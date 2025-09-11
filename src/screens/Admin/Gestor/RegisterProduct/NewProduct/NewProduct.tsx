// NewProduct.tsx
import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import {
  Container,
    Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { PostProduct } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api

const NewProduct: React.FC = () => {
  // Formulário novo produto
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");

  const handleAddProduct = async () => {
    if (!name || !descricao || !precoCusto || !precoVenda || !qtdeEstoque || !codigoProduto || !tipoUnidade) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await PostProduct({
        name,
        descricao,
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        qtdeEstoque: Number(qtdeEstoque),
        codigoProduto,
        tipoUnidade,
        imagem: "",
      });
      Alert.alert("Sucesso", "Produto cadastrado!");
      // resetar formulário
      setName(""); 
      setDescricao(""); 
      setPrecoCusto(""); 
      setPrecoVenda(""); 
      setQtdeEstoque(""); 
      setCodigoProduto(""); 
      setTipoUnidade("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o produto");
    }
  };

  return (
    <Container>
      <Title>Novo Produto</Title>
      <ScrollView>
        <Section>
          <Label>Nome</Label>
          <Input value={name} onChangeText={setName} />

          <Label>Descrição</Label>
          <Input value={descricao} onChangeText={setDescricao} />

          <Label>Preço de Custo</Label>
          <Input value={precoCusto} onChangeText={setPrecoCusto} keyboardType="numeric" />

          <Label>Preço de Venda</Label>
          <Input value={precoVenda} onChangeText={setPrecoVenda} keyboardType="numeric" />

          <Label>Quantidade</Label>
          <Input value={qtdeEstoque} onChangeText={setQtdeEstoque} keyboardType="numeric" />

          <Label>Código do Produto</Label>
          <Input value={codigoProduto} onChangeText={setCodigoProduto} />

          <Label>Tipo de Unidade</Label>
          <Input value={tipoUnidade} onChangeText={setTipoUnidade} />
        </Section>

        <Button onPress={handleAddProduct}>
          <ButtonText>Salvar</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewProduct;
