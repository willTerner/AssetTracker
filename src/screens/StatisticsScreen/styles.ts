import { StyleSheet } from 'react-native';
import { Colors } from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.offWhite,
    },
    headerCard: {
        backgroundColor: Colors.espresso,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.espressoDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
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
    totalSubtitle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        marginTop: 4,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.espresso,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.espresso,
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    pieCenterWrap: {
        alignItems: 'center',
    },
    pieCenterValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.espresso,
    },
    pieCenterLabel: {
        fontSize: 10,
        color: Colors.warmBrown,
    },
    legendContainer: {
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 3,
    },
    legendText: {
        flexShrink: 1,
        minWidth: 0,
        fontSize: 12,
        color: Colors.espresso,
        fontWeight: '500',
    },
    legendPercent: {
        flexShrink: 0,
        fontSize: 12,
        color: Colors.warmBrown,
        fontWeight: '600',
    },
    pieTooltip: {
        backgroundColor: Colors.espresso,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    pieTooltipText: {
        color: Colors.honey,
        fontSize: 12,
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.sand,
        backgroundColor: Colors.white,
    },
    filterChipActive: {
        backgroundColor: Colors.coral,
        borderColor: Colors.coral,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.warmBrown,
    },
    filterChipTextActive: {
        color: Colors.white,
    },
    noDataText: {
        fontSize: 13,
        color: Colors.warmBrown,
        textAlign: 'center',
        paddingVertical: 20,
        opacity: 0.6,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.sand,
    },
    tableHeaderCell: {
        fontSize: 11,
        color: Colors.warmBrown,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    tableCell: {
        fontSize: 12,
        color: Colors.espresso,
    },
    colPlatform: {
        flex: 2.5,
    },
    colValue: {
        flex: 2.5,
        textAlign: 'right',
    },
    colCny: {
        flex: 2,
        textAlign: 'right',
    },
    colPercent: {
        flex: 1.5,
        textAlign: 'right',
        fontWeight: '600',
    },
    colChange: {
        flex: 1.5,
        textAlign: 'right',
        fontWeight: '600',
    },
});
