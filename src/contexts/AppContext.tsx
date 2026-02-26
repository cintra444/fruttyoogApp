import React, { useContext, createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
    StoredUser,
    loadStoredUser,
    storeUser,
    clearStoredUser,
} from "src/Services/authStorage";

type AppContextProps = {
    user: StoredUser | null;
    handleLogin: (user: StoredUser) => Promise<void>;
    handleLogout: (navigation: NavigationProp<any>) => Promise<void>;
};

type AppProviderProps = {
    children: React.ReactNode;
};

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<StoredUser | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const data = await loadStoredUser();
            if (data) {
                setUser(data);
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao carregar usuário: " + error);
        }
    };

    const handleLogin = async (userData: StoredUser) => {
        setUser(userData);
        try {
            await storeUser(userData);
        } catch (error) {
            Alert.alert("Erro", "Erro ao salvar usuário: " + error);
        }
    };

    const handleLogout = async (navigation: NavigationProp<any>) => {
        setUser(null);
        try {
            await clearStoredUser();
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" as never }],
            });
        } catch (error) {
            Alert.alert("Erro", "Erro ao remover usuário: " + error);
        }
    };

    return (
        <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
