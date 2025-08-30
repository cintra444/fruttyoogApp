import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import LoginForm from '../../../components/LoginForm/LoginForm';
import ModalSuccess from  '../../../components/ModalSucess/ModalSucess';
import { useNavigation } from '@react-navigation/native';
import { useApp } from 'src/contexts/AppContext';
import LoginApi from '../../../Services/apiFruttyoog';
import { Container, FormWrapper, Title } from './styles';


const Login: React.FC = () => { 
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [usuario, setUsuario] = useState('');
    const { handleLogin } = useApp();

    const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleLoginPress = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

         if (!validateEmail(normalizedEmail)) {
      return Alert.alert('Erro', 'Email inválido');
    }

    if (!validatePassword(normalizedPassword)) {
      return Alert.alert(
        'Erro',
        'A senha deve conter no mínimo 8 caracteres, sendo pelo menos uma letra e um número'
      );
    }

        try {
            const response = await LoginApi.post('/login', { email: normalizedEmail, password: normalizedPassword });
            
            console.log('Resposta da API', response.data);
           
            const { usuario, token } = response.data;
    
            if (usuario && token) {
                handleLogin({
                    id: usuario.id,
                    name: usuario.nome,
                    email: usuario.email,
                    token: token.toString(),
                });
                setUsuario(normalizedEmail);
                setModalVisible(true);
            } else {
                Alert.alert('Erro', 'Credenciais inválidas');
            }
        } catch (error: any) {
      const mensagemErro = error?.response?.data?.message || 'Erro ao fazer login';
      console.error('Erro ao fazer login:', mensagemErro);
      Alert.alert('Erro', mensagemErro);
    }
  };


    const handleModalClose = () => {
        setModalVisible(false);
        navigation.navigate('Dashboard');
    };

    return (
        <Container>
          <FormWrapper>
      <Title>Login</Title>
      <LoginForm onLogin={handleLoginPress} />
      <ModalSuccess
        visible={modalVisible}
        onClose={handleModalClose}
        message={`Bem-vindo, ${usuario}`}
      />
    </FormWrapper>
    </Container>
    );        
    
};

export default Login;