import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation/types";
import Home from "../../screens/Home/Home";
import Login from "../../screens/Auth/Login/Login";
import Cadastro from "../../screens/Auth/Cadastro/Cadastro";
import Dashboard from "../../screens/Admin/Dashboard";
import Header from '../../components/Header/Header';
import Footer from "../../components/Footer/Footer";
import Compras from  "../../screens/Admin/Compras/Compras";
import Vendas from  "../../screens/Admin/Vendas/Vendas";
import Estoque from  "../../screens/Admin/Estoque/Estoque";
import Financeiro from  "../../screens/Admin/Financeiro/Financeiro";
import Relatorios from  "../../screens/Admin/Relatorios/Relatorios";
import Gestor from  "../../screens/Admin/Gestor/Gestor";
import BalancoMensal from "../../screens/Admin/BalancoMensal/BalancoMensal";
import NewShop from "../../screens/Admin/Compras/NewShop/NewShop";
import NewSale from "../../screens/Admin/Vendas/NewSale/NewSale";
import HistoryShop from "../../screens/Admin/Compras/HistoryShop/HistoryShop";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function MyStack() {
    return (
        <>
        {/* <NavigationContainer> */}
        <Stack.Navigator
        screenOptions={{ header: () => <Header />, 
        }}>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login}  options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Register" component={Cadastro} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/>

            {/* cards dash */}
            <Stack.Screen name="Compras" component={Compras} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewShop" component={NewShop} options={{ headerTitle: () => <Header /> }} />
            <Stack.Screen name="HistoryShop" component={HistoryShop} options={{ headerTitle: () => <Header /> }} /> 
            <Stack.Screen name="Vendas" component={Vendas} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewSale" component={NewSale} options={{ headerTitle: () => <Header /> }} />
            {/* <Stack.Screen name="HistorySale" component={HistorySale} options={{ headerTitle: () => <Header /> }} /> */}
            <Stack.Screen name="Estoque" component={Estoque} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Financeiro" component={Financeiro} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Relatorios" component={Relatorios} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Gestor" component={Gestor} options={{ headerTitle: () => <Header /> }}/> 
            {/* <Stack.Screen name="BalancoMensal" component={BalancoMensal} options={{ headerTitle: () => <Header /> }}/> */}

        </Stack.Navigator>
        <Footer/>
        </>
    );    
}