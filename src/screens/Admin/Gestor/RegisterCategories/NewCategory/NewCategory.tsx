import React, { useState } from "react";
import { Alert, Text } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { PostCategoria } from "../../../../../Services/apiFruttyoog";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";

const NewCategory: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState("");

  const handleSave = async () => {
    if (!nome) {
      Alert.alert("Atenção", "Informe o nome da categoria");
      return;
    }
    try {
      await PostCategoria({ nome });
      Alert.alert("Sucesso", "Categoria cadastrada!");
      setNome("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar");
    }
  };

  return (
    <Container>
      {/* Botão de voltar */}
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Nova Categoria
      </Text>

      <Section>
        <Label>Nome da Categoria</Label>
        <Input
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Queijo, Doce, Biscoito..."
        />
      </Section>

      <Button onPress={handleSave} bgColor="#4CAF50">
        <ButtonText>Salvar</ButtonText>
      </Button>
    </Container>
  );
};

export default NewCategory;
