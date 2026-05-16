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
        marginBottom: 36,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.espresso,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        letterSpacing: 6,
        textAlign: 'center',
        borderWidth: 1.5,
        borderColor: Colors.sand,
        color: Colors.espresso,
    },
    button: {
        backgroundColor: Colors.coral,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
