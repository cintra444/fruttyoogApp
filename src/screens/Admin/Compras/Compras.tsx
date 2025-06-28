import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Card, CardIcon, CardTitle, BackButton, BackButtonText } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

const cards = [
    {
        title: 'Produtos',
        icon: 'cube-outline',
        color: '#4CAF50',
        onPress: () => {},
    },
    {
        title: 'Pagamentos',
        icon: 'credit-card-outline',
        color: '#2196F3',
        onPress: () => {}, 
    },
    {
        title: 'Fornecedor',
        icon: 'truck-outline',
        color: '#FF9800',
        onPress: () => {},
    },
];
const Compras: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Container>
       {/* Botão de voltar */}
            <BackButton onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={33} color="#000" />
              <BackButtonText>Voltar</BackButtonText>
            </BackButton>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card) => (
          <Card key={card.title} onPress={card.onPress} activeOpacity={0.8} borderColor={card.color}>
            <CardIcon>
              <Icon name={card.icon} size={40} color={card.color} />
            </CardIcon>
            <CardTitle>{card.title}</CardTitle>
          </Card>
        ))}
      </ScrollView>
    </Container>
  );
};



export default Compras;