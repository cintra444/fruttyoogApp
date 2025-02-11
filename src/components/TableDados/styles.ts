import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f1f1f1',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tableCell: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});