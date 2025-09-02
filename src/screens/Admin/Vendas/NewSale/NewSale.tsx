import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import {
  Container,
  Label,
  Input,
  Button,
  ButtonText,
  Section,
  ProductList,
  ProductItem,
  ProductText,
  RemoveButton,
  RemoveText,
} from "./styles";
import { useNavigation } from "@react-navigation/native";

// Tipos
type Cliente = {
  id: number;
  nome: string;
};

type Produto = {
  id: number;
  nome: string;
  preco: number;
};

type Pagamento = {
  id: number;
  descricao: string;
};

type ProdutoSelecionado = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
};

const NewSale: React.FC = () => {
  const navigation = useNavigation();

  // Estados da API
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  // Estados do formulário
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState<string>("1");
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<number | null>(null);
  const [parcelas, setParcelas] = useState<string>("1");

  // Buscar dados da API
  useEffect(() => {
    axios.get("http://localhost:8080/clientes").then((res) => setClientes(res.data));
    axios.get("http://localhost:8080/produtos").then((res) => setProdutos(res.data));
    axios.get("http://localhost:8080/pagamentos").then((res) => setPagamentos(res.data));
  }, []);

  // Adicionar produto ao carrinho
  const handleAddProduto = () => {
    if (!produtoSelecionado) {
      Alert.alert("Selecione um produto!");
      return;
    }
    const produto = produtos.find((p) => p.id === produtoSelecionado);
    if (!produto) return;

    const jaExiste = produtosSelecionados.find((p) => p.id === produto.id);
    if (jaExiste) {
      Alert.alert("Esse produto já foi adicionado.");
      return;
    }

    setProdutosSelecionados((prev) => [
      ...prev,
      {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: parseInt(quantidade) || 1,
      },
    ]);
    setProdutoSelecionado(null);
    setQuantidade("1");
  };

  // Remover produto
  const handleRemoveProduto = (id: number) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id));
  };

  // Calcular total
  const calcularTotal = () =>
    produtosSelecionados.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  // Finalizar venda
  const handleFinalizarVenda = () => {
    if (!clienteSelecionado || produtosSelecionados.length === 0 || !pagamentoSelecionado) {
      Alert.alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const venda = {
      clienteId: clienteSelecionado,
      produtos: produtosSelecionados.map((p) => ({
        id: p.id,
        quantidade: p.quantidade,
      })),
      pagamentoId: pagamentoSelecionado,
      parcelas: pagamentoSelecionado === 2 ? parseInt(parcelas) || 1 : 1, // Exemplo: 2 = "A prazo"
      total: calcularTotal(),
    };

    console.log("Venda gerada:", venda);
    Alert.alert("Venda registrada com sucesso!");
    navigation.goBack();
  };

  return (
    <Container>
        <ScrollView>
      {/* Cliente */}
      <Section>
        <Label>Cliente</Label>
        <Picker
          selectedValue={clienteSelecionado}
          onValueChange={(value) => setClienteSelecionado(value)}
        >
          <Picker.Item label="Selecione um cliente" value={null} />
          {clientes.map((c) => (
            <Picker.Item key={c.id} label={c.nome} value={c.id} />
          ))}
        </Picker>
      </Section>

      {/* Produto */}
      <Section>
        <Label>Produto</Label>
        <Picker
          selectedValue={produtoSelecionado}
          onValueChange={(value) => setProdutoSelecionado(value)}
        >
          <Picker.Item label="Selecione um produto" value={null} />
          {produtos.map((p) => (
            <Picker.Item key={p.id} label={`${p.nome} - R$ ${p.preco.toFixed(2)}`} value={p.id} />
          ))}
        </Picker>
        <Label>Quantidade</Label>
        <Input
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
        <Button onPress={handleAddProduto}>
          <ButtonText>Adicionar Produto</ButtonText>
        </Button>
      </Section>

      {/* Lista de produtos */}
      <ProductList>
        {produtosSelecionados.map((p) => (
          <ProductItem key={p.id}>
            <ProductText>
              {p.nome} - {p.quantidade} x R$ {p.preco.toFixed(2)}
            </ProductText>
            <RemoveButton onPress={() => handleRemoveProduto(p.id)}>
              <RemoveText>Remover</RemoveText>
            </RemoveButton>
          </ProductItem>
        ))}
      </ProductList>

      {/* Forma de pagamento */}
      <Section>
        <Label>Forma de Pagamento</Label>
        <Picker
          selectedValue={pagamentoSelecionado}
          onValueChange={(value) => setPagamentoSelecionado(value)}
        >
          <Picker.Item label="Selecione uma forma" value={null} />
          {pagamentos.map((pg) => (
            <Picker.Item key={pg.id} label={pg.descricao} value={pg.id} />
          ))}
        </Picker>

        {pagamentoSelecionado === 2 && ( // Exemplo: "A prazo"
          <>
            <Label>Número de parcelas</Label>
            <Input
              keyboardType="numeric"
              value={parcelas}
              onChangeText={setParcelas}
            />
          </>
        )}
      </Section>

      {/* Total */}
      <Section>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Total: R$ {calcularTotal().toFixed(2)}
        </Text>
      </Section>

      {/* Botão finalizar */}
      <Button onPress={handleFinalizarVenda}>
        <ButtonText>Finalizar Venda</ButtonText>
      </Button>
        </ScrollView>
    </Container>
  );
};

export default NewSale;
