import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { ScrollView, Text } from "react-native";
import { Container, Card, CardIcon, CardTitle, BackButton, BackButtonText } from "../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Title } from "./styles";

type GestorScreenProps = StackNavigationProp<RootStackParamList, "RegisterCustomers">;

const RegisterCustomers: React.FC = () => {
  const navigation = useNavigation<GestorScreenProps>();
  
  const cards = [
    {
      title: "Novo Cliente",
      icon: "account-plus",
      color: "#4CAF50",
      onPress: () => navigation.navigate("NewCustomers"),
    },
    {
      title: "Editar Cliente",
      icon: "account-edit",
      color: "#2196F3",
      onPress: () => navigation.navigate("EditCustomers"),
    },
  ];

  return (
    <Container>
      {/* Botão de voltar */}
                  <BackButton onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={33} color="#000" />
                    <BackButtonText>Voltar</BackButtonText>
                  </BackButton>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Gerenciar Clientes</Text>
    <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
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

export default RegisterCustomers;