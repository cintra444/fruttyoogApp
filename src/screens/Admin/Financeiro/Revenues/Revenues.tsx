// Revenues.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import {
  Container,
  Title,
  StatsContainer,
  StatsCard,
  StatsTitle,
  StatsValue,
  StatsLabel,
  LoadingContainer,
  LoadingText,
  RevenueCard,
  RevenueMonth,
  RevenueValue,
  RevenueDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  FilterContainer,
  MonthSelector,
  MonthButton,
  MonthButtonText,
  YearSelector,
  YearButton,
  YearButtonText,
  EmptyContainer,
  EmptyText,
} from "./styles";
import { GetVenda, GetDespesa } from "../../../../Services/apiFruttyoog";

const { width } = Dimensions.get("window");

interface BalancoMensal {
  ano: number;
  mes: number;
  totalVendas: number;
  totalDespesas: number;
  totalCompras?: number;
  lucro: number;
  lucroPercentual: number;
  detalhesVendas?: Array<{
    id: number;
    data: string;
    valor: number;
    cliente: string;
  }>;
  detalhesDespesas?: Array<{
    id: number;
    descricao: string;
    categoria: string;
    valor: number;
    data: string;
  }>;
}

interface MonthlySummary {
  monthYear: string; // "01/2024"
  label: string; // "Janeiro 2024"
  totalVendas: number;
  totalDespesas: number;
  lucro: number;
  lucroPercentual: number;
}

const Revenues: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balancoMensal, setBalancoMensal] = useState<BalancoMensal | null>(
    null
  );
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>(
    []
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonthDetails, setSelectedMonthDetails] =
    useState<MonthlySummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [months] = useState([
    { number: 1, name: "Janeiro" },
    { number: 2, name: "Fevereiro" },
    { number: 3, name: "Março" },
    { number: 4, name: "Abril" },
    { number: 5, name: "Maio" },
    { number: 6, name: "Junho" },
    { number: 7, name: "Julho" },
    { number: 8, name: "Agosto" },
    { number: 9, name: "Setembro" },
    { number: 10, name: "Outubro" },
    { number: 11, name: "Novembro" },
    { number: 12, name: "Dezembro" },
  ]);

  useEffect(() => {
    loadData();
    generateYears();
  }, []);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      yearsArray.push(year);
    }
    setYears(yearsArray);
    setSelectedYear(currentYear);
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Carrega vendas e despesas para calcular os meses disponíveis
      const [vendasData, despesasData] = await Promise.all([
        GetVenda(),
        GetDespesa(),
      ]);

      if (vendasData && despesasData) {
        const summaries = calculateMonthlySummaries(vendasData, despesasData);
        setMonthlySummaries(summaries);

        // Seleciona o mês atual por padrão
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const currentYear = currentDate.getFullYear();
        const currentMonthYear = `${currentMonth}/${currentYear}`;

        const currentSummary = summaries.find(
          (s) => s.monthYear === currentMonthYear
        );
        if (currentSummary) {
          setSelectedMonthDetails(currentSummary);
          setSelectedMonth(currentMonth);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados de receita");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlySummaries = (
    vendas: any[],
    despesas: any[]
  ): MonthlySummary[] => {
    const monthlyData: Record<string, MonthlySummary> = {};

    // Processa vendas
    vendas.forEach((venda) => {
      if (venda.dataVenda) {
        try {
          const date = new Date(venda.dataVenda);
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          const monthYear = `${month}/${year}`;

          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
              monthYear,
              label: `${months[date.getMonth()].name} ${year}`,
              totalVendas: 0,
              totalDespesas: 0,
              lucro: 0,
              lucroPercentual: 0,
            };
          }

          monthlyData[monthYear].totalVendas += Number(venda.valorTotal) || 0;
        } catch (error) {
          console.error(
            "Erro ao processar data da venda:",
            venda.dataVenda,
            error
          );
        }
      }
    });

    // Processa despesas
    despesas.forEach((despesa) => {
      if (despesa.data) {
        try {
          const date = new Date(despesa.data);
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          const monthYear = `${month}/${year}`;

          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
              monthYear,
              label: `${months[date.getMonth()].name} ${year}`,
              totalVendas: 0,
              totalDespesas: 0,
              lucro: 0,
              lucroPercentual: 0,
            };
          }

          monthlyData[monthYear].totalDespesas += Number(despesa.valor) || 0;
        } catch (error) {
          console.error(
            "Erro ao processar data da despesa:",
            despesa.data,
            error
          );
        }
      }
    });

    // Calcula lucro e percentual para cada mês
    Object.keys(monthlyData).forEach((key) => {
      const data = monthlyData[key];
      data.lucro = data.totalVendas - data.totalDespesas;
      data.lucroPercentual =
        data.totalVendas > 0 ? (data.lucro / data.totalVendas) * 100 : 0;
    });

    // Ordena do mais recente para o mais antigo
    return Object.values(monthlyData).sort((a, b) => {
      const [mesA, anoA] = a.monthYear.split("/").map(Number);
      const [mesB, anoB] = b.monthYear.split("/").map(Number);

      if (anoA !== anoB) return anoB - anoA;
      return mesB - mesA;
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMonthSelect = (monthNumber: string) => {
    setSelectedMonth(monthNumber);
    const monthYear = `${monthNumber.padStart(2, "0")}/${selectedYear}`;
    const summary = monthlySummaries.find((s) => s.monthYear === monthYear);
    setSelectedMonthDetails(summary || null);
    setShowDetails(false);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    const monthYear = `${selectedMonth.padStart(2, "0")}/${year}`;
    const summary = monthlySummaries.find((s) => s.monthYear === monthYear);
    setSelectedMonthDetails(summary || null);
    setShowDetails(false);
  };

  const handleMonthCardPress = (summary: MonthlySummary) => {
    setSelectedMonthDetails(summary);
    const [month] = summary.monthYear.split("/");
    setSelectedMonth(month);
    const year = parseInt(summary.monthYear.split("/")[1]);
    setSelectedYear(year);
    setShowDetails(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getProfitColor = (lucro: number) => {
    return lucro >= 0 ? "#2ecc71" : "#e74c3c";
  };

  const getProfitIcon = (lucro: number) => {
    return lucro >= 0 ? "📈" : "📉";
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#3498db" />
        <LoadingText>Calculando receitas...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3498db"]}
          tintColor="#3498db"
        />
      }
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Title>📊 Balanço Financeiro</Title>

      {/* Estatísticas Gerais */}
      <StatsContainer>
        <StatsCard backgroundColor="#3498db">
          <StatsTitle>Total de Vendas</StatsTitle>
          <StatsValue>
            {formatCurrency(
              monthlySummaries.reduce((sum, m) => sum + m.totalVendas, 0)
            )}
          </StatsValue>
          <StatsLabel>{monthlySummaries.length} meses</StatsLabel>
        </StatsCard>

        <StatsCard backgroundColor="#2ecc71">
          <StatsTitle>Lucro Total</StatsTitle>
          <StatsValue>
            {formatCurrency(
              monthlySummaries.reduce((sum, m) => sum + m.lucro, 0)
            )}
          </StatsValue>
          <StatsLabel>
            {monthlySummaries.filter((m) => m.lucro > 0).length} meses positivos
          </StatsLabel>
        </StatsCard>
      </StatsContainer>

      {/* Seletor de Ano/Mês */}
      <FilterContainer>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#333",
          }}
        >
          Selecionar Período:
        </Text>

        <YearSelector horizontal showsHorizontalScrollIndicator={false}>
          {years.map((year) => (
            <YearButton
              key={year}
              selected={selectedYear === year}
              onPress={() => handleYearSelect(year)}
            >
              <YearButtonText selected={selectedYear === year}>
                {year}
              </YearButtonText>
            </YearButton>
          ))}
        </YearSelector>

        <MonthSelector horizontal showsHorizontalScrollIndicator={false}>
          {months.map((month) => (
            <MonthButton
              key={month.number}
              selected={selectedMonth === month.number.toString()}
              onPress={() => handleMonthSelect(month.number.toString())}
            >
              <MonthButtonText
                selected={selectedMonth === month.number.toString()}
              >
                {month.name.substring(0, 3)}
              </MonthButtonText>
            </MonthButton>
          ))}
        </MonthSelector>
      </FilterContainer>

      {/* Card do Mês Selecionado */}
      {selectedMonthDetails ? (
        <RevenueCard>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <RevenueMonth>{selectedMonthDetails.label}</RevenueMonth>
            <Text style={{ fontSize: 24 }}>
              {getProfitIcon(selectedMonthDetails.lucro)}
            </Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: "#666" }}>Vendas:</Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#3498db" }}
              >
                {formatCurrency(selectedMonthDetails.totalVendas)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: "#666" }}>Despesas:</Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#e74c3c" }}
              >
                {formatCurrency(selectedMonthDetails.totalDespesas)}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#eee",
                marginVertical: 10,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
                Lucro:
              </Text>
              <RevenueValue color={getProfitColor(selectedMonthDetails.lucro)}>
                {formatCurrency(selectedMonthDetails.lucro)}
              </RevenueValue>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: getProfitColor(selectedMonthDetails.lucro),
                textAlign: "right",
                marginTop: 5,
              }}
            >
              {selectedMonthDetails.lucroPercentual.toFixed(1)}% da receita
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowDetails(!showDetails)}
            style={{
              marginTop: 15,
              padding: 10,
              backgroundColor: "#f8f9fa",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#3498db", fontWeight: "bold" }}>
              {showDetails ? "▲ Ocultar Detalhes" : "▼ Ver Detalhes"}
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <RevenueDetails>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                }}
              >
                📋 Detalhamento do Mês
              </Text>

              <DetailItem>
                <DetailLabel>Receita Bruta:</DetailLabel>
                <DetailValue positive>
                  {formatCurrency(selectedMonthDetails.totalVendas)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Despesas Totais:</DetailLabel>
                <DetailValue negative>
                  {formatCurrency(selectedMonthDetails.totalDespesas)}
                </DetailValue>
              </DetailItem>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#eee",
                  marginVertical: 8,
                }}
              />

              <DetailItem>
                <DetailLabel>Margem de Lucro:</DetailLabel>
                <DetailValue
                  color={getProfitColor(selectedMonthDetails.lucroPercentual)}
                >
                  {selectedMonthDetails.lucroPercentual.toFixed(1)}%
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Eficiência:</DetailLabel>
                <DetailValue
                  color={
                    selectedMonthDetails.lucroPercentual > 20
                      ? "#2ecc71"
                      : selectedMonthDetails.lucroPercentual > 10
                        ? "#f39c12"
                        : "#e74c3c"
                  }
                >
                  {selectedMonthDetails.lucroPercentual > 20
                    ? "Excelente"
                    : selectedMonthDetails.lucroPercentual > 10
                      ? "Boa"
                      : "Atenção"}
                </DetailValue>
              </DetailItem>
            </RevenueDetails>
          )}
        </RevenueCard>
      ) : (
        <View
          style={{
            padding: 20,
            backgroundColor: "#f8f9fa",
            borderRadius: 10,
            margin: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
            📅 Nenhum dado disponível para{" "}
            {months[parseInt(selectedMonth) - 1]?.name} {selectedYear}
          </Text>
        </View>
      )}

      {/* Histórico de Meses */}
      <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 15,
            color: "#333",
          }}
        >
          📅 Histórico Mensal
        </Text>

        {monthlySummaries.length === 0 ? (
          <EmptyContainer>
            <Text style={{ fontSize: 50, marginBottom: 10 }}>📊</Text>
            <EmptyText>Nenhum dado financeiro registrado</EmptyText>
            <Text
              style={{
                fontSize: 12,
                color: "#999",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Realize vendas e registre despesas para ver o balanço
            </Text>
          </EmptyContainer>
        ) : (
          monthlySummaries.map((summary, index) => (
            <TouchableOpacity
              key={summary.monthYear}
              onPress={() => handleMonthCardPress(summary)}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 15,
                marginBottom: 10,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                borderLeftWidth: 4,
                borderLeftColor: getProfitColor(summary.lucro),
                opacity:
                  selectedMonthDetails?.monthYear === summary.monthYear
                    ? 1
                    : 0.9,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}
                  >
                    {summary.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    Vendas: {formatCurrency(summary.totalVendas)}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: getProfitColor(summary.lucro),
                    }}
                  >
                    {formatCurrency(summary.lucro)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: getProfitColor(summary.lucro),
                      marginTop: 2,
                    }}
                  >
                    {summary.lucroPercentual.toFixed(1)}%
                  </Text>
                </View>
              </View>

              {/* Barra de progresso */}
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    height: 4,
                    backgroundColor: "#ecf0f1",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${Math.min(100, (summary.totalDespesas / (summary.totalVendas || 1)) * 100)}%`,
                      height: "100%",
                      backgroundColor: "#e74c3c",
                      borderRadius: 2,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 10, color: "#95a5a6" }}>
                    Despesas: {formatCurrency(summary.totalDespesas)}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#95a5a6" }}>
                    {(
                      (summary.totalDespesas / (summary.totalVendas || 1)) *
                      100
                    ).toFixed(1)}
                    % da receita
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Legenda */}
      <View
        style={{
          padding: 15,
          backgroundColor: "#f8f9fa",
          borderRadius: 10,
          margin: 10,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 5,
            color: "#333",
          }}
        >
          📋 Legenda:
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#2ecc71",
              borderRadius: 6,
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 11, color: "#666" }}>Lucro positivo</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#e74c3c",
              borderRadius: 6,
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 11, color: "#666" }}>Lucro negativo</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#3498db",
              borderRadius: 6,
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 11, color: "#666" }}>
            Barras: % das despesas sobre receita
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default Revenues;
