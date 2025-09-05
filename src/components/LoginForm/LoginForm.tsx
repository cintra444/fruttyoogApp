import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Container, Label, Input, Button, ButtonText } from './styles';

interface LoginFormProps {
    onLogin: (email: string, password: string) => void; 
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLoginPress = async () => {
        if(!email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        onLogin(email, password);
    };

    return (
        <Container>
            <Label>Email</Label>
            <Input
                placeholder="Digite seu email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
            />
            <Label>Senha</Label>
            <Input
                placeholder="Digite sua senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
            />
            <Button onPress={handleLoginPress}>
                <ButtonText>Login</ButtonText>
            </Button>
        </Container>
    );
};



export default LoginForm;