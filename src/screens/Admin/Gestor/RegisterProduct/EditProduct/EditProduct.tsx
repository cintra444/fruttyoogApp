// EditProduct.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text } from "react-native";
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
  DeleteButton,
  DeleteButtonText,
} from "./styles";
import { GetProducts, PutProdutos } from "../../../../../Services/apiFruttyoog"; 
import { Picker } from "@react-native-picker/picker";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";

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

const tipoUnidadeOption = [
  "UNIDADE", "CAIXA", "LITRO", "POTE_VIDRO", "POTE_PLASTICO", 
  "PACOTE", "EMBALAGEM", "CAIXA_PLASTICA", "DUZIA", "KG", "GRAMA", "OUTRO"
];

const EditProduct: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const deleteProduct = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: async () => {
            if (!selectedProduct) return;
            try {
              
              const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
              setProducts(updatedProducts);
              setSelectedProduct(null);
              Alert.alert("Sucesso", "Produto deletado com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o produto");
            }
          }
        }
      ]
    );
  };

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

    if (
      !name ||
      !descricao ||
      !precoCusto ||
      !precoVenda ||
      !qtdeEstoque ||
      !codigoProduto ||
      !tipoUnidade
    ) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await PutProdutos({
        id: selectedProduct.id,
        name,
        descricao,
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        qtdeEstoque: Number(qtdeEstoque),
        codigoProduto,
        tipoUnidade,
        categoria: {
          id: selectedProduct.categoria.id,
        },
      });
      Alert.alert("Sucesso", "Produto atualizado!");

      const data = await GetProducts();
      if(data) setProducts(data);

    } catch {
      console.log("Erro ao atualizar produto");
      Alert.alert("Erro", "Não foi possível atualizar o produto");
    }
  };

  return (
    <Container>
       {/* Botão de voltar */}
                                     <BackButton onPress={() => navigation.goBack()}>
                                       <Icon name="arrow-left" size={33} color="#000" />
                                       <BackButtonText>Voltar</BackButtonText>
                                     </BackButton>
                                     <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Editar Produtos</Text>
                 
               
      {/* Lista horizontal de produtos */}
      <ScrollView  style={{ marginBottom: 20 }}>
        <CardContainer>
          {products.length === 0 && (
            <CardTitle>Nenhum produto cadastrado ainda</CardTitle>
          )}
          {products.map((prod) => (
            <CardTouchable key={prod.id} onPress={() => selectProduct(prod)}
              >
              <CardTitle
                >
                  {prod.name}</CardTitle>
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
            <Picker
              selectedValue={tipoUnidade}
              onValueChange={(itemValue) => setTipoUnidade(itemValue)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 5,
                marginBottom: 15,
              }}
            >
              <Picker.Item label="Selecione o tipo de unidade" value="" />
              {tipoUnidadeOption.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
              <Label>Categoria Atual</Label>
            <Input 
              value={selectedProduct.categoria.nome} 
              editable={false}
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </Section>

          <Button onPress={updateProduct}>
            <ButtonText>Atualizar</ButtonText>
          </Button>
          <DeleteButton onPress={deleteProduct}>
            <DeleteButtonText>Deletar Produto</DeleteButtonText>
          </DeleteButton>
        </ScrollView>
      )}
    </Container>
  );
};

export default EditProduct;
