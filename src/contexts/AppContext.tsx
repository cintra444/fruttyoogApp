import React, { useContext, createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
    isAdmin: boolean; // nova propriedade
};

type AppContextProps = {
    user: UserProps | null;
    handleLogin: (user: UserProps) => void;
    handleLogout: (navigation: NavigationProp<any>) => void;
};

type AppProviderProps = {
    children: React.ReactNode;
};

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProps | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const response = await AsyncStorage.getItem('@fruttyoog:user');
            if (response) {
                const data = JSON.parse(response);
                if (data && data.id && data.name && data.email && data.token) {
                    setUser(data);
                } else {
                    Alert.alert('Erro', 'Dados do usuário inválidos');
                }
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao carregar usuário: ' + error);
        }
    };

    const handleLogin = async (userData: UserProps) => {
        setUser(userData);
        try {
            await AsyncStorage.setItem('@fruttyoog:user', JSON.stringify(userData));
        } catch (error) {
            Alert.alert('Erro', 'Erro ao salvar usuário: ' + error);
        }
    };

    const handleLogout = async (navigation: NavigationProp<any>) => {
        setUser(null);
        try {
            await AsyncStorage.removeItem('@fruttyoog:user');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', 'Erro ao remover usuário: ' + error);
        }
    };

    return (
        <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
