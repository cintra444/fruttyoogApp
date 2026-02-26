import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { useApp } from '../../../contexts/AppContext';
import { getActiveApiUrl, Login as loginApi } from '../../../Services/apiFruttyoog';
import { Container, Logo, Input, Button, ButtonText, WelcomeText, QuestionText } from './styles';

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
      console.log("RESPOSTA LOGIN:", res);

      if (res && res.token && res.usuario) {
        // Determinar se é admin
        const isAdmin = res.usuario.role === 'ADMIN';

        await handleLogin({
          id: String(res.usuario.id),
          name: res.usuario.nome,
          email: res.usuario.email,
          token: res.token,
          isAdmin,
        });

        //reset para limpar histórico e definir tela inicial
        navigation.reset({
          index: 0,
          routes: [{ name: isAdmin ? 'Dashboard' : 'Home' }],
        });

      } else {
        Alert.alert('Erro', 'Credenciais inválidas');
      }
    } catch (err) {
      Alert.alert('Erro', `Não foi possível fazer login.\nAPI: ${getActiveApiUrl()}`);
    }
  };

  return (
    <Container>
      <Logo source={require('../../../assets/logo.png')} />
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
