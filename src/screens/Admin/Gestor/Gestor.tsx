import React from "react";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Container,
  Card,
  CardIcon,
  CardTitle,
  } from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";

type GestorScreenProps = StackNavigationProp<RootStackParamList, "Gestor">;
const Gestor: React.FC = () => {
  const navigation = useNavigation<GestorScreenProps>();

  const cards = [
    {
      title: "Cadastar Clientes",
      icon: "account-multiple",
      color: "#4CAF50",
      onPress: () => navigation.navigate("RegisterCustomers"),
    },
    {
      title: "Cadastar Fornecedores",
      icon: "truck",
      color: "#2196F3",
      onPress: () => navigation.navigate("RegisterSuppliers"),
    },
    {
      title: "Cadastar Categorias",
      icon: "shape-outline",
      color: "#F44336",
      onPress: () => navigation.navigate("RegisterCategories"),
    },
    {
      title: "Cadastrar Produtos",
      icon: "cube-outline",
      color: "#9C27B0",
      onPress: () => navigation.navigate("RegisterProduct"),
    },
    {
      title: "Gerenciar Cadastros",
      icon: "format-list-bulleted",
      color: "#FF9800",
      onPress: () => navigation.navigate("ManageRegisters"),
    },
  ];

  return (
    <Container>
      {/* Botão de voltar */}
<Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Gestor
      </Text>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.title}
            onPress={card.onPress}
            activeOpacity={0.8}
            borderColor={card.color}
          >
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

export default Gestor;

