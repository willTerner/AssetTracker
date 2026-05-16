import { StyleSheet } from 'react-native';
import { Colors } from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconInner: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: Colors.coral,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 8,
    },
    iconText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '800',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.espresso,
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: Colors.warmBrown,
        textAlign: 'center',
        marginBottom: 28,
    },
    pinDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    pinDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    pinDotFilled: {
        backgroundColor: Colors.coral,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    pinDotEmpty: {
        backgroundColor: Colors.sand,
        borderWidth: 2,
        borderColor: Colors.coral,
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 280,
        alignSelf: 'center',
        gap: 8,
    },
    keypadKey: {
        width: 76,
        paddingVertical: 14,
        backgroundColor: Colors.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.espresso,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    keypadKeyText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.espresso,
    },
    keypadKeyTextSecondary: {
        fontSize: 13,
        color: Colors.warmBrown,
    },
    keypadKeyTextDanger: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.coralDark,
    },
    attemptText: {
        marginTop: 20,
        textAlign: 'center',
        color: Colors.coralDark,
        fontSize: 13,
    },
});
