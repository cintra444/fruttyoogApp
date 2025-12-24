import React, { useEffect, useState } from "react";
import {
  Modal,
  Alert,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import {
  Title,
  Container,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  PurchaseList,
  PurchaseItem,
  PurchaseText,
  ActionButtons,
  ActionButton,
  ActionText,
  ModalContent,
  ModalTitle,
  CloseButton,
  CloseText,
  FilterRow,
  DateButton,
  DateButtonText,
  StatsContainer,
  StatItem,
  StatLabel,
  StatValue,
  DetailItem,
  DetailLabel,
  DetailValue,
  SearchInput,
  FilterContainer,
  QuickFilterButton,
  QuickFilterText,
  FilterSection,
  FilterHeader,
  FilterToggle,
  StyledPicker,
  DateInput,
  QuickFilterContainer,
} from "./styles";
import {
  GetCompra,
  DeleteCompra,
  PutCompra,
  GetFornecedor,
  GetProducts,
  GetFornecedorById,
  GetCompraById,
} from "../../../../Services/apiFruttyoog";
import api from "../../../../Services/apiFruttyoog";

interface Fornecedor {
  id: number;
  nomeFantasia?: string;
  telefone?: string;
}

interface Produto {
  id: number;
  nome: string;
  categoria?: {
    id: number;
    nome?: string;
  };
}

interface Compra {
  id: number;
  dataCompra: string;
  valorTotal: number;
  fornecedorId: number;
  tipoCompra: string;
  tipoPagamento: string;
  observacao?: string;
  fornecedorNome?: string;
  itens?: Array<{
    produtoId: number;
    produtoNome: string;
    quantidade: number;
    precoUnitarioReal: number;
    total: number;
  }>;
  pagamentos?: Array<{
    tipo: string;
    valor: number;
    descricao?: string;
  }>;
}

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

const HistoryShop: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [comprasFiltradas, setComprasFiltradas] = useState<Compra[]>([]);
  const [loading, setLoading] = useState({
    principal: false,
    detalhes: false,
  });

  // Estados para filtros
  const [buscaRapida, setBuscaRapida] = useState("");
  const [filtroFornecedor, setFiltroFornecedor] = useState<number | null>(null);
  const [filtroProduto, setFiltroProduto] = useState<number | null>(null);
  const [filtroTipoCompra, setFiltroTipoCompra] = useState<TipoCompra | null>(
    null
  );
  const [filtroTipoPagamento, setFiltroTipoPagamento] =
    useState<TipoPagamento | null>(null);
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [
    buscaRapida,
    filtroFornecedor,
    filtroProduto,
    filtroTipoCompra,
    filtroTipoPagamento,
    filtroDataInicio,
    filtroDataFim,
    compras,
  ]);

  const carregarDados = async () => {
    setLoading((prev) => ({ ...prev, principal: true }));
    try {
      await Promise.all([
        carregarFornecedores(),
        carregarProdutos(),
        listarTodas(),
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading((prev) => ({ ...prev, principal: false }));
    }
  };

  const carregarFornecedores = async () => {
    try {
      const data = await GetFornecedor();
      if (data && Array.isArray(data)) {
        const fornecedoresOrdenados: typeof data = data.sort((a, b) =>
          a.nomeFantasia.localeCompare(b.nomeFantasia, "pt-BR", {
            sensitivity: "base",
          })
        );
        setFornecedores(fornecedoresOrdenados);
      }
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const data = await GetProducts();
      if (data && Array.isArray(data)) {
        const produtosOrdenados: typeof data = data.sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR", {
            sensitivity: "base",
          })
        );
        setProdutos(produtosOrdenados);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const listarTodas = async () => {
    try {
      const data = await GetCompra();
      if (data && Array.isArray(data)) {
        const comprasComFornecedor = data.map((compra: any) => {
          const fornecedor = fornecedores.find(
            (f) => f.id === compra.fornecedorId
          );
          return {
            ...compra,
            valorTotal: compra.valorNota || compra.valorTotal,
            observacao: compra.observacoes || compra.observacao,
            fornecedorNome: fornecedor ? fornecedor.nomeFantasia : "",
          };
        });
        const comprasOrdenadas = [...comprasComFornecedor].sort((a, b) => {
          const dataA = new Date(a.dataCompra);
          const dataB = new Date(b.dataCompra);
          if (dataB.getTime() !== dataA.getTime()) {
            return dataB.getTime() - dataA.getTime();
          }
          return b.id - a.id;
        });

        setCompras(comprasOrdenadas);
      }
    } catch (error) {
      console.error("Erro ao carregar compras:", error);
      Alert.alert("Erro", "Não foi possível carregar as compras");
    }
  };

  //recarregar quando mudar o fornecedor
  useEffect(() => {
    if (fornecedores.length > 0 && compras.length > 0) {
      const comprasAtualizadas = compras.map((compra) => {
        const fornecedor = fornecedores.find(
          (f) => f.id === compra.fornecedorId
        );
        return {
          ...compra,
          fornecedorNome: fornecedor
            ? fornecedor.nomeFantasia || "Fornecedor desconhecido"
            : "Fornecedor não encontrado",
        };
      });
      setCompras(comprasAtualizadas);
    }
  }, [fornecedores, compras]);

  const aplicarFiltros = () => {
    let filtradas = [...compras];

    // Filtro por busca rápida
    if (buscaRapida.trim() !== "") {
      const termo = buscaRapida.toLowerCase().trim();
      filtradas = filtradas.filter(
        (compra) =>
          compra.id.toString().includes(termo) ||
          compra.fornecedorNome?.toLowerCase().includes(termo) ||
          compra.tipoCompra.toLowerCase().includes(termo) ||
          compra.tipoPagamento.toLowerCase().includes(termo) ||
          compra.observacao?.toLowerCase().includes(termo)
      );
    }

    // Filtro por fornecedor
    if (filtroFornecedor) {
      filtradas = filtradas.filter(
        (compra) => compra.fornecedorId === filtroFornecedor
      );
    }

    // Filtro por produto (se houver detalhes dos itens)
    if (filtroProduto && selectedCompra?.itens) {
      filtradas = filtradas.filter((compra) =>
        compra.itens?.some((item) => item.produtoId === filtroProduto)
      );
    }

    // Filtro por tipo de compra
    if (filtroTipoCompra) {
      filtradas = filtradas.filter(
        (compra) => compra.tipoCompra === filtroTipoCompra
      );
    }

    // Filtro por tipo de pagamento
    if (filtroTipoPagamento) {
      filtradas = filtradas.filter(
        (compra) => compra.tipoPagamento === filtroTipoPagamento
      );
    }

    // Filtro por data
    if (filtroDataInicio) {
      filtradas = filtradas.filter(
        (compra) => new Date(compra.dataCompra) >= new Date(filtroDataInicio)
      );
    }

    if (filtroDataFim) {
      filtradas = filtradas.filter(
        (compra) =>
          new Date(compra.dataCompra) <= new Date(filtroDataFim + "T23:59:59")
      );
    }

    setComprasFiltradas(filtradas);
  };

  const limparFiltros = () => {
    setBuscaRapida("");
    setFiltroFornecedor(null);
    setFiltroProduto(null);
    setFiltroTipoCompra(null);
    setFiltroTipoPagamento(null);
    setFiltroDataInicio("");
    setFiltroDataFim("");
  };

  const aplicarFiltroRapido = (tipo: string) => {
    const hoje = new Date();

    switch (tipo) {
      case "hoje":
        const hojeISO = new Date().toISOString().split("T")[0];
        setFiltroDataInicio(hojeISO);
        setFiltroDataFim(hojeISO);
        break;

      case "semana":
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        const fimSemana = new Date(hoje);
        fimSemana.setDate(hoje.getDate() + (6 - hoje.getDay()));
        setFiltroDataInicio(inicioSemana.toISOString().split("T")[0]);
        setFiltroDataFim(fimSemana.toISOString().split("T")[0]);
        break;

      case "mes":
        const dataAtual = new Date();
        const primeiroDia = new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth(),
          1
        )
          .toISOString()
          .split("T")[0];
        const ultimoDia = new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth() + 1,
          0
        )
          .toISOString()
          .split("T")[0];
        setFiltroDataInicio(primeiroDia);
        setFiltroDataFim(ultimoDia);
        break;

      case "fiado":
        setFiltroTipoPagamento("FIADO");
        break;
      case "dinheiro":
        setFiltroTipoPagamento("DINHEIRO");
        break;
      case "pix":
        setFiltroTipoPagamento("PIX");
        break;
      case "cartao":
        setFiltroTipoPagamento("CREDITO");
        break;
      case "boleto":
        setFiltroTipoPagamento("BOLETO");
        break;
      case "transferencia":
        setFiltroTipoPagamento("TRANSFERENCIA");
        break;
      case "cheque":
        setFiltroTipoPagamento("CHEQUE");
        break;
      case "debito":
        setFiltroTipoPagamento("DEBITO");
        break;
      case "credito":
        setFiltroTipoPagamento("CREDITO");
        break;
      case "outros":
        setFiltroTipoPagamento("OUTROS");
        break;

      case "nota_fiscal":
        setFiltroTipoCompra("NOTA_FISCAL");
        break;
      case "mei":
        setFiltroTipoCompra("MEI");
        break;
      case "branca":
        setFiltroTipoCompra("BRANCA");
        break;
    }
    setMostrarFiltros(true);
  };
  const formatarDataInput = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    }
    return text;
  };

  const abrirModal = async (compra: Compra) => {
    setSelectedCompra(compra);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setSelectedCompra(null);
    setModalVisible(false);
  };

  const carregarDetalhesCompra = async (
    compraId: number
  ): Promise<Compra | null> => {
    try {
      const response = await api.get<Compra>(`/compra/${compraId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar detalhes da compra:", error);
      return null;
    }
  };

  const formatarData = (data: string) => {
    try {
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    } catch {
      return data;
    }
  };

  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2)}`;
  };

  // Estatísticas
  const totalCompras = comprasFiltradas.length;
  const valorTotal = comprasFiltradas.reduce(
    (sum, compra) => sum + compra.valorTotal,
    0
  );
  const valorMedio = totalCompras > 0 ? valorTotal / totalCompras : 0;

  // Filtros mais usados
  const filtrosRapidos = [
    { id: "hoje", label: "Hoje", icon: "calendar-today", color: "#2196f3" },
    {
      id: "semana",
      label: "Esta Semana",
      icon: "calendar-week",
      color: "#2196f3",
    },
    { id: "mes", label: "Este Mês", icon: "calendar-month", color: "#2196f3" },
    {
      id: "fiado",
      label: "Fiado",
      icon: "credit-card-clock",
      color: "#ff9800",
    },
    { id: "dinheiro", label: "Dinheiro", icon: "cash", color: "#4caf50" },
    { id: "pix", label: "PIX", icon: "qrcode-scan", color: "#9c27b0" },
    { id: "cartao", label: "Cartão", icon: "credit-card", color: "#f44336" },
    { id: "boleto", label: "Boleto", icon: "file-document", color: "#3f51b5" },
    {
      id: "transferencia",
      label: "Transferência",
      icon: "transfer",
      color: "#00bcd4",
    },
    { id: "cheque", label: "Cheque", icon: "bank", color: "#795548" },
    {
      id: "debito",
      label: "Débito",
      icon: "credit-card-chip",
      color: "#e91e63",
    },
    {
      id: "credito",
      label: "Crédito",
      icon: "credit-card-plus",
      color: "#ff5722",
    },
    {
      id: "outros",
      label: "Outros",
      icon: "dots-horizontal",
      color: "#607d8b",
    },
    {
      id: "nota_fiscal",
      label: "Nota Fiscal",
      icon: "file-document",
      color: "#4caf50",
    },
    {
      id: "mei",
      label: "MEI",
      icon: "file-document-outline",
      color: "#2196f3",
    },
    {
      id: "branca",
      label: "Branca",
      icon: "file-document-outline",
      color: "#ff9800",
    },
  ];

  return (
    <Container>
      {loading.principal ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Carregando histórico...
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={true}>
          <Title>Histórico de Compras</Title>

          {/* Estatísticas Rápidas */}
          <StatsContainer>
            <StatItem>
              <StatLabel>Total de Compras</StatLabel>
              <StatValue>{totalCompras}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Valor Total</StatLabel>
              <StatValue>{formatarMoeda(valorTotal)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Valor Médio</StatLabel>
              <StatValue>{formatarMoeda(valorMedio)}</StatValue>
            </StatItem>
          </StatsContainer>

          {/* Filtros Rápidos */}
          <FilterSection>
            <FilterHeader>
              <Label>Filtros Rápidos</Label>
              <TouchableOpacity
                onPress={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <FilterToggle>
                  <Icon
                    name={mostrarFiltros ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6200ee"
                  />
                  <Text style={{ color: "#6200ee", marginLeft: 5 }}>
                    {mostrarFiltros ? "Menos opções" : "Mais opções"}
                  </Text>
                </FilterToggle>
              </TouchableOpacity>
            </FilterHeader>

            {/* Container para filtros rápidos com altura fixa */}
            <QuickFilterContainer>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 5 }}
              >
                {filtrosRapidos.map((filtro) => (
                  <QuickFilterButton
                    key={filtro.id}
                    onPress={() => aplicarFiltroRapido(filtro.id)}
                    style={{
                      backgroundColor: filtro.color + "15", // 15 = 8% opacity
                      borderColor: filtro.color,
                      marginRight: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      height: 36,
                      minWidth: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name={filtro.icon} size={14} color={filtro.color} />
                    <QuickFilterText
                      style={{ color: filtro.color, fontSize: 11 }}
                    >
                      {filtro.label}
                    </QuickFilterText>
                  </QuickFilterButton>
                ))}
              </ScrollView>
            </QuickFilterContainer>
            {/* Busca Rápida */}
            <View style={{ marginTop: 15 }}>
              <Label>Busca Rápida</Label>
              <SearchInput
                placeholder="🔍 Buscar por ID, fornecedor, tipo..."
                value={buscaRapida}
                onChangeText={setBuscaRapida}
              />
            </View>

            {/* Filtros Avançados (expandíveis) */}
            {mostrarFiltros && (
              <FilterContainer>
                {/* Fornecedor - Picker */}
                <View style={{ marginBottom: 15 }}>
                  <Label>Fornecedor</Label>
                  <StyledPicker
                    selectedValue={filtroFornecedor}
                    onValueChange={(itemValue) =>
                      setFiltroFornecedor(itemValue as number | null)
                    }
                  >
                    <Picker.Item label="Todos os fornecedores" value={null} />
                    {fornecedores.map((fornecedor) => (
                      <Picker.Item
                        key={fornecedor.id}
                        label={
                          fornecedor.nomeFantasia || "Fornecedor desconhecido"
                        }
                        value={fornecedor.id}
                      />
                    ))}
                  </StyledPicker>
                </View>

                <FilterRow>
                  {/* Tipo de Compra - Picker */}
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Label>Tipo de Compra</Label>
                    <StyledPicker
                      selectedValue={filtroTipoCompra}
                      onValueChange={(itemValue) =>
                        setFiltroTipoCompra(itemValue as TipoCompra | null)
                      }
                    >
                      <Picker.Item label="Todos os tipos" value={null} />
                      <Picker.Item label="MEI" value="MEI" />
                      <Picker.Item label="Nota Fiscal" value="NOTA_FISCAL" />
                      <Picker.Item label="Branca" value="BRANCA" />
                    </StyledPicker>
                  </View>

                  {/* Tipo de Pagamento - Picker */}
                  <View style={{ flex: 1 }}>
                    <Label>Tipo de Pagamento</Label>
                    <StyledPicker
                      selectedValue={filtroTipoPagamento}
                      onValueChange={(itemValue) =>
                        setFiltroTipoPagamento(
                          itemValue as TipoPagamento | null
                        )
                      }
                    >
                      <Picker.Item label="Todos os tipos" value={null} />
                      <Picker.Item label="Dinheiro" value="DINHEIRO" />
                      <Picker.Item label="PIX" value="PIX" />
                      <Picker.Item label="Boleto" value="BOLETO" />
                      <Picker.Item
                        label="Transferência"
                        value="TRANSFERENCIA"
                      />
                      <Picker.Item label="Cartão de Crédito" value="CREDITO" />
                      <Picker.Item label="Cartão de Débito" value="DEBITO" />
                      <Picker.Item label="Fiado" value="FIADO" />
                      <Picker.Item label="A Prazo" value="A_PRAZO" />
                      <Picker.Item label="Outros" value="OUTROS" />
                    </StyledPicker>
                  </View>
                </FilterRow>

                {/* Produto - Picker */}
                <View style={{ marginBottom: 15 }}>
                  <Label>Produto</Label>
                  <StyledPicker
                    selectedValue={filtroProduto}
                    onValueChange={(itemValue) =>
                      setFiltroProduto(itemValue as number | null)
                    }
                  >
                    <Picker.Item label="Todos os produtos" value={null} />
                    {produtos.map((produto) => (
                      <Picker.Item
                        key={produto.id}
                        label={produto.nome}
                        value={produto.id}
                      />
                    ))}
                  </StyledPicker>
                </View>

                {/* Datas */}
                <FilterRow>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Label>Data Início</Label>
                    <DateInput
                      placeholder="AAAA-MM-DD"
                      value={filtroDataInicio}
                      onChangeText={(text) =>
                        setFiltroDataInicio(formatarDataInput(text))
                      }
                      maxLength={10}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Label>Data Fim</Label>
                    <DateInput
                      placeholder="AAAA-MM-DD"
                      value={filtroDataFim}
                      onChangeText={(text) =>
                        setFiltroDataFim(formatarDataInput(text))
                      }
                      maxLength={10}
                      keyboardType="numeric"
                    />
                  </View>
                </FilterRow>

                {/* Botões de Ação */}
                <FilterRow style={{ marginTop: 20 }}>
                  <Button
                    onPress={limparFiltros}
                    bgColor="#6c757d"
                    style={{ flex: 1, marginRight: 10, height: 45 }}
                  >
                    <ButtonText>Limpar Filtros</ButtonText>
                  </Button>
                  <Button
                    onPress={listarTodas}
                    bgColor="#4caf50"
                    style={{ flex: 1, height: 45 }}
                  >
                    <ButtonText>Recarregar</ButtonText>
                  </Button>
                </FilterRow>
              </FilterContainer>
            )}
          </FilterSection>

          {/* Resumo de Filtros Ativos */}
          {(filtroFornecedor ||
            filtroTipoCompra ||
            filtroTipoPagamento ||
            filtroProduto ||
            filtroDataInicio ||
            filtroDataFim) && (
            <View
              style={{
                backgroundColor: "#e3f2fd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
                borderLeftWidth: 4,
                borderLeftColor: "#2196f3",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#1565c0",
                  marginBottom: 8,
                }}
              >
                Filtros Ativos:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {filtroFornecedor && (
                  <View
                    style={{
                      backgroundColor: "#bbdefb",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="store" size={12} color="#0d47a1" />
                    <Text
                      style={{ fontSize: 12, color: "#0d47a1", marginLeft: 4 }}
                    >
                      {fornecedores.find((f) => f.id === filtroFornecedor)
                        ?.nomeFantasia || "Fornecedor nao encontrado"}
                    </Text>
                  </View>
                )}
                {filtroTipoCompra && (
                  <View
                    style={{
                      backgroundColor: "#c8e6c9",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="file-document" size={12} color="#1b5e20" />
                    <Text
                      style={{ fontSize: 12, color: "#1b5e20", marginLeft: 4 }}
                    >
                      {filtroTipoCompra}
                    </Text>
                  </View>
                )}
                {filtroTipoPagamento && (
                  <View
                    style={{
                      backgroundColor: "#fff9c4",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="credit-card" size={12} color="#f57f17" />
                    <Text
                      style={{ fontSize: 12, color: "#f57f17", marginLeft: 4 }}
                    >
                      {filtroTipoPagamento}
                    </Text>
                  </View>
                )}
                {filtroProduto && (
                  <View
                    style={{
                      backgroundColor: "#f3e5f5",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="package-variant" size={12} color="#7b1fa2" />
                    <Text
                      style={{ fontSize: 12, color: "#7b1fa2", marginLeft: 4 }}
                    >
                      {produtos.find((p) => p.id === filtroProduto)?.nome}
                    </Text>
                  </View>
                )}
                {filtroDataInicio && (
                  <View
                    style={{
                      backgroundColor: "#e1f5fe",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="calendar-start" size={12} color="#0277bd" />
                    <Text
                      style={{ fontSize: 12, color: "#0277bd", marginLeft: 4 }}
                    >
                      De: {filtroDataInicio}
                    </Text>
                  </View>
                )}
                {filtroDataFim && (
                  <View
                    style={{
                      backgroundColor: "#e1f5fe",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="calendar-end" size={12} color="#0277bd" />
                    <Text
                      style={{ fontSize: 12, color: "#0277bd", marginLeft: 4 }}
                    >
                      Até: {filtroDataFim}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={limparFiltros}
                style={{ alignSelf: "flex-end", marginTop: 8 }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#1976d2",
                    textDecorationLine: "underline",
                  }}
                >
                  Limpar todos
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de Compras */}
          <Label>
            {comprasFiltradas.length === compras.length
              ? `Todas as compras (${compras.length})`
              : `Compras encontradas: ${comprasFiltradas.length} de ${compras.length}`}
          </Label>

          <PurchaseList>
            {comprasFiltradas.map((compra) => (
              <PurchaseItem key={compra.id} onPress={() => abrirModal(compra)}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <PurchaseText
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#333",
                      }}
                    >
                      #{compra.id} • {formatarMoeda(compra.valorTotal)}
                    </PurchaseText>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      <Icon name="calendar" size={14} color="#666" />
                      <PurchaseText style={{ marginLeft: 6, fontSize: 13 }}>
                        {formatarData(compra.dataCompra)}
                      </PurchaseText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <Icon name="store" size={14} color="#666" />
                      <PurchaseText
                        style={{ marginLeft: 6, fontSize: 13, flex: 1 }}
                      >
                        {compra.fornecedorNome}
                      </PurchaseText>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor:
                        compra.tipoCompra === "NOTA_FISCAL"
                          ? "#4caf50"
                          : compra.tipoCompra === "MEI"
                            ? "#2196f3"
                            : "#ff9800",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {compra.tipoCompra}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: "#f0f0f0",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="credit-card" size={12} color="#666" />
                    <PurchaseText style={{ marginLeft: 4, fontSize: 12 }}>
                      {compra.tipoPagamento}
                    </PurchaseText>
                  </View>
                  {compra.observacao && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="note-text" size={12} color="#666" />
                      <PurchaseText
                        style={{ marginLeft: 4, fontSize: 12, color: "#666" }}
                      >
                        Tem observação
                      </PurchaseText>
                    </View>
                  )}
                </View>
              </PurchaseItem>
            ))}
          </PurchaseList>

          {comprasFiltradas.length === 0 && (
            <View style={{ alignItems: "center", padding: 40, marginTop: 20 }}>
              <Icon name="magnify" size={60} color="#e0e0e0" />
              <Text
                style={{
                  color: "#666",
                  fontSize: 16,
                  marginTop: 15,
                  fontWeight: "500",
                }}
              >
                Nenhuma compra encontrada
              </Text>
              {compras.length > 0 && (
                <Text
                  style={{
                    color: "#999",
                    fontSize: 13,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Tente ajustar os filtros ou termos de busca
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      )}
      {/* Modal de Detalhes */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "90%",
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: "100%" }}
            >
              <View style={{ padding: 20 }}>
                {/* Cabeçalho do Modal */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    paddingBottom: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#e0e0e0",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: "#333",
                    }}
                  >
                    Compra #{selectedCompra?.id} - Detalhes
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      backgroundColor: "#f5f5f5",
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="close" size={22} color="#666" />
                  </TouchableOpacity>
                </View>

                {loading.detalhes ? (
                  <View style={{ padding: 30, alignItems: "center" }}>
                    <ActivityIndicator size="small" color="#6200ee" />
                    <Text style={{ marginTop: 15, color: "#666" }}>
                      Carregando detalhes...
                    </Text>
                  </View>
                ) : (
                  selectedCompra && (
                    <View style={{ marginBottom: 20 }}>
                      {/* Informações básicas */}
                      <View
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: 16,
                          borderRadius: 10,
                          marginBottom: 20,
                          borderWidth: 1,
                          borderColor: "#e0e0e0",
                        }}
                      >
                        {/* Fornecedor */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 15,
                            paddingBottom: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: "#e0e0e0",
                          }}
                        >
                          <Icon
                            name="store"
                            size={20}
                            color="#6200ee"
                            style={{ marginRight: 10 }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#666",
                                marginBottom: 3,
                              }}
                            >
                              Fornecedor
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#333",
                              }}
                            >
                              {selectedCompra.fornecedorNome}
                            </Text>
                          </View>
                        </View>

                        {/* Data e Valor */}
                        <View
                          style={{ flexDirection: "row", marginBottom: 15 }}
                        >
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                              }}
                            >
                              <Icon
                                name="calendar"
                                size={16}
                                color="#666"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={{ fontSize: 13, color: "#666" }}>
                                Data
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                                color: "#333",
                              }}
                            >
                              {formatarData(selectedCompra.dataCompra)}
                            </Text>
                          </View>

                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                              }}
                            >
                              <Icon
                                name="currency-usd"
                                size={16}
                                color="#666"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={{ fontSize: 13, color: "#666" }}>
                                Valor Total
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "bold",
                                color: "#28a745",
                              }}
                            >
                              {formatarMoeda(selectedCompra.valorTotal)}
                            </Text>
                          </View>
                        </View>

                        {/* Tipo e Pagamento */}
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                              }}
                            >
                              <Icon
                                name="file-document"
                                size={16}
                                color="#666"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={{ fontSize: 13, color: "#666" }}>
                                Tipo
                              </Text>
                            </View>
                            <View
                              style={{
                                backgroundColor:
                                  selectedCompra.tipoCompra === "NOTA_FISCAL"
                                    ? "#4caf50"
                                    : selectedCompra.tipoCompra === "MEI"
                                      ? "#2196f3"
                                      : "#ff9800",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 4,
                                alignSelf: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 12,
                                  fontWeight: "500",
                                }}
                              >
                                {selectedCompra.tipoCompra}
                              </Text>
                            </View>
                          </View>

                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                              }}
                            >
                              <Icon
                                name="credit-card"
                                size={16}
                                color="#666"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={{ fontSize: 13, color: "#666" }}>
                                Pagamento
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                                color: "#333",
                              }}
                            >
                              {selectedCompra.tipoPagamento}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Observações (se houver) */}
                      {selectedCompra.observacao && (
                        <View
                          style={{
                            backgroundColor: "#fff3cd",
                            padding: 15,
                            borderRadius: 10,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: "#ffc107",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 10,
                            }}
                          >
                            <Icon name="note-text" size={18} color="#856404" />
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 15,
                                color: "#856404",
                                marginLeft: 8,
                              }}
                            >
                              Observações
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#856404",
                              lineHeight: 20,
                            }}
                          >
                            {selectedCompra.observacao}
                          </Text>
                        </View>
                      )}

                      {/* Seção de Itens da Compra */}
                      {selectedCompra.itens &&
                      selectedCompra.itens.length > 0 ? (
                        <View style={{ marginBottom: 25 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 15,
                              paddingBottom: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "#e0e0e0",
                            }}
                          >
                            <Icon
                              name="package-variant"
                              size={20}
                              color="#6200ee"
                              style={{ marginRight: 10 }}
                            />
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 16,
                                color: "#333",
                              }}
                            >
                              Itens da Compra ({selectedCompra.itens.length})
                            </Text>
                          </View>

                          {selectedCompra.itens.map((item, index) => (
                            <View
                              key={index}
                              style={{
                                backgroundColor: "#fff",
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: "#e0e0e0",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <View style={{ flex: 1 }}>
                                  <Text
                                    style={{
                                      fontWeight: "600",
                                      fontSize: 15,
                                      color: "#333",
                                      marginBottom: 8,
                                    }}
                                  >
                                    {item.produtoNome}
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: 4,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 13,
                                        color: "#666",
                                        width: 100,
                                      }}
                                    >
                                      Quantidade:
                                    </Text>
                                    <Text
                                      style={{
                                        fontWeight: "500",
                                        fontSize: 13,
                                      }}
                                    >
                                      {item.quantidade}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 13,
                                        color: "#666",
                                        width: 100,
                                      }}
                                    >
                                      Preço Unitário:
                                    </Text>
                                    <Text
                                      style={{
                                        fontWeight: "500",
                                        fontSize: 13,
                                      }}
                                    >
                                      {formatarMoeda(item.precoUnitarioReal)}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    backgroundColor: "#28a745",
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderRadius: 6,
                                    minWidth: 80,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: 15,
                                      color: "white",
                                    }}
                                  >
                                    {formatarMoeda(item.total)}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: "rgba(255,255,255,0.9)",
                                      marginTop: 2,
                                    }}
                                  >
                                    Total
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: 15,
                            borderRadius: 8,
                            marginBottom: 20,
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            name="package-variant-closed"
                            size={24}
                            color="#999"
                          />
                          <Text
                            style={{
                              color: "#666",
                              marginTop: 8,
                              fontSize: 14,
                            }}
                          >
                            Nenhum item disponível para esta compra
                          </Text>
                        </View>
                      )}

                      {/* Seção de Pagamentos */}
                      {selectedCompra.pagamentos &&
                      selectedCompra.pagamentos.length > 0 ? (
                        <View style={{ marginBottom: 25 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 15,
                              paddingBottom: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "#e0e0e0",
                            }}
                          >
                            <Icon
                              name="cash-multiple"
                              size={20}
                              color="#4CAF50"
                              style={{ marginRight: 10 }}
                            />
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 16,
                                color: "#333",
                              }}
                            >
                              Pagamentos ({selectedCompra.pagamentos.length})
                            </Text>
                          </View>

                          {selectedCompra.pagamentos.map((pagamento, index) => (
                            <View
                              key={index}
                              style={{
                                backgroundColor: "#e8f5e9",
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 10,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <View
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 14,
                                      backgroundColor: "#4CAF50",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      marginRight: 10,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                      }}
                                    >
                                      {index + 1}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text
                                      style={{
                                        fontWeight: "600",
                                        fontSize: 15,
                                        color: "#333",
                                      }}
                                    >
                                      {pagamento.tipo}
                                    </Text>
                                    {pagamento.descricao && (
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          color: "#666",
                                          marginTop: 2,
                                        }}
                                      >
                                        {pagamento.descricao}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    color: "#2E7D32",
                                  }}
                                >
                                  {formatarMoeda(pagamento.valor)}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: 15,
                            borderRadius: 8,
                            marginBottom: 20,
                            alignItems: "center",
                          }}
                        >
                          <Icon name="cash-remove" size={24} color="#999" />
                          <Text
                            style={{
                              color: "#666",
                              marginTop: 8,
                              fontSize: 14,
                            }}
                          >
                            Nenhum pagamento disponível para esta compra
                          </Text>
                        </View>
                      )}
                    </View>
                  )
                )}

                {/* Botão de Fechar */}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: "#6200ee",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Fechar Detalhes
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default HistoryShop;
