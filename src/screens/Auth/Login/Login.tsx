import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import styles from './styles';
import LoginForm from '../../../components/LoginForm/LoginForm';
import ModalSuccess from  '../../../components/ModalSucess/ModalSucess';
import { useNavigation } from '@react-navigation/native';
import { useApp } from 'src/contexts/AppContext';
import LoginApi from '../../../Services/apiFruttyoog';


const Login: React.FC = () => { 
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [usuario, setUsuario] = useState('');
    const { handleLogin } = useApp();

    const handleLoginPress = async (email: string, password: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!emailRegex.test(normalizedEmail)) {
            Alert.alert('Erro', 'Email inválida');
            return;
        }

        if (!passwordRegex.test(normalizedPassword)) {
            Alert.alert('Erro', 'A senha deve conter no mínimo 8 caracteres, sendo pelo menos uma letra e um número');
            return;
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
                    password: normalizedPassword,
                    token: token.toString(),
                });
                setUsuario(normalizedEmail);
                setModalVisible(true);
            } else {
                Alert.alert('Erro', 'Credenciais inválidas');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('Erro ao fazer login', (error as any).response?.data || error.message);
                Alert.alert('Erro', (error as any).response?.data?.message || 'Erro ao fazer login');
            } else {
                console.log('Erro ao fazer login', String(error));
                Alert.alert('Erro', 'Erro ao fazer login');
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
            <LoginForm onLogin={handleLoginPress} />
            <ModalSuccess
                visible={modalVisible}
                onClose={handleModalClose}
                message={`Bem-vindo, ${usuario}`} />
        </View>
    );        
    
};

export default Login;