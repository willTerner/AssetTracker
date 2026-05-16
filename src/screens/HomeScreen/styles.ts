import { StyleSheet } from 'react-native';
import { Colors } from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    header: {
        backgroundColor: Colors.espresso,
        padding: 24,
        paddingTop: 0,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: Colors.espressoDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 16,
        gap: 8,
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    headerButtonText: {
        color: Colors.honey,
        fontSize: 12,
        fontWeight: '600',
    },
    totalLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    totalValue: {
        color: Colors.honey,
        fontSize: 34,
        fontWeight: '800',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.warmBrown,
        marginBottom: 6,
    },
    emptySubtext: {
        fontSize: 13,
        color: Colors.warmBrown,
        opacity: 0.6,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
    },
    fabInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.coral,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '300',
        lineHeight: 30,
    },
});
