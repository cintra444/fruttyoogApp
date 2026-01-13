import React, { useEffect, useState } from "react";
import {
  Modal,
  Alert,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
  View,
  Dimensions,
  ScrollView,
  Share,
} from "react-native";
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
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorText,
  FilterRow,
  ClearButton,
  ClearButtonText,
} from "./styles";
import {
  GetVenda,
  GetCliente,
  GetProducts,
  GetNotaVendaByVendaId,
} from "../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../Navigation/types";

const { width } = Dimensions.get("window");

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "HistorySale">;
};

interface Cliente {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
}

interface Produto {
  id: number;
  nome: string;
}

interface ItemVenda {
  id?: number;
  notaVendaId?: number;
  produtoId?: number;
  produtoNome?: string;
  produto: {
    id: number;
    nome?: string;
  };
  quantidade: number;
  valorUnitario: number;
  subTotal: number;
  subtotal?: number;
  vendaId?: number;
}

interface Venda {
  id: number;
  dataVenda: string;
  valorTotal: number;
  valorTotalPago: number;
  saldoDevedor: number;
  cliente: Cliente;
  itens: ItemVenda[];
  pagamentos?: Array<{
    formaPagamento: string;
    valor: number;
    status: string;
    dataPagamento?: string;
  }>;
}

const getNomeProduto = (item: ItemVenda, produtos: Produto[]): string => {
  console.log("Item:", item);
  console.log("Produto ID:", item.produto?.id);
  console.log("Produto nome direto:", item.produto?.nome);
  console.log("Total de produtos disponíveis:", produtos.length);

  if (!item) return "Produto não identificado";

  if (item.produtoNome && item.produtoNome.trim() !== "") {
    return item.produtoNome;
  }

  if (item.produto?.nome && item.produto?.nome.trim() !== "") {
    return item.produto.nome;
  }

  const produtoIdDireto = Number(item.produtoId);
  if (!isNaN(produtoIdDireto)) {
    const produtoEncontrado = produtos.find(
      (p) => Number(p.id) === produtoIdDireto
    );
    if (produtoEncontrado?.nome) {
      return produtoEncontrado.nome;
    }
  }
  const produtoIdNested = Number(item.produto?.id);
  if (!isNaN(produtoIdNested)) {
    const produtoEncontrado = produtos.find(
      (p) => Number(p.id) === produtoIdNested
    );
    if (produtoEncontrado?.nome) {
      return produtoEncontrado.nome;
    }
  }
  if (item.produtoId) {
    return `Produto #${item.produtoId}`;
  }

  return `Produto #${item.produto?.id ?? "N/I"}`;
};

const HistorySale: React.FC = () => {
  const navigation = useNavigation<Props["navigation"]>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [modalOpcoesVisible, setModalOpcoesVisible] = useState(false);
  const [modalNotaCompletaVisible, setModalNotaCompletaVisible] =
    useState(false);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const [clientesData, vendasData, produtosData, notaVendaData] =
        await Promise.all([
          GetCliente(),
          GetVenda(),
          GetProducts(),
          GetNotaVendaByVendaId(1),
        ]);

      if (clientesData) {
        setClientes(clientesData);
      }

      if (produtosData) {
        setProdutos(produtosData);
      }

      if (vendasData) {
        // Ordenar por data (mais recente primeiro)
        const vendasOrdenadas = vendasData.sort(
          (a: Venda, b: Venda) =>
            new Date(b.dataVenda).getTime() - new Date(a.dataVenda).getTime()
        );

        // Garantir que os valores numéricos são números válidos
        const vendasFormatadas = vendasOrdenadas.map((venda: Venda) => ({
          ...venda,
          valorTotal: Number(venda.valorTotal) || 0,
          valorTotalPago: Number(venda.valorTotalPago) || 0,
          saldoDevedor: Number(venda.saldoDevedor) || 0,
          itens:
            venda.itens?.map((item: ItemVenda) => ({
              ...item,
              valorUnitario: Number(item.valorUnitario) || 0,
              subTotal: Number(item.subTotal) || 0,
            })) || [],
        }));
        setVendas(vendasFormatadas);
        setVendasFiltradas(vendasFormatadas);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError(err?.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const carregarComRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const aplicarFiltros = () => {
    if (!filtroCliente && !filtroData && !filtroProduto) {
      setVendasFiltradas(vendas);
      setFiltroAtivo(false);
      return;
    }

    let filtradas = [...vendas];

    // Filtrar por cliente (nome ou ID)
    if (filtroCliente) {
      const clienteLower = filtroCliente.toLowerCase();
      filtradas = filtradas.filter((v) => {
        const clienteNome = v.cliente?.nome?.toLowerCase() || "";
        const clienteId = v.cliente?.id?.toString() || "";
        return (
          clienteNome.includes(clienteLower) ||
          clienteId.includes(filtroCliente)
        );
      });
    }

    // Filtrar por data
    if (filtroData) {
      filtradas = filtradas.filter((v) => {
        const dataVenda = new Date(v.dataVenda);
        const filtroDate = new Date(filtroData);

        // Comparar apenas dia, mês e ano
        return (
          dataVenda.getFullYear() === filtroDate.getFullYear() &&
          dataVenda.getMonth() === filtroDate.getMonth() &&
          dataVenda.getDate() === filtroDate.getDate()
        );
      });
    }

    // Filtrar por produto
    if (filtroProduto) {
      const produtoLower = filtroProduto.toLowerCase();

      filtradas = filtradas.filter((v) =>
        v.itens?.some((item) => {
          const nomeProduto = getNomeProduto(item, produtos).toLowerCase();
          return nomeProduto.includes(produtoLower);
        })
      );
    }

    setVendasFiltradas(filtradas);
    setFiltroAtivo(true);
  };

  const limparFiltros = () => {
    setFiltroCliente("");
    setFiltroData("");
    setFiltroProduto("");
    setVendasFiltradas(vendas);
    setFiltroAtivo(false);
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return dataString;

      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dataString;
    }
  };

  const formatarMoeda = (valor: number) => {
    const valorNumerico = Number(valor);
    if (
      isNaN(valorNumerico) ||
      valorNumerico === null ||
      valorNumerico === undefined
    ) {
      return "R$ 0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarDataSimples = (dataString: string) => {
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return dataString;

      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dataString;
    }
  };

  const abrirModalOpcoes = (venda: Venda) => {
    setSelectedVenda(venda);
    setModalOpcoesVisible(true);
  };

  const fecharModalOpcoes = () => {
    setModalOpcoesVisible(false);
    setSelectedVenda(null);
  };

  const abrirModalNotaCompleta = () => {
    setModalOpcoesVisible(false);
    setTimeout(() => {
      setModalNotaCompletaVisible(true);
    }, 100);
  };

  const fecharModalNotaCompleta = () => {
    setModalNotaCompletaVisible(false);
    setSelectedVenda(null);
  };

  const compartilharNota = async () => {
    if (!selectedVenda) return;

    try {
      const texto = criarTextoNota(selectedVenda);
      await Share.share({
        message: texto,
        title: `Nota da Venda #${selectedVenda.id}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar nota:", error);
      Alert.alert("Erro", "Não foi possível compartilhar a nota");
    }
  };

  const criarTextoNota = (venda: Venda): string => {
    const dataFormatada = formatarData(venda.dataVenda);

    let texto = "";
    texto += "🧾 *FRUTTYOOG – NOTA DE VENDA*\n";
    texto += "--------------------------------\n";
    texto += `📅 Data: ${dataFormatada}\n`;
    texto += `🧾 Venda Nº: ${venda.id}\n`;
    texto += `👤 Cliente: ${venda.cliente?.nome || "Consumidor Final"}\n`;
    texto += "--------------------------------\n";
    texto += "*📦 PRODUTOS*\n";

    venda.itens?.forEach((item, index) => {
      const nomeProduto = getNomeProduto(item, produtos);
      texto += `\n${index + 1}. ${nomeProduto}`;
      texto += `\n   Qtd: ${item.quantidade}`;
      texto += ` | Unit: ${formatarMoeda(item.valorUnitario)}`;
      texto += ` | Subtotal: ${formatarMoeda(item.subTotal)}\n`;
    });

    texto += "--------------------------------\n";
    texto += `💰 Total: ${formatarMoeda(venda.valorTotal)}\n`;
    texto += `💵 Pago: ${formatarMoeda(venda.valorTotalPago)}\n`;

    if (venda.saldoDevedor > 0) {
      texto += `❗ Saldo Devedor: ${formatarMoeda(venda.saldoDevedor)}\n`;
    } else {
      texto += "✅ Situação: QUITADA\n";
    }

    if (venda.pagamentos?.length) {
      texto += "--------------------------------\n";
      texto += "*💳 PAGAMENTOS*\n";
      venda.pagamentos.forEach((p) => {
        texto += `• ${p.formaPagamento}: ${formatarMoeda(p.valor)} (${p.status})\n`;
      });
    }

    texto += "--------------------------------\n";
    texto += "🙏 Obrigado pela preferência!\n";
    texto += "Fruttyoog © " + new Date().getFullYear() + "\n";

    return texto;
  };

  const visualizarDetalhes = () => {
    if (!selectedVenda) return;

    fecharModalOpcoes();

    setTimeout(() => {
      Alert.alert(
        `Detalhes da Venda #${selectedVenda.id}`,
        `Cliente: ${selectedVenda.cliente?.nome || "Não informado"}\n` +
          `Data: ${formatarData(selectedVenda.dataVenda)}\n` +
          `Total: ${formatarMoeda(selectedVenda.valorTotal)}\n` +
          `Pago: ${formatarMoeda(selectedVenda.valorTotalPago)}\n` +
          `Saldo: ${formatarMoeda(selectedVenda.saldoDevedor)}\n` +
          `Itens: ${selectedVenda.itens?.length || 0}\n` +
          `Pagamentos: ${selectedVenda.pagamentos?.length || 0}`,
        [
          {
            text: "OK",
            style: "default",
            onPress: () => {
              // Reabrir o modal depois que o Alert fecha
              setTimeout(() => {
                setModalOpcoesVisible(true);
              }, 100);
            },
          },
          {
            text: "Ver Nota Completa",
            onPress: () => {
              // Abrir a nota completa diretamente
              setTimeout(() => {
                setSelectedVenda(selectedVenda);
                setModalNotaCompletaVisible(true);
              }, 100);
            },
          },
        ]
      );
    }, 150);
  };

  const adicionarPagamento = () => {
    if (!selectedVenda) return;

    Alert.alert(
      "Adicionar Pagamento",
      `Deseja adicionar um pagamento para a venda #${selectedVenda.id}?\n\n` +
        `Cliente: ${selectedVenda.cliente?.nome || "Não informado"}\n` +
        `Saldo atual: ${formatarMoeda(selectedVenda.saldoDevedor)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => {
            fecharModalOpcoes();

            // Navegar para a tela de adicionar pagamento
            setTimeout(() => {
              navigation.navigate("AddPayment", {
                saleId: selectedVenda.id,
                customerId: selectedVenda.cliente?.id,
                customerName: selectedVenda.cliente?.nome,
                balance: selectedVenda.saldoDevedor,
                totalValue: selectedVenda.valorTotal,
              });
            }, 150);
          },
        },
      ]
    );
  };

  const renderStatusPagamento = (status: string) => {
    const statusUpper = status?.toUpperCase() || "PENDENTE";
    const cores: { [key: string]: string } = {
      PAGO: "#2ecc71",
      PENDENTE: "#f39c12",
      CANCELADO: "#e74c3c",
    };

    return (
      <View
        style={{
          backgroundColor: cores[statusUpper] || "#95a5a6",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
          {statusUpper}
        </Text>
      </View>
    );
  };

  const renderNotaCompleta = () => {
    if (!selectedVenda) return null;

    // Garantir que os valores são números válidos
    const valorTotal = Number(selectedVenda.valorTotal) || 0;
    const valorTotalPago = Number(selectedVenda.valorTotalPago) || 0;
    const saldoDevedor = Number(selectedVenda.saldoDevedor) || 0;

    return (
      <Modal
        visible={modalNotaCompletaVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={fecharModalNotaCompleta}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {/* HEADER */}
          <View
            style={{
              backgroundColor: "#3498db",
              paddingTop: 40,
              paddingBottom: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <TouchableOpacity
              onPress={fecharModalNotaCompleta}
              style={{ padding: 5 }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                ←
              </Text>
            </TouchableOpacity>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                NOTA DE VENDA
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 14,
                  marginTop: 2,
                }}
              >
                #{selectedVenda.id}
              </Text>
            </View>

            <TouchableOpacity onPress={compartilharNota} style={{ padding: 5 }}>
              <Text style={{ color: "white", fontSize: 20 }}>📤</Text>
            </TouchableOpacity>
          </View>

          {/* CONTEÚDO */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ padding: 20 }}>
              {/* CABEÇALHO */}
              <View style={{ alignItems: "center", marginBottom: 25 }}>
                <Text
                  style={{
                    fontSize: width < 400 ? 20 : 24,
                    fontWeight: "bold",
                    color: "#2c3e50",
                    textAlign: "center",
                  }}
                >
                  FRUTTYOOG DISTRIBUIDORA
                </Text>
                <Text
                  style={{
                    fontSize: width < 400 ? 14 : 16,
                    color: "#7f8c8d",
                    marginTop: 5,
                    textAlign: "center",
                  }}
                >
                  Vendas Domiciliar e Comerciais
                </Text>
              </View>

              {/* INFORMAÇÕES DA VENDA */}
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#7f8c8d" }}>Data</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#2c3e50",
                    }}
                  >
                    {formatarData(selectedVenda.dataVenda)}
                  </Text>
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{ fontSize: 14, color: "#7f8c8d", marginBottom: 3 }}
                  >
                    Cliente
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#2c3e50",
                    }}
                  >
                    {selectedVenda.cliente?.nome || "Não informado"}
                  </Text>
                </View>

                {selectedVenda.cliente?.telefone && (
                  <Text style={{ fontSize: 14, color: "#34495e" }}>
                    📞 {selectedVenda.cliente.telefone}
                  </Text>
                )}
              </View>

              {/* TABELA DE PRODUTOS */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#2c3e50",
                  marginBottom: 15,
                  paddingBottom: 5,
                  borderBottomWidth: 2,
                  borderBottomColor: "#3498db",
                }}
              >
                PRODUTOS ({selectedVenda.itens?.length || 0})
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 25,
                }}
              >
                {/* Cabeçalho da tabela */}
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#3498db",
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      flex: 3,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    Produto
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    Qtd
                  </Text>
                  <Text
                    style={{
                      flex: 1.5,
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "right",
                      fontSize: 14,
                    }}
                  >
                    Unitário
                  </Text>
                  <Text
                    style={{
                      flex: 1.5,
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "right",
                      fontSize: 14,
                    }}
                  >
                    Total
                  </Text>
                </View>

                {/* Linhas dos produtos */}
                {selectedVenda.itens?.map((item, index) => {
                  const produtoNome = getNomeProduto(item, produtos);
                  const valorUnitario = Number(item.valorUnitario) || 0;
                  const subTotal = Number(item.subTotal) || 0;

                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa",
                        borderTopWidth: 1,
                        borderTopColor: "#eee",
                      }}
                    >
                      <Text style={{ flex: 3, fontSize: 14 }} numberOfLines={1}>
                        {produtoNome}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {item.quantidade}
                      </Text>
                      <Text
                        style={{
                          flex: 1.5,
                          textAlign: "right",
                          fontSize: 14,
                        }}
                      >
                        {formatarMoeda(valorUnitario)}
                      </Text>
                      <Text
                        style={{
                          flex: 1.5,
                          textAlign: "right",
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#2c3e50",
                        }}
                      >
                        {formatarMoeda(subTotal)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* PAGAMENTOS */}
              {selectedVenda.pagamentos &&
                selectedVenda.pagamentos.length > 0 && (
                  <View style={{ marginBottom: 25 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#2c3e50",
                        marginBottom: 15,
                        paddingBottom: 5,
                        borderBottomWidth: 2,
                        borderBottomColor: "#3498db",
                      }}
                    >
                      PAGAMENTOS ({selectedVenda.pagamentos.length})
                    </Text>

                    {selectedVenda.pagamentos.map((pagamento, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: 15,
                          borderRadius: 8,
                          marginBottom: 10,
                          borderLeftWidth: 4,
                          borderLeftColor:
                            pagamento.status === "PAGO"
                              ? "#2ecc71"
                              : pagamento.status === "PENDENTE"
                                ? "#f39c12"
                                : "#e74c3c",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: "#2c3e50",
                              fontSize: 15,
                            }}
                          >
                            {pagamento.formaPagamento || "Pagamento"}
                          </Text>
                          {renderStatusPagamento(pagamento.status)}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "#34495e", fontSize: 15 }}>
                            Valor:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                              {formatarMoeda(pagamento.valor)}
                            </Text>
                          </Text>
                          {pagamento.dataPagamento && (
                            <Text style={{ fontSize: 13, color: "#7f8c8d" }}>
                              {formatarDataSimples(pagamento.dataPagamento)}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

              {/* RESUMO FINANCEIRO */}
              <View
                style={{
                  backgroundColor: "#2c3e50",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  RESUMO FINANCEIRO
                </Text>

                <View style={{ marginBottom: 15 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ color: "#ecf0f1", fontSize: 15 }}>
                      Total da Venda:
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {formatarMoeda(valorTotal)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ color: "#ecf0f1", fontSize: 15 }}>
                      Total Pago:
                    </Text>
                    <Text
                      style={{
                        color: "#2ecc71",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {formatarMoeda(valorTotalPago)}
                    </Text>
                  </View>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#7f8c8d",
                      marginVertical: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#ecf0f1",
                        fontSize: 17,
                        fontWeight: "bold",
                      }}
                    >
                      {selectedVenda.saldoDevedor > 0
                        ? "Saldo Devedor:"
                        : "Situação:"}
                    </Text>
                    <Text
                      style={{
                        color:
                          selectedVenda.saldoDevedor > 0
                            ? "#e74c3c"
                            : "#2ecc71",
                        fontSize: 19,
                        fontWeight: "bold",
                      }}
                    >
                      {selectedVenda.saldoDevedor > 0
                        ? formatarMoeda(saldoDevedor)
                        : "✅ QUITADA"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* BOTÕES DE AÇÃO */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={compartilharNota}
                  style={{
                    flex: 1,
                    backgroundColor: "#2ecc71",
                    padding: 16,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.5,
                  }}
                >
                  <Text style={{ fontSize: 18, marginRight: 8 }}>📤</Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Compartilhar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Imprimir", "Funcionalidade em desenvolvimento")
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#3498db",
                    padding: 16,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.5,
                  }}
                >
                  <Text style={{ fontSize: 18, marginRight: 8 }}>🖨️</Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Imprimir
                  </Text>
                </TouchableOpacity>
              </View>

              {/* RODAPÉ */}
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 20,
                  paddingBottom: 30,
                  borderTopWidth: 1,
                  borderTopColor: "#ddd",
                }}
              >
                <Text
                  style={{
                    color: "#7f8c8d",
                    fontSize: 14,
                    marginBottom: 5,
                  }}
                >
                  Fruttyoog © {new Date().getFullYear()}
                </Text>
                <Text
                  style={{
                    color: "#95a5a6",
                    fontSize: 12,
                  }}
                >
                  Sistema de Gestão Comercial
                </Text>
                <Text
                  style={{
                    color: "#bdc3c7",
                    fontSize: 10,
                    marginTop: 10,
                  }}
                >
                  Esta é uma via digital da nota de venda
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* BOTÃO VOLTAR NO FINAL */}
          <TouchableOpacity
            onPress={fecharModalNotaCompleta}
            style={{
              backgroundColor: "#7f8c8d",
              padding: 15,
              alignItems: "center",
              borderTopWidth: 1,
              borderTopColor: "#ddd",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Voltar ao Histórico
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  if (loading && !refreshing) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#3498db" />
        <LoadingText>Carregando histórico de vendas...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
        <Button onPress={carregarDados} style={{ marginTop: 20 }}>
          <ButtonText>Tentar Novamente</ButtonText>
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <Container
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={carregarComRefresh}
          colors={["#3498db"]}
          tintColor="#3498db"
        />
      }
    >
      <Title>Histórico de Vendas</Title>

      {/* Filtros */}
      <Section>
        <Label>Filtros</Label>

        <FilterRow>
          <View style={{ flex: 1 }}>
            <Label>Cliente</Label>
            <Input
              placeholder="Nome ou ID do cliente"
              value={filtroCliente}
              onChangeText={setFiltroCliente}
            />
          </View>
        </FilterRow>

        <FilterRow>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Label>Data</Label>
            <Input
              placeholder="AAAA-MM-DD"
              value={filtroData}
              onChangeText={setFiltroData}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Label>Produto</Label>
            <Input
              placeholder="Nome do produto"
              value={filtroProduto}
              onChangeText={setFiltroProduto}
            />
          </View>
        </FilterRow>

        <FilterRow>
          <Button onPress={aplicarFiltros} style={{ flex: 1, marginRight: 10 }}>
            <ButtonText>Aplicar Filtros</ButtonText>
          </Button>

          {filtroAtivo && (
            <ClearButton onPress={limparFiltros} style={{ flex: 1 }}>
              <ClearButtonText>Limpar Filtros</ClearButtonText>
            </ClearButton>
          )}
        </FilterRow>

        {filtroAtivo && (
          <Text
            style={{ marginTop: 10, color: "#3498db", textAlign: "center" }}
          >
            {vendasFiltradas.length} venda(s) encontrada(s)
          </Text>
        )}
      </Section>

      {/* Lista de Vendas */}
      {vendasFiltradas.length === 0 ? (
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ color: "#7f8c8d", textAlign: "center" }}>
            {filtroAtivo
              ? "Nenhuma venda encontrada com os filtros aplicados"
              : "Nenhuma venda registrada ainda"}
          </Text>
          {filtroAtivo && (
            <ClearButton onPress={limparFiltros} style={{ marginTop: 20 }}>
              <ClearButtonText>Limpar Filtros</ClearButtonText>
            </ClearButton>
          )}
        </View>
      ) : (
        <PurchaseList>
          {vendasFiltradas.map((venda) => (
            <PurchaseItem
              key={venda.id}
              onPress={() => abrirModalOpcoes(venda)}
            >
              <View style={{ flex: 1 }}>
                <PurchaseText style={{ fontWeight: "bold", fontSize: 16 }}>
                  Venda #{venda.id}
                </PurchaseText>
                <PurchaseText>
                  Cliente: {venda.cliente?.nome || "Não informado"}
                </PurchaseText>
                <PurchaseText>
                  Data: {formatarData(venda.dataVenda)}
                </PurchaseText>
                <PurchaseText style={{ fontWeight: "bold", marginTop: 5 }}>
                  Total: {formatarMoeda(venda.valorTotal)}
                </PurchaseText>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: venda.saldoDevedor > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "bold",
                    }}
                  >
                    {venda.saldoDevedor > 0 ? "Saldo: " : "Pago: "}
                    {formatarMoeda(
                      venda.saldoDevedor > 0
                        ? venda.saldoDevedor
                        : venda.valorTotalPago
                    )}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#7f8c8d", marginLeft: 10 }}
                  >
                    Itens: {venda.itens?.length || 0}
                  </Text>
                </View>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text style={{ color: "#3498db", fontWeight: "bold" }}>›</Text>
              </View>
            </PurchaseItem>
          ))}
        </PurchaseList>
      )}

      {/* Modal de Opções */}
      <Modal
        visible={modalOpcoesVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharModalOpcoes}
      >
        <ModalContent>
          <ModalTitle>Venda #{selectedVenda?.id}</ModalTitle>

          {selectedVenda && (
            <View style={{ marginBottom: 20, width: "100%" }}>
              <Text style={{ fontSize: 14, color: "#2c3e50", marginBottom: 5 }}>
                Cliente:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {selectedVenda.cliente?.nome}
                </Text>
              </Text>
              <Text style={{ fontSize: 14, color: "#2c3e50", marginBottom: 5 }}>
                Data: {formatarData(selectedVenda.dataVenda)}
              </Text>
              <Text style={{ fontSize: 14, color: "#2c3e50", marginBottom: 5 }}>
                Total:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {formatarMoeda(selectedVenda.valorTotal)}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: selectedVenda.saldoDevedor > 0 ? "#e74c3c" : "#27ae60",
                  fontWeight: "bold",
                }}
              >
                {selectedVenda.saldoDevedor > 0 ? "Saldo Devedor: " : "Pago: "}
                {formatarMoeda(
                  selectedVenda.saldoDevedor > 0
                    ? selectedVenda.saldoDevedor
                    : selectedVenda.valorTotalPago
                )}
              </Text>
            </View>
          )}

          {/* BOTÕES ORGANIZADOS VERTICALMENTE */}
          <ActionButtons>
            {/* Botão 1: Ver Detalhes */}
            <ActionButton onPress={visualizarDetalhes} bgColor="#3498db">
              <ActionText>📋 Ver Detalhes</ActionText>
            </ActionButton>

            {/* Botão 2: Nota Completa */}
            <ActionButton onPress={abrirModalNotaCompleta} bgColor="#2ecc71">
              <ActionText>📄 Nota Completa</ActionText>
            </ActionButton>

            {/* Botão 3: Adicionar Pagamento (apenas se tiver saldo) */}
            {selectedVenda && selectedVenda.saldoDevedor > 0 && (
              <ActionButton onPress={adicionarPagamento} bgColor="#f39c12">
                <ActionText>💰 Adicionar Pagamento</ActionText>
              </ActionButton>
            )}
          </ActionButtons>

          <CloseButton onPress={fecharModalOpcoes}>
            <CloseText>Fechar</CloseText>
          </CloseButton>

          {/* Botão para voltar a tela HistorySale */}
          <TouchableOpacity
            onPress={() => {
              fecharModalOpcoes();
              navigation.popToTop();
            }}
            style={{
              marginTop: 15,
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#3498db", fontWeight: "bold" }}>
              Ir para o início
            </Text>
          </TouchableOpacity>
        </ModalContent>
      </Modal>

      {/* MODAL DE NOTA COMPLETA (SUBSTITUI O INVOICE) */}
      {renderNotaCompleta()}
    </Container>
  );
};

export default HistorySale;
