import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import logo from '../../../assets/logo.png';

const Header: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text>Acessar</Text>
            </View>
            <View style={styles.headerCenter}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Image source={require('../../../assets/logo.png')} style={styles.headerImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Image source={require('../../../assets/logo.png')} style={styles.headerImage} />
                </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
                <Text>Versao 0.0.1</Text>
            </View>
        </View>
    );
};

export default Header;