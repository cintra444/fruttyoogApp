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
import { PostPaymentMethods} from "../../../../../Services/apiFruttyoog"; // ajuste o caminho

const NewPaymentMethods: React.FC = () => {
  const [formaPagamento, setFormaPagamento] = useState("");
  const [prazo, setPrazo] = useState("");

  const handleSave = async () => {
    if (!formaPagamento || !prazo) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
    try {
      await PostPaymentMethods({ tipoPagamento: formaPagamento, prazoDias: parseInt(prazo) });
      Alert.alert("Sucesso", "Forma de pagamento cadastrada!");
      setFormaPagamento("");
      setPrazo("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar");
    }
  };

  return (
    <Container>
      <Title>Cadastrar Forma de Pagamento</Title>

      <Section>
        <Label>Forma de Pagamento</Label>
        <Input
          value={formaPagamento}
          onChangeText={setFormaPagamento}
          placeholder="Ex: Cartão de Crédito"
        />
      </Section>

      <Section>
        <Label>Prazo</Label>
        <Input
          value={prazo}
          onChangeText={setPrazo}
          placeholder="Ex: 30 dias"
        />
      </Section>

      <Button onPress={handleSave} bgColor="#4CAF50">
        <ButtonText>Salvar</ButtonText>
      </Button>
    </Container>
  );
};

export default NewPaymentMethods;
