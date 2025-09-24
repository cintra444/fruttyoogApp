// NewSuppliers.tsx
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import {
  Container,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BackButton, BackButtonText } from "../../../../Admin/Gestor/styles";
import { PostFornecedor } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho

const NewSuppliers: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSave = async () => {
    if (!nomeFantasia || !vendedor || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
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
                                <BackButton onPress={() => navigation.goBack()}>
                                  <Icon name="arrow-left" size={33} color="#000" />
                                  <BackButtonText>Voltar</BackButtonText>
                                </BackButton>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Cadastrar Fornecedor</Text>
                  
              
      <ScrollView>
        <Section>
          <Label>Nome Fantasia</Label>
          <Input value={nomeFantasia} onChangeText={setNomeFantasia} />
        </Section>
        <Section>
          <Label>Vendedor</Label>
          <Input value={vendedor} onChangeText={setVendedor} />
        </Section>
        <Section>
          <Label>Telefone</Label>
          <Input value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        </Section>
        <Button onPress={handleSave}>
          <ButtonText>Salvar</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewSuppliers;
