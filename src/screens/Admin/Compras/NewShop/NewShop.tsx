import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
} from "./styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Fornecedor = {
  id: number;
  nomeFantasia: string;
};

type Produto = {
  id: number;
  nome: string;
  precoCustoReferencia?: number;
  estoque?: number;
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
};

const NewShop: React.FC = () => {
  const navigation = useNavigation();

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const fornecedoresRes = await api.get("/fornecedor");
        if (fornecedoresRes.data && Array.isArray(fornecedoresRes.data)) {
          setFornecedores(fornecedoresRes.data);
        }
      } catch (error: any) {
        console.error("❌ Erro ao carregar fornecedores:", error);
        Alert.alert("Erro", "Erro ao carregar fornecedores.");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFornecedor) {
      carregarProdutosFornecedor(selectedFornecedor);
    } else {
      setProdutos([]);
    }
  }, [selectedFornecedor]);

  const carregarProdutosFornecedor = async (fornecedorId: number) => {
    try {
      console.log(`🔄 Buscando produtos do fornecedor ${fornecedorId}...`);
      const response = await api.get(`/produtos/fornecedor/${fornecedorId}`);

      console.log("📦 Produtos recebidos:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setProdutos(response.data);
      } else {
        setProdutos([]);
      }
    } catch (error: any) {
      console.error("❌ Erro ao carregar produtos:", error);
      console.log("🔗 URL tentada:", `/produtos/fornecedor/${fornecedorId}`);
      console.log("📋 Status:", error.response?.status);
      console.log("📋 Mensagem:", error.message);

      // Tenta endpoint alternativo
      try {
        console.log("🔄 Tentando endpoint alternativo...");
        const responseAlt = await api.get(
          `/fornecedor/${fornecedorId}/produtos`
        );
        if (responseAlt.data && Array.isArray(responseAlt.data)) {
          setProdutos(responseAlt.data);
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
    }
  };

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

      if (campo === "produtoId" && valor) {
        const produtoSelecionado = produtos.find((p) => p.id === valor);
        if (produtoSelecionado) {
          item.produtoNome = produtoSelecionado.nome;
          item.precoReferencia = produtoSelecionado.precoCustoReferencia;
          item.precoUnitarioReal = produtoSelecionado.precoCustoReferencia || 0;
        }
      }

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

  const validarFormulario = (): boolean => {
    if (!selectedFornecedor) {
      Alert.alert("Atenção", "Selecione um fornecedor.");
      return false;
    }
    if (!selectedTipoCompra) {
      Alert.alert("Atenção", "Selecione o tipo de compra.");
      return false;
    }
    if (
      itens.some(
        (item) =>
          !item.produtoId || item.quantidade <= 0 || item.precoUnitarioReal <= 0
      )
    ) {
      Alert.alert("Atenção", "Verifique os itens da compra.");
      return false;
    }
    if (valorTotalNota <= 0) {
      Alert.alert("Atenção", "O valor total da nota deve ser maior que zero.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      const compraData = {
        fornecedorId: selectedFornecedor,
        tipoCompra: selectedTipoCompra,
        tipoPagamento: selectedTipoPagamento,
        dataCompra,
        dataPagamento: dataPagamento || null,
        prazoPagamento: prazoPagamento ? parseInt(prazoPagamento) : null,
        observacoes,
        valorNota: valorTotalNota,
        atualizarReferencias,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitarioReal: item.precoUnitarioReal,
          precoReferencia: item.precoReferencia,
          total: item.total,
        })),
      };

      console.log("📤 Enviando compra:", compraData);
      await api.post("/compra", compraData);
      Alert.alert("Sucesso", "Compra cadastrada com sucesso!");
      navigation.navigate("Compras" as never);
    } catch (error: any) {
      console.error("❌ Erro ao cadastrar compra:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Erro ao cadastrar compra, tente novamente."
      );
    }
  };

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Title>Nova Compra</Title>

      <ScrollView>
        // === DADOS DA COMPRA ===
        {/* LINHA 1: Fornecedor */}
        <FormGroup>
          <Label>Fornecedor *</Label>
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
        </FormGroup>
        {/* LINHA 2: Data da Compra */}
        <FormGroup>
          <Label>Data da Compra</Label>
          <StyledInput
            value={dataCompra}
            onChangeText={setDataCompra}
            placeholder="AAAA-MM-DD"
          />
        </FormGroup>
        {/* LINHA 3: Tipo de Compra */}
        <FormGroup>
          <Label>Tipo de Compra *</Label>
          <StyledPicker
            selectedValue={selectedTipoCompra}
            onValueChange={(itemValue) =>
              setSelectedTipoCompra(itemValue as TipoCompra)
            }
          >
            <PickerItem label="Selecione..." value={null} />
            <PickerItem label="MEI" value="MEI" />
            <PickerItem label="Nota Fiscal" value="NOTA_FISCAL" />
            <PickerItem label="Branca" value="BRANCA" />
          </StyledPicker>
        </FormGroup>
        {/* === ITENS DA COMPRA === */}
        {itens.map((item, index) => (
          <ItemContainer key={index}>
            <ItemRow>
              <Text style={{ fontWeight: "bold" }}>Item {index + 1}</Text>
              {itens.length > 1 && (
                <RemoveItemButton onPress={() => removerItem(index)}>
                  <Icon name="close" size={20} color="white" />
                </RemoveItemButton>
              )}
            </ItemRow>
            // Dentro do map dos itens
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
            <FormGroup>
              <Label>Quantidade *</Label>
              <StyledInput
                keyboardType="numeric"
                value={item.quantidade.toString()}
                onChangeText={(text) =>
                  atualizarItem(index, "quantidade", parseInt(text) || 1)
                }
                placeholder="0"
              />
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
              <Label
                style={{ fontWeight: "bold", color: "#333", fontSize: 16 }}
              >
                Total do Item: R$ {item.total.toFixed(2)}
              </Label>
            </FormGroup>
          </ItemContainer>
        ))}
        <AddButton onPress={adicionarItem}>
          <Icon name="plus" size={20} color="white" />
          <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5 }}>
            Adicionar Item
          </Text>
        </AddButton>
        // === PAGAMENTO ===
        <SectionTitle>Pagamento</SectionTitle>
        {/* LINHA 1: Forma de Pagamento */}
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
        {/* LINHA 2: Data do Pagamento */}
        <FormGroup>
          <Label>Data do Pagamento</Label>
          <StyledInput
            value={dataPagamento}
            onChangeText={setDataPagamento}
            placeholder="AAAA-MM-DD"
          />
        </FormGroup>
        {/* LINHA 3: Prazo */}
        <FormGroup>
          <Label>Prazo (dias)</Label>
          <StyledInput
            keyboardType="numeric"
            value={prazoPagamento}
            onChangeText={setPrazoPagamento}
            placeholder="0"
          />
        </FormGroup>
        {/* Observações */}
        <FormGroup>
          <Label>Observações</Label>
          <StyledInput
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Observações adicionais..."
            multiline
            numberOfLines={3}
            style={{ height: 80 }}
          />
        </FormGroup>
        {/* Atualizar referências */}
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
                borderColor: atualizarReferencias ? "#007bff" : "#ccc",
                backgroundColor: atualizarReferencias
                  ? "#007bff"
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
        {/* Total */}
        <TotalText>Total da Compra: R$ {valorTotalNota.toFixed(2)}</TotalText>
        <SubmitButton onPress={handleSubmit}>
          <Icon name="check" size={20} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              marginLeft: 10,
            }}
          >
            Salvar Compra
          </Text>
        </SubmitButton>
      </ScrollView>
    </Container>
  );
};

export default NewShop;
