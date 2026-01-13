// Payment.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
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
  PaymentTypeContainer,
  PaymentTypeText,
  PaymentTypeValue,
  PaymentTypeIcon,
} from "./styles";
import { GetVenda } from "../../../../Services/apiFruttyoog";
import { VendaResponse } from "../../../../Services/apiFruttyoog";

// Interface atualizada
interface VendaType extends VendaResponse {
  formasPagamento: string[];
}

interface PaymentStats {
  totalGeral: number;
  totalPago: number;
  totalPendente: number;
  totalPorForma: Record<string, number>; // Mudei de totalPorTipo para totalPorForma
  totalVendas: number;
  vendasPendentes: number;
  vendasQuitadas: number;
  totalTransacoes: number; // Total de transações (soma de todas as formas de pagamento)
}

const Payment: React.FC = () => {
  const [vendas, setVendas] = useState<VendaType[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalGeral: 0,
    totalPago: 0,
    totalPendente: 0,
    totalPorForma: {},
    totalVendas: 0,
    vendasPendentes: 0,
    vendasQuitadas: 0,
    totalTransacoes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVendas();
  }, []);

  const loadVendas = async () => {
    try {
      setLoading(true);
      const res = (await GetVenda()) as VendaType[];

      const vendasValidas = (res || []).filter(
        (venda) => venda && venda.valorTotal > 0
      );

      setVendas(vendasValidas);
      calculateStats(vendasValidas);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVendas();
    setRefreshing(false);
  };

  const calculateStats = (vendasList: VendaType[]) => {
    const stats: PaymentStats = {
      totalGeral: 0,
      totalPago: 0,
      totalPendente: 0,
      totalPorForma: {},
      totalVendas: vendasList.length,
      vendasPendentes: 0,
      vendasQuitadas: 0,
      totalTransacoes: 0,
    };

    vendasList.forEach((venda) => {
      const valorTotal = Number(venda.valorTotal) || 0;
      const valorPago = Number(venda.valorTotalPago) || 0;
      const saldoDevedor = Number(venda.saldoDevedor) || 0;

      // Totais gerais
      stats.totalGeral += valorTotal;
      stats.totalPago += valorPago;
      stats.totalPendente += saldoDevedor;

      // Contar vendas por status
      if (saldoDevedor > 0) {
        stats.vendasPendentes += 1;
      } else {
        stats.vendasQuitadas += 1;
      }

      // PROCESSAR FORMAS DE PAGAMENTO (AGORA É UM ARRAY)
      if (venda.formasPagamento && Array.isArray(venda.formasPagamento)) {
        // Para cada forma de pagamento na venda
        venda.formasPagamento.forEach((forma) => {
          if (forma && forma.trim() !== "") {
            const formaNormalizada = forma.trim();

            // Distribuir o valor igualmente entre as formas de pagamento
            // Ou usar valores dos pagamentos individuais se disponível
            let valorParaForma = valorTotal;

            // Se tiver pagamentos detalhados, usar os valores reais
            if (venda.pagamentos && venda.pagamentos.length > 0) {
              // Encontrar pagamentos com esta forma
              const pagamentosComEstaForma = venda.pagamentos.filter(
                (p) => p.formaPagamento === forma
              );

              if (pagamentosComEstaForma.length > 0) {
                // Somar valores dos pagamentos com esta forma
                valorParaForma = pagamentosComEstaForma.reduce(
                  (sum, pag) => sum + (Number(pag.valor) || 0),
                  0
                );
              }
            } else {
              // Se não tiver pagamentos detalhados, dividir igualmente
              valorParaForma = valorTotal / venda.formasPagamento.length;
            }

            // Somar por forma de pagamento
            stats.totalPorForma[formaNormalizada] =
              (stats.totalPorForma[formaNormalizada] || 0) + valorParaForma;

            stats.totalTransacoes += 1;
          }
        });
      }

      // Alternativa: usar os pagamentos detalhados para estatísticas mais precisas
      if (venda.pagamentos && Array.isArray(venda.pagamentos)) {
        venda.pagamentos.forEach((pagamento) => {
          const forma = pagamento.formaPagamento || "Não informado";
          const valor = Number(pagamento.valor) || 0;

          if (forma && forma.trim() !== "") {
            stats.totalPorForma[forma] =
              (stats.totalPorForma[forma] || 0) + valor;
          }
        });
      }
    });

    setStats(stats);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getPaymentTypeIcon = (forma: string) => {
    const formaLower = forma?.toLowerCase();
    if (formaLower.includes("pix")) return "🏦";
    if (
      formaLower.includes("cartão") ||
      formaLower.includes("cartao") ||
      formaLower.includes("credito") ||
      formaLower.includes("débito") ||
      formaLower.includes("debito")
    )
      return "💳";
    if (formaLower.includes("dinheiro")) return "💰";
    if (formaLower.includes("fiado")) return "📝";
    if (formaLower.includes("a_prazo") || formaLower.includes("prazo"))
      return "📅";
    if (formaLower.includes("boleto")) return "📄";
    if (
      formaLower.includes("transferência") ||
      formaLower.includes("transferencia")
    )
      return "🔄";
    if (formaLower.includes("cheque")) return "🧾";
    if (formaLower.includes("outros")) return "💸";
    return "💰";
  };

  const getPaymentTypeName = (forma: string) => {
    const formaLower = forma?.toLowerCase();

    // Mapeamento dos enums que aparecem nos logs
    if (formaLower === "pix") return "PIX";
    if (formaLower === "dinheiro") return "Dinheiro";
    if (formaLower === "fiado") return "Fiado";
    if (formaLower === "a_prazo") return "A Prazo";
    if (formaLower === "outros") return "Outros";
    if (formaLower.includes("cartão") || formaLower.includes("cartao")) {
      if (formaLower.includes("credito")) return "Cartão Crédito";
      if (formaLower.includes("debito") || formaLower.includes("débito"))
        return "Cartão Débito";
      return "Cartão";
    }

    // Se não reconhecer, retorna o próprio nome capitalizado
    return forma.charAt(0).toUpperCase() + forma.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#2196F3" />
        <LoadingText>Carregando estatísticas...</LoadingText>
      </LoadingContainer>
    );
  }

  // Ordenar formas de pagamento por valor (maior para menor)
  const sortedPaymentForms = Object.entries(stats.totalPorForma).sort(
    ([, valorA], [, valorB]) => valorB - valorA
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Container
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
          />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Title>Estatísticas de Pagamentos</Title>

        {/* Cards de Estatísticas */}
        <StatsContainer>
          <StatsCard backgroundColor="#2196F3">
            <StatsTitle>Total Geral</StatsTitle>
            <StatsValue>{formatCurrency(stats.totalGeral)}</StatsValue>
            <StatsLabel>{stats.totalVendas} vendas</StatsLabel>
          </StatsCard>

          <StatsCard backgroundColor="#4CAF50">
            <StatsTitle>Total Pago</StatsTitle>
            <StatsValue>{formatCurrency(stats.totalPago)}</StatsValue>
            <StatsLabel>{stats.vendasQuitadas} vendas quitadas</StatsLabel>
          </StatsCard>

          <StatsCard backgroundColor="#FF9800">
            <StatsTitle>Total Pendente</StatsTitle>
            <StatsValue>{formatCurrency(stats.totalPendente)}</StatsValue>
            <StatsLabel>{stats.vendasPendentes} vendas pendentes</StatsLabel>
          </StatsCard>
        </StatsContainer>

        {/* Resumo por Forma de Pagamento */}
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 15,
              color: "#333",
            }}
          >
            💰 Distribuição por Forma de Pagamento
          </Text>

          {sortedPaymentForms.length === 0 ? (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#666", fontSize: 14 }}>
                Nenhuma forma de pagamento registrada
              </Text>
            </View>
          ) : (
            sortedPaymentForms.map(([forma, valor]) => {
              const porcentagem =
                stats.totalGeral > 0
                  ? ((valor / stats.totalGeral) * 100).toFixed(1)
                  : "0";

              return (
                <PaymentTypeContainer key={forma}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <PaymentTypeIcon>
                      <Text style={{ fontSize: 20 }}>
                        {getPaymentTypeIcon(forma)}
                      </Text>
                    </PaymentTypeIcon>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <PaymentTypeText>
                        {getPaymentTypeName(forma)}
                      </PaymentTypeText>
                      <Text style={{ fontSize: 12, color: "#666" }}>
                        {porcentagem}% do total •{" "}
                        {stats.totalPorForma[forma] > 0
                          ? Math.round(
                              (stats.totalPorForma[forma] / stats.totalGeral) *
                                100
                            )
                          : 0}
                        % das vendas
                      </Text>
                    </View>
                  </View>
                  <PaymentTypeValue>{formatCurrency(valor)}</PaymentTypeValue>
                </PaymentTypeContainer>
              );
            })
          )}

          {/* Detalhamento dos enums encontrados */}
          <View
            style={{
              backgroundColor: "#f8f9fa",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#666",
              }}
            >
              📋 Formas de Pagamento Encontradas:
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {sortedPaymentForms.map(([forma]) => (
                <View
                  key={forma}
                  style={{
                    backgroundColor: "#e3f2fd",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 15,
                    margin: 3,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, marginRight: 5 }}>
                    {getPaymentTypeIcon(forma)}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#1976d2" }}>
                    {getPaymentTypeName(forma)}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#ddd",
                marginVertical: 15,
              }}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  Total de Vendas
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {stats.totalVendas}
                </Text>
              </View>

              <View>
                <Text
                  style={{ fontSize: 12, color: "#666", textAlign: "right" }}
                >
                  Transações Totais
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#2196F3",
                    textAlign: "right",
                  }}
                >
                  {stats.totalTransacoes}
                </Text>
              </View>

              <View>
                <Text
                  style={{ fontSize: 12, color: "#666", textAlign: "right" }}
                >
                  Taxa de Quitação
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#4CAF50",
                    textAlign: "right",
                  }}
                >
                  {stats.totalVendas > 0
                    ? (
                        (stats.vendasQuitadas / stats.totalVendas) *
                        100
                      ).toFixed(0)
                    : "0"}
                  %
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
};

export default Payment;
