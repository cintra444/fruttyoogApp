// SalesReport.tsx - Versão corrigida para sua API
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  Alert,
} from "react-native";
import {
  Container,
  Title,
  Card,
  CardTitle,
  CardContent,
  FilterContainer,
  DateInput,
  Button,
  ButtonText,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  SectionTitle,
  Row,
  LoaderContainer,
  NoDataText,
  InfoContainer,
  InfoText,
} from "./styles";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { GetVenda, VendaResponse } from "../../../../Services/apiFruttyoog";

/* =======================
   TIPAGENS
======================= */

// Interfaces baseadas no JSON que você compartilhou
interface ItemVenda {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
  vendaId: number;
  notaVendaId: number;
}

interface Cliente {
  id: number;
  codigoCliente: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  referencia: string;
  tipoCliente: "REVENDEDOR" | "FINAL";
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: "ADMIN" | string;
}

interface FormaPagamento {
  // Objeto vazio no exemplo
  [key: string]: any;
}

interface Pagamento {
  id: number;
  clienteId: number;
  formaPagamento: FormaPagamento;
  vendaId: number;
  dataPagamento: string;
  valor: number;
  status: "PENDENTE" | "PAGO" | "CANCELADO";
  criadoEm: string;
  atualizadoEm: string;
}

interface Venda {
  id: number;
  dataVenda: string;
  valorTotal: number;
  valorTotalPago: number;
  saldoDevedor: number;
  cliente: Cliente;
  usuario: Usuario;
  itens: ItemVenda[];
  pagamentos: Pagamento[];
  formasPagamento: FormaPagamento[];
}

type TimeRange = "hoje" | "semana" | "mes" | "ano" | "todos";

const paymentLabelMap: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  CREDITO: "Cartão de Crédito",
  DEBITO: "Cartão de Débito",
  A_PRAZO: "A Prazo",
  FIADO: "Fiado",
  TRANSFERENCIA: "Transferência",
  BOLETO: "Boleto",
  CHEQUE: "Cheque",
  OUTROS: "Outros",
};

/* =======================
   COMPONENTE
======================= */

const SalesReport: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [filteredVendas, setFilteredVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("mes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* =======================
     CARREGAMENTO
  ======================= */

  const loadData = async () => {
    try {
      setLoading(true);
      const data = (await GetVenda()) as any;

      console.log("Dados recebidos da API:", data);

      if (data && Array.isArray(data)) {
        setVendas(data);
        applyTimeFilter(data, timeRange);
        setError(null);
      } else {
        // Se a API retornar null ou undefined
        setVendas([]);
        setFilteredVendas([]);
        setError("Nenhum dado de venda encontrado");
      }
    } catch (e) {
      console.error("Erro ao carregar vendas:", e);
      setError("Erro ao buscar vendas. Tente novamente.");
      setVendas([]);
      setFilteredVendas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyTimeFilter = (data: Venda[], range: TimeRange) => {
    const now = new Date();
    let filtered = [...data];

    switch (range) {
      case "hoje": {
        const today = now.toDateString();
        filtered = data.filter(
          (v) => new Date(v.dataVenda).toDateString() === today
        );
        break;
      }
      case "semana": {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = data.filter((v) => new Date(v.dataVenda) >= weekAgo);
        break;
      }
      case "mes": {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = data.filter((v) => new Date(v.dataVenda) >= monthAgo);
        break;
      }
      case "ano": {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        filtered = data.filter((v) => new Date(v.dataVenda) >= yearAgo);
        break;
      }
      case "todos":
      default:
        filtered = data;
    }

    setFilteredVendas(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (vendas.length > 0) {
      applyTimeFilter(vendas, timeRange);
    }
  }, [timeRange, vendas]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  /* =======================
     RESUMO GERAL
  ======================= */

  const resumo = useMemo(() => {
    return vendas.reduce(
      (acc, venda) => {
        acc.faturamento += venda.valorTotal || 0;
        acc.recebido += venda.valorTotalPago || 0;
        acc.saldo += venda.saldoDevedor || 0;
        acc.vendas += 1;
        acc.itensVendidos += venda.itens.reduce(
          (sum, item) => sum + (item.quantidade || 0),
          0
        );
        return acc;
      },
      {
        faturamento: 0,
        recebido: 0,
        saldo: 0,
        vendas: 0,
        itensVendidos: 0,
      }
    );
  }, [vendas]);

  /* =======================
     DADOS DOS GRÁFICOS
  ======================= */

  // 📊 Vendas diárias (últimos 7 dias)
  const dailySalesData = useMemo(() => {
    const map = new Map<string, number>();

    filteredVendas.forEach((venda) => {
      const dateKey = new Date(venda.dataVenda).toISOString().split("T")[0];
      map.set(dateKey, (map.get(dateKey) || 0) + (venda.valorTotal || 0));
    });

    const sorted = Array.from(map.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7);

    if (sorted.length === 0) {
      return {
        labels: ["Sem dados"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: sorted.map(([date]) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
      datasets: [{ data: sorted.map(([, total]) => total) }],
    };
  }, [filteredVendas]);

  // 📈 Top produtos
  const topProductsData = useMemo(() => {
    const map = new Map<string, { quantidade: number; valor: number }>();

    filteredVendas.forEach((venda) => {
      venda.itens?.forEach((item) => {
        if (item.produtoNome) {
          const existing = map.get(item.produtoNome) || {
            quantidade: 0,
            valor: 0,
          };
          map.set(item.produtoNome, {
            quantidade: existing.quantidade + (item.quantidade || 0),
            valor: existing.valor + (item.subtotal || 0),
          });
        }
      });
    });

    const sorted = Array.from(map.entries())
      .sort(([, a], [, b]) => b.quantidade - a.quantidade)
      .slice(0, 5);

    if (sorted.length === 0) {
      return {
        labels: ["Sem dados"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: sorted.map(([nome]) =>
        nome.length > 10 ? nome.slice(0, 10) + "..." : nome
      ),
      datasets: [{ data: sorted.map(([, data]) => data.quantidade) }],
    };
  }, [filteredVendas]);

  // 🥧 Formas de pagamento
  const paymentMethodsData = useMemo(() => {
    const map = new Map<string, number>();

    const getPaymentLabel = (value: unknown): string => {
      if (!value) return "Outros";

      if (typeof value === "string") {
        return paymentLabelMap[value] || value;
      }

      if (typeof value === "object") {
        const raw =
          (value as any).descricao ||
          (value as any).tipo ||
          (value as any).nome ||
          (value as any).formaPagamento;

        if (typeof raw === "string" && raw.trim().length > 0) {
          return paymentLabelMap[raw] || raw;
        }
      }

      return "Outros";
    };

    filteredVendas.forEach((venda) => {
      venda.pagamentos?.forEach((pagamento) => {
        const nomeForma = getPaymentLabel(pagamento.formaPagamento);

        map.set(nomeForma, (map.get(nomeForma) || 0) + (pagamento.valor || 0));
      });
    });

    const entries = Array.from(map.entries());

    if (entries.length === 0) {
      return [
        {
          name: "Sem dados",
          population: 1,
          color: "#CCCCCC",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        },
      ];
    }

    return entries.map(([name, value], index) => ({
      name: name.length > 10 ? name.slice(0, 10) + "..." : name,
      population: value,
      color: ["#4CAF50", "#2196F3", "#FF9800", "#F44336", "#9C27B0"][index % 5],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));
  }, [filteredVendas]);

  // 👥 Tipo de cliente
  const clientTypeData = useMemo(() => {
    const map = new Map<string, { quantidade: number; valor: number }>();

    filteredVendas.forEach((venda) => {
      const tipoCliente = venda.cliente?.tipoCliente || "Desconhecido";
      const existing = map.get(tipoCliente) || { quantidade: 0, valor: 0 };

      map.set(tipoCliente, {
        quantidade: existing.quantidade + 1,
        valor: existing.valor + (venda.valorTotal || 0),
      });
    });

    const data = Array.from(map.entries());

    if (data.length === 0) {
      return {
        labels: ["Sem dados"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: data.map(([label]) => label),
      datasets: [
        {
          data: data.map(([, data]) => data.quantidade),
          // Para mostrar valor em vez de quantidade:
          // data: data.map(([, data]) => data.valor)
        },
      ],
    };
  }, [filteredVendas]);

  /* =======================
     ESTATÍSTICAS DO PERÍODO
  ======================= */

  const stats = useMemo(() => {
    const total = filteredVendas.reduce((s, v) => s + (v.valorTotal || 0), 0);

    return {
      totalVendas: filteredVendas.length,
      valorTotal: total,
      valorMedio: filteredVendas.length > 0 ? total / filteredVendas.length : 0,
      saldoDevedor: filteredVendas.reduce(
        (s, v) => s + (v.saldoDevedor || 0),
        0
      ),
      totalItens: filteredVendas.reduce(
        (s, v) =>
          s +
          (v.itens?.reduce((i, item) => i + (item.quantidade || 0), 0) || 0),
        0
      ),
      clientesAtendidos: new Set(
        filteredVendas.map((v) => v.cliente?.nome || "Desconhecido")
      ).size,
    };
  }, [filteredVendas]);

  const screenWidth = Dimensions.get("window").width - 40;

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: { fontSize: 10 },
    style: {
      borderRadius: 16,
    },
  };

  /* =======================
     RENDER
  ======================= */

  if (loading) {
    return (
      <LoaderContainer>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 20, color: "#666" }}>
          Carregando relatórios...
        </Text>
      </LoaderContainer>
    );
  }

  if (error) {
    return (
      <Container
        style={{ justifyContent: "center", alignItems: "center", padding: 40 }}
      >
        <Text
          style={{ color: "#F44336", marginBottom: 20, textAlign: "center" }}
        >
          {error}
        </Text>
        <Button bgColor="#4CAF50" onPress={loadData}>
          <ButtonText>Tentar novamente</ButtonText>
        </Button>
      </Container>
    );
  }

  if (vendas.length === 0) {
    return (
      <Container
        style={{ justifyContent: "center", alignItems: "center", padding: 40 }}
      >
        <NoDataText>Nenhuma venda cadastrada no sistema</NoDataText>
        <Button bgColor="#4CAF50" onPress={loadData} style={{ marginTop: 20 }}>
          <ButtonText>↻ Recarregar</ButtonText>
        </Button>
      </Container>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Container>
        <Title>📊 Dashboard de Vendas</Title>

        <InfoContainer>
          <InfoText>
            Analise o desempenho das vendas por período. Use os filtros para
            ajustar a visualização.
          </InfoText>
        </InfoContainer>

        {/* Filtros */}
        <FilterContainer>
          <Row>
            {(["hoje", "semana", "mes", "ano", "todos"] as TimeRange[]).map(
              (r) => (
                <Button
                  key={r}
                  active={timeRange === r}
                  onPress={() => setTimeRange(r)}
                >
                  <ButtonText active={timeRange === r}>
                    {r === "semana"
                      ? "7 dias"
                      : r === "mes"
                        ? "30 dias"
                        : r === "ano"
                          ? "1 ano"
                          : r.charAt(0).toUpperCase() + r.slice(1)}
                  </ButtonText>
                </Button>
              )
            )}
          </Row>

          <Row style={{ flex: 1, marginRight: 10, marginTop: 20 }}>
            <DateInput
              placeholder="Data início"
              value={startDate}
              onChangeText={setStartDate}
            />
            <DateInput
              placeholder="Data fim"
              value={endDate}
              onChangeText={setEndDate}
            />
            <Button
              bgColor="#2196F3"
              onPress={() => {
                // Implementar filtro customizado por data
                if (startDate && endDate) {
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  end.setHours(23, 59, 59, 999);

                  const customFiltered = vendas.filter((venda) => {
                    const vendaDate = new Date(venda.dataVenda);
                    return vendaDate >= start && vendaDate <= end;
                  });

                  setFilteredVendas(customFiltered);
                } else {
                  Alert.alert("Atenção", "Preencha ambas as datas");
                }
              }}
            >
              <ButtonText>Filtrar</ButtonText>
            </Button>
          </Row>
        </FilterContainer>

        {/* Resumo Geral */}
        <SectionTitle>📈 Resumo Geral</SectionTitle>
        <Card>
          <Row style={{ marginBottom: 15 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Faturamento Total
              </Text>
              <Text
                style={{ fontSize: 22, fontWeight: "bold", color: "#4CAF50" }}
              >
                R$ {resumo.faturamento.toFixed(2)}
              </Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Total Recebido
              </Text>
              <Text
                style={{ fontSize: 22, fontWeight: "bold", color: "#2196F3" }}
              >
                R$ {resumo.recebido.toFixed(2)}
              </Text>
            </View>
          </Row>
          <Row style={{ marginBottom: 15 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Saldo Devedor
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: resumo.saldo > 0 ? "#F44336" : "#4CAF50",
                }}
              >
                R$ {resumo.saldo.toFixed(2)}
              </Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Total de Vendas
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
                {resumo.vendas}
              </Text>
            </View>
          </Row>
          <Row>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Itens Vendidos
              </Text>
              <Text
                style={{ fontSize: 22, fontWeight: "bold", color: "#FF9800" }}
              >
                {resumo.itensVendidos}
              </Text>
            </View>
          </Row>
        </Card>

        {/* Estatísticas do Período */}
        <SectionTitle>📊 Resumo do Período</SectionTitle>

        <StatsRow>
          <StatCard>
            <StatValue>R$ {stats.valorTotal.toFixed(2)}</StatValue>
            <StatLabel>Total em Vendas</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalVendas}</StatValue>
            <StatLabel>Vendas</StatLabel>
          </StatCard>
        </StatsRow>

        <StatsRow>
          <StatCard>
            <StatValue>R$ {stats.valorMedio.toFixed(2)}</StatValue>
            <StatLabel>Ticket Médio</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.clientesAtendidos}</StatValue>
            <StatLabel>Clientes Únicos</StatLabel>
          </StatCard>
        </StatsRow>

        <StatsRow>
          <StatCard>
            <StatValue>{stats.totalItens}</StatValue>
            <StatLabel>Itens Vendidos</StatLabel>
          </StatCard>
          <StatCard warning={stats.saldoDevedor > 0}>
            <StatValue>R$ {stats.saldoDevedor.toFixed(2)}</StatValue>
            <StatLabel>Saldo Devedor</StatLabel>
          </StatCard>
        </StatsRow>

        {/* Gráficos */}
        <SectionTitle>📈 Evolução das Vendas</SectionTitle>

        <Card>
          <CardTitle>Vendas Diárias (Últimos 7 dias)</CardTitle>
          <CardContent>
            {dailySalesData.labels[0] !== "Sem dados" ? (
              <LineChart
                data={dailySalesData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: 8 }}
                fromZero
              />
            ) : (
              <NoDataText>Não há vendas nos últimos 7 dias</NoDataText>
            )}
          </CardContent>
        </Card>

        <SectionTitle>🏆 Produtos mais vendidos</SectionTitle>

        <Card>
          <CardTitle>Top 5 Produtos</CardTitle>
          <CardContent>
            {topProductsData.labels[0] !== "Sem dados" ? (
              <BarChart
                data={topProductsData}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                showValuesOnTopOfBars
                fromZero
                style={{ borderRadius: 8, marginLeft: 0 }}
                yAxisLabel=""
                yAxisSuffix=""
              />
            ) : (
              <NoDataText style={{ fontSize: 12 }}>Sem dados</NoDataText>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardTitle>💳Formas de Pagamento</CardTitle>
          <CardContent>
            {paymentMethodsData[0]?.name !== "Sem dados" ? (
              <PieChart
                data={paymentMethodsData}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <NoDataText style={{ fontSize: 12 }}>Sem dados</NoDataText>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Vendas por Tipo de Cliente</CardTitle>
          <CardContent>
            {clientTypeData.labels[0] !== "Sem dados" ? (
              <BarChart
                data={clientTypeData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                showValuesOnTopOfBars
                fromZero
                style={{ borderRadius: 8 }}
                yAxisLabel=""
                yAxisSuffix=""
              />
            ) : (
              <NoDataText>Não há dados para análise</NoDataText>
            )}
          </CardContent>
        </Card>

        {/* Últimas vendas */}
        {filteredVendas.length > 0 && (
          <>
            <SectionTitle>🕒 Vendas Recentes</SectionTitle>
            {filteredVendas.slice(0, 5).map((venda) => (
              <Card key={venda.id} small>
                <Row style={{ justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 14,
                        color: "#333",
                      }}
                    >
                      {new Date(venda.dataVenda).toLocaleDateString("pt-BR")} -{" "}
                      {venda.cliente?.nome}
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
                      {venda.itens?.length || 0} itens • R${" "}
                      {venda.valorTotal?.toFixed(2) || "0.00"}
                      {venda.usuario?.nome &&
                        ` • Vendedor: ${venda.usuario.nome}`}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        color: venda.saldoDevedor > 0 ? "#F44336" : "#4CAF50",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {venda.saldoDevedor > 0 ? "Pendente" : "Pago"}
                    </Text>
                    {venda.saldoDevedor > 0 && (
                      <Text
                        style={{ color: "#F44336", fontSize: 10, marginTop: 2 }}
                      >
                        Falta: R$ {venda.saldoDevedor.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </Row>
              </Card>
            ))}
          </>
        )}

        {/* Botão de atualizar */}
        <Button
          bgColor="#2196F3"
          onPress={loadData}
          style={{ marginTop: 20, marginBottom: 30 }}
        >
          <ButtonText>↻ Atualizar Dados</ButtonText>
        </Button>

        {filteredVendas.length === 0 && !loading && vendas.length > 0 && (
          <Card>
            <NoDataText>
              Nenhuma venda encontrada para o período selecionado
            </NoDataText>
          </Card>
        )}
      </Container>
    </ScrollView>
  );
};

export default SalesReport;
