import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        minHeight: 82,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: 22,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 2,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copy: { flex: 1, minWidth: 52 },
    platform: { fontSize: 15, lineHeight: 19, fontWeight: '700' },
    meta: { marginTop: 4, fontSize: 11, lineHeight: 14 },
    amountWrap: { alignItems: 'flex-end', maxWidth: '44%', flexShrink: 1 },
    amount: { fontSize: 14, lineHeight: 18, fontWeight: '700' },
    converted: { marginTop: 3, fontSize: 11, lineHeight: 14 },
    change: { marginTop: 3, fontSize: 10, lineHeight: 13, fontWeight: '600' },
});
