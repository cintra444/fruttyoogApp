import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../../screens/Home/Home';
import Settings from '../../screens/Settings/settings'
import Footer from 'src/components/Footer/Footer';
import Logout from 'src/screens/Logout/Logout';
import Refresh from 'src/screens/Refresh/Refresh';
import Chat from 'src/screens/Chat/Chat'; 

const Tab = createBottomTabNavigator();

const MyTabs = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator tabBar={() => <Footer />}>
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Settings" component={Settings} />
                <Tab.Screen name="refresh" component={Refresh} />
                <Tab.Screen name="Logout" component={Logout} />
                <Tab.Screen name="Chat" component={Chat} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default MyTabs;