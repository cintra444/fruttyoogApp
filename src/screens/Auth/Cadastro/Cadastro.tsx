import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CadastroForm from '../../../components/CadastroForm/CadastroForm';
import { useNavigation } from '@react-navigation/native';
import { Container, FormWrapper, Title } from './styles';
import api from 'src/Services/apiFruttyoog';


const Cadastro: React.FC = () => {
    const navigation = useNavigation<any>();

    const handleFormSubmit = async (data: any) => {
      try {
        await api.post('/usuarios', data);
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente mais tarde.');
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