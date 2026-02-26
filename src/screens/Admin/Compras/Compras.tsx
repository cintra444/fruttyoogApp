import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import { RootStackParamList } from "../../../Navigation/types";

type ComprasScreenProp = StackNavigationProp<RootStackParamList, "Compras">;

const Compras: React.FC = () => {
  const navigation = useNavigation<ComprasScreenProp>();

  const cards = [
    {
      title: "Nova compra",
      icon: "cart-outline",
      color: "#4CAF50",
      onPress: () =>
        navigation.navigate("NewShop", {
          novoProdutoId: undefined,
          fornecedorId: undefined,
        }),
    },
    {
      title: "Historico de compras",
      icon: "history",
      color: "#2196F3",
      onPress: () => navigation.navigate("HistoryShop"),
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
        Compras
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

export default Compras;

