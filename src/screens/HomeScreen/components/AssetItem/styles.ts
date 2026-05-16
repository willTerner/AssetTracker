import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants';

export const styles = StyleSheet.create({
    assetItem: {
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: Colors.coral,
        shadowColor: '#5C3D2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    platform: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.espresso,
        flex: 1,
        marginRight: 8,
    },
    value: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.coral,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    bottomLeft: {
        flex: 1,
    },
    date: {
        fontSize: 10,
        color: Colors.warmBrown,
        marginTop: 2,
    },
    cnyValue: {
        fontSize: 10,
        color: Colors.warmBrown,
    },
    changeText: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
});
