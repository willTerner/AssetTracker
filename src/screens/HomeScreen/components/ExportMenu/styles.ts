import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants';

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportMenu: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        width: '82%',
        maxWidth: 320,
        shadowColor: Colors.espressoDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 40,
        elevation: 12,
    },
    exportMenuTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.espresso,
        textAlign: 'center',
        marginBottom: 2,
    },
    exportMenuSubtitle: {
        fontSize: 11,
        color: Colors.warmBrown,
        textAlign: 'center',
        marginBottom: 16,
    },
    exportMenuItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: Colors.offWhite,
        borderWidth: 1.5,
        borderColor: Colors.sand,
    },
    exportMenuItemText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.espresso,
    },
    exportMenuCancel: {
        paddingVertical: 10,
        marginTop: 4,
    },
    exportMenuCancelText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.warmBrown,
    },
});
