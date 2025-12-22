// EditProduct.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Alert, ScrollView, Text, View, ActivityIndicator } from "react-native";
import {
  Container,
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
import { Picker } from "@react-native-picker/picker";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import {
  GetProducts,
  PutProdutos,
  DeleteProdutos,
  GetCategoria,
} from "../../../../../Services/apiFruttyoog";
import { UNIT_TYPES } from "src/constants/unitTypes";

interface Categoria {
  id: number;
  nome: string;
}

interface Product {
  id: number;
  nome: string;
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
  fornecedor?: {
    id: number;
    nomeFantasia: string;
  };
}

const EditProduct: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Formulário
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>("");

  // Carregar dados ao iniciar
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadCategorias()]);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await GetProducts();
      if (data) {
        // Transform API data to match Product interface by enriching categoria with nome
        const enrichedProducts = data.map((product: any) => ({
          ...product,
          categoria: {
            id: product.categoria.id,
            nome:
              categorias.find((c) => c.id === product.categoria.id)?.nome ||
              "Desconhecida",
          },
        }));
        setProducts(enrichedProducts);

        // Se o produto selecionado ainda existe na lista
        if (
          selectedProduct &&
          enrichedProducts.find((p) => p.id === selectedProduct.id)
        ) {
          // Mantém selecionado
        } else {
          limparFormulario();
        }
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os produtos");
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await GetCategoria();
      if (data) {
        setCategorias(data);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    }
  };

  // Ordenar produtos por nome
  const productsOrdenados = useMemo(() => {
    return [...products].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    );
  }, [products]);

  // Selecionar produto
  const selecionarProduto = (product: Product) => {
    setSelectedProduct(product);
    setName(product.nome);
    setDescricao(product.descricao);
    setPrecoCusto(product.precoCusto.toString());
    setPrecoVenda(product.precoVenda.toString());
    setQtdeEstoque(product.qtdeEstoque.toString());
    setCodigoProduto(product.codigoProduto);
    setTipoUnidade(product.tipoUnidade);
    setSelectedCategoriaId(product.categoria.id.toString());
  };

  // Limpar formulário
  const limparFormulario = () => {
    setSelectedProduct(null);
    setName("");
    setDescricao("");
    setPrecoCusto("");
    setPrecoVenda("");
    setQtdeEstoque("");
    setCodigoProduto("");
    setTipoUnidade("");
    setSelectedCategoriaId("");
  };

  // Atualizar produto
  const atualizarProduto = async () => {
    if (!selectedProduct) {
      Alert.alert("Erro", "Selecione um produto para editar");
      return;
    }

    // Validação básica
    if (!name) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const produtoData = {
        id: selectedProduct.id,
        nome: name.trim(),
        descricao: descricao.trim(),
        codigoProduto: codigoProduto.trim(),
        precoCusto: parseFloat(precoCusto),
        precoVenda: parseFloat(precoVenda),
        tipoUnidade,
        qtdeEstoque: parseInt(qtdeEstoque) || 0,
        categoria: {
          id: parseInt(selectedCategoriaId, 10),
        },
      };

      await PutProdutos(produtoData);
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");

      // Recarregar lista
      await loadProducts();
    } catch (error: any) {
      console.error("❌ Erro ao atualizar produto:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível atualizar o produto"
      );
    }
  };

  // Excluir produto
  const excluirProduto = async () => {
    if (!selectedProduct) return;

    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o produto "${selectedProduct.nome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteProdutos(selectedProduct.id);
              Alert.alert("Sucesso", "Produto excluído com sucesso!");

              // Recarregar lista
              await loadProducts();

              // Limpar formulário
              limparFormulario();
            } catch (error: any) {
              console.error("❌ Erro ao excluir produto:", error);
              Alert.alert(
                "Erro",
                error.response?.data?.message ||
                  "Não foi possível excluir o produto"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      {/* Botão de voltar */}
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Editar Produtos
      </Text>

      {/* Seção da Lista de Produtos */}
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Label>Selecione um produto:</Label>

        <CardContainer
          style={{
            maxHeight: 250,
            flexDirection: "column",
            flex: 1,
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {loading ? (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#6200ee" />
                <Text style={{ marginTop: 10, color: "#666" }}>
                  Carregando produtos...
                </Text>
              </View>
            ) : productsOrdenados.length === 0 ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Nenhum produto cadastrado
              </CardTitle>
            ) : (
              productsOrdenados.map((product) => (
                <CardTouchable
                  key={product.id}
                  onPress={() => selecionarProduto(product)}
                  style={{
                    marginBottom: 10,
                    backgroundColor:
                      selectedProduct?.id === product.id ? "#E3F2FD" : "#fff",
                    borderWidth: selectedProduct?.id === product.id ? 2 : 1,
                    borderColor:
                      selectedProduct?.id === product.id ? "#2196F3" : "#ccc",
                    borderLeftWidth: 4,
                    borderLeftColor: "#4CAF50",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardTitle
                      style={{
                        fontWeight:
                          selectedProduct?.id === product.id ? "600" : "400",
                        color: "#333",
                        flex: 1,
                      }}
                    >
                      {product.nome}
                    </CardTitle>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      R$ {product.precoVenda.toFixed(2)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      Código: {product.codigoProduto}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      Estoque: {product.qtdeEstoque} {product.tipoUnidade}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
                    Categoria: {product.categoria.nome}
                  </Text>
                </CardTouchable>
              ))
            )}
          </ScrollView>
        </CardContainer>
      </View>

      {/* Seção do Formulário de Edição */}
      {selectedProduct && (
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 15,
              color: "#6200ee",
            }}
          >
            Editando: {selectedProduct.nome}
          </Text>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Section>
              <Label>Nome do Produto *</Label>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Nome do produto"
                autoCapitalize="words"
              />

              <Label>Descrição</Label>
              <Input
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descrição do produto"
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: "top" }}
              />

              <Label>Código do Produto *</Label>
              <Input
                value={codigoProduto}
                onChangeText={setCodigoProduto}
                placeholder="Código único do produto"
                autoCapitalize="characters"
              />

              <Label>Preço de Custo *</Label>
              <Input
                value={precoCusto}
                onChangeText={setPrecoCusto}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Label>Preço de Venda *</Label>
              <Input
                value={precoVenda}
                onChangeText={setPrecoVenda}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Label>Tipo de Unidade *</Label>
              <Picker
                selectedValue={tipoUnidade}
                onValueChange={setTipoUnidade}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  marginBottom: 15,
                }}
              >
                <Picker.Item label="Selecione a unidade..." value="" />
                {UNIT_TYPES.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>

              <Label>Quantidade em Estoque</Label>
              <Input
                value={qtdeEstoque}
                onChangeText={setQtdeEstoque}
                keyboardType="numeric"
                placeholder="0"
              />

              <Label>Categoria *</Label>
              <Picker
                selectedValue={selectedCategoriaId}
                onValueChange={setSelectedCategoriaId}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  marginBottom: 15,
                }}
              >
                <Picker.Item label="Selecione a categoria..." value="" />
                {categorias.map((categoria) => (
                  <Picker.Item
                    key={categoria.id}
                    label={categoria.nome}
                    value={categoria.id.toString()}
                  />
                ))}
              </Picker>

              {/* Informações do Fornecedor (apenas visualização) */}
              {selectedProduct.fornecedor && (
                <View
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 15,
                  }}
                >
                  <Text style={{ fontWeight: "500", marginBottom: 5 }}>
                    Fornecedor Atual:
                  </Text>
                  <Text style={{ fontSize: 14, color: "#666" }}>
                    {selectedProduct.fornecedor.nomeFantasia}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                    (Para alterar o fornecedor, edite através da tela de
                    compras)
                  </Text>
                </View>
              )}
            </Section>

            {/* Botões de Ação */}
            <Button onPress={atualizarProduto}>
              <Icon
                name="check"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <ButtonText>Atualizar Produto</ButtonText>
            </Button>

            <Button
              onPress={loadData}
              style={{
                backgroundColor: "#4CAF50",
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name="reload"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <ButtonText>Recarregar Lista</ButtonText>
            </Button>

            <DeleteButton onPress={excluirProduto}>
              <Icon
                name="delete"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <DeleteButtonText>Excluir Produto</DeleteButtonText>
            </DeleteButton>

            {/* Informações adicionais */}
            <View
              style={{
                backgroundColor: "#E8F5E9",
                padding: 12,
                borderRadius: 8,
                marginTop: 15,
                borderLeftWidth: 4,
                borderLeftColor: "#4CAF50",
              }}
            >
              <Text
                style={{ fontSize: 14, color: "#2E7D32", fontWeight: "500" }}
              >
                <Icon name="information-outline" size={16} color="#4CAF50" />{" "}
                Informações
              </Text>
              <Text style={{ fontSize: 12, color: "#2E7D32", marginTop: 5 }}>
                • Campos marcados com * são obrigatórios
              </Text>
              <Text style={{ fontSize: 12, color: "#2E7D32", marginTop: 2 }}>
                • Para alterar fornecedor, edite através da tela de compras
              </Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Se não houver produto selecionado */}
      {!selectedProduct && !loading && products.length > 0 && (
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Icon name="cursor-default-click" size={48} color="#ccc" />
          <Text style={{ color: "#666", marginTop: 10, textAlign: "center" }}>
            Selecione um produto da lista acima para editar
          </Text>
        </View>
      )}
    </Container>
  );
};

export default EditProduct;
