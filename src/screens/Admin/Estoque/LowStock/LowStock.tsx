import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  Container,
  Title,
  ProductItem,
  ProductText,
  QuantityText,
} from "./styles";
import { GetStock } from "../../../../Services/apiFruttyoog"; // ajuste caminho

interface StockItem {
  id: number;
  nomeProduto: string;
  categoria: string;
  quantidade: number;
}

const LowStock: React.FC = () => {
  const [lowStock, setLowStock] = useState<StockItem[]>([]);

  useEffect(() => {
    loadLowStock();
  }, []);

  const loadLowStock = async () => {
    try {
      const res = await GetStock();
      if (res) {
        const filtered = res.filter((item: StockItem) => item.quantidade <= 5);
        setLowStock(filtered);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o estoque crítico");
    }
  };

  return (
    <Container>
      <Title>Estoque Crítico (≤ 5)</Title>

      <FlatList
        data={lowStock}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductItem>
            <ProductText>{item.nomeProduto}</ProductText>
            <ProductText>Categoria: {item.categoria}</ProductText>
            <QuantityText lowStock>
              Quantidade: {item.quantidade}
            </QuantityText>
          </ProductItem>
        )}
      />
    </Container>
  );
};

export default LowStock;
