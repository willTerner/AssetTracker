import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, overflow: 'hidden' },
    ambientBlue: { position: 'absolute', top: 18, left: -74, width: 190, height: 190, borderRadius: 95, opacity: 0.6 },
    ambientPurple: { position: 'absolute', right: -60, bottom: 55, width: 155, height: 155, borderRadius: 78, opacity: 0.65 },
    brandMark: {
        width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 20,
        marginBottom: 18, shadowColor: '#0A84FF', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.24, shadowRadius: 16, elevation: 5,
    },
    card: {
        width: '100%', padding: 22, borderRadius: 28, borderWidth: 1,
        shadowColor: '#2D4C7A1F', shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35, shadowRadius: 22, elevation: 5,
    },
    lockBadge: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    title: { fontSize: 22, fontWeight: '800' },
    subtitle: { marginTop: 6, marginBottom: 20, fontSize: 13, lineHeight: 20 },
    fieldWrap: { marginBottom: 13 },
    fieldLabel: { marginBottom: 7, fontSize: 12, fontWeight: '600' },
    inputWrap: {
        minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 14, borderWidth: 1, borderRadius: 15,
    },
    input: { flex: 1, height: 50, fontSize: 15, letterSpacing: 1.2 },
    tip: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, borderRadius: 13, marginTop: 3 },
    tipText: { flex: 1, fontSize: 10, lineHeight: 15 },
    primaryButton: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
