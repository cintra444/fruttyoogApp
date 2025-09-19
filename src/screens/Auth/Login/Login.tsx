import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { useApp } from '../../../contexts/AppContext';
import { Login as loginApi } from '../../../Services/apiFruttyoog';
import { Container, Input, Button, ButtonText, WelcomeText, QuestionText } from './styles';

const Login: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { handleLogin } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const res = await loginApi({ email, password });

      if (res && res.token) {
        // Determinar se é admin
        const isAdmin = res.role === 'admin';

        handleLogin({
          id: res.id,
          name: res.name,
          email: res.email,
          token: res.token,
          isAdmin,
        });

        // Redirecionar para dashboard ou home
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Erro', 'Credenciais inválidas');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível fazer login');
    }
  };

  return (
    <Container>
      <WelcomeText>Bem-vindo!</WelcomeText>
      <QuestionText>Informe suas credenciais para continuar</QuestionText>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button onPress={submitLogin}>
        <ButtonText>Login</ButtonText>
      </Button>

      {/* Somente admin pode ver botão de cadastro */}
      {/** Se quiser liberar cadastro apenas para admin, basta condicionar aqui */}
      {/* <Button onPress={() => navigation.navigate('Register')}>
        <ButtonText>Cadastro</ButtonText>
      </Button> */}
    </Container>
  );
};

export default Login;
