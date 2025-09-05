import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { Container, Logo, WelcomeText, QuestionText, Button, ButtonText } from './styles';

    const Home: React.FC = () => {
        const navigation = useNavigation<NavigationProp<RootStackParamList>>();

        //apenas para navegação entre telas para desenvolvimento

        const screens: (keyof RootStackParamList)[] = [
            'Dashboard',
            'Settings',
            'Refresh',
            'Logout',
            'Chat',
        ];
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
      Menu de navegação para desenvolvimento: 
      <Text style={{ marginTop: 20, fontSize: 16 }}>Navegação entre telas:</Text>
      <View style={{ height: 10 }} />
      {screens.map((screen) => (
        <TouchableOpacity key={screen} onPress={() => navigation.navigate(screen)}>
          <Text>{screen}</Text>
        </TouchableOpacity>
      ))}
    </Container>

    );
};

export default Home;
