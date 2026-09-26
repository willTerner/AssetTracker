import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: { flex: 1 },
    content: { paddingHorizontal: 16 },
    ambientBlue: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 170,
        height: 170,
        borderRadius: 85,
        opacity: 0.62,
    },
    ambientPurple: {
        position: 'absolute',
        top: 420,
        right: 0,
        width: 140,
        height: 140,
        borderRadius: 70,
        opacity: 0.58,
    },
    sectionTitle: {
        marginLeft: 4,
        marginBottom: 5,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '700',
    },
    group: {
        paddingHorizontal: 2,
        paddingVertical: 8,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 22,
        overflow: 'hidden',
    },
    preferencesGroup: { paddingVertical: 7, marginBottom: 18 },
    clearGroup: {
        minHeight: 50,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
    },
});
