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

type ManageRegistersScreenProps = StackNavigationProp<
  RootStackParamList,
  "ManageRegisters"
>;
const RegisterPaymentMethods: React.FC = () => {
  const navigation = useNavigation<ManageRegistersScreenProps>();

  const cards = [
    {
      title: "Clientes cadastrados",
      icon: "account-multiple",
      color: "#4CAF50",
      onPress: () => navigation.navigate("ClientList"),
    },
    {
      title: "Fornecedores cadastrados",
      icon: "truck",
      color: "#2196F3",
      onPress: () => navigation.navigate("SupplierList"),
    },
    {
      title: "Produtos cadastrados",
      icon: "package-variant",
      color: "#9C27B0",
      onPress: () => navigation.navigate("ProductList"),
    },
    {
      title: "Categorias cadastradas",
      icon: "tag-multiple",
      color: "#F44336",
      onPress: () => navigation.navigate("CategoryList"),
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
        Gerenciar Cadastros
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

export default RegisterPaymentMethods;

