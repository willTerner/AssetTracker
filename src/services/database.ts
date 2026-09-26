import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'asset-tracker-vault.db';
const DATABASE_KEY_NAME = 'asset-tracker.vault-key.v1';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

async function getOrCreateDatabaseKey(): Promise<string> {
    const storedKey = await SecureStore.getItemAsync(DATABASE_KEY_NAME);
    if (storedKey) return storedKey;

    const generatedKey = bytesToHex(await Crypto.getRandomBytesAsync(32));
    await SecureStore.setItemAsync(DATABASE_KEY_NAME, generatedKey);
    return generatedKey;
}

async function openEncryptedDatabase(): Promise<SQLite.SQLiteDatabase> {
    const key = await getOrCreateDatabaseKey();
    const database = await SQLite.openDatabaseAsync(DATABASE_NAME);

    try {
        await database.execAsync(`PRAGMA key = '${key}';`);
        await database.execAsync('PRAGMA cipher_memory_security = ON;');
        const cipher = await database.getFirstAsync<{ cipher_version: string }>('PRAGMA cipher_version;');
        if (!cipher?.cipher_version) throw new Error('SQLCipher 未启用，请重新构建 Android 应用。');
        await database.execAsync(
            'CREATE TABLE IF NOT EXISTS secure_kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);'
        );
        await database.getFirstAsync<{ key: string }>(
            'SELECT key FROM secure_kv LIMIT 1'
        );
        return database;
    } catch (error) {
        await database.closeAsync();
        throw new Error(`无法打开加密账本：${(error as Error).message}`);
    }
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!databasePromise) {
        databasePromise = openEncryptedDatabase().catch((error) => {
            databasePromise = null;
            throw error;
        });
    }
    return databasePromise;
}

async function withEncryptedExclusiveTransaction(
    task: (transaction: SQLite.SQLiteDatabase) => Promise<void>
): Promise<void> {
    const key = await getOrCreateDatabaseKey();
    const transaction = await SQLite.openDatabaseAsync(DATABASE_NAME, { useNewConnection: true });
    let transactionStarted = false;

    try {
        await transaction.execAsync(`PRAGMA key = '${key}';`);
        await transaction.execAsync('PRAGMA cipher_memory_security = ON;');
        const cipher = await transaction.getFirstAsync<{ cipher_version: string }>('PRAGMA cipher_version;');
        if (!cipher?.cipher_version) throw new Error('SQLCipher 未启用，请重新构建 Android 应用。');
        await transaction.execAsync(
            'CREATE TABLE IF NOT EXISTS secure_kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);'
        );
        await transaction.getFirstAsync<{ key: string }>('SELECT key FROM secure_kv LIMIT 1');

        await transaction.execAsync('BEGIN EXCLUSIVE;');
        transactionStarted = true;
        await task(transaction);
        await transaction.execAsync('COMMIT;');
        transactionStarted = false;
    } catch (error) {
        if (transactionStarted) {
            await transaction.execAsync('ROLLBACK;').catch(() => undefined);
        }
        throw error;
    } finally {
        await transaction.closeAsync().catch(() => undefined);
    }
}

export async function getEncryptedValue(key: string): Promise<string | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<{ value: string }>(
        'SELECT value FROM secure_kv WHERE key = ?',
        key
    );
    return row?.value ?? null;
}

export async function setEncryptedValue(key: string, value: string): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
        'INSERT INTO secure_kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        key,
        value
    );
}

export async function setEncryptedValues(entries: Array<[string, string]>): Promise<void> {
    await getDatabase();
    await withEncryptedExclusiveTransaction(async (transaction) => {
        for (const [key, value] of entries) {
            await transaction.runAsync(
                'INSERT INTO secure_kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
                key,
                value
            );
        }
    });
}

export async function removeEncryptedValues(keys: string[]): Promise<void> {
    await getDatabase();
    await withEncryptedExclusiveTransaction(async (transaction) => {
        for (const key of keys) {
            await transaction.runAsync('DELETE FROM secure_kv WHERE key = ?', key);
        }
    });
}

