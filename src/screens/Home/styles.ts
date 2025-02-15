import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    logo: {
        width: width * 0.8,
        height: height * 0.2,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#005006',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#1D71B8',
        fontSize: 18,
    },
});

export default styles