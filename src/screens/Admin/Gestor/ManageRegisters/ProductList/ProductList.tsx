// ProductList.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  CardContainer,
  CardTouchable,
  CardTitle,
  ListItem,
  ListText,
  DeleteButton,
  DeleteButtonText,
} from "./styles";
import {
  GetProducts,
  DeleteProdutos,
} from "../../.../../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BackButton, BackButtonText } from "../../styles";

interface Product {
  id: number;
  name: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  qtdeEstoque: number;
  codigoProduto: string;
  tipoUnidade: string;
  categoria: {
    id: number;
    nome: string;
  };
}

const ProductList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await GetProducts();
      if (data) setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o produto "${productName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteProdutos(productId);
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              loadProducts();
            } catch (error) {
              console.error("Erro ao excluir produto:", error);
              Alert.alert("Erro", "Não foi possível excluir o produto");
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Title>Produtos Cadastrados</Title>

      {loading ? (
        <Text style={{ textAlign: "center", padding: 20 }}>
          Carregando produtos...
        </Text>
      ) : products.length === 0 ? (
        <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
          Nenhum produto cadastrado
        </Text>
      ) : (
        <ScrollView>
          <Section>
            <Label style={{ fontSize: 16, marginBottom: 10 }}>
              Total: {products.length} produto(s)
            </Label>

            {products.map((product) => (
              <ListItem key={product.id}>
                <View style={{ flex: 1 }}>
                  <ListText style={{ fontWeight: "bold", fontSize: 16 }}>
                    {product.name}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Código: {product.codigoProduto}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Categoria: {product.categoria.nome}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Estoque: {product.qtdeEstoque}{" "}
                    {product.tipoUnidade.toLowerCase()}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Preço: R$ {product.precoVenda.toFixed(2)}
                  </ListText>
                  {product.descricao && (
                    <ListText
                      style={{
                        color: "#666",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      {product.descricao}
                    </ListText>
                  )}
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <CardTouchable
                    onPress={() => product}
                    style={{
                      backgroundColor: "#2196F3",
                      padding: 8,
                      borderRadius: 4,
                      marginBottom: 5,
                      minWidth: 80,
                    }}
                  >
                    <CardTitle style={{ fontSize: 12, color: "#fff" }}>
                      Editar
                    </CardTitle>
                  </CardTouchable>

                  <DeleteButton
                    onPress={() => handleDelete(product.id, product.name)}
                    style={{ padding: 8, minWidth: 80 }}
                  >
                    <DeleteButtonText style={{ fontSize: 12 }}>
                      Excluir
                    </DeleteButtonText>
                  </DeleteButton>
                </View>
              </ListItem>
            ))}
          </Section>
        </ScrollView>
      )}
    </Container>
  );
};

export default ProductList;
