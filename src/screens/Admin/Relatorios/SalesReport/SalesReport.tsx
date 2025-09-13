// SalesReport.tsx
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Dimensions } from "react-native";
import { Container, Title, FilterContainer, Input, Button, ButtonText } from "./styles";
import { LineChart } from "react-native-chart-kit";
import { GetSalesReport } from "../../../../Services/apiFruttyoog";

interface SalesItem {
  produto: string;
  quantidade: number;
}

const SalesReport: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<SalesItem[]>([]);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Atenção", "Informe o período!");
      return;
    }
    try {
      const res = await GetSalesReport(startDate, endDate);
      setData(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o relatório");
    }
  };

  const chartData = {
    labels: data.map((item) => item.produto),
    datasets: [
      {
        data: data.map((item) => item.quantidade),
      },
    ],
  };

  return (
    <ScrollView>
      <Container>
        <Title>Relatório de Vendas</Title>
        <FilterContainer>
          <Input placeholder="Data início (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
          <Input placeholder="Data fim (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} />
          <Button onPress={handleGenerateReport} bgColor="#4CAF50">
            <ButtonText>Gerar Relatório</ButtonText>
          </Button>
        </FilterContainer>

        {data.length > 0 && (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
          />
        )}
      </Container>
    </ScrollView>
  );
};

export default SalesReport;
