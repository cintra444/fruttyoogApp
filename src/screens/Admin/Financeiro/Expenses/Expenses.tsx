// Expenses.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import { Container, Section, ExpenseItem, Label, TotalText } from "./styles";
import { GetDespesa } from "../../../../Services/apiFruttyoog";

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Despesa[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await GetDespesa();
      if (data){
        setExpenses
        const totalValor = data.reduce((acc, curr) => acc + curr.valor, 0);
        setTotal(totalValor);
      } else {
        setExpenses([]);
        setTotal(0);
      }

    } catch {
      Alert.alert("Erro", "Não foi possível carregar as despesas");
    }
  };

  return (
    <Container>
      <TotalText>Total despesas: R$ {total.toFixed(2)}</TotalText>
      <ScrollView>
        {expenses.map(exp => (
          <ExpenseItem key={exp.id}>
            <Label>Descrição: {exp.descricao}</Label>
            <Label>Valor: R$ {exp.valor.toFixed(2)}</Label>
            <Label>Data: {exp.data}</Label>
          </ExpenseItem>
        ))}
      </ScrollView>
    </Container>
  );
};

export default Expenses;
