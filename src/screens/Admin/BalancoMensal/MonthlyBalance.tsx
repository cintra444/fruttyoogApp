import React, { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import {
  Container,
  Title,
  SectionTitle,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TotalText,
  BalanceText,
} from "./styles";
import { GetExpenses, GetRevenues } from "../../../Services/apiFruttyoog"; // ajuste conforme sua API

interface Expense {
  id: number;
  descricao: string;
  valor: number;
}

interface Revenue {
  id: number;
  descricao: string;
  valor: number;
}

const MonthlyBalance: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalRevenues, setTotalRevenues] = useState(0);

  useEffect(() => {
    handleLoadData();
  }, []);

  const handleLoadData = async () => {
    try {
      const exp = await GetExpenses(); // retorna despesas do mês atual
      const rev = await GetRevenues(); // retorna receitas do mês atual

      setExpenses(exp || []);
      setRevenues(rev || []);

      setTotalExpenses(exp?.reduce((acc: number, e: Expense) => acc + e.valor, 0) || 0);
      setTotalRevenues(rev?.reduce((acc: number, r: Revenue) => acc + r.valor, 0) || 0);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados do balanço");
    }
  };

  const balance = totalRevenues - totalExpenses;

  return (
    <ScrollView>
      <Container>
        <Title>Balanço Mensal</Title>

        {/* Receitas */}
        <SectionTitle>Receitas</SectionTitle>
        <Table>
          <TableHeader>
            <TableCell style={{ flex: 2, fontWeight: "bold" }}>Descrição</TableCell>
            <TableCell style={{ flex: 1, fontWeight: "bold", textAlign: "right" }}>Valor</TableCell>
          </TableHeader>
          {revenues.map((item) => (
            <TableRow key={item.id}>
              <TableCell style={{ flex: 2 }}>{item.descricao}</TableCell>
              <TableCell style={{ flex: 1, textAlign: "right" }}>
                R$ {item.valor.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <TotalText>Total Receitas: R$ {totalRevenues.toFixed(2)}</TotalText>

        {/* Despesas */}
        <SectionTitle>Despesas</SectionTitle>
        <Table>
          <TableHeader>
            <TableCell style={{ flex: 2, fontWeight: "bold" }}>Descrição</TableCell>
            <TableCell style={{ flex: 1, fontWeight: "bold", textAlign: "right" }}>Valor</TableCell>
          </TableHeader>
          {expenses.map((item) => (
            <TableRow key={item.id}>
              <TableCell style={{ flex: 2 }}>{item.descricao}</TableCell>
              <TableCell style={{ flex: 1, textAlign: "right" }}>
                R$ {item.valor.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <TotalText>Total Despesas: R$ {totalExpenses.toFixed(2)}</TotalText>

        {/* Resultado */}
        <SectionTitle>Resultado</SectionTitle>
        <BalanceText positive={balance >= 0}>
          {balance >= 0
            ? `Lucro: R$ ${balance.toFixed(2)}`
            : `Prejuízo: R$ ${balance.toFixed(2)}`}
        </BalanceText>
      </Container>
    </ScrollView>
  );
};

export default MonthlyBalance;
