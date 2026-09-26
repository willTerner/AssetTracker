import { ValueSnapshot } from '../../services/valueHistory';

// 数据点越多 gifted-charts 里单个 x 轴标签的容器宽度（= spacing）越窄，
// 超过 9 个点会把 "9/5" 这类标签截断成 "0…"，故最多保留 9 个采样点
const MAX_POINTS = 9;
const LABEL_SLOTS = 5;

export function buildLineData(
    snapshots: ValueSnapshot[],
    dateFilter: 'week' | 'month' | 'quarter' | 'year' | 'ytd' | 'all'
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
        case 'quarter':
            startDate = new Date(now.getTime() - 90 * 86400000).toISOString().slice(0, 10);
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
    const rangeSnaps = sorted.filter((s) => s.date >= startDate && s.date <= today);
    if (rangeSnaps.length === 0) return [];

    // 均匀重采样，始终包含最新一个点
    let sampled = rangeSnaps;
    const lastIdx = rangeSnaps.length - 1;
    if (lastIdx + 1 > MAX_POINTS) {
        sampled = [];
        for (let i = 0; i < MAX_POINTS - 1; i += 1) {
            sampled.push(rangeSnaps[Math.round((i * lastIdx) / (MAX_POINTS - 1))]);
        }
        sampled.push(rangeSnaps[lastIdx]);
    }

    // 在约 LABEL_SLOTS 个位置显示日期标签（首尾必显示）
    const labelStep = Math.max(1, Math.ceil((sampled.length - 1) / (LABEL_SLOTS - 1)));

    const formatLabel = (dateStr: string): string => {
        const d = new Date(dateStr);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    return sampled.map((s, i) => ({
        value: s.totalCNY,
        label:
            i % labelStep === 0 || i === sampled.length - 1 ? formatLabel(s.date) : '',
    }));
}
