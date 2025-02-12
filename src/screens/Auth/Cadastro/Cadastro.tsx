import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CadastroForm from '../../../components/CadastroForm/CadastroForm';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';


const Cadastro: React.FC = () => {
    const navigation = useNavigation<any>();

    const handleFormSubmit = (data: any) => {
        console.log(data);
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Usuário</Text>
            <CadastroForm type="usuario" onSubmit={(data) => console.log(data)} />
        </View>
    );
};


export default Cadastro;