// FinancialReport.tsx - Versão final
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
  FilterRow,
  FilterButtonContainer,
  ChartCard,
  DateInput,
  TabContainer,
  TabButton,
  TabButtonText,
  FinancialTable,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderText,
  TableCellText,
} from "./styles";
import { BarChart, PieChart } from "react-native-chart-kit";
import {
  GetVenda,
  VendaResponse,
  GetDespesas,
  DespesaResponse,
  GetCompra, // Use a função corrigida
  CompraResponse,
} from "../../../../Services/apiFruttyoog";

/* =======================
   COMPONENTE PRINCIPAL
======================= */

const FinancialReport: React.FC = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [compras, setCompras] = useState<CompraResponse[]>([]);
  const [despesas, setDespesas] = useState<DespesaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "geral" | "vendas" | "compras" | "despesas"
  >("geral");
  const [timeRange, setTimeRange] = useState<
    "mes" | "trimestre" | "semestre" | "ano"
  >("mes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [comprasAccessError, setComprasAccessError] = useState(false);

  /* =======================
     CARREGAMENTO DE DADOS
  ======================= */

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      setComprasAccessError(false);

      console.log("🔄 Carregando dados financeiros...");

      // Carregar vendas
      const vendasData = await GetVenda();
      if (vendasData && Array.isArray(vendasData)) {
        setVendas(vendasData);
        console.log(`✅ ${vendasData.length} vendas carregadas`);
      } else {
        setVendas([]);
        console.warn("⚠️ Vendas retornaram null");
      }

      // Carregar compras
      const comprasData = await GetCompra();
      if (comprasData === null) {
        // Erro 403 - acesso negado
        setComprasAccessError(true);
        setCompras([]);
        console.warn("🔒 Acesso negado às compras");
      } else if (comprasData && Array.isArray(comprasData)) {
        setCompras(comprasData);
        console.log(`✅ ${comprasData.length} compras carregadas`);
      } else {
        setCompras([]);
        console.warn("⚠️ Compras retornaram undefined");
      }

      // Carregar despesas
      const despesasData = await GetDespesas();
      if (despesasData && Array.isArray(despesasData)) {
        setDespesas(despesasData);
        console.log(`✅ ${despesasData.length} despesas carregadas`);
      } else {
        setDespesas([]);
        console.warn("⚠️ Despesas retornaram null");
      }

      setError(null);
    } catch (e: any) {
      console.error("❌ Erro ao carregar dados:", e);
      setError("Erro ao carregar dados financeiros");
      setVendas([]);
      setCompras([]);
      setDespesas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFinancialData();
  };

  /* =======================
     FILTRAGEM E CÁLCULOS
  ======================= */

  const filterByDate = (data: any[], dateField: string) => {
    if (!startDate || !endDate) return data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredVendas = useMemo(
    () => filterByDate(vendas, "dataVenda"),
    [vendas, startDate, endDate]
  );

  const filteredCompras = useMemo(
    () => filterByDate(compras, "dataCompra"),
    [compras, startDate, endDate]
  );

  const filteredDespesas = useMemo(
    () => filterByDate(despesas, "dataDespesa"),
    [despesas, startDate, endDate]
  );

  const financialData = useMemo(() => {
    const receitas = filteredVendas.reduce(
      (sum, venda) => sum + (venda.valorTotal || 0),
      0
    );
    const despesasCompras = filteredCompras.reduce(
      (sum, compra) => sum + (compra.valorNota || 0),
      0
    );
    const despesasOutras = filteredDespesas.reduce(
      (sum, despesa) => sum + (despesa.valor || 0),
      0
    );
    const totalDespesas = despesasCompras + despesasOutras;
    const lucro = receitas - totalDespesas;
    const margem = receitas > 0 ? (lucro / receitas) * 100 : 0;

    return {
      receitas,
      despesas: totalDespesas,
      lucro,
      margem,
      vendasCount: filteredVendas.length,
      comprasCount: filteredCompras.length,
      despesasCount: filteredDespesas.length,
    };
  }, [filteredVendas, filteredCompras, filteredDespesas]);

  /* =======================
     GRÁFICOS
  ======================= */

  const revenueExpenseChartData = useMemo(() => {
    return [
      {
        name: "Receitas",
        amount: financialData.receitas,
        color: "#4CAF50",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
      {
        name: "Despesas",
        amount: financialData.despesas,
        color: "#F44336",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
    ].filter((item) => item.amount > 0);
  }, [financialData]);

  const expenseCompositionChartData = useMemo(() => {
    const comprasTotal = filteredCompras.reduce(
      (sum, c) => sum + (c.valorNota || 0),
      0
    );
    const despesasTotal = filteredDespesas.reduce(
      (sum, d) => sum + (d.valor || 0),
      0
    );

    return [
      {
        name: "Compras",
        population: comprasTotal,
        color: "#FF9800",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
      {
        name: "Outras Despesas",
        population: despesasTotal,
        color: "#9C27B0",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
    ].filter((item) => item.population > 0);
  }, [filteredCompras, filteredDespesas]);

  const screenWidth = Dimensions.get("window").width - 40;

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={{ marginTop: 20, color: "#666" }}>
          Carregando relatório financeiro...
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
        <Button bgColor="#9C27B0" onPress={loadFinancialData}>
          <ButtonText>Tentar novamente</ButtonText>
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
        <Title>💰 Dashboard Financeiro</Title>

        <InfoContainer>
          <InfoText>
            Análise da saúde financeira: receitas, despesas e lucratividade.
          </InfoText>
        </InfoContainer>

        {/* Alerta se não tiver acesso a compras */}
        {comprasAccessError && (
          <Card
            style={{
              backgroundColor: "#FFF3E0",
              borderLeftWidth: 4,
              borderLeftColor: "#FF9800",
              marginBottom: 15,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 20, marginRight: 10 }}>⚠️</Text>
              <Text style={{ fontSize: 14, color: "#E65100", flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>Atenção:</Text> Você não
                tem permissão para acessar os dados de compras. As despesas
                mostradas incluem apenas outras despesas registradas.
              </Text>
            </View>
          </Card>
        )}

        {/* Filtros */}
        <FilterContainer>
          <TabContainer>
            <TabButton
              active={activeTab === "geral"}
              onPress={() => setActiveTab("geral")}
            >
              <TabButtonText active={activeTab === "geral"}>
                📊 Geral
              </TabButtonText>
            </TabButton>
            <TabButton
              active={activeTab === "vendas"}
              onPress={() => setActiveTab("vendas")}
            >
              <TabButtonText active={activeTab === "vendas"}>
                💰 Vendas
              </TabButtonText>
            </TabButton>
            <TabButton
              active={activeTab === "compras"}
              onPress={() => setActiveTab("compras")}
            >
              <TabButtonText active={activeTab === "compras"}>
                🛒 Compras
              </TabButtonText>
            </TabButton>
            <TabButton
              active={activeTab === "despesas"}
              onPress={() => setActiveTab("despesas")}
            >
              <TabButtonText active={activeTab === "despesas"}>
                💸 Despesas
              </TabButtonText>
            </TabButton>
          </TabContainer>

          <Text
            style={{
              fontSize: 14,
              color: "#666",
              marginVertical: 10,
              fontWeight: "500",
            }}
          >
            Período Personalizado:
          </Text>

          <Row style={{ marginBottom: 10 }}>
            <DateInput
              placeholder="Data início"
              value={startDate}
              onChangeText={setStartDate}
              style={{ flex: 1, marginRight: 10 }}
            />
            <DateInput
              placeholder="Data fim"
              value={endDate}
              onChangeText={setEndDate}
              style={{ flex: 1, marginLeft: 10 }}
            />
          </Row>

          <FilterButtonContainer>
            <Button
              bgColor="#9C27B0"
              onPress={() => {
                if (startDate && endDate) {
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  if (start > end) {
                    Alert.alert(
                      "Atenção",
                      "Data início não pode ser maior que data fim"
                    );
                  }
                }
              }}
              style={{ flex: 1 }}
            >
              <ButtonText>Aplicar Filtro</ButtonText>
            </Button>
          </FilterButtonContainer>
        </FilterContainer>

        {/* ESTATÍSTICAS */}
        <SectionTitle>📈 Resumo Financeiro</SectionTitle>

        <Card>
          <Row style={{ marginBottom: 15 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Receitas
              </Text>
              <StatValue style={{ color: "#4CAF50", fontSize: 20 }}>
                R$ {financialData.receitas.toFixed(2)}
              </StatValue>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {financialData.vendasCount} vendas
              </Text>
            </View>

            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Despesas
              </Text>
              <StatValue style={{ color: "#F44336", fontSize: 20 }}>
                R$ {financialData.despesas.toFixed(2)}
              </StatValue>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {financialData.comprasCount + financialData.despesasCount}{" "}
                registros
              </Text>
            </View>
          </Row>

          <Row
            style={{
              paddingTop: 15,
              borderTopWidth: 1,
              borderTopColor: "#eee",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Lucro Líquido
              </Text>
              <StatValue
                style={{
                  color: financialData.lucro >= 0 ? "#2196F3" : "#F44336",
                  fontSize: financialData.lucro >= 0 ? 22 : 20,
                }}
              >
                R$ {financialData.lucro.toFixed(2)}
              </StatValue>
            </View>

            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor:
                  financialData.lucro >= 0 ? "#E8F5E9" : "#FFEBEE",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: financialData.lucro >= 0 ? "#C8E6C9" : "#FFCDD2",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: financialData.lucro >= 0 ? "#2E7D32" : "#C62828",
                }}
              >
                {financialData.lucro >= 0 ? "✅ Positivo" : "⚠️ Negativo"}
              </Text>
            </View>
          </Row>
        </Card>

        {/* GRÁFICOS */}
        {activeTab === "geral" && (
          <>
            <SectionTitle>📊 Receitas vs Despesas</SectionTitle>
            <ChartCard>
              <CardTitle>Composição Financeira</CardTitle>
              <CardContent>
                {revenueExpenseChartData.length > 0 ? (
                  <View style={{ alignItems: "center" }}>
                    <PieChart
                      data={revenueExpenseChartData}
                      width={screenWidth}
                      height={220}
                      chartConfig={chartConfig}
                      accessor="amount"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                ) : (
                  <NoDataText>Não há dados financeiros</NoDataText>
                )}
              </CardContent>
            </ChartCard>

            <SectionTitle>💸 Composição das Despesas</SectionTitle>
            <ChartCard>
              <CardTitle>Distribuição das Despesas</CardTitle>
              <CardContent>
                {expenseCompositionChartData.length > 0 ? (
                  <View style={{ alignItems: "center" }}>
                    <PieChart
                      data={expenseCompositionChartData}
                      width={screenWidth}
                      height={200}
                      chartConfig={chartConfig}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                ) : (
                  <NoDataText>Não há dados de despesas</NoDataText>
                )}
              </CardContent>
            </ChartCard>
          </>
        )}

        {/* ABA DE VENDAS */}
        {activeTab === "vendas" && filteredVendas.length > 0 && (
          <>
            <SectionTitle>💰 Últimas Vendas</SectionTitle>
            <Card>
              <FinancialTable>
                <TableHeader>
                  <TableCell style={{ flex: 2 }}>
                    <TableHeaderText>Cliente</TableHeaderText>
                  </TableCell>
                  <TableCell>
                    <TableHeaderText>Data</TableHeaderText>
                  </TableCell>
                  <TableCell>
                    <TableHeaderText>Valor</TableHeaderText>
                  </TableCell>
                </TableHeader>

                {filteredVendas.slice(0, 5).map((venda, index) => (
                  <TableRow key={venda.id} even={index % 2 === 0}>
                    <TableCell style={{ flex: 2 }}>
                      <TableCellText style={{ fontWeight: "500" }}>
                        {venda.cliente?.nome || "Cliente"}
                      </TableCellText>
                    </TableCell>
                    <TableCell>
                      <TableCellText>
                        {new Date(venda.dataVenda).toLocaleDateString("pt-BR")}
                      </TableCellText>
                    </TableCell>
                    <TableCell>
                      <TableCellText
                        style={{ color: "#4CAF50", fontWeight: "bold" }}
                      >
                        R$ {venda.valorTotal?.toFixed(2) || "0.00"}
                      </TableCellText>
                    </TableCell>
                  </TableRow>
                ))}
              </FinancialTable>
            </Card>
          </>
        )}

        {/* BOTÃO DE ATUALIZAR */}
        <Button
          bgColor="#9C27B0"
          onPress={loadFinancialData}
          style={{ marginTop: 20, marginBottom: 30 }}
        >
          <ButtonText>↻ Atualizar Dados</ButtonText>
        </Button>
      </Container>
    </ScrollView>
  );
};

export default FinancialReport;
