import React from 'react';
import { View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import  { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';

const Footer = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Settings')}>
                <Icon name="settings" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Refresh')}>
                <Icon name="refresh" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Logout')}>
                <Icon name="logout" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Chat')}>
                <Icon name="chat" size={30} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

export default Footer;