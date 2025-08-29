// Dashboard.tsx
import React from "react";
import { Dimensions, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Card } from "../../components/CardMenu/CardMenuAdm";
import { ContainerDashboard } from "./styles";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { HeaderBackButton } from '@react-navigation/elements';

type DashboardStackParamList = {
  Compras: undefined;
  Vendas: undefined;
  Estoque: undefined;
  Financeiro: undefined;
  Relatorios: undefined;
  Gestor: undefined;
};

const cardMenu: {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
  screen: keyof DashboardStackParamList;
}[] = [
  {
    id: "1",
    title: "Compras",
    icon: "shopping-cart",
    description: "Gerencie suas compras",
    screen: "Compras"
  },

  {
    id: "2", 
    title: "Vendas",
    icon: "attach-money",
    description: "Gerencie suas vendas",
    screen: "Vendas"
  },

  {
    id: "3",
    title: "Estoque",
    icon: "inventory",
    description: "Gerencie seu estoque",
    screen: "Estoque"
  },

  {
    id: "4",
    title: "Financeiro",
    icon: "account-balance",
    description: "Gerencie seu financeiro",
    screen: "Financeiro"
  },

  {
    id: "5",
    title: "Relatórios",
    icon: "insert-chart",
    description: "Acesse seus relatórios",
    screen: "Relatorios"
  },

  {
    id: "6", 
    title: "Gestor",
    icon: "supervisor-account",
    description: "Gerencie seus gestores",
    screen: "Gestor"
  }
];

const Dashboard: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<DashboardStackParamList>>();

  const handleCardPress = (item: typeof cardMenu[number]) => {
    navigation.navigate(item.screen);
  };

  const screemWidth = Dimensions.get("window").width; // Obtém a largura da tela
  const numColumns = screemWidth > 600 ? 3 : 2; // Ajusta o número de colunas com base na largura da tela

  return (
    <ContainerDashboard>
      <FlatList 
        data={cardMenu}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={{ padding: 16, gap: 16, alignItems: "stretch" }}
        columnWrapperStyle = { { justifyContent: "space-between" } }
        renderItem={({ item }) =>(
          <Card key={item.id} item={item} onPress={() => handleCardPress(item)} />
        )}
      />
    </ContainerDashboard>
  );
}

export default Dashboard;