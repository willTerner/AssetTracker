import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: '#11182766' },
    sheet: { maxHeight: '72%', padding: 18, borderRadius: 25 },
    title: { marginBottom: 8, fontSize: 17, fontWeight: '800' },
    list: { marginTop: 4 },
    option: { minHeight: 53, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
    optionText: { fontSize: 13, fontWeight: '600' },
});
