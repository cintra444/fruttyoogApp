import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Card, CardIcon, CardTitle, BackButton, BackButtonText } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';

const cards = [
    {
        title: 'Produtos',
        icon: 'product-hunt',
        color: '#4CAF50',
        onPress: () => {},
    },
    {
        title: 'Categorias',
        icon: 'category-outline',
        color: '#2196F3',
        onPress: () => {}, 
    },
];
const Estoque: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Container>
       {/* Botão de voltar */}
            <BackButton onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={33} color="#000" />
              <BackButtonText>Voltar</BackButtonText>
            </BackButton>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Estoque</Text>
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



export default Estoque;