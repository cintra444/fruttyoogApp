// Payment.tsx
import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  Container,
  Title,
  FilterContainer,
  Input,
  Button,
  ButtonText,
  ProductItem,
  ProductText,
  QuantityText,
  FilterGroup,
  FilterLabel,
} from "./styles";
import {
  GetPayments,
  GetPaymentsByStatus,
  GetPaymentsByTipo,
} from "../../../../Services/apiFruttyoog"; // ajuste conforme sua api

interface PaymentItemType {
  id: number;
  cliente: string;
  dataPagamento: string;
  valor: number;
  tipoPagamento: string;
  status: "pago" | "pendente";
}

const Payment: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItemType[]>([]);
  const [clienteFilter, setClienteFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    handleListAll();
  }, []);

  const calculateTotal = (list: PaymentItemType[]) => {
    const totalValor = list.reduce((acc, curr) => acc + curr.valor, 0);
    setTotal(totalValor);
  };

  const handleListAll = async () => {
    try {
      const res = await GetPayments();
      setPayments(res || []);
      calculateTotal(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os pagamentos");
    }
  };

  const handleFilterByStatus = async () => {
    if (!statusFilter) {
      Alert.alert("Atenção", "Informe o status");
      return;
    }
    try {
      const res = await GetPaymentsByStatus(statusFilter);
      setPayments(res || []);
      calculateTotal(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível filtrar por status");
    }
  };

  const handleFilterByTipo = async () => {
    if (!tipoFilter) {
      Alert.alert("Atenção", "Informe o tipo de pagamento");
      return;
    }
    try {
      const res = await GetPaymentsByTipo(tipoFilter);
      setPayments(res || []);
      calculateTotal(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível filtrar por tipo");
    }
  };

  return (
    <Container>
      <Title>Pagamentos</Title>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Filtrar por Status:</FilterLabel>
          <Input
            placeholder="pago / pendente"
            value={statusFilter}
            onChangeText={setStatusFilter}
          />
          <Button onPress={handleFilterByStatus} bgColor="#FF9800">
            <ButtonText>Buscar por Status</ButtonText>
          </Button>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Filtrar por Tipo de Pagamento:</FilterLabel>
          <Input
            placeholder="ex: cartão, dinheiro"
            value={tipoFilter}
            onChangeText={setTipoFilter}
          />
          <Button onPress={handleFilterByTipo} bgColor="#2196F3">
            <ButtonText>Buscar por Tipo</ButtonText>
          </Button>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Listar Todos:</FilterLabel>
          <Button onPress={handleListAll} bgColor="#4CAF50">
            <ButtonText>Listar Todos</ButtonText>
          </Button>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Total do mês: R$ {total.toFixed(2)}</FilterLabel>
        </FilterGroup>
      </FilterContainer>

      <FlatList
        data={payments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductItem>
            <ProductText>Cliente: {item.cliente}</ProductText>
            <ProductText>Data: {item.dataPagamento}</ProductText>
            <ProductText>Valor: R$ {item.valor.toFixed(2)}</ProductText>
            <ProductText>Tipo: {item.tipoPagamento}</ProductText>
            <QuantityText lowStock={item.status === "pendente"}>
              Status: {item.status}
            </QuantityText>
          </ProductItem>
        )}
      />
    </Container>
  );
};

export default Payment;
