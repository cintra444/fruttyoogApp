import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../../screens/Home/Home';
import Settings from '../../screens/Settings/settings'
import Footer from "../../components/Footer/Footer";
import Refresh from "../../screens/Refresh/Refresh";
import Chat from '../../screens/Chat/Chat';
import Logout from '../../screens/Auth/Logout/logout';
import { Icon } from 'react-native-vector-icons/Icon';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
    return (
       
            <Tab.Navigator tabBar={() => <Footer />}
                screenOptions={{
                    tabBarActiveTintColor: '#e91e63',
                    tabBarInactiveTintColor: '#000',
                    headerShown: false,
                }}
                >

                <Tab.Screen name="Home" component={Home} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" size={24} color={color} />
                    ),
                }}
            />
                <Tab.Screen name="Settings" component={Settings}  options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="cog" size={24} color={color} />
                    ),
                }}
            />
                <Tab.Screen name="refresh" component={Refresh} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="refresh" size={24} color={color} />
                    ),
                }}
            />
                <Tab.Screen name="Logout" component={Logout} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="sign-out" size={24} color={color} />
                    ),
                }}
            />
                <Tab.Screen name="Chat" component={Chat} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="comments" size={24} color={color} />
                    ),
                }}
            />
              </Tab.Navigator>
       
    );
};

export default MyTabs;