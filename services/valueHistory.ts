import AsyncStorage from '@react-native-async-storage/async-storage';

const SNAPSHOT_KEY = '@value_snapshots';

export interface ValueSnapshot {
    date: string;
    totalCNY: number;
}

export async function getSnapshots(): Promise<ValueSnapshot[]> {
    try {
        const raw = await AsyncStorage.getItem(SNAPSHOT_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export async function recordSnapshot(totalCNY: number): Promise<void> {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const snapshots = await getSnapshots();
        const existing = snapshots.findIndex((s) => s.date === today);
        if (existing >= 0) {
            snapshots[existing] = { date: today, totalCNY };
        } else {
            snapshots.push({ date: today, totalCNY });
        }
        await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshots));
    } catch (e) {
        console.error('Error recording snapshot:', e);
    }
}
