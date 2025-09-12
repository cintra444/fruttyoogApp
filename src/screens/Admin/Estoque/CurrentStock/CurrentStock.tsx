import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  Container,
  Title,
  FilterContainer,
  Input,
  Button,
  ButtonText,
  ProductItem,
  ProductText,
  QuantityText,
  FilterGroup,
  FilterLabel,
} from "./styles";
import {
  GetStock,
  GetStockByProduct,
  GetStockByCategory,
  GetStockByQuantity,
} from "../../../../Services/apiFruttyoog"; // ajuste conforme sua api

interface StockItem {
  id: number;
  nomeProduto: string;
  categoria: string;
  quantidade: number;
}

const CurrentStock: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [produto, setProduto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");

  useEffect(() => {
    handleListAll();
  }, []);

  const handleListAll = async () => {
    try {
      const res = await GetStock();
      if (res) setStock(res);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o estoque");
    }
  };

  const handleFilterByProduct = async () => {
    if (!produto) {
      Alert.alert("Atenção", "Informe o nome do produto");
      return;
    }
    try {
      const res = await GetStockByProduct(produto);
      setStock(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar por produto");
    }
  };

  const handleFilterByCategory = async () => {
    if (!categoria) {
      Alert.alert("Atenção", "Informe a categoria");
      return;
    }
    try {
      const res = await GetStockByCategory(categoria);
      setStock(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar por categoria");
    }
  };

  const handleFilterByQuantity = async () => {
    if (!quantidade) {
      Alert.alert("Atenção", "Informe a quantidade");
      return;
    }
    try {
      const q = parseInt(quantidade, 10);
      if (isNaN(q)) {
        Alert.alert("Erro", "Quantidade inválida");
        return;
      }
      const res = await GetStockByQuantity(q);
      setStock(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar por quantidade");
    }
  };

  return (
    <Container>
      <Title>Estoque Atual</Title>

      <FilterContainer>
        <FilterGroup>
        <FilterLabel>Filtrar por Produto:</FilterLabel>
        <Input
          placeholder="Filtrar por produto"
          value={produto}
          onChangeText={setProduto}
        />
        <Button onPress={handleFilterByProduct} bgColor="#FF9800">
          <ButtonText>Buscar Produto</ButtonText>
        </Button>
        </FilterGroup>

        <FilterGroup>
        <FilterLabel>Filtrar por Categoria:</FilterLabel>
        <Input
          placeholder="Filtrar por categoria"
          value={categoria}
          onChangeText={setCategoria}
        />
        <Button onPress={handleFilterByCategory} bgColor="#2196F3">
          <ButtonText>Buscar Categoria</ButtonText>
        </Button>
        </FilterGroup>

        <FilterGroup>
        <FilterLabel>Filtrar por Quantidade:</FilterLabel>
        <Input
          placeholder="Filtrar por quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />
        <Button onPress={handleFilterByQuantity} bgColor="#9C27B0">
          <ButtonText>Buscar Quantidade</ButtonText>
        </Button>
        </FilterGroup>

        <FilterGroup>
        <FilterLabel>Listar Todos:</FilterLabel>
        <Button onPress={handleListAll} bgColor="#4CAF50">
          <ButtonText>Listar Todos</ButtonText>
        </Button>
        </FilterGroup>
      </FilterContainer>


      <FlatList
        data={stock}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductItem>
            <ProductText>{item.nomeProduto}</ProductText>
            <ProductText>Categoria: {item.categoria}</ProductText>
            <QuantityText lowStock={item.quantidade <= 5}>
              Quantidade: {item.quantidade}
            </QuantityText>
          </ProductItem>
        )}
      />
    </Container>
  );
};

export default CurrentStock;
