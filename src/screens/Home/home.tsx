import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import styles from './styles';  

    const Home: React.FC = () => {
        const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.welcomeText}>Seja bem vindo ao App Fruttyoog!</Text>
            <Text style={styles.questionText}>O que deseja fazer?</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.buttonText}>Cadastro</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;
