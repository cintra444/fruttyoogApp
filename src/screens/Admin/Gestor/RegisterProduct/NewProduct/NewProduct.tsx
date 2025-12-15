// NewProduct.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text, ActivityIndicator, View } from "react-native";
import {
  Container,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  FormRow,
  PriceInfo,
  PriceLabel,
  PriceValue,
  InfoText,
  CardContainer,
  CardTouchable,
  CardTitle,
} from "./styles";
import api from "../../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { parse } from "@babel/core";

const tipoUnidadeOption = [
  "UNIDADE",
  "CAIXA",
  "LITRO",
  "POTE_VIDRO",
  "POTE_PLASTICO",
  "PACOTE",
  "EMBALAGEM",
  "CAIXA_PLASTICA",
  "DUZIA",
  "KG",
  "GRAMA",
  "OUTRO",
];

interface Categoria {
  id: number;
  nome: string;
}

interface Fornecedor {
  id: number;
  nomeFantasia: string;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  precoVenda: number;
  precoCustoReferencia?: number;
  codigoProduto: string;
  tipoUnidade: string;
  categoria: Categoria;
  fornecedor?: Fornecedor;
}

const NewProduct: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Formulário novo produto
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [precoCustoReferencia, setPrecoCustoReferencia] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");

  //para consultas
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>("");
  const [selectedFornecedorId, setSelectedFornecedorId] = useState("");
  const [loading, setLoading] = useState(true);

  const [produtosRecentes, setProdutosRecentes] = useState<Produto[]>([]);

  useEffect(() => {
    loadInitialData();
    loadProdutosRecentes();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadCategorias(), loadFornecedores()]);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
      Alert.alert("Erro", "Não foi possível carregar os dados necessarios");
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      if (response.data && Array.isArray(response.data)) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    }
  };
  const loadFornecedores = async () => {
    try {
      const response = await api.get("/fornecedor");

      if (response.data && Array.isArray(response.data)) {
        setFornecedores(response.data);
      }
    } catch (error: any) {
      console.error("❌ Erro ao carregar fornecedores:", error);
      Alert.alert("Erro", "Erro ao carregar fornecedores.");
    }
  };

  const loadProdutosRecentes = async () => {
    try {
      const response = await api.get("/produtos?limit=5");
      if (response.data && Array.isArray(response.data)) {
        setProdutosRecentes(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos recentes:", error);
      Alert.alert("Erro", "Erro ao carregar produtos recentes.");
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O Nome do produto é obrigatório.");
      return false;
    }
    if (!descricao.trim()) {
      Alert.alert("Erro", "A Descrição do produto é obrigatória.");
      return false;
    }
    if (!precoVenda || parseFloat(precoVenda) <= 0) {
      Alert.alert("Erro", "O Preço de Venda deve ser maior que zero.");
      return false;
    }
    if (!codigoProduto.trim()) {
      Alert.alert("Erro", "O Código do produto é obrigatório.");
      return false;
    }
    if (!tipoUnidade.trim()) {
      Alert.alert("Erro", "O Tipo de Unidade é obrigatório.");
      return false;
    }
    if (!selectedCategoriaId) {
      Alert.alert("Erro", "A Categoria do produto é obrigatória.");
      return false;
    }
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const produtoData = {
        name: name.trim(),
        descricao: descricao.trim(),
        precoVenda: parseFloat(precoVenda),
        precoCustoReferencia: precoCustoReferencia
          ? parseFloat(precoCustoReferencia)
          : null,
        codigoProduto: codigoProduto.trim(),
        tipoUnidade,
        categoria: {
          id: parseInt(selectedCategoriaId, 10),
        },
        fornecedor: selectedFornecedorId
          ? {
              id: parseInt(selectedFornecedorId, 10),
            }
          : undefined,
      };
      qtdeEstoque: 0;

      console.log("Dados do produto a serem enviados:", produtoData);

      const response = await api.post("/produtos", produtoData);

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            // resetar formulário
            setName("");
            setDescricao("");
            setPrecoVenda("");
            setPrecoCustoReferencia("");
            setCodigoProduto("");
            setTipoUnidade("");
            setSelectedCategoriaId("");
            setSelectedFornecedorId("");

            // atualizar produtos recentes
            if (response.data) {
              setProdutosRecentes((prev) => [
                response.data,
                ...prev.slice(0, 4),
              ]);
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao cadastrar produto:", error);
      const errorMessage =
        error.response?.data?.message || "Não foi possível cadastrar o produto";
      Alert.alert("Erro", errorMessage);
    }
  };

  const selectProdutoRecente = (produto: Produto) => {
    setName(produto.nome);
    setDescricao(produto.descricao || "");
    setPrecoVenda(produto.precoVenda?.toString() || "");
    setPrecoCustoReferencia(produto.precoCustoReferencia?.toString() || "");
    setCodigoProduto(produto.codigoProduto);
    setTipoUnidade(produto.tipoUnidade);
    setSelectedCategoriaId(produto.categoria.id?.toString() || "");
    setSelectedFornecedorId(produto.fornecedor?.id?.toString() || "");
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
        Novo Produto
      </Text>

      {/* Seção: Produtos Recentes (referência) */}
      {produtosRecentes.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Label>Produtos Recentes (Clique para copiar dados):</Label>
          <CardContainer
            style={{
              maxHeight: 150,
              flexDirection: "column",
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 5 }}
            >
              {produtosRecentes.map((produto) => (
                <CardTouchable
                  key={produto.id}
                  onPress={() => selectProdutoRecente(produto)}
                  style={{
                    marginBottom: 8,
                    backgroundColor: "#f0f0f0",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <CardTitle style={{ fontWeight: "500" }}>
                    {produto.nome}
                  </CardTitle>
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    {produto.codigoProduto} • {produto.categoria?.nome}
                  </Text>
                </CardTouchable>
              ))}
            </ScrollView>
          </CardContainer>
        </View>
      )}

      <ScrollView>
        <Section>
          {/* Nome e Código */}
          <FormRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Label>Nome do Produto *</Label>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Ex: Maçã Fuji"
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Label>Código *</Label>
              <Input
                value={codigoProduto}
                onChangeText={setCodigoProduto}
                placeholder="Ex: PROD001"
                autoCapitalize="characters"
              />
            </View>
          </FormRow>

          {/* Descrição */}
          <Label>Descrição *</Label>
          <Input
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o produto (tamanho, marca, características...)"
            multiline
            numberOfLines={3}
            style={{ height: 80 }}
          />

          {/* Preços */}
          <Label>Preços</Label>
          <FormRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <PriceInfo>
                <PriceLabel>Preço de Venda *</PriceLabel>
                <PriceValue>
                  {precoVenda
                    ? `R$ ${parseFloat(precoVenda).toFixed(2)}`
                    : "R$ 0,00"}
                </PriceValue>
              </PriceInfo>
              <Input
                value={precoVenda}
                onChangeText={setPrecoVenda}
                keyboardType="numeric"
                placeholder="0.00"
              />
              <InfoText>Preço que será vendido ao cliente</InfoText>
            </View>

            <View style={{ flex: 1 }}>
              <PriceInfo>
                <PriceLabel>Preço de Custo Ref.</PriceLabel>
                <PriceValue>
                  {precoCustoReferencia
                    ? `R$ ${parseFloat(precoCustoReferencia).toFixed(2)}`
                    : "R$ --"}
                </PriceValue>
              </PriceInfo>
              <Input
                value={precoCustoReferencia}
                onChangeText={setPrecoCustoReferencia}
                keyboardType="numeric"
                placeholder="0.00 (opcional)"
              />
              <InfoText>Referência para futuras compras</InfoText>
            </View>
          </FormRow>

          {/* Unidade e Categoria */}
          <FormRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Label>Tipo de Unidade *</Label>
              <Picker
                selectedValue={tipoUnidade}
                onValueChange={setTipoUnidade}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Picker.Item label="Selecione a unidade..." value="" />
                {tipoUnidadeOption.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Label>Categoria *</Label>
              {loading ? (
                <ActivityIndicator size="small" color="#6200ee" />
              ) : (
                <Picker
                  selectedValue={selectedCategoriaId}
                  onValueChange={setSelectedCategoriaId}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#ccc",
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
              )}
            </View>
          </FormRow>

          {/* Fornecedor Principal */}
          <Label>Fornecedor Principal (Opcional)</Label>
          <InfoText>Aparecerá como sugestão nas compras futuras</InfoText>
          <Picker
            selectedValue={selectedFornecedorId}
            onValueChange={setSelectedFornecedorId}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              marginBottom: 15,
            }}
          >
            <Picker.Item label="Sem fornecedor específico" value="" />
            {fornecedores.map((fornecedor) => (
              <Picker.Item
                key={fornecedor.id}
                label={fornecedor.nomeFantasia}
                value={fornecedor.id.toString()}
              />
            ))}
          </Picker>

          {/* Observação sobre estoque */}
          <InfoText
            style={{
              backgroundColor: "#e3f2fd",
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
              color: "#1565c0",
            }}
          >
            💡 <Text style={{ fontWeight: "bold" }}>Atenção:</Text> O estoque
            será gerenciado automaticamente através das compras. Ao cadastrar
            uma compra no sistema, o estoque será atualizado.
          </InfoText>
        </Section>

        <Button onPress={handleAddProduct}>
          <ButtonText>Cadastrar Produto</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewProduct;
