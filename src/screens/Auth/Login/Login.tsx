import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Text, View } from 'react-native';
import styles from './styles';
import LoginForm from '../../../components/LoginForm/LoginForm';
import ModalSuccess from 'src/components/ModalSucess/ModalSucess';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [usuario, setUsuario] = useState('');

    const handleLogin = (email: string, password: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!emailRegex.test(normalizedEmail)) {
            Alert.alert('Erro', 'Email ou senha inválida');
            return;
        }

        if (!passwordRegex.test(normalizedPassword)) {
            Alert.alert('Erro', 'Email ou senha inválida');
            return;
        }

        setUsuario(normalizedEmail);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        navigate('Dashboard');
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