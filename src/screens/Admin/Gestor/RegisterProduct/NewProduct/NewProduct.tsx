import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text, ActivityIndicator, View } from "react-native";
import { Container, Section, Label, Input, Button, ButtonText } from "./styles";
import { } from "../../styles";
import api from "../../../../../Services/apiFruttyoog";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { UNIT_TYPES } from "src/constants/unitTypes";

interface Categoria {
  id: number;
  nome: string;
}

interface Fornecedor {
  id: number;
  nomeFantasia: string;
}

interface NewProductRouteParams {
  fornecedorId?: number;
}

const NewProduct: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as NewProductRouteParams | undefined;
  const fornecedorId = params?.fornecedorId as number | undefined;

  // formulario
  const [nome, setNome] = useState(""); // prod_nome
  const [descricao, setDescricao] = useState(""); // prod_descricao
  const [codigoProduto, setCodigoProduto] = useState(""); // prod_codigo
  const [precoCusto, setPrecoCusto] = useState(""); // prod_preco_custo_referencia
  const [precoVenda, setPrecoVenda] = useState(""); // prod_preco_venda
  const [tipoUnidade, setTipoUnidade] = useState("UNIDADE"); // prod_tipo_unidade
  const [qtdeEstoque, setQtdeEstoque] = useState("0"); // prod_qtde_estoque

  // Dados para selects
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>("");
  const [selectedFornecedorId, setSelectedFornecedorId] = useState(
    fornecedorId ? fornecedorId.toString() : ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();

    if (fornecedorId) {
      console.log("Fornecedor pré-selecionado:", fornecedorId);
    }
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadCategorias(), loadFornecedores()]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados necessários");
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      if (response.data && Array.isArray(response.data)) {
        setCategorias(response.data);

        if (response.data.length > 0 && !selectedCategoriaId) {
          setSelectedCategoriaId(response.data[0].id.toString());
        }
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

        if (fornecedorId && !selectedFornecedorId) {
          const fornecedorExiste = response.data.some(
            (f) => f.id === fornecedorId
          );
          if (fornecedorExiste) {
            setSelectedFornecedorId(fornecedorId.toString());
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      Alert.alert("Erro", "Não foi possível carregar os fornecedores");
    }
  };

  const handleAddProduct = async () => {
    try {
      // ✅ CORREÇÃO: Estrutura padronizada
      const produtoData = {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        codigoProduto: codigoProduto.trim(),
        precoCusto: precoCusto ? parseFloat(precoCusto) : 0, // Nome padronizado
        precoVenda: precoVenda ? parseFloat(precoVenda) : 0,
        tipoUnidade: tipoUnidade || "UNIDADE", // Valor padrão
        qtdeEstoque: qtdeEstoque ? parseInt(qtdeEstoque) : 0,
        categoria: selectedCategoriaId
          ? {
              id: parseInt(selectedCategoriaId, 10),
            }
          : null,
        fornecedor: selectedFornecedorId
          ? {
              id: parseInt(selectedFornecedorId, 10),
            }
          : null,
      };
      console.log("🔍 Objeto montado:", produtoData);
      console.log("📤 Enviando produto:", JSON.stringify(produtoData, null, 2));
      console.log("🔐 Headers da requisição:", api.defaults.headers);
      const response = await api.post("/produtos", produtoData);

      Alert.alert("Sucesso", `Produto "${nome}" cadastrado com sucesso!`, [
        {
          text: "OK",
          onPress: () => {
            // Limpar formulário
            setNome("");
            setDescricao("");
            setCodigoProduto("");
            setPrecoCusto("");
            setPrecoVenda("");
            setTipoUnidade("UNIDADE");
            setQtdeEstoque("0");
            setSelectedCategoriaId("");
            setSelectedFornecedorId("");
          },
        },
        {
          text: "Usar em nova compra",
          onPress: () => {
            navigation.navigate("NewShop", {
              novoProdutoId: response.data.id,
              fornecedorId: selectedFornecedorId
                ? parseInt(selectedFornecedorId)
                : undefined,
            });
          },
        },
      ]);
    } catch (error: any) {
      // ✅ Adicionado ": any" para tipagem do error
      console.error("❌ Erro ao cadastrar produto:", error);

      let errorMessage = "Não foi possível cadastrar o produto";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    } // ✅ Fechamento da função handleAddProduct estava faltando aqui
  };

  return (
    <Container>
      {/* Botão de voltar */}
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
          {/* 1. Nome do Produto */}
          <Label>Nome do Produto</Label>
          <Input
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Maçã Fuji"
            autoCapitalize="words"
          />

          {/* 2. Descrição */}
          <Label>Descrição</Label>
          <Input
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o produto"
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: "top" }}
          />

          {/* 3. Código do Produto */}
          <Label>Código do Produto</Label>
          <Input
            value={codigoProduto}
            onChangeText={setCodigoProduto}
            placeholder="Ex: FRUT001"
            autoCapitalize="characters"
          />

          {/* 4. Preço de Custo Referência */}
          <Label>Preço de Custo Referência</Label>
          <Input
            value={precoCusto}
            onChangeText={setPrecoCusto}
            keyboardType="numeric"
            placeholder="0.00"
          />
          <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            Este será o preço sugerido nas compras
          </Text>

          {/* 5. Preço de Venda */}
          <Label>Preço de Venda</Label>
          <Input
            value={precoVenda}
            onChangeText={setPrecoVenda}
            keyboardType="numeric"
            placeholder="0.00"
          />

          {/* 6. Tipo de Unidade */}
          <Label>Tipo de Unidade</Label>
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

          {/* 7. Quantidade em Estoque */}
          <Label>Quantidade em Estoque</Label>
          <Input
            value={qtdeEstoque}
            onChangeText={setQtdeEstoque}
            keyboardType="numeric"
            placeholder="0"
          />

          {/* 8. Categoria */}
          <Label>Categoria</Label>
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
          )}

          {/* 9. Fornecedor Principal */}
          <Label>Fornecedor Principal</Label>
          <Picker
            selectedValue={selectedFornecedorId}
            onValueChange={setSelectedFornecedorId}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              marginBottom: 25,
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
        </Section>

        {/* Botões de Ação */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Button
            onPress={handleAddProduct}
            style={{ flex: 1, marginRight: 10, backgroundColor: "#4CAF50" }}
          >
            <ButtonText>Cadastrar Produto</ButtonText>
          </Button>

          <Button
            onPress={() => navigation.navigate("RegisterProduct")}
            style={{ flex: 1, marginLeft: 10, backgroundColor: "#757575" }}
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
        </View>

        {/* Informação de integração */}
        {fornecedorId && (
          <View
            style={{
              backgroundColor: "#E3F2FD",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#2196F3",
            }}
          >
            <Text style={{ color: "#0D47A1", fontSize: 14 }}>
              <Icon name="information-outline" size={16} color="#2196F3" /> Este
              produto será associado ao fornecedor selecionado na compra
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default NewProduct;

