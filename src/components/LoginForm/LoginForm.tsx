import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { styles } from './styles';

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
        <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLoginPress} />
        </View>
    );
};



export default LoginForm;