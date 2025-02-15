import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    headerLeft: {
        flex: 1,
    },
    headerCenter: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    headerIcon: {
        marginHorizontal: 10,
    },
});

