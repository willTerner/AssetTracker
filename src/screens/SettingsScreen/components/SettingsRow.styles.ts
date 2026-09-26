import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    row: {
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
        paddingHorizontal: 13,
        borderBottomWidth: 1,
    },
    rowWithDetail: { minHeight: 58 },
    iconWrap: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    copy: { flex: 1, minWidth: 0 },
    title: { fontSize: 13, fontWeight: '600' },
    detail: { marginTop: 3, fontSize: 10, lineHeight: 13 },
    value: { maxWidth: '35%', fontSize: 12, fontWeight: '600', textAlign: 'right' },
});
