import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: '#11182766' },
    sheet: { padding: 18, borderRadius: 25 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 13 },
    iconWrap: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
    headerCopy: { flex: 1 },
    title: { fontSize: 16, fontWeight: '800' },
    subtitle: { marginTop: 3, fontSize: 10 },
    closeButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
    option: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderWidth: 1, borderRadius: 14, marginTop: 8 },
    optionLabel: { fontSize: 13, fontWeight: '700' },
    optionDetail: { fontSize: 10 },
    cancelButton: { height: 43, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
    cancelText: { fontSize: 12, fontWeight: '600' },
});
