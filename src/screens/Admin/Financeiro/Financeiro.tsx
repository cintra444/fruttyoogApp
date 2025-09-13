import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Card, CardIcon, CardTitle, BackButton, BackButtonText } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/Navigation/types';

type FinanceiroScreenProps = StackNavigationProp<RootStackParamList, 'Financeiro'>;

const Financeiro: React.FC = () => {
  const navigation = useNavigation<FinanceiroScreenProps>();

const cards = [
    {
        title: 'Pagamentos',
        icon: 'credit-card',
        color: '#4CAF50',
        onPress: () => navigation.navigate('Payments'),
    },
    {
        title: 'Despesas',
        icon: 'cash-minus',
        color: '#2196F3',
        onPress: () => navigation.navigate('Expenses'), 
    },
    {
        title: 'Receitas',
        icon: 'receipt',
        color: '#FF9800',
        onPress: () => navigation.navigate('Revenues'),
    },
];

  return (
    <Container>
       {/* Botão de voltar */}
            <BackButton onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={33} color="#000" />
              <BackButtonText>Voltar</BackButtonText>
            </BackButton>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Financeiro</Text>
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



export default Financeiro;