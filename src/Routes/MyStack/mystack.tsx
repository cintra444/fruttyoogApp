import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation/types";
import Home from "../../screens/Home/Home";
import Login from "../../screens/Auth/Login/Login";
import Cadastro from "src/screens/Auth/Cadastro/Cadastro";
import Dashboard from "src/screens/Admin/Dashboard";


const Stack = createNativeStackNavigator<RootStackParamList>();

export function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Cadastro} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
    );    
}