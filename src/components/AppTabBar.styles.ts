import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    dockPosition: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16 },
    dock: {
        height: 74,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderRadius: 28,
        paddingHorizontal: 8,
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.13,
        shadowRadius: 18,
        elevation: 10,
    },
    tabButton: { width: 64, height: 56, alignItems: 'center', justifyContent: 'center', gap: 4 },
    tabLabel: { fontSize: 10, fontWeight: '600' },
    addButton: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 7,
    },
});
