import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 18,
        borderRadius: 22,
        borderWidth: 1,
    },
    titleGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconWrap: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 11,
    },
    title: { fontSize: 21, fontWeight: '800' },
    helpButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
