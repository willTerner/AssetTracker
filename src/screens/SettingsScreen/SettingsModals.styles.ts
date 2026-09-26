import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: '#11182766' },
    sheet: { maxHeight: '82%', paddingHorizontal: 18, paddingBottom: 12, borderRadius: 26, overflow: 'hidden' },
    dialog: { width: '100%', padding: 20, borderRadius: 25 },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 54 },
    sheetTitle: { fontSize: 18, fontWeight: '800' },
    closeButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
    optionsList: { marginTop: 2 },
    option: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
    optionCopy: { flex: 1, paddingVertical: 11 },
    optionLabel: { fontSize: 14, fontWeight: '600' },
    optionDetail: { marginTop: 3, fontSize: 11 },
    helperText: { marginBottom: 14, fontSize: 12, lineHeight: 18 },
    pinInputWrap: { marginBottom: 12 },
    pinInputLabel: { marginBottom: 6, fontSize: 11, fontWeight: '600' },
    pinInput: { height: 46, paddingHorizontal: 13, borderWidth: 1, borderRadius: 13, fontSize: 14, letterSpacing: 1 },
    primaryButton: { height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 15, marginTop: 7 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
