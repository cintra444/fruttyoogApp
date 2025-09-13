// StockReport.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Dimensions } from "react-native";
import { Container, Title, FilterContainer, Input, Button, ButtonText } from "./styles";
import { BarChart } from "react-native-chart-kit";
import { GetStockReport } from "../../../../Services/apiFruttyoog";

interface StockItem {
  categoria: string;
  quantidade: number;
}

const StockReport: React.FC = () => {
  const [category, setCategory] = useState("");
  const [data, setData] = useState<StockItem[]>([]);

  const handleGenerateReport = async () => {
    if (!category) {
      Alert.alert("Atenção", "Informe a categoria!");
      return;
    }
    try {
      const res = await GetStockReport(category);
      setData(res || []);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o relatório");
    }
  };

  const chartData = {
    labels: data.map((item) => item.categoria),
    datasets: [
      {
        data: data.map((item) => item.quantidade),
      },
    ],
  };

  return (
    <ScrollView>
      <Container>
        <Title>Relatório de Estoque</Title>
        <FilterContainer>
          <Input placeholder="Categoria" value={category} onChangeText={setCategory} />
          <Button onPress={handleGenerateReport} bgColor="#2196F3">
            <ButtonText>Gerar Relatório</ButtonText>
          </Button>
        </FilterContainer>

        {data.length > 0 && (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
          />
        )}
      </Container>
    </ScrollView>
  );
};

export default StockReport;
