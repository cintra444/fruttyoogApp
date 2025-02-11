import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import  { styles } from './styles';

const Footer = () => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="home" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="settings" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="refresh" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="logout" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="chat" size={30} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

export default Footer;