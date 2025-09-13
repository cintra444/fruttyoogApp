// FinancialReport.tsx
import React, { useState } from "react";
import { ScrollView, Dimensions, Alert } from "react-native";
import { Container, Title, Button, ButtonText, FilterContainer, Input } from "./styles";
import { PieChart } from "react-native-chart-kit";
import { GetFinancialReport } from "../../../../Services/apiFruttyoog";

const FinancialReport: React.FC = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState<{ name: string; amount: number; color: string }[]>([]);

  const handleGenerateReport = async () => {
    if (!month || !year) {
      Alert.alert("Atenção", "Informe mês e ano!");
      return;
    }
    try {
      const res = await GetFinancialReport(month, year); // Deve retornar { receitas, despesas }
      setData([
        { name: "Receitas", amount: res.receitas, color: "#4CAF50" },
        { name: "Despesas", amount: res.despesas, color: "#F44336" },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o relatório financeiro");
    }
  };

  return (
    <ScrollView>
      <Container>
        <Title>Relatório Financeiro</Title>
        <FilterContainer>
          <Input placeholder="Mês (MM)" value={month} onChangeText={setMonth} keyboardType="numeric" />
          <Input placeholder="Ano (YYYY)" value={year} onChangeText={setYear} keyboardType="numeric" />
          <Button onPress={handleGenerateReport} bgColor="#9C27B0">
            <ButtonText>Gerar Relatório</ButtonText>
          </Button>
        </FilterContainer>

        {data.length > 0 && (
          <PieChart
            data={data}
            width={Dimensions.get("window").width - 40}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </Container>
    </ScrollView>
  );
};

export default FinancialReport;
