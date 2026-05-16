import { StyleSheet } from 'react-native';
import { Colors } from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.espresso,
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.sand,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: Colors.espresso,
    },
    pickerWrapper: {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.sand,
        borderRadius: 12,
        overflow: 'hidden',
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    changeInfo: {
        marginTop: 20,
        padding: 14,
        backgroundColor: '#FFF0E5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.sand,
        borderStyle: 'dashed',
    },
    changeLabel: {
        fontSize: 11,
        color: Colors.warmBrown,
        marginBottom: 6,
    },
    changeValue: {
        fontSize: 17,
        fontWeight: '700',
    },
    positive: {
        color: Colors.sage,
    },
    negative: {
        color: Colors.coralDark,
    },
    saveButton: {
        backgroundColor: Colors.coral,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 28,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: Colors.warmBrown,
        fontSize: 15,
        fontWeight: '600',
    },
});

export const pickerSelectStyles = {
    inputIOS: {
        fontSize: 15,
        color: Colors.espresso,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    inputAndroid: {
        fontSize: 15,
        color: Colors.espresso,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    placeholder: {
        color: Colors.warmBrown,
    },
    iconContainer: {
        top: 14,
        right: 14,
    },
};
