import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
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
} from "./styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Fornecedor = {
  id: number;
  nome: string;
};
type Produto = {
  id: number;
  nome: string;
  precoCusto?: number;
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

type ItemCompta = {
  produtoId: number | null;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
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

  const [itens, setItens] = useState<ItemCompta[]>([
    {
      produtoId: null,
      produtoNome: "",
      quantidade: 1,
      precoUnitario: 0,
      total: 0,
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fornecedoresRes = await api.get("/fornecedor");
        setFornecedores(fornecedoresRes.data);
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error);
        Alert.alert("Erro ao carregar fornecedores.");
      }
    };

    loadData();
  }, []);

  // Carregar produtos quando o fornecedor selecionado mudar
  useEffect(() => {
    if (selectedFornecedor) {
      api
        .get(`fornecedor/${selectedFornecedor}/produtos`)
        .then((res) => setProdutos(res.data))
        .catch(() => {
          setProdutos([]);
          Alert.alert(
            "Aviso",
            "Selecione o produto após escolher o fornecedor."
          );
        });
    } else {
      setProdutos([]);
    }
  }, [selectedFornecedor]);

  //Adicionar itens de compra
  const adicionarItem = () => {
    setItens((prev) => [
      ...prev,
      {
        produtoId: null,
        produtoNome: "",
        quantidade: 1,
        precoUnitario: 0,
        total: 0,
      },
    ]);
  };

  //Remover itens de compra
  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens((prev) => prev.filter((_, i) => i !== index));
    }
  };

  //atualizar item
  const atualizarItem = (
    index: number,
    campo: keyof ItemCompta,
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
          item.precoUnitario = produtoSelecionado.precoCusto || 0;
        }
      }
      if (campo === "quantidade" || campo === "precoUnitario") {
        item.total = item.quantidade * item.precoUnitario;
      }

      novosItens[index] = item;
      return novosItens;
    });
  };

  //calcular valor total da compra
  const valorTotalNota = itens.reduce((total, item) => total + item.total, 0);

  const validarFormulario = (): boolean => {
    if (!selectedFornecedor) {
      Alert.alert("Selecione um fornecedor.");
      return false;
    }
    if (!selectedTipoCompra) {
      Alert.alert("Selecione o tipo de compra.");
      return false;
    }

    if (
      itens.some(
        (item) =>
          !item.produtoId || item.quantidade <= 0 || item.precoUnitario <= 0
      )
    ) {
      Alert.alert("Verifique os itens da compra.");
      return false;
    }

    if (valorTotalNota <= 0) {
      Alert.alert("O valor total da nota deve ser maior que zero.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

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
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          total: item.total,
        })),
      };

      await api.post("/compra", compraData);
      Alert.alert("Sucesso", "Compra cadastrada com sucesso.");
      navigation.navigate("NewShop" as never);
    } catch (error: any) {
      console.error("Erro ao cadastrar compra:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Erro ao cadastrar compra, tente novamente."
      );
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
        Nova Compra
      </Text>

      <ScrollView>
        <FormGroup>
          <Label>Fornecedor</Label>
          <StyledPicker
            selectedValue={selectedFornecedor}
            onValueChange={(itemValue) =>
              setSelectedFornecedor(Number(itemValue) || null)
            }
          >
            <PickerItem label="Selecione o fornecedor..." value={null} />
            {fornecedores.map((f) => (
              <PickerItem key={f.id} label={f.nome} value={f.id} />
            ))}
          </StyledPicker>
        </FormGroup>

        <FormGroup>
          <Label>Data da compra</Label>
          <StyledInput
            value={dataCompra}
            onChangeText={setDataCompra}
            placeholder="AAAA-MM-DD"
          />
        </FormGroup>

        <FormGroup>
          <Label>Tipo de Compra</Label>
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

        <SectionTitle>Itens da Compra</SectionTitle>
        {itens.map((item, index) => (
          <ItemContainer key={index}>
            <ItemRow>
              <Text>Item {index + 1}</Text>
              {itens.length > 1 && (
                <RemoveItemButton onPress={() => removerItem(index)}>
                  <Text>x</Text>
                </RemoveItemButton>
              )}
            </ItemRow>

            <FormGroup>
              <Label>Produto</Label>
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
                    label={`${p.nome} - R$ ${(p.precoCusto || 0).toFixed(2)}`}
                    value={p.id}
                  />
                ))}
              </StyledPicker>
            </FormGroup>

            <FormGroup>
              <Label>Quantidade</Label>
              <StyledInput
                keyboardType="numeric"
                value={item.quantidade.toString()}
                onChangeText={(text) =>
                  atualizarItem(index, "quantidade", parseInt(text) || 1)
                }
                placeholder="Quantidade"
              />
            </FormGroup>

            <FormGroup>
              <Label>Preco Unitario (R$)*</Label>
              <StyledInput
                keyboardType="numeric"
                value={item.precoUnitario.toString()}
                onChangeText={(text) =>
                  atualizarItem(index, "precoUnitario", parseFloat(text) || 0)
                }
                placeholder="0.00"
              />
            </FormGroup>

            <FormGroup>
              <Label>Total do Item: R$ {item.total.toFixed(2)}</Label>
            </FormGroup>
          </ItemContainer>
        ))}

        <AddButton onPress={adicionarItem}>
          <Text>+ Adicionar Item</Text>
        </AddButton>

        <SectionTitle>Pagamento</SectionTitle>

        <FormGroup>
          <Label>Forma de pagamento</Label>
          <StyledPicker
            selectedValue={selectedTipoPagamento}
            onValueChange={(itemValue) =>
              setSelectedTipoPagamento(itemValue as TipoPagamento)
            }
          >
            <PickerItem label="Selecione a forma..." value={null} />
            {<PickerItem label="Dinheiro" value="DINHEIRO" />}
            {<PickerItem label="PIX" value="PIX" />}
            {<PickerItem label="Boleto" value="BOLETO" />}
            {<PickerItem label="Transferência" value="TRANSFERENCIA" />}
            {<PickerItem label="Cheque" value="CHEQUE" />}
            {<PickerItem label="Debito" value="DEBITO" />}
            {<PickerItem label="Credito" value="CREDITO" />}
            {<PickerItem label="Fiado" value="FIADO" />}
            {<PickerItem label="A_prazo" value="A_PRAZO" />}
            {<PickerItem label="Outros" value="OUTROS" />}
          </StyledPicker>
        </FormGroup>

        <FormGroup>
          <Label>Data do pagamento</Label>
          <StyledInput
            value={dataPagamento}
            onChangeText={setDataPagamento}
            placeholder="AAAA-MM-DD (opcional)"
          />
        </FormGroup>

        <FormGroup>
          <Label>Prazo (dias)*</Label>
          <StyledInput
            keyboardType="numeric"
            value={prazoPagamento}
            onChangeText={setPrazoPagamento}
            placeholder="Dias para pagamento (opcional)"
          />
        </FormGroup>

        <FormGroup>
          <Label>Observações</Label>
          <StyledInput
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Observações adicionais..."
            multiline
          />
        </FormGroup>

        <TotalText>Total da Compra: R$ {valorTotalNota.toFixed(2)}</TotalText>

        <SubmitButton onPress={handleSubmit}>
          <Text>Salvar Compra</Text>
        </SubmitButton>
      </ScrollView>
    </Container>
  );
};

export default NewShop;
