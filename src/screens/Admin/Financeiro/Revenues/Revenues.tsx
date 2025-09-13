// Revenues.tsx
import React, { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Container, Label, TotalText } from "./styles";
import { GetPayments, GetDespesa } from "../../../../Services/apiFruttyoog";

const Revenues: React.FC = () => {
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    calculateRevenue();
  }, []);

  const calculateRevenue = async () => {
    try {
      const payments = await GetPayments();
      if(!Array.isArray(payments)) return;

      const expenses = await GetDespesa();
      if(!Array.isArray(expenses)) return;
      
      const totalPay = payments.reduce((acc, curr) => acc + curr.valor, 0);
      const totalExp = expenses.reduce((acc, curr) => acc + curr.valor, 0);
      setTotalPayments(totalPay);
      setTotalExpenses(totalExp);
    } catch {
      Alert.alert("Erro", "Não foi possível calcular a receita");
    }
  };

  return (
    <Container>
      <Label>Total Recebido: R$ {totalPayments.toFixed(2)}</Label>
      <Label>Total Despesas: R$ {totalExpenses.toFixed(2)}</Label>
      <TotalText>Lucro: R$ {(totalPayments - totalExpenses).toFixed(2)}</TotalText>
    </Container>
  );
};

export default Revenues;
