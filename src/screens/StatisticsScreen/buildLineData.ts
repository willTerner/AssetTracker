import { ValueSnapshot } from '../../services/valueHistory';

export function buildLineData(
    snapshots: ValueSnapshot[],
    dateFilter: 'week' | 'month' | 'year' | 'ytd' | 'all'
): { value: number | undefined; label: string }[] {
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

    const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));

    // snapshots within range
    const rangeSnaps = sorted.filter((s) => s.date >= startDate && s.date <= today);

    // 5 evenly spaced label dates
    const start = new Date(startDate);
    const end = new Date(today);
    const rangeDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const maxLabels = 5;
    const labelInterval = rangeDays <= maxLabels - 1 ? 1 : Math.ceil(rangeDays / (maxLabels - 1));

    const labelDates = new Set<string>();
    for (let i = 0; i < maxLabels; i += 1) {
        const d = new Date(start);
        d.setDate(d.getDate() + i * labelInterval);
        if (d <= end) {
            labelDates.add(d.toISOString().slice(0, 10));
        }
    }
    // ensure today is always included as a label
    labelDates.add(today);

    // merge: snapshots + label positions, deduped by date
    const pointMap = new Map<string, { value: number | undefined; isLabel: boolean }>();

    for (const d of labelDates) {
        pointMap.set(d, { value: undefined, isLabel: true });
    }
    for (const s of rangeSnaps) {
        const existing = pointMap.get(s.date);
        pointMap.set(s.date, { value: s.totalCNY, isLabel: existing?.isLabel ?? false });
    }

    const entries = [...pointMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    const formatLabel = (dateStr: string): string => {
        const d = new Date(dateStr);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${m}/${day}`;
    };

    return entries.map(([dateStr, pt]) => ({
        value: pt.value,
        label: pt.isLabel ? formatLabel(dateStr) : '',
    }));
}
