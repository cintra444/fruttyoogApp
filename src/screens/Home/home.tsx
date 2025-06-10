import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { Container, Logo, WelcomeText, QuestionText, Button, ButtonText } from './styles';

    const Home: React.FC = () => {
        const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <Container>
      <Logo source={require('../../assets/logo.png')} />
      <WelcomeText>Seja bem-vindo ao App Fruttyoog!</WelcomeText>
      <QuestionText>O que deseja fazer?</QuestionText>

      <Button onPress={() => navigation.navigate('Login')}>
        <ButtonText>Login</ButtonText>
      </Button>

      <Button onPress={() => navigation.navigate('Register')}>
        <ButtonText>Cadastro</ButtonText>
      </Button>
    </Container>
    );
};

export default Home;
