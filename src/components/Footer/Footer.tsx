import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { FooterContainer, IconContainer } from './styles';

interface FooterItem {
    name: string;
    icon: string;
    route: keyof RootStackParamList;
}

const footerItems: FooterItem[] = [
    { name: 'Home', icon: 'home', route: 'Home' },
    { name: 'Settings', icon: 'settings', route: 'Settings' },
    { name: 'Refresh', icon: 'refresh', route: 'Refresh' },
    { name: 'Logout', icon: 'logout', route: 'Logout' },
    { name: 'Chat', icon: 'chat', route: 'Chat' },
];

const Footer = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <FooterContainer>
            {footerItems.map((item) => (
                <IconContainer key={item.name} onPress={() => navigation.navigate(item.route)}>
                    <Icon name={item.icon} size={30} color="#000" />
                </IconContainer>
            ))}
        </FooterContainer>
    );
};

export default Footer;