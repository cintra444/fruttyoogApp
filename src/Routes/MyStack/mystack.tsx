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
import HistorySale from "../../screens/Admin/Vendas/HistorySale/HistorySale";
import Invoice from "../../screens/Admin/Vendas/Invoice/Invoice";
import RegisterProduct from "../../screens/Admin/Gestor/RegisterProduct/RegisterProduct";
import RegisterCustomers from "../../screens/Admin/Gestor/RegisterCustomers/RegisterCustomers";
import NewCustomers from "../../screens/Admin/Gestor/RegisterCustomers/NewCustomers/NewCustomers";
import EditCustomers from "../../screens/Admin/Gestor/RegisterCustomers/EditCustomers/EditCustomers";
import NewProduct from "../../screens/Admin/Gestor/RegisterProduct/NewProduct/NewProduct";
import EditProduct from "../../screens/Admin/Gestor/RegisterProduct/EditProduct/EditProduct";
import RegisterSuppliers from "../../screens/Admin/Gestor/RegisterSuppliers/RegisterSuppliers";
import NewSuppliers from "../../screens/Admin/Gestor/RegisterSuppliers/NewSuppliers/NewSuppliers";
import EditSuppliers from "../../screens/Admin/Gestor/RegisterSuppliers/EditSuppliers/EditSuppliers";



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

            {/* compras */}
            <Stack.Screen name="Compras" component={Compras} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewShop" component={NewShop} options={{ headerTitle: () => <Header /> }} />
            <Stack.Screen name="HistoryShop" component={HistoryShop} options={{ headerTitle: () => <Header /> }} /> 
            {/* vendas */}
            <Stack.Screen name="Vendas" component={Vendas} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewSale" component={NewSale} options={{ headerTitle: () => <Header /> }} />
            <Stack.Screen name="HistorySale" component={HistorySale} options={{ headerTitle: () => <Header /> }} />
            <Stack.Screen name="Invoice" component={Invoice} options={{ headerTitle: () => <Header /> }} />
            {/* outras telas */}
            <Stack.Screen name="Estoque" component={Estoque} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Financeiro" component={Financeiro} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="Relatorios" component={Relatorios} options={{ headerTitle: () => <Header /> }}/>
            {/* gestor */}
            <Stack.Screen name="Gestor" component={Gestor} options={{ headerTitle: () => <Header /> }}/> 
            {/* produtos */}
            <Stack.Screen name="RegisterProduct" component={RegisterProduct} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewProduct" component={NewProduct} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="EditProduct" component={EditProduct} options={{ headerTitle: () => <Header /> }}/>
            {/* clientes */}
            <Stack.Screen name="RegisterCustomers" component={RegisterCustomers} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewCustomers" component={NewCustomers} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="EditCustomers" component={EditCustomers} options={{ headerTitle: () => <Header /> }}/>
            {/* fornecedores */}
            <Stack.Screen name="RegisterSuppliers" component={RegisterSuppliers} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="NewSuppliers" component={NewSuppliers} options={{ headerTitle: () => <Header /> }}/>
            <Stack.Screen name="EditSuppliers" component={EditSuppliers} options={{ headerTitle: () => <Header /> }}/>
            {/* <Stack.Screen name="BalancoMensal" component={BalancoMensal} options={{ headerTitle: () => <Header /> }}/> */}

        </Stack.Navigator>
        <Footer/>
        </>
    );    
}