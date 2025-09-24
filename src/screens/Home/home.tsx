import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { Container, Logo, WelcomeText, QuestionText, Button, ButtonText } from './styles';
import { useApp } from '../../contexts/AppContext'; // seu context

const Home: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { user, handleLogout } = useApp();

    // Menu de navegação para desenvolvimento
    const screens: (keyof RootStackParamList)[] = [
        'Dashboard',
        'Settings',
        'Refresh',
        'Chat',
    ];

    return (
        <Container>
            <Logo source={require('../../assets/logo.png')} />
            <WelcomeText>Seja bem-vindo ao App Fruttyoog!</WelcomeText>
            <QuestionText></QuestionText>

            {!user ? (
                <Button onPress={() => navigation.navigate('Login')}>
                    <ButtonText>Login</ButtonText>
                </Button>
            ) : (
                <>
                <Button onPress={() => handleLogout(navigation)}>
                    <ButtonText>Logout</ButtonText>
                </Button>
               
                <Button onPress={() => navigation.navigate('Register')}>
                    <ButtonText>Cadastro</ButtonText>
                </Button>
            
                <Button onPress={() => navigation.navigate('Dashboard')}>
                    <ButtonText>Administrador </ButtonText>
                </Button>
            
                </>
            )}
            {/* <Text style={{ marginTop: 20, fontSize: 16 }}>Navegação entre telas (para dev):</Text>
            <View style={{ height: 10 }} />
            {screens.map((screen) => (
                <TouchableOpacity key={screen} onPress={() => navigation.navigate(screen)}>
                    <Text>{screen}</Text>
                </TouchableOpacity>
            ))} */}
        </Container>
    );
};

export default Home;
