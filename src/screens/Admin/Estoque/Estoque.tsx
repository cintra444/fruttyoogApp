import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Card, CardIcon, CardTitle, } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/Navigation/types';

type EstoqueScreenProps = StackNavigationProp<RootStackParamList, 'Estoque'>;
const Estoque: React.FC = () => {
  const navigation = useNavigation<EstoqueScreenProps>();

const cards = [
    {
        title: 'Estoque Atual',
        icon: 'warehouse',
        color: '#4CAF50',
        onPress: () => navigation.navigate('CurrentStock'),
    },
    {
        title: 'Estoque Crítico',
        icon: 'alert-circle',
        color: '#2196F3',
        onPress: () => navigation.navigate('LowStock'), 
    },
];

  return (
    <Container>
       {/* Botão de voltar */}
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
