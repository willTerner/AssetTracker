import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        minHeight: 134,
        gap: 14,
        padding: 18,
        borderWidth: 1,
        borderRadius: 26,
        marginBottom: 22,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 3,
    },
    mainRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    copy: { flex: 1, minWidth: 0 },
    name: { fontSize: 15, fontWeight: '700' },
    status: { marginTop: 4, fontSize: 11 },
    divider: { height: 1 },
    metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaLabel: { fontSize: 11 },
    metaValue: { fontSize: 12, fontWeight: '700' },
});
