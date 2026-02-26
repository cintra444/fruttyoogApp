import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Card, CardIcon, CardTitle, } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/Navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

type RelatoriosScreenProps = StackNavigationProp<RootStackParamList, 'Relatorios'>;
const Relatorios: React.FC = () => {
  const navigation = useNavigation<RelatoriosScreenProps>();

const cards = [
    {
        title: 'Relatorio de Vendas',
        icon: 'chart-bar',
        color: '#4CAF50',
        onPress: () => navigation.navigate('SalesReport'),
    },
    {
        title: 'Relatorio de Estoque',
        icon: 'archive',
        color: '#2196F3',
        onPress: () => navigation.navigate('StockReport'), 
    },
    {
        title: 'Relatorio Financeiro',
        icon: 'file-chart',
        color: '#FF9800',
        onPress: () => navigation.navigate('FinancialReport'),
    },
    {
        title: 'Exportar para Excel',
        icon: 'file-excel',
        color: '#0F766E',
        onPress: () => navigation.navigate('ExportData'),
    },
];

  return (
    <Container>
       {/* Botão de voltar */}
<Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Relatórios</Text>
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



export default Relatorios;

