import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextData {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

interface Venda{
    id: string;
    cliente: string;
    fornecedor: string;
    produto: string;
    valor: number;
    quantidade: number;
    data: string;
    preco: number;
    total: number;
    status: string;
}

interface VendaContextData {
    vendas: Venda[];
    addVenda: (venda: Venda) => void;
    updateVenda: (venda: Venda) => void;
    deleteVenda: (id: string) => void;
    getVendaById: (id: string) => Venda | undefined;
}

interface AppContextData extends AuthContextData, VendaContextData {}

interface AppProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [vendas, setVendas] = useState<Venda[]>([]);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    const addVenda = (venda: Venda) => setVendas([...vendas, venda]);
    const updateVenda = (venda: Venda) => {
        const index = vendas.findIndex((v) => v.id === venda.id);
        if (index !== -1) {
            vendas[index] = venda;
            setVendas([...vendas]);
        }
    };
    const deleteVenda = (id: string) => setVendas(vendas.filter((v) => v.id !== id));
    const getVendaById = (id: string) => vendas.find((v) => v.id === id);

    return (
        <AppContext.Provider value={{ isLoggedIn, login, logout, vendas, addVenda, updateVenda, deleteVenda, getVendaById }}>
            {children}
        </AppContext.Provider>
    );
};