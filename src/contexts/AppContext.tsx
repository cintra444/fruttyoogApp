import React, { useContext, createContext, useState, useEffect } from "react";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";

type AppContextProps = {
     user: UserProps | null;
    handleLogin: (user: UserProps) => void;
    handleLogout: () => void;
};

type UserProps = {
    id: string,
    name: string,
    email: string,
    password: string,
    token: string,
};

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserProps | null>(null);

    useEffect(() => {
        loadingUser();
    }, []);

    const loadingUser = async () => {
        try {
            const response = await AsyncStorage.getItem('@fruttyoog:user');
            if (response) {
                const data = JSON.parse(response);
                setUser(data);
            }
        } catch (error) {
            Alert.alert('Erro: ', 'Erro ao carregar usuário');
        }
    };

    const handleLogin = async (userData: UserProps) => {
        setUser(userData);

        try {
            await AsyncStorage.setItem('@fruttyoog:user', JSON.stringify(userData));
        } catch (error) {
            Alert.alert('Erro', 'Erro ao salvar usuário');
        }
    };

    const handleLogout = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem('@fruttyoog:user');
        } catch (error) {
            Alert.alert('Erro', 'Erro ao remover usuário');
        }
    };

    return (
        <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AppContext.Provider>
    );

};

export const useApp = () => {
    const context = useContext(AppContext);
    return context;
}