import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { Title, Container, Section, Label, Input, Button, ButtonText, Card, CardTitle, CardText } from "./styles";



interface Produto {
  id: number;
  nome: string;
  valor: number;
}

interface Nota {
  id: number;
  cliente: string;
  produtos: Produto[];
  formaPagamento: string;
  valorTotal: number;
}


const Invoice: React.FC = ({ route, navigation }: any) => {    
  const [clienteBusca, setClienteBusca] = useState("");
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notaGerada, setNotaGerada] = useState<Nota | null>(null);

  // id da venda passada pela tela NewSale
  const newSaleId = route?.params?.newSaleId;

  const API_BASE = "http://10.0.2.2:8080"; 
  // use http://localhost:8080 se rodar no web
  // use http://192.168.x.x:8080 se rodar em celular físico

  useEffect(() => {
    listarTodasNotas();
  }, []);

  // 🔹 Listar todas
  const listarTodasNotas = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notas`);
      setNotas(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as notas.");
    }
  };

  // 🔹 Gerar nota a partir da venda
  const gerarNota = async () => {
    if (!newSaleId) {
      Alert.alert("Erro", "Nenhuma venda selecionada para gerar nota.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/notas`, {
        idVenda: newSaleId,
      });

      setNotaGerada(response.data);
      setNotas((prev) => [...prev, response.data]);
      Alert.alert("Sucesso", "Nota gerada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar a nota.");
    }
  };

  // 🔹 Buscar por cliente
  const buscarNota = async () => {
    if (!clienteBusca.trim()) {
      Alert.alert("Erro", "Digite o nome do cliente para buscar.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE}/notas?cliente=${clienteBusca}`
      );
      if (response.data.length === 0) {
        Alert.alert("Aviso", "Nenhuma nota encontrada.");
      }
      setNotas(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar notas.");
    }
  };

  return (
    <Container>
        <Title>Notas Fiscais</Title>
      <Section>
        <Button onPress={gerarNota} bgColor="#4CAF50">
          <ButtonText>Gerar Nota</ButtonText>
        </Button>

        <Button onPress={() => navigation.goBack()} bgColor="#2196F3">
          <ButtonText>Inserir (Voltar)</ButtonText>
        </Button>

        <Button onPress={listarTodasNotas} bgColor="#FF9800">
          <ButtonText>Listar Todas</ButtonText>
        </Button>
      </Section>

      <Section>
        <Label>Buscar Nota por Cliente</Label>
        <Input
          placeholder="Digite o nome do cliente"
          value={clienteBusca}
          onChangeText={setClienteBusca}
        />
        <Button onPress={buscarNota}>
          <ButtonText>Buscar</ButtonText>
        </Button>
      </Section>

      {notaGerada && (
        <Card>
          <CardTitle>Última Nota Gerada</CardTitle>
          <CardText>Cliente: {notaGerada.cliente}</CardText>
          <CardText>
            Forma de Pagamento: {notaGerada.formaPagamento}
          </CardText>
          <CardText>Produtos:</CardText>
          {notaGerada.produtos.map((p) => (
            <CardText key={p.id}>
              - {p.nome}: R$ {p.valor.toFixed(2)}
            </CardText>
          ))}
          <CardText>
            Valor Total: R$ {notaGerada.valorTotal.toFixed(2)}
          </CardText>
        </Card>
      )}

      <Section>
        {notas.map((nota) => (
          <Card key={nota.id}>
            <CardTitle>Nota #{nota.id}</CardTitle>
            <CardText>Cliente: {nota.cliente}</CardText>
            <CardText>
              Valor Total: R$ {nota.valorTotal.toFixed(2)}
            </CardText>
          </Card>
        ))}
      </Section>
    </Container>
  );
}
export default Invoice;
