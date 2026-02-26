// NewSuppliers.tsx
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Container, Section, Label, Input, Button, ButtonText } from "./styles";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { } from "../../../../Admin/Gestor/styles";
import { PostFornecedor } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho

const NewSuppliers: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [telefone, setTelefone] = useState("");

  //funcao para formatar telefone
  const formatarTelefone = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      return cleaned.length === 0 ? "" : `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      // Para celular com 11 dígitos (xx) xxxxx-xxxx
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handleSave = async () => {
    if (!nomeFantasia || !vendedor || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const telefoneFormatado = formatarTelefone(telefone);

      await PostFornecedor({ nomeFantasia, nomeContato: vendedor, telefone });
      Alert.alert("Sucesso", "Fornecedor cadastrado!");
      // resetar formulário
      setNomeFantasia("");
      setVendedor("");
      setTelefone("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o fornecedor");
    }
  };

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
        Cadastrar Fornecedor
      </Text>

      <ScrollView>
        <Section>
          <Label>Nome Fantasia</Label>
          <Input
            value={nomeFantasia}
            onChangeText={setNomeFantasia}
            placeholder="Nome da empresa"
          />
        </Section>
        <Section>
          <Label>Vendedor</Label>
          <Input
            value={vendedor}
            onChangeText={setVendedor}
            placeholder="Nome do vendedor"
          />
        </Section>
        <Section>
          <Label>Telefone</Label>
          <Input
            value={telefone}
            onChangeText={(text) => setTelefone(formatarTelefone(text))}
            keyboardType="phone-pad"
            maxLength={15}
            placeholder="(xx) xxxxx-xxxx"
          />
        </Section>
        <Button onPress={handleSave}>
          <ButtonText>Salvar</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewSuppliers;

