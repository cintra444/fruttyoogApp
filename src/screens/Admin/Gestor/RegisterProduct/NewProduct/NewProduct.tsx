// NewProduct.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text, ActivityIndicator, View } from "react-native";
import {
  Container,
  Title,
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
} from "./styles";
import api from "../../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";

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

const NewProduct: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Formulário novo produto
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");

  //para consultas
  const [precoCustoReferencia, setPrecoCustoReferencia] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState("");

  useEffect(() => {
    loadFornecedores();
    loadCategorias();
  }, []);

  const loadFornecedores = async () => {
    try {
      console.log("🔄 Buscando fornecedores...");
      const response = await api.get("/fornecedor");
      console.log("📦 Resposta da API - Fornecedores:", response.data);
      console.log("📊 Status:", response.status);

      if (response.data && Array.isArray(response.data)) {
        setFornecedores(response.data);
        console.log(`✅ ${response.data.length} fornecedores carregados`);
      } else {
        console.log("❌ Resposta não é um array ou está vazia:", response.data);
        setFornecedores([]);
      }
    } catch (error: any) {
      console.error("❌ Erro ao carregar fornecedores:", error);
      console.log("🔗 URL tentada:", "/fornecedor");
      console.log("📋 Mensagem de erro:", error.message);
      console.log("🔍 Response error:", error.response?.data);
      setFornecedores([]);
    }
  };

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categorias");

      if (response.data && Array.isArray(response.data)) {
        setCategorias(response.data);
      } else {
        setError("Nenhuma categoria encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    } finally {
      setLoading(false);
    }
  };
  const handleAddProduct = async () => {
    if (
      !name ||
      !descricao ||
      !precoVenda ||
      !qtdeEstoque ||
      !codigoProduto ||
      !tipoUnidade ||
      !selectedCategoriaId
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios (*)");
      return;
    }

    try {
      const produto = {
        name,
        descricao,
        precoVenda: parseFloat(precoVenda),
        precoCustoReferencia: precoCustoReferencia
          ? parseFloat(precoCustoReferencia)
          : null,
        qtdeEstoque: parseInt(qtdeEstoque, 10),
        codigoProduto,
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

      await api.post("/produtos", produto);
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");

      // resetar formulário
      setName("");
      setDescricao("");
      setPrecoVenda("");
      setPrecoCustoReferencia("");
      setQtdeEstoque("");
      setCodigoProduto("");
      setTipoUnidade("");
      setSelectedCategoriaId("");
      setSelectedFornecedorId("");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o produto");
    }
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

      <ScrollView>
        <Section>
          {/* Nome e Código */}
          <FormRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Label>Nome *</Label>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Nome do produto"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Label>Código *</Label>
              <Input
                value={codigoProduto}
                onChangeText={setCodigoProduto}
                placeholder="Código único"
              />
            </View>
          </FormRow>

          {/* Descrição */}
          <Label>Descrição *</Label>
          <Input
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descrição detalhada"
            multiline
            numberOfLines={3}
          />

          {/* Preços */}
          <Label>Preços</Label>
          <FormRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <PriceInfo>
                <PriceLabel>Preço de Venda *</PriceLabel>
                <PriceValue>R$ {precoVenda || "0.00"}</PriceValue>
              </PriceInfo>
              <Input
                value={precoVenda}
                onChangeText={setPrecoVenda}
                keyboardType="numeric"
                placeholder="0.00"
              />
              <InfoText>Preço que será mostrado ao cliente</InfoText>
            </View>

            <View style={{ flex: 1 }}>
              <PriceInfo>
                <PriceLabel>Preço de Custo Ref.</PriceLabel>
                <PriceValue>R$ {precoCustoReferencia || "N/A"}</PriceValue>
              </PriceInfo>
              <Input
                value={precoCustoReferencia}
                onChangeText={setPrecoCustoReferencia}
                keyboardType="numeric"
                placeholder="0.00 (opcional)"
              />
              <InfoText>Referência para compras futuras</InfoText>
            </View>
          </FormRow>

          {/* Estoque */}
          <FormRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Label>Estoque Inicial *</Label>
              <Input
                value={qtdeEstoque}
                onChangeText={setQtdeEstoque}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Label>Tipo de Unidade *</Label>
              <Picker
                selectedValue={tipoUnidade}
                onValueChange={setTipoUnidade}
                style={{ backgroundColor: "#fff", borderRadius: 5 }}
              >
                <Picker.Item label="Selecione..." value="" />
                {tipoUnidadeOption.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </FormRow>

          {/* Categoria */}
          <Label>Categoria *</Label>
          {loading ? (
            <ActivityIndicator size="small" color="#005006" />
          ) : (
            <Picker
              selectedValue={selectedCategoriaId}
              onValueChange={setSelectedCategoriaId}
              style={{
                backgroundColor: "#fff",
                borderRadius: 5,
                marginBottom: 15,
              }}
            >
              <Picker.Item label="Selecione a categoria" value="" />
              {categorias.map((categoria) => (
                <Picker.Item
                  key={categoria.id}
                  label={categoria.nome}
                  value={categoria.id.toString()}
                />
              ))}
            </Picker>
          )}

          {/* Fornecedor (opcional) */}
          <Label>Fornecedor Principal (Opcional)</Label>
          <InfoText>
            Este fornecedor aparecerá como sugestão nas compras
          </InfoText>
          <Picker
            selectedValue={selectedFornecedorId}
            onValueChange={setSelectedFornecedorId}
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              marginBottom: 15,
            }}
          >
            <Picker.Item label="Nenhum fornecedor" value="" />
            {fornecedores.map((fornecedor) => (
              <Picker.Item
                key={fornecedor.id}
                label={fornecedor.nomeFantasia}
                value={fornecedor.id.toString()}
              />
            ))}
          </Picker>
        </Section>

        <Button onPress={handleAddProduct}>
          <ButtonText>Salvar Produto</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewProduct;
