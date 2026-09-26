import { readEncryptedSnapshots, writeEncryptedSnapshots } from './migration';

const SNAPSHOT_KEY = '@snapshots_v1';

export interface ValueSnapshot {
    date: string;
    totalCNY: number;
}

export async function getSnapshots(): Promise<ValueSnapshot[]> {
    try {
        const raw = await readEncryptedSnapshots();
        if (!raw) return [];
        return JSON.parse(raw) as ValueSnapshot[];
    } catch (error) {
        console.error('Error reading encrypted snapshots:', error);
        return [];
    }
}

export async function recordSnapshot(totalCNY: number): Promise<void> {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const snapshots = await getSnapshots();
        const existing = snapshots.findIndex((snapshot) => snapshot.date === today);
        if (existing >= 0) {
            snapshots[existing] = { date: today, totalCNY };
        } else {
            snapshots.push({ date: today, totalCNY });
        }
        await writeEncryptedSnapshots(JSON.stringify(snapshots));
    } catch (error) {
        console.error('Error recording encrypted snapshot:', error);
    }
}

export async function clearSnapshots(): Promise<void> {
    await writeEncryptedSnapshots(JSON.stringify([]));
}
