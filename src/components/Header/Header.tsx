import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from 'src/Navigation/types';
import { styles } from './styles';


const Header: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

//trocar as imagens por um icone de login e cadastro
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text>Acessar</Text>
            </View>
            <View style={styles.headerCenter}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Icon name='sign-in' size={30} color='#000' style={styles.headerIcon}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Icon name='user-plus' size={30} color='#000' style={styles.headerIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
                <Text>Versao 0.0.1</Text>
            </View>
        </View>
    );
};

export default Header;