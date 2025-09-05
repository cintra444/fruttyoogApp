import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../Navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { styles } from './styles';

const Refresh: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Home');
        }, 7000); // 7 segundos

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Atualizando...</Text>
        </View>
    );
};

export default Refresh;