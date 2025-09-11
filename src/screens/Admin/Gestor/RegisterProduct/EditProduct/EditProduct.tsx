// EditProduct.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  CardContainer,
  CardTouchable,
  CardTitle,
} from "./styles";
import { GetProducts, PutProduct } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api

interface Product {
  id: number;
  name: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  qtdeEstoque: number;
  codigoProduto: string;
  tipoUnidade: string;
  imagem?: string;
}

const EditProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await GetProducts();
        if (data) setProducts(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os produtos");
      }
    };
    loadProducts();
  }, []);

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescricao(product.descricao);
    setPrecoCusto(String(product.precoCusto));
    setPrecoVenda(String(product.precoVenda));
    setQtdeEstoque(String(product.qtdeEstoque));
    setCodigoProduto(product.codigoProduto);
    setTipoUnidade(product.tipoUnidade);
  };

  const updateProduct = async () => {
    if (!selectedProduct) return;

    try {
      await PutProduct({
        ...selectedProduct,
        name,
        descricao,
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        qtdeEstoque: Number(qtdeEstoque),
        codigoProduto,
        tipoUnidade,
      });
      Alert.alert("Sucesso", "Produto atualizado!");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o produto");
    }
  };

  return (
    <Container>
        <Title>Editar Produto</Title>
      {/* Lista horizontal de produtos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <CardContainer>
          {products.length === 0 && (
            <CardTitle>Nenhum produto cadastrado ainda</CardTitle>
          )}
          {products.map((prod) => (
            <CardTouchable key={prod.id} onPress={() => selectProduct(prod)}>
              <CardTitle>{prod.name}</CardTitle>
            </CardTouchable>
          ))}
        </CardContainer>
      </ScrollView>

      {/* Formulário de edição */}
      {selectedProduct && (
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

          <Button onPress={updateProduct}>
            <ButtonText>Atualizar</ButtonText>
          </Button>
        </ScrollView>
      )}
    </Container>
  );
};

export default EditProduct;
