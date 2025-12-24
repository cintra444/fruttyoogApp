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
import api, { PostCompra } from "src/Services/apiFruttyoog";
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
  precoCusto?: number;
  estoque?: number;
  tipounidade?: string;
  categoria?: {
    id: number;
    nome: string;
  };
  fornecedorId?: number;
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

interface Pagamento {
  tipo: TipoPagamento;
  valor: number;
  descricao: string;
}

type ItemCompra = {
  produtoId: number | null;
  produtoNome: string;
  quantidade: string;
  precoUnitarioReal: string;
  total: number;
  precoReferencia?: number;
  tipounidade?: string;
};
interface CompraRequest {
  fornecedorId: number;
  tipoCompra: string;
  tipoPagamento: string;
  dataCompra: string;
  valorNota: number;
  prazoPagamento: number;
  observacoes?: string;
  dataPagamento?: string;
  atualizarReferencias: boolean;
  itens: {
    produtoId: number;
    quantidade: number;
    precoUnitarioReal: number;
    precoReferencia?: number;
    usarComoReferencia: boolean;
  }[];
  pagamentos: {
    tipo: string;
    valor: number;
    descricao?: string;
  }[];
}

const NewShop: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [novoProdutoId, setNovoProdutoId] = useState<number | null>(null);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState({
    produtos: false,
    fornecedores: false,
    salvar: false,
  });

  const [selectedFornecedor, setSelectedFornecedor] = useState<number | null>(
    null
  );
  const [selectedTipoCompra, setSelectedTipoCompra] =
    useState<TipoCompra | null>(null);
  const [tipoPagamentoPrincipal, setTipoPagamentoPrincipal] =
    useState<TipoPagamento>("DINHEIRO");

  //estados para pagamentos multiplos
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([
    {
      tipo: "DINHEIRO",
      valor: 0,
      descricao: "",
    },
  ]);

  // Função para formatar data ISO para DD/MM/AA
  const formatarDataParaBrasileiro = (dataISO: string): string => {
    if (!dataISO) return "";

    if (dataISO.includes("/")) {
      const partes = dataISO.split("/");
      if (partes.length === 3) {
        const ano = partes[2];
        return `${partes[0]}/${partes[1]}/${ano.slice(-2)}`;
      }
      return dataISO;
    }

    const partes = dataISO.split("-");
    if (partes.length === 3) {
      const ano = partes[0];
      const mes = partes[1];
      const dia = partes[2];
      return `${dia}/${mes}/${ano.slice(-2)}`;
    }
    return dataISO;
  };

  // Função para converter DD/MM/AA para ISO
  const formatarDataParaISO = (dataBrasileira: string): string => {
    if (!dataBrasileira || dataBrasileira.trim() === "") return "";

    const partes = dataBrasileira.split("/");
    if (partes.length !== 3) return "";

    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");
    let ano = partes[2];

    if (ano.length === 2) {
      ano = `20${ano}`;
    }

    return `${ano}-${mes}-${dia}`;
  };

  // Data atual no formato DD/MM/AA
  const getDataAtualFormatada = () => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, "0");
    const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
    const ano = hoje.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${ano}`;
  };

  const [dataCompra, setDataCompra] = useState<string>(getDataAtualFormatada());
  const [dataPagamento, setDataPagamento] = useState<string>("");
  const [prazoPagamento, setPrazoPagamento] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [atualizarReferencias, setAtualizarReferencias] = useState(false);

  const [itens, setItens] = useState<ItemCompra[]>([
    {
      produtoId: null,
      produtoNome: "",
      quantidade: "",
      precoUnitarioReal: "",
      total: 0,
    },
  ]);

  //verificar se há novo produto vindo da navegação
  useEffect(() => {
    const params = route.params as
      | { novoProdutoId?: number; fornecedorId?: number }
      | undefined;

    if (params?.novoProdutoId) {
      const produtoId = params.novoProdutoId;
      setNovoProdutoId(produtoId);
    }

    if (params?.fornecedorId && !selectedFornecedor) {
      setSelectedFornecedor(params.fornecedorId);
    }
  }, [route.params]);

  // Carregar fornecedores
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
      resetarItens();
    }
  }, [selectedFornecedor]);

  const resetarItens = () => {
    setItens([
      {
        produtoId: null,
        produtoNome: "",
        quantidade: "",
        precoUnitarioReal: "",
        total: 0,
      },
    ]);
  };

  //carregar produtos do fornecedor
  const carregarProdutosFornecedor = async (fornecedorId: number) => {
    try {
      setLoading((prev) => ({ ...prev, produtos: true }));
      setProdutos([]);

      console.log(`🔄 Carregando produtos para fornecedor ID: ${fornecedorId}`);

      const endpoints = [
        `/produtos/fornecedor/${fornecedorId}`,
        `/produtos?fornecedor=${fornecedorId}`,
        `/fornecedor/${fornecedorId}/produtos`,
      ];

      let produtosCarregados: Produto[] = [];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Tentando endpoint: ${endpoint}`);
          const response = await api.get(endpoint);

          if (response.data) {
            console.log(`✅ Resposta do endpoint ${endpoint}:`, response.data);

            let dataArray = [];
            if (Array.isArray(response.data)) {
              dataArray = response.data;
            } else if (
              response.data.produtos &&
              Array.isArray(response.data.produtos)
            ) {
              dataArray = response.data.produtos;
            } else if (
              response.data.content &&
              Array.isArray(response.data.content)
            ) {
              dataArray = response.data.content;
            }

            if (dataArray.length > 0) {
              produtosCarregados = dataArray.map((p: any) => ({
                id: p.id,
                nome: p.nome || p.name || `Produto ${p.id}`,
                precoCusto:
                  p.precoCusto ||
                  p.precoCustoReferencia ||
                  p.precoReferencia ||
                  0,
                estoque: p.estoque || p.qtdeEstoque || p.quantidadeEstoque || 0,
                tipounidade: p.tipounidade || p.unidade || "UNIDADE",
                categoria: p.categoria || { id: 0, nome: "Sem categoria" },
                fornecedorId:
                  p.fornecedorId || p.fornecedor?.id || fornecedorId,
              }));

              console.log(
                `✅ Carregados ${produtosCarregados.length} produtos`
              );
              break;
            }
          }
        } catch (error: any) {
          console.log(
            `❌ Falha no endpoint ${endpoint}:`,
            error.response?.status
          );
          continue;
        }
      }

      if (produtosCarregados.length > 0) {
        const produtosFiltrados = produtosCarregados.filter(
          (p) => p.fornecedorId === fornecedorId
        );

        const produtosOrdenados = [...produtosFiltrados].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
        );

        console.log(
          `✅ Definindo ${produtosOrdenados.length} produtos para o fornecedor ${fornecedorId}`
        );
        setProdutos(produtosOrdenados);
      } else {
        console.log(
          `ℹ️ Nenhum produto encontrado para fornecedor ${fornecedorId}`
        );
        setProdutos([]);
      }
    } catch (error: any) {
      console.error("❌ Erro geral ao carregar produtos:", error);
      Alert.alert(
        "Aviso",
        "Não foi possível carregar os produtos deste fornecedor."
      );
      setProdutos([]);
    } finally {
      setLoading((prev) => ({ ...prev, produtos: false }));
    }
  };

  // funcao para pagamentos multiplos
  const adicionarPagamento = () => {
    setPagamentos((prev) => [
      ...prev,
      {
        tipo: "DINHEIRO",
        valor: 0,
        descricao: "",
      },
    ]);
  };

  const removerPagamento = (index: number) => {
    if (pagamentos.length > 1) {
      setPagamentos((prev) => prev.filter((_, i) => i !== index));
    } else {
      Alert.alert("Aviso", "É necessário pelo menos um pagamento.");
    }
  };

  const atualizarPagamento = (
    index: number,
    campo: keyof Pagamento,
    valor: any
  ) => {
    setPagamentos((prev) => {
      const novosPagamentos = [...prev];
      const pagamento = { ...novosPagamentos[index] };

      (pagamento as any)[campo] =
        campo === "valor" ? parseFloat(valor) || 0 : valor;
      novosPagamentos[index] = pagamento;
      return novosPagamentos;
    });
  };

  //calcular total dos pagamentos
  const totalPagamentos = pagamentos.reduce(
    (total, pagamento) => total + pagamento.valor,
    0
  );

  const adicionarItemDoCard = (produto: Produto) => {
    const primeiroItemVazio = itens[0] && !itens[0].produtoId;

    if (primeiroItemVazio) {
      setItens((prev) => {
        const novosItens = [...prev];
        novosItens[0] = {
          produtoId: produto.id,
          produtoNome: produto.nome,
          quantidade: "",
          precoUnitarioReal: produto.precoCusto
            ? produto.precoCusto.toString()
            : "",
          total: produto.precoCusto || 0,
          precoReferencia: produto.precoCusto,
          tipounidade: produto.tipounidade,
        };
        return novosItens;
      });
    } else {
      setItens((prev) => [
        ...prev,
        {
          produtoId: produto.id,
          produtoNome: produto.nome,
          quantidade: "",
          precoUnitarioReal: produto.precoCusto
            ? produto.precoCusto.toString()
            : "",
          total: produto.precoCusto || 0,
          precoReferencia: produto.precoCusto,
          tipounidade: produto.tipounidade,
        },
      ]);
    }

    if (novoProdutoId === produto.id) {
      setNovoProdutoId(null);
    }
  };

  const adicionarItemVazio = () => {
    setItens((prev) => [
      ...prev,
      {
        produtoId: null,
        produtoNome: "",
        quantidade: "",
        precoUnitarioReal: "",
        total: 0,
      },
    ]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens((prev) => prev.filter((_, i) => i !== index));
    } else {
      setItens([
        {
          produtoId: null,
          produtoNome: "",
          quantidade: "",
          precoUnitarioReal: "",
          total: 0,
        },
      ]);
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
          item.precoReferencia = produtoSelecionado.precoCusto;
          item.precoUnitarioReal = produtoSelecionado.precoCusto
            ? produtoSelecionado.precoCusto.toString()
            : "";
          item.tipounidade = produtoSelecionado.tipounidade;
        }
      }

      if (campo === "quantidade" || campo === "precoUnitarioReal") {
        const quantidade = parseFloat(item.quantidade) || 0;
        const precoUnitarioReal = parseFloat(item.precoUnitarioReal) || 0;
        item.total = quantidade * precoUnitarioReal;
      }

      novosItens[index] = item;
      return novosItens;
    });
  };

  const usarPrecoReferencia = (index: number) => {
    const item = itens[index];
    if (item.produtoId && item.precoReferencia) {
      atualizarItem(
        index,
        "precoUnitarioReal",
        item.precoReferencia.toString()
      );
    }
  };

  const valorTotalNota = itens.reduce((total, item) => {
    const qtd = parseFloat(item.quantidade) || 0;
    const preco = parseFloat(item.precoUnitarioReal) || 0;
    return total + qtd * preco;
  }, 0);

  const quantidadeTotal = itens.reduce(
    (total, item) => total + (parseFloat(item.quantidade) || 0),
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

    if (!selectedTipoCompra) {
      Alert.alert("Atenção", "Selecione um tipo de compra.");
      return false;
    }

    // Se houver múltiplos pagamentos, verificar se todos têm tipo
    const pagamentosInvalidos = pagamentos.some((p) => !p.tipo);
    if (pagamentosInvalidos) {
      Alert.alert("Atenção", "Todos os pagamentos devem ter um tipo definido.");
      return false;
    }

    const itensValidos = itens.filter((item) => item.produtoId);
    if (itensValidos.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um produto à compra.");
      return false;
    }

    const itemInvalido = itens.some((item, index) => {
      if (item.produtoId) {
        const qtd = parseFloat(item.quantidade) || 0;
        const precoUnitarioReal = parseFloat(item.precoUnitarioReal) || 0;
        if (qtd <= 0) {
          Alert.alert(
            "Atenção",
            `Informe uma quantidade maior que zero para "${item.produtoNome}".`
          );
          return true;
        }

        if (precoUnitarioReal <= 0) {
          Alert.alert(
            "Atenção",
            `Informe um preço unitário maior que zero para "${item.produtoNome}".`
          );
          return true;
        }
      }
      return false;
    });

    if (itemInvalido) return false;

    if (totalPagamentos <= 0) {
      Alert.alert(
        "Atenção",
        "Adicione pelo menos um pagamento com valor maior que zero."
      );
      return false;
    }

    const diferenca = Math.abs(totalPagamentos - valorTotalNota);
    if (diferenca > 0.01) {
      Alert.alert(
        "Atenção",
        `O valor total da compra (${valorTotalNota.toFixed(2)}) deve ser igual ao valor total dos pagamentos (${totalPagamentos.toFixed(2)}).`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading((prev) => ({ ...prev, salvar: true }));

      const dataCompraISO = formatarDataParaISO(dataCompra);
      if (!dataCompraISO) {
        Alert.alert("Erro", "Data da compra inválida.");
        return;
      }

      const itensValidos = itens.filter((item) => item.produtoId);
      const tipoPagamentoParaCompra =
        pagamentos.length > 0 ? pagamentos[0].tipo : "DINHEIRO";

      // Formatar os dados conforme a NOVA interface
      const compraData: CompraRequest = {
        fornecedorId: selectedFornecedor!,
        tipoCompra: selectedTipoCompra!,
        tipoPagamento: tipoPagamentoParaCompra,
        dataCompra: dataCompraISO,
        valorNota: parseFloat(valorTotalNota.toFixed(2)),
        prazoPagamento: prazoPagamento ? parseInt(prazoPagamento) : 0,
        observacoes: observacoes.trim() || undefined,
        dataPagamento: dataPagamento
          ? formatarDataParaISO(dataPagamento)
          : undefined,
        atualizarReferencias: atualizarReferencias,
        pagamentos: pagamentos
          .filter((p) => p.valor > 0)
          .map((p) => ({
            tipo: p.tipo,
            valor: parseFloat(p.valor.toFixed(2)),
            descricao: p.descricao || undefined,
          })),
        itens: itensValidos.map((item) => ({
          produtoId: item.produtoId!,
          quantidade: parseFloat(item.quantidade) || 0,
          precoUnitarioReal: parseFloat(item.precoUnitarioReal) || 0,
          precoReferencia: item.precoReferencia
            ? parseFloat(item.precoReferencia.toFixed(2))
            : undefined,
          usarComoReferencia:
            atualizarReferencias &&
            (parseFloat(item.precoUnitarioReal) || 0) > 0,
        })),
      };

      console.log("📤 Enviando compra:", JSON.stringify(compraData, null, 2));

      // Usar a NOVA função da API
      const response = await PostCompra(compraData);

      if (response) {
        console.log("✅ Compra cadastrada com sucesso:", response);
        Alert.alert("Sucesso", "Compra cadastrada com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
          {
            text: "Nova Compra",
            onPress: () => {
              limparFormulario();
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error("❌ Erro ao cadastrar compra:", error);

      // Se o erro já foi tratado pela handleApiError, não mostrar alerta duplicado
      if (!error.isHandled) {
        Alert.alert(
          "Erro",
          error.message || "Erro ao cadastrar compra, tente novamente."
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, salvar: false }));
    }
  };

  //limpar formulario apos cadastro
  const limparFormulario = () => {
    setItens([
      {
        produtoId: null,
        produtoNome: "",
        quantidade: "",
        precoUnitarioReal: "",
        total: 0,
      },
    ]);

    setPagamentos([
      {
        tipo: "DINHEIRO",
        valor: 0,
        descricao: "",
      },
    ]);
    setSelectedTipoCompra(null);
    setDataCompra(getDataAtualFormatada());
    setDataPagamento("");
    setPrazoPagamento("");
    setObservacoes("");
    setAtualizarReferencias(false);
    setNovoProdutoId(null);
  };

  //navegar para tela cadastro de produto
  const navegarParaNovoProduto = () => {
    (navigation as any).navigate("NewProduct", {
      fornecedorId: selectedFornecedor,
    });
  };

  //formatar enquanto digita
  const formatarDataInput = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length <= 8) {
      const dia = cleaned.slice(0, 2);
      const mes = cleaned.slice(2, 4);
      const ano = cleaned.slice(4, 8);
      const anoReduzido = ano.length === 4 ? ano.slice(2) : ano;
      return `${dia}/${mes}/${anoReduzido}`;
    }
    return text;
  };

  // Adicionar campo de tipo de pagamento principal na seção de dados da compra
  const renderTipoPagamentoPrincipal = () => (
    <FormGroup>
      <Label>Tipo de Pagamento Principal *</Label>
      <StyledPicker
        selectedValue={tipoPagamentoPrincipal}
        onValueChange={(itemValue) =>
          setTipoPagamentoPrincipal(itemValue as TipoPagamento)
        }
      >
        <Picker.Item label="Dinheiro" value="DINHEIRO" />
        <Picker.Item label="PIX" value="PIX" />
        <Picker.Item label="Boleto" value="BOLETO" />
        <Picker.Item label="Transferência" value="TRANSFERENCIA" />
        <Picker.Item label="Cartão de Crédito" value="CREDITO" />
        <Picker.Item label="Cartão de Débito" value="DEBITO" />
        <Picker.Item label="Fiado" value="FIADO" />
        <Picker.Item label="A Prazo" value="A_PRAZO" />
        <Picker.Item label="Outros" value="OUTROS" />
      </StyledPicker>
    </FormGroup>
  );

  //renderiza secao de pagamentos
  const renderPagamentos = () => (
    <View style={{ marginBottom: 25 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <SectionTitle>💰 Pagamentos Detalhados</SectionTitle>
      </View>

      {pagamentos.map((pagamento, index) => (
        <ItemContainer key={index} style={{ marginBottom: 15 }}>
          <ItemRow>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#2196F3",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {index + 1}
                </Text>
              </View>
              <Text style={{ fontWeight: "bold", color: "#333", fontSize: 16 }}>
                Pagamento {index + 1}
              </Text>
            </View>

            {pagamentos.length > 1 && (
              <RemoveItemButton onPress={() => removerPagamento(index)}>
                <Icon name="close" size={18} color="white" />
              </RemoveItemButton>
            )}
          </ItemRow>

          <FormGroup>
            <Label>Tipo de Pagamento *</Label>
            <Picker
              selectedValue={pagamento.tipo}
              onValueChange={(itemValue) =>
                atualizarPagamento(index, "tipo", itemValue as TipoPagamento)
              }
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                marginBottom: 15,
              }}
            >
              <Picker.Item label="Dinheiro" value="DINHEIRO" />
              <Picker.Item label="PIX" value="PIX" />
              <Picker.Item label="Boleto" value="BOLETO" />
              <Picker.Item label="Transferência" value="TRANSFERENCIA" />
              <Picker.Item label="Cartão de Crédito" value="CREDITO" />
              <Picker.Item label="Cartão de Débito" value="DEBITO" />
              <Picker.Item label="Fiado" value="FIADO" />
              <Picker.Item label="A Prazo" value="A_PRAZO" />
              <Picker.Item label="Outros" value="OUTROS" />
            </Picker>
          </FormGroup>

          <FormRow>
            <Column style={{ flex: 2, marginRight: 10 }}>
              <Label>Valor (R$) *</Label>
              <StyledInput
                keyboardType="numeric"
                value={pagamento.valor === 0 ? "" : pagamento.valor.toString()}
                onChangeText={(text) =>
                  atualizarPagamento(index, "valor", text)
                }
                placeholder="0.00"
              />
            </Column>
            <Column style={{ flex: 3 }}>
              <Label>Descrição (Opcional)</Label>
              <StyledInput
                value={pagamento.descricao || ""}
                onChangeText={(text) =>
                  atualizarPagamento(index, "descricao", text)
                }
                placeholder="Ex: Pagamento parcial, entrada, etc."
              />
            </Column>
          </FormRow>

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
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>
                Valor deste pagamento:
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "#2196F3" }}
              >
                R$ {pagamento.valor.toFixed(2)}
              </Text>
            </View>
          </FormGroup>
        </ItemContainer>
      ))}

      {/* Botão de Adicionar Pagamento embaixo do card */}
      <AddButton onPress={adicionarPagamento} style={{ marginTop: 10 }}>
        <Icon name="plus" size={18} color="white" />
        <Text style={{ color: "white", marginLeft: 5, fontWeight: "500" }}>
          Adicionar Pagamento
        </Text>
      </AddButton>

      {/* RESUMO DOS PAGAMENTOS */}
      <View
        style={{
          backgroundColor: "#E3F2FD",
          padding: 15,
          borderRadius: 10,
          marginTop: 15,
          borderWidth: 1,
          borderColor: "#90CAF9",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1565C0" }}>
            Total dos Pagamentos:
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1565C0" }}>
            R$ {totalPagamentos.toFixed(2)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
            Valor Total da Nota:
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#28a745" }}>
            R$ {valorTotalNota.toFixed(2)}
          </Text>
        </View>

        {Math.abs(totalPagamentos - valorTotalNota) > 0.01 && (
          <View
            style={{
              backgroundColor:
                totalPagamentos === valorTotalNota ? "#E8F5E9" : "#FFEBEE",
              padding: 10,
              borderRadius: 6,
              marginTop: 10,
              borderLeftWidth: 4,
              borderLeftColor:
                totalPagamentos === valorTotalNota ? "#4CAF50" : "#F44336",
            }}
          >
            <Text
              style={{
                color:
                  totalPagamentos === valorTotalNota ? "#2E7D32" : "#D32F2F",
                fontWeight: "500",
              }}
            >
              {totalPagamentos === valorTotalNota
                ? "✓ Soma dos pagamentos corresponde ao valor total"
                : `⚠️ Diferença: R$ ${Math.abs(totalPagamentos - valorTotalNota).toFixed(2)}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Renderiza produtos disponíveis em cards
  const renderProdutosDisponiveis = () => {
    if (!selectedFornecedor) return null;

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
          <Label style={{ marginBottom: 10, fontSize: 16, fontWeight: "600" }}>
            Produtos disponíveis deste fornecedor:
          </Label>
        </View>

        {loading.produtos ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#6200ee" />
            <LoadingText>Carregando produtos...</LoadingText>
          </LoadingContainer>
        ) : produtos.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FFF3CD",
              padding: 15,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#FFEEBA",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Icon name="alert-circle-outline" size={20} color="#856404" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#856404",
                  marginLeft: 8,
                }}
              >
                Nenhum produto cadastrado
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#856404", marginBottom: 10 }}>
              Este fornecedor não possui produtos cadastrados ainda.
            </Text>
          </View>
        ) : (
          <CardContainer style={{ height: 300 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 5 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {produtos.map((produto) => {
                const jaAdicionado = itens.some(
                  (item) => item.produtoId === produto.id
                );
                const ehNovoProduto = novoProdutoId === produto.id;

                return (
                  <CardTouchable
                    key={produto.id}
                    onPress={() => adicionarItemDoCard(produto)}
                    style={{
                      backgroundColor: jaAdicionado ? "#e8f5e9" : "#fff",
                      borderLeftWidth: 4,
                      borderLeftColor: ehNovoProduto
                        ? "#FF9800"
                        : jaAdicionado
                          ? "#4caf50"
                          : "#6200ee",
                      opacity: jaAdicionado ? 0.7 : 1,
                      marginBottom: 8,
                      padding: 12,
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
                          fontSize: 16,
                        }}
                      >
                        {produto.nome}
                      </CardTitle>

                      {ehNovoProduto && (
                        <View
                          style={{
                            backgroundColor: "#FF9800",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                            marginLeft: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          >
                            NOVO
                          </Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ fontSize: 13, color: "#666" }}>
                        {produto.categoria?.nome || "Sem categoria"}
                      </Text>

                      {produto.precoCusto && produto.precoCusto > 0 && (
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "500",
                            color: "#ff9800",
                          }}
                        >
                          Ref: R$ {produto.precoCusto.toFixed(2)}
                        </Text>
                      )}
                    </View>

                    {produto.estoque !== undefined && (
                      <Text
                        style={{ fontSize: 12, color: "#666", marginTop: 3 }}
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
                          marginTop: 8,
                          paddingTop: 5,
                          borderTopWidth: 1,
                          borderTopColor: "#e0e0e0",
                        }}
                      >
                        <Icon name="check-circle" size={14} color="#4caf50" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#4caf50",
                            marginLeft: 5,
                            fontWeight: "500",
                          }}
                        >
                          Adicionado à compra
                        </Text>
                      </View>
                    )}
                  </CardTouchable>
                );
              })}
            </ScrollView>
          </CardContainer>
        )}

        {/* Botão Novo Produto embaixo da lista */}
        <TouchableOpacity
          onPress={navegarParaNovoProduto}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#4CAF50",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          <Icon name="plus" size={18} color="white" />
          <Text style={{ color: "white", marginLeft: 8, fontWeight: "600" }}>
            Novo Produto
          </Text>
        </TouchableOpacity>

        <InfoCard style={{ marginTop: 15 }}>
          <InfoCardText>
            💡 Clique em um produto para adicioná-lo automaticamente à compra
          </InfoCardText>
        </InfoCard>
      </View>
    );
  };

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Title>Nova Compra</Title>

      <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }}>
        {/* Seção: Dados da Compra */}
        <View style={{ marginBottom: 25 }}>
          <SectionTitle>📋 Dados da Compra</SectionTitle>

          <FormGroup>
            <Label>Fornecedor *</Label>
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
                onValueChange={(itemValue) => {
                  const novoFornecedor = Number(itemValue) || null;
                  console.log(
                    `🔄 Alterando fornecedor para: ${novoFornecedor}`
                  );
                  setSelectedFornecedor(novoFornecedor);
                }}
              >
                <PickerItem label="Selecione o fornecedor..." value={null} />
                {fornecedores.map((f) => (
                  <PickerItem key={f.id} label={f.nomeFantasia} value={f.id} />
                ))}
              </StyledPicker>
            )}
          </FormGroup>

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

          {/* Adicionar campo de tipo de pagamento principal */}
          <FormGroup>
            <Label>Tipo de Pagamento Principal *</Label>
            <StyledPicker
              selectedValue={tipoPagamentoPrincipal}
              onValueChange={(itemValue) =>
                setTipoPagamentoPrincipal(itemValue as TipoPagamento)
              }
            >
              <Picker.Item label="Dinheiro" value="DINHEIRO" />
              <Picker.Item label="PIX" value="PIX" />
              <Picker.Item label="Boleto" value="BOLETO" />
              <Picker.Item label="Transferência" value="TRANSFERENCIA" />
              <Picker.Item label="Cartão de Crédito" value="CREDITO" />
              <Picker.Item label="Cartão de Débito" value="DEBITO" />
              <Picker.Item label="Fiado" value="FIADO" />
              <Picker.Item label="A Prazo" value="A_PRAZO" />
              <Picker.Item label="Outros" value="OUTROS" />
            </StyledPicker>
          </FormGroup>

          <FormRow>
            <Column style={{ flex: 1, marginRight: 10 }}>
              <Label>Data da Compra</Label>
              <StyledInput
                value={dataCompra}
                onChangeText={(text) => setDataCompra(formatarDataInput(text))}
                placeholder="DD/MM/AA"
                keyboardType="numeric"
                maxLength={8}
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

          <FormGroup>
            <Label>Data do Pagamento (Opcional)</Label>
            <StyledInput
              value={dataPagamento}
              onChangeText={(text) => setDataPagamento(formatarDataInput(text))}
              placeholder="DD/MM/AA"
              keyboardType="numeric"
              maxLength={8}
            />
          </FormGroup>

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
            <TouchableOpacity
              onPress={adicionarItemVazio}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#6200ee",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Icon name="plus" size={16} color="white" />
              <Text style={{ color: "white", marginLeft: 5, fontSize: 13 }}>
                Novo Item
              </Text>
            </TouchableOpacity>
          </View>

          {itens.map((item, index) => (
            <ItemContainer key={index} style={{ marginBottom: 15 }}>
              <ItemRow>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: item.produtoId ? "#6200ee" : "#ccc",
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
                    {item.produtoNome || `Item ${index + 1} (vazio)`}
                  </Text>
                </View>

                {itens.length > 1 && (
                  <RemoveItemButton onPress={() => removerItem(index)}>
                    <Icon name="close" size={18} color="white" />
                  </RemoveItemButton>
                )}
              </ItemRow>

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
                      label={`${p.nome}${p.precoCusto ? ` (Ref: R$ ${p.precoCusto.toFixed(2)})` : ""}`}
                      value={p.id}
                    />
                  ))}
                </StyledPicker>
              </FormGroup>

              {item.produtoId && (
                <>
                  <FormRow>
                    <Column style={{ flex: 1, marginRight: 10 }}>
                      <Label>Quantidade *</Label>
                      <StyledInput
                        keyboardType="numeric"
                        value={item.quantidade.toString()}
                        onChangeText={(text) =>
                          atualizarItem(
                            index,
                            "quantidade",
                            parseFloat(text) || 1
                          )
                        }
                        placeholder="0"
                      />
                      {item.tipounidade && (
                        <Text
                          style={{ fontSize: 12, color: "#666", marginTop: 3 }}
                        >
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
                          <PriceButton
                            onPress={() => usarPrecoReferencia(index)}
                          >
                            <PriceButtonText>Usar Ref.</PriceButtonText>
                          </PriceButton>
                        )}
                      </PriceInputContainer>

                      {item.precoReferencia && item.precoReferencia > 0 && (
                        <ReferencePrice>
                          Preço de referência: R${" "}
                          {item.precoReferencia.toFixed(2)}
                        </ReferencePrice>
                      )}
                    </Column>
                  </FormRow>

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
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          color: "#333",
                        }}
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
                </>
              )}
            </ItemContainer>
          ))}
        </View>

        {/* Seção: Pagamentos Múltiplos */}
        {renderPagamentos()}

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

        {/* RESUMO FINAL */}
        <View
          style={{
            backgroundColor: "#f8f9fa",
            padding: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#dee2e6",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Resumo da Compra
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 14, color: "#666" }}>
              Itens diferentes:
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>
              {produtosDiferentes}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 14, color: "#666" }}>
              Quantidade total:
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>
              {quantidadeTotal}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 14, color: "#666" }}>Valor total:</Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#28a745" }}
            >
              R$ {valorTotalNota.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Botão de Salvar */}
        <SubmitButton
          onPress={handleSubmit}
          disabled={loading.salvar}
          style={{
            opacity: loading.salvar ? 0.7 : 1,
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          {loading.salvar ? (
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
            {loading.salvar ? "Processando..." : "Salvar Compra"}
          </Text>
        </SubmitButton>
      </ScrollView>
    </Container>
  );
};

export default NewShop;
