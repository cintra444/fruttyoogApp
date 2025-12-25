import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GetVendaById } from "../../../../Services/apiFruttyoog";
import {
  Container,
  Title,
  Section,
  Button,
  ButtonText,
  ShareButton,
  ShareButtonText,
  InfoText,
  InfoTitle,
  ProductItem,
  ProductText,
  PaymentItem,
  PaymentText,
  InvoiceHeader,
  InvoiceInfo,
  InvoiceTotal,
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorText,
  ActionButton,
  ActionButtonText,
  ClientInfo,
  ClientName,
  ItemHeader,
  ItemHeaderText,
  ItemRow,
  ItemColumn,
  ItemText,
  ActionRow,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  StatusBadge,
} from "./styles";

type VendaDetalhes = {
  id: number;
  dataVenda: string;
  valorTotal: number;
  valorTotalPago: number;
  saldoDevedor: number;
  cliente: {
    id: number;
    nome: string;
  };
  itens: Array<{
    produto: {
      nome: string;
    };
    quantidade: number;
    valorUnitario: number;
    subTotal: number;
  }>;
  pagamentos: Array<{
    formaPagamento: string;
    valor: number;
    status: string;
    dataPagamento?: string;
  }>;
};

type InvoiceRouteParams = {
  vendaId: number;
};

type InvoiceProps = NativeStackScreenProps<
  { Invoice: InvoiceRouteParams },
  "Invoice"
>;

const Invoice: React.FC<InvoiceProps> = ({ route, navigation }) => {
  const { vendaId } = route.params;
  const [venda, setVenda] = useState<VendaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarVenda();
  }, [vendaId]);

  const carregarVenda = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Carregando venda com ID:", vendaId);
      const vendaData = await GetVendaById(vendaId);
      console.log("Venda carregada:", vendaData);
      if (vendaData) {
        setVenda(vendaData);
      } else {
        setError("Venda não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar venda:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da venda");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      if (!dataString) return "";
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

  const formatarDataSimples = (dataString: string) => {
    if (!dataString) return "";
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return dataString;
      return data.toLocaleDateString("pt-BR");
    } catch (error) {
      return dataString;
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const handleCompartilhar = async () => {
    if (!venda) return;

    try {
      const notaText = `
==============================
      NOTA DE VENDA
==============================
Nº: #${venda.id}
Data: ${formatarData(venda.dataVenda)}
Cliente: ${venda.cliente.nome}
==============================
ITENS:
${venda.itens
  .map(
    (item) =>
      `• ${item.produto.nome}
   ${item.quantidade} x ${formatarMoeda(item.valorUnitario)} = ${formatarMoeda(item.subTotal)}`
  )
  .join("\n")}
==============================
PAGAMENTOS:
${venda.pagamentos
  .map(
    (pag) =>
      `• ${pag.formaPagamento}: ${formatarMoeda(pag.valor)} (${pag.status})`
  )
  .join("\n")}
==============================
TOTAL: ${formatarMoeda(venda.valorTotal)}
PAGO: ${formatarMoeda(venda.valorTotalPago)}
SALDO: ${formatarMoeda(venda.saldoDevedor)}
==============================
      `;

      await Share.share({
        message: notaText,
        title: `Nota de Venda #${venda.id}`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar a nota");
    }
  };

  const handleImprimir = () => {
    Alert.alert("Imprimir", "Função de impressão será implementada.");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "PAGO":
        return "#2ecc71";
      case "PENDENTE":
        return "#f1c40f";
      case "CANCELADO":
        return "#e74c3c";
      default:
        return "#3498db";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "PAGO":
        return "Pago";
      case "PENDENTE":
        return "Pendente";
      case "CANCELADO":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#3498db" />
        <LoadingText>Carregando nota fiscal...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
        <ActionButton onPress={carregarVenda} variant="primary">
          <ActionButtonText>Recarregar</ActionButtonText>
        </ActionButton>
        <ActionButton onPress={() => navigation.goBack()} variant="secondary">
          <ActionButtonText>Voltar</ActionButtonText>
        </ActionButton>
      </ErrorContainer>
    );
  }

  if (!venda) {
    return (
      <ErrorContainer>
        <ErrorText>Nota fiscal de venda não encontrada.</ErrorText>
        <ActionButton
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        >
          <ActionButtonText>Voltar</ActionButtonText>
        </ActionButton>
      </ErrorContainer>
    );
  }

  return (
    <Container showsVerticalScrollIndicator={false}>
      <InvoiceHeader>
        <Title>NOTA DE VENDA</Title>
        <Text style={{ fontSize: 18, color: "#666", fontWeight: "bold" }}>
          #{venda.id}
        </Text>
        <Text style={{ fontSize: 14, color: "#7f8c8d" }}>
          {formatarData(venda.dataVenda)}
        </Text>
      </InvoiceHeader>

      <ClientInfo>
        <ClientName>Cliente: {venda.cliente.nome}</ClientName>
      </ClientInfo>

      <Section>
        <InfoTitle style={{ fontSize: 16, marginBottom: 10 }}>
          PRODUTOS
        </InfoTitle>
        <ItemHeader>
          <ItemHeaderText style={{ flex: 3 }}>Produto</ItemHeaderText>
          <ItemHeaderText style={{ flex: 1, textAlign: "center" }}>
            Qtd
          </ItemHeaderText>
          <ItemHeaderText style={{ flex: 1, textAlign: "right" }}>
            Unitário
          </ItemHeaderText>
          <ItemHeaderText style={{ flex: 1, textAlign: "right" }}>
            Total
          </ItemHeaderText>
        </ItemHeader>
        {venda.itens.map((item, index) => (
          <ItemRow key={index}>
            <ItemColumn width="3">
              <ItemText>{item.produto.nome}</ItemText>
            </ItemColumn>
            <ItemColumn width="1">
              <ItemText style={{ textAlign: "center" }}>
                {item.quantidade}
              </ItemText>
            </ItemColumn>
            <ItemColumn width="1">
              <ItemText style={{ textAlign: "right" }}>
                {formatarMoeda(item.valorUnitario)}
              </ItemText>
            </ItemColumn>
            <ItemColumn width="1">
              <ItemText style={{ textAlign: "right" }}>
                {formatarMoeda(item.subTotal)}
              </ItemText>
            </ItemColumn>
          </ItemRow>
        ))}
      </Section>

      <Section>
        <InfoTitle style={{ fontSize: 16, marginBottom: 15 }}>
          PAGAMENTOS
        </InfoTitle>

        {venda.pagamentos.map((pagamento, index) => (
          <View
            key={index}
            style={{
              marginBottom: 12,
              backgroundColor: "#f8f9fa",
              padding: 12,
              borderRadius: 8,
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
                style={{ fontSize: 15, fontWeight: "bold", color: "#2c3e50" }}
              >
                {pagamento.formaPagamento || "Pagamento"}
              </Text>
              <StatusBadge status={pagamento.status}>
                <Text style={{ fontSize: 12, color: "#fff" }}>
                  {getStatusText(pagamento.status)}
                </Text>
              </StatusBadge>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <Text style={{ fontSize: 14, color: "#34495e" }}>
                Valor:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {formatarMoeda(pagamento.valor)}
                </Text>
              </Text>
              {pagamento.dataPagamento && (
                <Text style={{ fontSize: 12, color: "#7f8c8d" }}>
                  {formatarDataSimples(pagamento.dataPagamento)}
                </Text>
              )}
            </View>
          </View>
        ))}
      </Section>

      <InvoiceTotal>
        <SummaryRow>
          <SummaryLabel>Total da Venda:</SummaryLabel>
          <SummaryValue>{formatarMoeda(venda.valorTotal)}</SummaryValue>
        </SummaryRow>

        <SummaryRow>
          <SummaryLabel>Total Pago:</SummaryLabel>
          <SummaryValue style={{ color: "#27ae60", fontWeight: "bold" }}>
            {formatarMoeda(venda.valorTotalPago)}
          </SummaryValue>
        </SummaryRow>

        <View
          style={{
            height: 1,
            backgroundColor: "#ddd",
            marginVertical: 10,
          }}
        />

        <SummaryRow>
          <SummaryLabel style={{ fontSize: 16, fontWeight: "bold" }}>
            Saldo:
          </SummaryLabel>
          <SummaryValue
            style={{
              fontSize: 18,
              color: venda.saldoDevedor > 0 ? "#e74c3c" : "#27ae60",
              fontWeight: "bold",
            }}
          >
            {formatarMoeda(venda.saldoDevedor)}
          </SummaryValue>
        </SummaryRow>
      </InvoiceTotal>

      <ActionRow>
        <ActionButton
          onPress={handleCompartilhar}
          variant="primary"
          style={{ flex: 1, marginRight: 5 }}
        >
          <ActionButtonText>Compartilhar</ActionButtonText>
        </ActionButton>

        <ActionButton
          onPress={handleImprimir}
          variant="secondary"
          style={{ flex: 1, marginHorizontal: 5 }}
        >
          <ActionButtonText>Imprimir</ActionButtonText>
        </ActionButton>
      </ActionRow>

      <ActionRow style={{ marginTop: 10 }}>
        <ActionButton
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={{ flex: 1 }}
        >
          <ActionButtonText>Voltar</ActionButtonText>
        </ActionButton>

        <ActionButton
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={{ flex: 1, marginLeft: 10 }}
        >
          <ActionButtonText>Início</ActionButtonText>
        </ActionButton>
      </ActionRow>
    </Container>
  );
};
export default Invoice;
