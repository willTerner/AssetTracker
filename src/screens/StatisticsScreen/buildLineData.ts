import { ValueSnapshot } from '../../services/valueHistory';

export function buildLineData(
    snapshots: ValueSnapshot[],
    dateFilter: 'week' | 'month' | 'year' | 'ytd' | 'all'
): { value: number; label: string }[] {
    if (snapshots.length === 0) return [];

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    let startDate: string;
    switch (dateFilter) {
        case 'week':
            startDate = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
            break;
        case 'month':
            startDate = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);
            break;
        case 'year':
            startDate = new Date(now.getTime() - 365 * 86400000).toISOString().slice(0, 10);
            break;
        case 'ytd':
            startDate = `${now.getFullYear()}-01-01`;
            break;
        case 'all':
        default:
            startDate = snapshots[0].date;
            break;
    }

    const start = new Date(startDate);
    const end = new Date(today);
    const rangeDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    const step = Math.max(1, Math.ceil(rangeDays / 10));

    const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
    const snapVals = sorted.map((s) => s.totalCNY);
    const snapDates = sorted.map((s) => s.date);

    const getValueAt = (dateStr: string): number => {
        for (let i = snapDates.length - 1; i >= 0; i -= 1) {
            if (snapDates[i] <= dateStr) return snapVals[i];
        }
        return 0;
    };

    const formatLabel = (d: Date): string => {
        const m = d.getMonth() + 1;
        const day = d.getDate();
        const mm = String(m).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        if (step <= 2) return `${mm}/${dd}`;
        if (step <= 7) return `${mm}/${dd}`;
        return `${d.getFullYear()}/${mm}`;
    };

    const result: { value: number; label: string }[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
        const dateStr = cursor.toISOString().slice(0, 10);
        result.push({
            value: getValueAt(dateStr),
            label: formatLabel(cursor),
        });
        cursor.setDate(cursor.getDate() + step);
    }

    if (result.length > 0 && result[result.length - 1].label !== formatLabel(end)) {
        const todayStr = end.toISOString().slice(0, 10);
        result.push({
            value: getValueAt(todayStr),
            label: formatLabel(end),
        });
    }

    return result;
}
