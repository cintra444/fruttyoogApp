import React, { useContext, createContext, useState, useEffect } from "react";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

type AppContextProps = {
     user: UserProps | null;
    handleLogin: (user: UserProps) => void;
    handleLogout: () => void;
};

type UserProps = {
    id: string,
    name: string,
    email: string,
    token: string,
};

const AppContext = createContext<AppContextProps>({} as AppContextProps);
export const AppProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserProps | null>(null);
    const navigation = useNavigation();
   

    useEffect(() => {
        loadingUser();
    }, []);

    const loadingUser = async () => {
        try {
            const response = await AsyncStorage.getItem('@fruttyoog:user');
            if (response) {
                const data = JSON.parse(response);
                if(data && data.id && data.name && data.email && data.token) {
                setUser(data);
            } else {
                Alert.alert('Erro: ', 'Dados do usuário inválidos');
            }
            }
        } catch (error) {
            Alert.alert('Erro: ', 'Erro ao carregar usuário: ' + error);
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

    const handleLogout = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem('@fruttyoog:user');
            // @ts-ignore
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', 'Erro ao remover usuário' + error);
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