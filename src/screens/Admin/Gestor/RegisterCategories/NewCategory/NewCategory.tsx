import React, { useState } from "react";
import { Alert } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { PostCategoria } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho

const NewCategory: React.FC = () => {
  const [nomeCategoria, setNomeCategoria] = useState("");

  const handleSave = async () => {
    if (!nomeCategoria) {
      Alert.alert("Atenção", "Informe o nome da categoria");
      return;
    }
    try {
      await PostCategoria({ nomeCategoria });
      Alert.alert("Sucesso", "Categoria cadastrada!");
      setNomeCategoria("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar");
    }
  };

  return (
    <Container>
      <Title>Cadastrar Categoria</Title>

      <Section>
        <Label>Nome da Categoria</Label>
        <Input
          value={nomeCategoria}
          onChangeText={setNomeCategoria}
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
