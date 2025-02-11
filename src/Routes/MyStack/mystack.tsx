import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation/types";
import Home from "../../screens/Home/home";
import Login from "../../screens/Login/login";  
import Logout from "../../screens/Logout/logout";
import Main from "../../screens/Main/main";
import Settings from "../../screens/Settings/settings";



const Stack = createNativeStackNavigator<RootStackParamList>();

export function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    );    
}