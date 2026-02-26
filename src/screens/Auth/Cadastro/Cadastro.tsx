import React from 'react';
import { Alert } from 'react-native';
import CadastroForm from '../../../components/CadastroForm/CadastroForm';
import { useNavigation } from '@react-navigation/native';
import { Container, FormWrapper, Title } from './styles';
import api, { getActiveApiUrl } from 'src/Services/apiFruttyoog';


const Cadastro: React.FC = () => {
    const navigation = useNavigation<any>();

    const handleFormSubmit = async (data: any) => {
      try {
        await api.post('/usuarios', {
          username: data.nome ?? data.username,
          email: data.email,
          password: data.senha ?? data.password,
          role: data.role ?? 'USER',
        });
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      } catch {
        Alert.alert('Erro', `Não foi possível realizar o cadastro.\nAPI: ${getActiveApiUrl()}`);
      }
        
    };

    return ( 
    <Container>
      <FormWrapper>
      <Title>Cadastro de Usuário</Title>
      <CadastroForm type="usuario" onSubmit={handleFormSubmit} />
      </FormWrapper>
    </Container>
    );
};


export default Cadastro;
