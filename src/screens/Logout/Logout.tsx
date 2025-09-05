import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const Logout: React.FC = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' as never }],
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Logging out...</Text>
        </View>
    );
};


export default Logout;