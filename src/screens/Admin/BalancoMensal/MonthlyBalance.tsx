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
import {
  GetCompra,
  GetDespesas,
  GetVenda,
} from "../../../Services/apiFruttyoog";

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

  const isCurrentMonth = (value?: string) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();
    return (
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    );
  };

  const handleLoadData = async () => {
    try {
      const [vendas, compras, despesas] = await Promise.all([
        GetVenda(),
        GetCompra(),
        GetDespesas(),
      ]);

      const revenuesMapped: Revenue[] = (vendas || [])
        .filter((item) => isCurrentMonth(item.dataVenda))
        .map((item) => ({
          id: item.id,
          descricao: `Venda #${item.id} - ${item.cliente?.nome || "Cliente"}`,
          valor: Number(item.valorTotal || 0),
        }));

      const purchaseExpenses: Expense[] = (compras || [])
        .filter((item) => isCurrentMonth(item.dataCompra))
        .map((item) => ({
          id: item.id,
          descricao: `Compra #${item.id}`,
          valor: Number(item.valorNota || 0),
        }));

      const miscExpenses: Expense[] = (despesas || [])
        .filter((item) => isCurrentMonth(item.dataDespesa || item.data))
        .map((item) => ({
          id: item.id,
          descricao: item.descricao || "Despesa",
          valor: Number(item.valor || 0),
        }));

      const allExpenses = [...purchaseExpenses, ...miscExpenses];

      setExpenses(allExpenses);
      setRevenues(revenuesMapped);
      setTotalExpenses(allExpenses.reduce((acc, e) => acc + e.valor, 0));
      setTotalRevenues(revenuesMapped.reduce((acc, r) => acc + r.valor, 0));
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
