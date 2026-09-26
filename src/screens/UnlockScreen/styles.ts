import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26, overflow: 'hidden' },
    ambientBlue: { position: 'absolute', top: -70, left: -70, width: 210, height: 210, borderRadius: 105, opacity: 0.7 },
    ambientGreen: { position: 'absolute', right: -58, bottom: 145, width: 170, height: 170, borderRadius: 85, opacity: 0.6 },
    brandMark: {
        width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#0A84FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.23, shadowRadius: 16, elevation: 5,
    },
    heading: { alignItems: 'center', marginTop: 20 },
    title: { fontSize: 22, fontWeight: '800' },
    subtitle: { marginTop: 6, fontSize: 12, textAlign: 'center' },
    dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 13, marginTop: 29, marginBottom: 28 },
    pinDot: { width: 10, height: 10, borderRadius: 5 },
    keypad: { width: 292, gap: 6 },
    keyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    key: { width: 82, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
    keyText: { fontSize: 25, fontWeight: '500' },
    invisibleKey: { width: 24, height: 24 },
    privacyNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 },
    privacyText: { fontSize: 10 },
    attemptMessage: { position: 'absolute', bottom: 58, fontSize: 11 },
    backButton: { position: 'absolute', top: 52, left: 22, flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { fontSize: 11 },
});
