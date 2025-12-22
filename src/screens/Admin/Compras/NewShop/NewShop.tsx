import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "src/Services/apiFruttyoog";
import {
  Container,
  Title,
  FormGroup,
  Label,
  StyledPicker,
  PickerItem,
  StyledInput,
  SubmitButton,
  AddButton,
  TotalText,
  ItemContainer,
  ItemRow,
  SectionTitle,
  RemoveItemButton,
  BackButton,
  BackButtonText,
  PriceInputContainer,
  PriceInput,
  PriceButton,
  PriceButtonText,
  ReferencePrice,
  UpdateReferenceCheckbox,
  CheckboxLabel,
  FormRow,
  Column,
  CardContainer,
  CardTouchable,
  CardTitle,
  InfoCard,
  InfoCardText,
  LoadingContainer,
  LoadingText,
} from "./styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { UNIT_TYPES } from "src/constants/unitTypes";

type Fornecedor = {
  id: number;
  nomeFantasia: string;
  telefone?: string;
};

type Produto = {
  id: number;
  nome: string;
  precoCustoReferencia?: number;
  estoque?: number;
  tipounidade?: string;
  categoria?: {
    id: number;
    nome: string;
  };
};

type TipoCompra = "MEI" | "NOTA_FISCAL" | "BRANCA";
type TipoPagamento =
  | "DINHEIRO"
  | "PIX"
  | "BOLETO"
  | "TRANSFERENCIA"
  | "CHEQUE"
  | "DEBITO"
  | "CREDITO"
  | "FIADO"
  | "A_PRAZO"
  | "OUTROS";

type ItemCompra = {
  produtoId: number | null;
  produtoNome: string;
  quantidade: number;
  precoUnitarioReal: number;
  total: number;
  precoReferencia?: number;
  tipounidade?: string;
};

const NewShop: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [novoProdutoId, setNovoProdutoId] = useState<number | null>(null);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState({
    produtos: false,
    fornecedores: false,
  });

  const [selectedFornecedor, setSelectedFornecedor] = useState<number | null>(
    null
  );
  const [selectedTipoCompra, setSelectedTipoCompra] =
    useState<TipoCompra | null>(null);
  const [selectedTipoPagamento, setSelectedTipoPagamento] =
    useState<TipoPagamento | null>(null);
  const [dataCompra, setDataCompra] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dataPagamento, setDataPagamento] = useState<string>("");
  const [prazoPagamento, setPrazoPagamento] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [atualizarReferencias, setAtualizarReferencias] = useState(false);

  const [itens, setItens] = useState<ItemCompra[]>([
    {
      produtoId: null,
      produtoNome: "",
      quantidade: 1,
      precoUnitarioReal: 0,
      total: 0,
    },
  ]);

  //verificar se há novo produto vindo da navegação
  useEffect(() => {
    const params = route.params as { novoProdutoId?: number } | undefined;
    if (params?.novoProdutoId) {
      const produtoId = params.novoProdutoId;
      setNovoProdutoId(produtoId);

      //se selecionar fornecedor, recarregar produtos
      if (selectedFornecedor) {
        carregarProdutosFornecedor(selectedFornecedor);
      }
    }
  }, [route.params]);

  // Carregar fornecedores ao montar o componente
  useEffect(() => {
    const loadFornecedores = async () => {
      try {
        setLoading((prev) => ({ ...prev, fornecedores: true }));
        const response = await api.get("/fornecedor");

        if (response.data && Array.isArray(response.data)) {
          const fornecedoresOrdenados = [...response.data].sort((a, b) =>
            a.nomeFantasia.localeCompare(b.nomeFantasia, "pt-BR", {
              sensitivity: "base",
            })
          );
          setFornecedores(fornecedoresOrdenados);
        } else {
          setFornecedores([]);
        }
      } catch (error: any) {
        console.error("❌ Erro ao carregar fornecedores:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar a lista de fornecedores."
        );
      } finally {
        setLoading((prev) => ({ ...prev, fornecedores: false }));
      }
    };
    loadFornecedores();
  }, []);

  //carregar produtos quando o fornecedor mudar
  useEffect(() => {
    if (selectedFornecedor) {
      carregarProdutosFornecedor(selectedFornecedor);
    } else {
      setProdutos([]);
      setItens((prev) =>
        prev.map((item) => ({
          ...item,
          produtoId: null,
          produtoNome: "",
          precoReferencia: undefined,
        }))
      );
    }
  }, [selectedFornecedor]);

  //carregar produtos do fornecedor
  const carregarProdutosFornecedor = async (fornecedorId: number) => {
    try {
      setLoading((prev) => ({ ...prev, produtos: true }));
      console.log(`🔍 Carregando produtos para fornecedor ${fornecedorId}...`);

      const response = await api.get(`/produtos/fornecedor/${fornecedorId}`);
      console.log("✅ Produtos carregados:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const produtosOrdenados = [...response.data].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
        );
        setProdutos(produtosOrdenados);
      } else {
        setProdutos([]);
      }
    } catch (error: any) {
      console.error("❌ Erro no endpoint principal:", error);

      // Tenta endpoint alternativo
      try {
        console.log("🔄 Tentando endpoint alternativo...");
        const responseAlt = await api.get(
          `/fornecedor/${fornecedorId}/produtos`
        );
        if (responseAlt.data && Array.isArray(responseAlt.data)) {
          const produtosOrdenados = [...responseAlt.data].sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
          );
          setProdutos(produtosOrdenados);
        } else {
          setProdutos([]);
          Alert.alert(
            "Aviso",
            "Nenhum produto cadastrado para este fornecedor."
          );
        }
      } catch (error2: any) {
        console.error("❌ Erro no endpoint alternativo:", error2);
        setProdutos([]);
        Alert.alert(
          "Aviso",
          "Não foi possível carregar os produtos deste fornecedor."
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, produtos: false }));
    }
  };

  //adicionar item
  const adicionarItem = () => {
    setItens((prev) => [
      ...prev,
      {
        produtoId: null,
        produtoNome: "",
        quantidade: 1,
        precoUnitarioReal: 0,
        total: 0,
      },
    ]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens((prev) => prev.filter((_, i) => i !== index));
    } else {
      Alert.alert("Aviso", "É necessário pelo menos um item na compra.");
    }
  };

  const atualizarItem = (
    index: number,
    campo: keyof ItemCompra,
    valor: any
  ) => {
    setItens((prev) => {
      const novosItens = [...prev];
      const item = { ...novosItens[index] };

      (item as any)[campo] = valor;

      // Se o campo atualizado for produtoId, buscar nome e preço referência
      if (campo === "produtoId" && valor) {
        const produtoSelecionado = produtos.find((p) => p.id === valor);
        if (produtoSelecionado) {
          item.produtoNome = produtoSelecionado.nome;
          item.precoReferencia = produtoSelecionado.precoCustoReferencia;
          item.precoUnitarioReal = produtoSelecionado.precoCustoReferencia || 0;
          item.tipounidade = produtoSelecionado.tipounidade;
        }
      }

      //Atualiza o total quando quantidade ou preço unitário mudam
      if (campo === "quantidade" || campo === "precoUnitarioReal") {
        item.total = item.quantidade * item.precoUnitarioReal;
      }

      novosItens[index] = item;
      return novosItens;
    });
  };

  const usarPrecoReferencia = (index: number) => {
    const item = itens[index];
    if (item.produtoId && item.precoReferencia) {
      atualizarItem(index, "precoUnitarioReal", item.precoReferencia);
    }
  };

  const valorTotalNota = itens.reduce((total, item) => total + item.total, 0);
  const quantidadeTotal = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );
  const produtosDiferentes = new Set(
    itens.filter((item) => item.produtoId).map((item) => item.produtoId)
  ).size;

  //validar formulario
  const validarFormulario = (): boolean => {
    if (!selectedFornecedor) {
      Alert.alert("Atenção", "Selecione um fornecedor.");
      return false;
    }

    if (itens.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um item à compra.");
      return false;
    }

    const itemInvalido = itens.some((item, index) => {
      if (!item.produtoId) {
        Alert.alert(
          "Atenção",
          `Selecione um produto para o item ${index + 1}.`
        );
        return true;
      }
      return false;
    });
    if (itemInvalido) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      const compraData = {
        fornecedorId: selectedFornecedor,
        tipoCompra: selectedTipoCompra,
        dataCompra,
        valorNota: valorTotalNota,
        tipoPagamento: selectedTipoPagamento,
        prazoPagamento: prazoPagamento ? parseInt(prazoPagamento) : 0,
        observacoes: observacoes.trim() || null,
        dataPagamento: dataPagamento || null,
        atualizarReferencias,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitarioReal: item.precoUnitarioReal,
          total: item.total,
          precoReferencia: item.precoReferencia,
          usarComoReferencia:
            atualizarReferencias && item.precoUnitarioReal > 0,
        })),
      };

      console.log("📤 Enviando compra:", JSON.stringify(compraData, null, 2));

      setLoading((prev) => ({ ...prev, produtos: true }));
      const response = await api.post("/compra", compraData);

      Alert.alert("Sucesso", "Compra cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
        {
          text: "Nova Compra",
          onPress: () => {
            // Limpar formulário
            setItens([
              {
                produtoId: null,
                produtoNome: "",
                quantidade: 1,
                precoUnitarioReal: 0,
                total: 0,
              },
            ]);
            setSelectedTipoCompra(null);
            setSelectedTipoPagamento(null);
            setDataPagamento("");
            setPrazoPagamento("");
            setObservacoes("");
            setAtualizarReferencias(false);
            setNovoProdutoId(null);
          },
        },
      ]);
    } catch (error: any) {
      console.error("❌ Erro ao cadastrar compra:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Erro ao cadastrar compra, tente novamente."
      );
    } finally {
      setLoading((prev) => ({ ...prev, produtos: false }));
    }
  };

  //navegar para tela cadastro de produto
  const navegarParaNovoProduto = () => {
    (navigation as any).navigate("NewProduct", {
      fornecedorId: selectedFornecedor,
    });
  };
  // Renderiza produtos disponíveis em cards
  const renderProdutosDisponiveis = () => {
    if (!selectedFornecedor || produtos.length === 0) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Label style={{ marginBottom: 10 }}>
            Produtos disponíveis deste fornecedor:
          </Label>

          <TouchableOpacity
            onPress={navegarParaNovoProduto}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#4CAF50",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          ></TouchableOpacity>
          <Icon name="plus" size={16} color="white" />
          <Text style={{ color: "white", marginLeft: 5, fontWeight: "500" }}>
            Novo Produto
          </Text>
        </View>

        <CardContainer style={{ maxHeight: 200 }}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ padding: 5 }}
          >
            {loading.produtos ? (
              <LoadingContainer>
                <ActivityIndicator size="small" color="#6200ee" />
                <LoadingText>Carregando produtos...</LoadingText>
              </LoadingContainer>
            ) : (
              produtos.map((produto) => {
                const jaAdicionado = itens.some(
                  (item) => item.produtoId === produto.id
                );

                return (
                  <CardTouchable
                    key={produto.id}
                    onPress={() => {
                      if (!jaAdicionado) {
                        // Adiciona novo item com este produto
                        setItens((prev) => [
                          ...prev,
                          {
                            produtoId: produto.id,
                            produtoNome: produto.nome,
                            quantidade: 1,
                            precoUnitarioReal:
                              produto.precoCustoReferencia || 0,
                            total: produto.precoCustoReferencia || 0,
                            precoReferencia: produto.precoCustoReferencia,
                            tipoUnidade: produto.tipounidade,
                          },
                        ]);
                        //limpar indicador de produto novo
                        if (produto.id === novoProdutoId) {
                          setNovoProdutoId(null);
                        }
                      }
                    }}
                    style={{
                      backgroundColor: jaAdicionado ? "#e8f5e9" : "#fff",
                      borderLeftWidth: 4,
                      borderLeftColor: jaAdicionado ? "#4caf50" : "#6200ee",
                      opacity: jaAdicionado ? 0.7 : 1,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <CardTitle
                        style={{
                          fontWeight: "600",
                          color: jaAdicionado ? "#2e7d32" : "#333",
                          flex: 1,
                        }}
                      >
                        {produto.nome}
                      </CardTitle>
                      {produto.id === novoProdutoId && (
                        <View
                          style={{
                            backgroundColor: "#ff9800",
                            paddingHorizontal: 6,
                            borderRadius: 4,
                            marginLeft: 5,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 10,
                              fontWeight: "500",
                            }}
                          >
                            Novo
                          </Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "#666" }}>
                        {produto.categoria?.nome || "Sem categoria"}
                      </Text>
                      {produto.precoCustoReferencia && (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: "#ff9800",
                          }}
                        >
                          Ref: R$ {produto.precoCustoReferencia.toFixed(2)}
                        </Text>
                      )}
                    </View>

                    {produto.estoque !== undefined && (
                      <Text
                        style={{ fontSize: 11, color: "#666", marginTop: 2 }}
                      >
                        Estoque atual: {produto.estoque}{" "}
                        {produto.tipounidade || "un"}
                      </Text>
                    )}

                    {jaAdicionado && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Icon name="check-circle" size={14} color="#4caf50" />
                        <Text
                          style={{
                            fontSize: 11,
                            marginLeft: 5,
                            color: "#4caf50",
                          }}
                        >
                          Já adicionado à compra
                        </Text>
                      </View>
                    )}
                  </CardTouchable>
                );
              })
            )}
          </ScrollView>
        </CardContainer>
        <InfoCard style={{ marginTop: 10 }}>
          <InfoCardText>
            💡 Clique em um produto para adicioná-lo automaticamente à compra
          </InfoCardText>
        </InfoCard>
      </View>
    );
  };

  // Renderiza resumo da compra
  const renderResumoCompra = () => (
    <View
      style={{
        backgroundColor: "#f8f9fa",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e0e0e0",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        📊 Resumo da Compra
      </Text>

      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 15, color: "#666" }}>Total de Itens:</Text>
          <Text style={{ fontSize: 15, fontWeight: "600" }}>
            {itens.length}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 15, color: "#666" }}>
            Produtos Diferentes:
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "600" }}>
            {produtosDiferentes}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 15, color: "#666" }}>Quantidade Total:</Text>
          <Text style={{ fontSize: 15, fontWeight: "600" }}>
            {quantidadeTotal}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          paddingTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>Valor Total:</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#28a745" }}>
            R$ {valorTotalNota.toFixed(2)}
          </Text>
        </View>

        {selectedFornecedor && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 14, color: "#666" }}>Fornecedor:</Text>
            <Text
              style={{ fontSize: 14, fontWeight: "500", textAlign: "right" }}
            >
              {
                fornecedores.find((f) => f.id === selectedFornecedor)
                  ?.nomeFantasia
              }
            </Text>
          </View>
        )}
        {atualizarReferencias && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#e8f5e9",
              padding: 10,
              borderRadius: 6,
              marginTop: 10,
            }}
          >
            <Icon name="information-outline" size={18} color="#2e7d32" />
            <Text
              style={{
                fontSize: 14,
                color: "#2e7d32",
                marginLeft: 8,
                flex: 1,
              }}
            >
              Os preços de referência serão atualizados com esta compra
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Title>Nova Compra</Title>

      <ScrollView showsVerticalScrollIndicator={true}>
        {/* Seção: Dados da Compra */}
        <View style={{ marginBottom: 25 }}>
          <SectionTitle>📋 Dados da Compra</SectionTitle>

          {/* Fornecedor */}
          <FormGroup>
            <Label>Fornecedor </Label>
            {loading.fornecedores ? (
              <View style={{ padding: 15, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#6200ee" />
                <Text style={{ marginTop: 5, color: "#666" }}>
                  Carregando fornecedores...
                </Text>
              </View>
            ) : (
              <StyledPicker
                selectedValue={selectedFornecedor}
                onValueChange={(itemValue) =>
                  setSelectedFornecedor(Number(itemValue) || null)
                }
              >
                <PickerItem label="Selecione o fornecedor..." value={null} />
                {fornecedores.map((f) => (
                  <PickerItem key={f.id} label={f.nomeFantasia} value={f.id} />
                ))}
              </StyledPicker>
            )}
          </FormGroup>

          {/* Tipo de Compra */}
          <FormGroup>
            <Label>Tipo de Compra *</Label>
            <StyledPicker
              selectedValue={selectedTipoCompra}
              onValueChange={(itemValue) =>
                setSelectedTipoCompra(itemValue as TipoCompra)
              }
            >
              <PickerItem label="Selecione o tipo..." value={null} />
              <PickerItem label="MEI" value="MEI" />
              <PickerItem label="Nota Fiscal" value="NOTA_FISCAL" />
              <PickerItem label="Branca" value="BRANCA" />
            </StyledPicker>
          </FormGroup>

          {/* Data da Compra */}
          <FormGroup>
            <Label>Data da Compra</Label>
            <StyledInput
              value={dataCompra}
              onChangeText={setDataCompra}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
            />
          </FormGroup>
        </View>

        {/* Seção: Produtos Disponíveis */}
        {renderProdutosDisponiveis()}

        {/* Seção: Itens da Compra */}
        <View style={{ marginBottom: 25 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <SectionTitle>🛒 Itens da Compra</SectionTitle>
            <AddButton onPress={adicionarItem}>
              <Icon name="plus" size={18} color="white" />
              <Text
                style={{ color: "white", marginLeft: 5, fontWeight: "500" }}
              >
                Adicionar Item
              </Text>
            </AddButton>
          </View>

          {itens.map((item, index) => (
            <ItemContainer key={index}>
              {/* Cabeçalho do Item */}
              <ItemRow>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "#6200ee",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={{ fontWeight: "bold", color: "#333", fontSize: 16 }}
                  >
                    {item.produtoNome || `Item ${index + 1}`}
                  </Text>
                </View>

                {itens.length > 1 && (
                  <RemoveItemButton onPress={() => removerItem(index)}>
                    <Icon name="close" size={18} color="white" />
                  </RemoveItemButton>
                )}
              </ItemRow>

              {/* Produto */}
              <FormGroup>
                <Label>Produto *</Label>
                <StyledPicker
                  selectedValue={item.produtoId}
                  onValueChange={(itemValue) =>
                    atualizarItem(index, "produtoId", Number(itemValue) || null)
                  }
                  enabled={!!selectedFornecedor && produtos.length > 0}
                >
                  <PickerItem label="Selecione o produto..." value={null} />
                  {produtos.map((p) => (
                    <PickerItem
                      key={p.id}
                      label={`${p.nome}${p.precoCustoReferencia ? ` (Ref: R$ ${p.precoCustoReferencia.toFixed(2)})` : ""}`}
                      value={p.id}
                    />
                  ))}
                </StyledPicker>
              </FormGroup>

              {/* Quantidade e Preço */}
              <FormRow>
                <Column style={{ flex: 1, marginRight: 10 }}>
                  <Label>Quantidade *</Label>
                  <StyledInput
                    keyboardType="numeric"
                    value={item.quantidade.toString()}
                    onChangeText={(text) =>
                      atualizarItem(index, "quantidade", parseInt(text) || 1)
                    }
                    placeholder="0"
                  />
                  {item.tipounidade && (
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 3 }}>
                      Unidade: {item.tipounidade}
                    </Text>
                  )}
                </Column>

                <Column style={{ flex: 1 }}>
                  <Label>Preço Unitário (R$) *</Label>
                  <PriceInputContainer>
                    <PriceInput
                      keyboardType="numeric"
                      value={item.precoUnitarioReal.toString()}
                      onChangeText={(text) =>
                        atualizarItem(
                          index,
                          "precoUnitarioReal",
                          parseFloat(text) || 0
                        )
                      }
                      placeholder="0.00"
                    />
                    {item.precoReferencia && item.precoReferencia > 0 && (
                      <PriceButton onPress={() => usarPrecoReferencia(index)}>
                        <PriceButtonText>Usar Ref.</PriceButtonText>
                      </PriceButton>
                    )}
                  </PriceInputContainer>

                  {item.precoReferencia && item.precoReferencia > 0 && (
                    <ReferencePrice>
                      Preço de referência: R$ {item.precoReferencia.toFixed(2)}
                    </ReferencePrice>
                  )}
                </Column>
              </FormRow>

              {/* Total do Item */}
              <FormGroup
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}
                  >
                    Total do Item:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: "#28a745",
                    }}
                  >
                    R$ {item.total.toFixed(2)}
                  </Text>
                </View>
              </FormGroup>
            </ItemContainer>
          ))}
        </View>

        {/* Seção: Pagamento */}
        <View style={{ marginBottom: 25 }}>
          <SectionTitle>💰 Pagamento</SectionTitle>

          {/* Forma de Pagamento */}
          <FormGroup>
            <Label>Forma de Pagamento</Label>
            <StyledPicker
              selectedValue={selectedTipoPagamento}
              onValueChange={(itemValue) =>
                setSelectedTipoPagamento(itemValue as TipoPagamento)
              }
            >
              <PickerItem label="Selecione..." value={null} />
              <PickerItem label="Dinheiro" value="DINHEIRO" />
              <PickerItem label="PIX" value="PIX" />
              <PickerItem label="Boleto" value="BOLETO" />
              <PickerItem label="Transferência" value="TRANSFERENCIA" />
              <PickerItem label="Cartão" value="CARTAO" />
              <PickerItem label="Outros" value="OUTROS" />
            </StyledPicker>
          </FormGroup>

          {/* Datas e Prazo */}
          <FormRow>
            <Column style={{ flex: 1, marginRight: 10 }}>
              <Label>Data do Pagamento</Label>
              <StyledInput
                value={dataPagamento}
                onChangeText={setDataPagamento}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />
            </Column>
            <Column style={{ flex: 1 }}>
              <Label>Prazo (dias)</Label>
              <StyledInput
                keyboardType="numeric"
                value={prazoPagamento}
                onChangeText={setPrazoPagamento}
                placeholder="0"
              />
            </Column>
          </FormRow>

          {/* Observações */}
          <FormGroup>
            <Label>Observações</Label>
            <StyledInput
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Observações adicionais..."
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: "top" }}
            />
          </FormGroup>

          {/* Atualizar Referências */}
          <UpdateReferenceCheckbox>
            <TouchableOpacity
              onPress={() => setAtualizarReferencias(!atualizarReferencias)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: atualizarReferencias ? "#6200ee" : "#ccc",
                  backgroundColor: atualizarReferencias
                    ? "#6200ee"
                    : "transparent",
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {atualizarReferencias && (
                  <Icon name="check" size={16} color="white" />
                )}
              </View>
              <CheckboxLabel>
                Atualizar preços de referência com os valores desta compra
              </CheckboxLabel>
            </TouchableOpacity>
          </UpdateReferenceCheckbox>
        </View>

        {/* Resumo da Compra */}
        {renderResumoCompra()}

        {/* Botão de Salvar */}
        <SubmitButton
          onPress={handleSubmit}
          disabled={loading.produtos}
          style={{ opacity: loading.produtos ? 0.7 : 1 }}
        >
          {loading.produtos ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Icon name="check" size={20} color="white" />
          )}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              marginLeft: 10,
            }}
          >
            {loading.produtos ? "Processando..." : "Salvar Compra"}
          </Text>
        </SubmitButton>
      </ScrollView>
    </Container>
  );
};

export default NewShop;
