import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { FooterContainer, IconContainer } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FooterItem {
    id: number;
    name: string;
    icon: string;
    route: keyof RootStackParamList;
}

const footerItems: FooterItem[] = [
    {id: 1, name: 'Home', icon: 'home', route: 'Home' },
    {id: 2, name: 'Settings', icon: 'settings', route: 'Settings' },
    {id: 3, name: 'Refresh', icon: 'refresh', route: 'Refresh' },
    {id: 4, name: 'Logout', icon: 'logout', route: 'Logout' },
    {id: 5, name: 'Chat', icon: 'chat', route: 'Chat' },
];

const Footer = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']}>
        <FooterContainer>
            {footerItems.map((item) => (
                <IconContainer activeOpacity={0.8} key={item.id} onPress={() => navigation.navigate(item.route)}>
                    <Icon name={item.icon} size={30} color="#000" />
                </IconContainer>
            ))}
        </FooterContainer>
        </SafeAreaView>
        
    );
};

export default Footer;
