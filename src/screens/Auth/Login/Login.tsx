import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import styles from './styles';
import LoginForm from '../../../components/LoginForm/LoginForm';
import ModalSuccess from  '../../../components/ModalSucess/ModalSucess';
import { useNavigation } from '@react-navigation/native';
import { Login as LoginApi } from '../../../Services/api';


const Login: React.FC = () => { 
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [usuario, setUsuario] = useState('');

    const handleLogin = async (email: string, password: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        console.log("Enviando login:", { email: normalizedEmail, password: normalizedPassword });

        if (!emailRegex.test(normalizedEmail)) {
            Alert.alert('Erro', 'Email ou senha inválida');
            return;
        }

        if (!passwordRegex.test(normalizedPassword)) {
            Alert.alert('Erro', 'Email ou senha inválida');
            return;
        }
        try {
            const response = await LoginApi({ email: normalizedEmail, password: normalizedPassword });
            if (response) {
                setUsuario(normalizedEmail);
                setModalVisible(true);
        } else {
            Alert.alert('Erro', 'Email ou senha inválida');
        }
        } catch (error) {
            if (error instanceof Error && (error as any).response && (error as any).response.data) {
                Alert.alert('Mensagem do erro: ', (error as any).response.data.message);
            } else {
                Alert.alert('Erro', 'Ocorreu um erro inesperado');
            }
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        navigation.navigate('Dashboard');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <LoginForm onLogin={handleLogin} />
            <ModalSuccess
                visible={modalVisible}
                onClose={handleModalClose}
                message={`Bem-vindo, ${usuario}`} />
        </View>
    );        
    
};

export default Login;