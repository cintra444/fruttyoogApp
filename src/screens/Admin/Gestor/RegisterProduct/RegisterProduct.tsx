import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { ScrollView, Text } from "react-native";
import { Container, Card, CardIcon, CardTitle, } from "../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


type RegisterProductScreenProps = StackNavigationProp<RootStackParamList, "RegisterProduct">;

const RegisterProduct: React.FC = () => {
  const navigation = useNavigation<RegisterProductScreenProps>();
  
  const cards = [
    {
      title: "Novo Produto",
      icon: "plus-box",
      color: "#4CAF50",
      onPress: () => navigation.navigate("NewProduct"),
    },
    {
      title: "Editar Produto",
      icon: "pencil-box",
      color: "#2196F3",
      onPress: () => navigation.navigate("EditProduct"),
    },
  ];

  return (
    <Container>
      {/* Botão de voltar */}
<Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Gerenciar Produtos</Text>
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

export default RegisterProduct;
