import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { Container, Label, Input } from './styles';

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
            />
            <Label>Senha</Label>
            <Input
                placeholder="Digite sua senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLoginPress} />
        </Container>
    );
};



export default LoginForm;