import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
    errorTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
    errorMessage: { marginTop: 9, fontSize: 12, lineHeight: 19, textAlign: 'center' },
    retryButton: { minWidth: 126, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 14, marginTop: 22 },
    retryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
