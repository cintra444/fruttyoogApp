import React, { useEffect, useState } from "react";
import { Modal, Alert, Text } from "react-native";
import {
  Container,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  PurchaseList,
  PurchaseItem,
  PurchaseText,
  ActionButtons,
  ActionButton,
  ActionText,
  ModalContent,
  ModalTitle,
  CloseButton,
  CloseText,
  PickerContainer,
  EmptyText,
} from "./styles";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

interface Fornecedor {
  id: number;
  nome: string;
}

interface Compra {
  id: number;
  fornecedor: string;
  dataCompra: string;
  total: number;
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const HistoryShop: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filtroFornecedor, setFiltroFornecedor] = useState<number | null>(null);
  const [filtroData, setFiltroData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fornecedoresRes, comprasRes] = await Promise.all([
          api.get("/fornecedores"),
          api.get("/compras"),
        ]);
        setFornecedores(fornecedoresRes.data);
        setCompras(comprasRes.data);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar dados da API");
      }
    };
    fetchData();
  }, []);

  const filtrarCompras = async () => {
    try {
      let endpoint = "/compras";
      if (filtroFornecedor && filtroData) {
        endpoint += `?fornecedor=${filtroFornecedor}&data=${filtroData}`;
      } else if (filtroFornecedor) {
        endpoint += `?fornecedor=${filtroFornecedor}`;
      } else if (filtroData) {
        endpoint += `?data=${filtroData}`;
      }

      const res = await api.get(endpoint);
      setCompras(res.data);

      if (res.data.length === 0) {
        Alert.alert("Aviso", "Nenhuma compra encontrada com esses filtros");
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar as compras filtradas");
    }
  };

  const listarTodas = async () => {
    try {
      const res = await api.get("/compras");
      setCompras(res.data);
      setFiltroFornecedor(null);
      setFiltroData("");
    } catch {
      Alert.alert("Erro", "Não foi possível listar todas as compras");
    }
  };

  const abrirModal = (compra: Compra) => {
    setSelectedCompra(compra);
    setModalVisible(true);
  };

  const editarCompra = async () => {
    Alert.alert("Editar", `Compra ${selectedCompra?.id} editada com sucesso!`);
    setModalVisible(false);
  };

  const excluirCompra = async () => {
    try {
      await api.delete(`/compras/${selectedCompra?.id}`);
      setCompras(compras.filter((c) => c.id !== selectedCompra?.id));
      Alert.alert("Sucesso", "Compra excluída!");
    } catch {
      Alert.alert("Erro", "Não foi possível excluir a compra");
    }
    setModalVisible(false);
  };

  const visualizarCompra = () => {
    Alert.alert(
      "Visualizar",
      `Fornecedor: ${selectedCompra?.fornecedor}\nData: ${selectedCompra?.dataCompra}\nTotal: R$ ${selectedCompra?.total}`
    );
    setModalVisible(false);
  };

  return (
    <Container>
      {/* Filtros */}
      <Section>
        <Label>Fornecedor</Label>
        <PickerContainer>
          <Picker
            selectedValue={filtroFornecedor}
            onValueChange={(itemValue) => setFiltroFornecedor(itemValue)}
          >
            <Picker.Item label="Todos" value={null} />
            {fornecedores.map((f) => (
              <Picker.Item key={f.id} label={f.nome} value={f.id} />
            ))}
          </Picker>
        </PickerContainer>

        <Label>Data da compra</Label>
        <Input
          placeholder="AAAA-MM-DD"
          value={filtroData}
          onChangeText={setFiltroData}
        />

        <Button onPress={filtrarCompras}>
          <ButtonText>Filtrar Compras</ButtonText>
        </Button>

        <Button onPress={listarTodas} style={{ marginTop: 8 }}>
          <ButtonText>Listar Todas</ButtonText>
        </Button>
      </Section>

      {/* Lista de compras */}
      <PurchaseList>
        {compras.length === 0 ? (
          <EmptyText>Nenhuma compra encontrada</EmptyText>
        ) : (
          compras.map((compra) => (
            <PurchaseItem key={compra.id} onPress={() => abrirModal(compra)}>
              <PurchaseText>
                {compra.fornecedor} - {compra.dataCompra}
              </PurchaseText>
              <PurchaseText>Total: R$ {compra.total}</PurchaseText>
            </PurchaseItem>
          ))
        )}
      </PurchaseList>

      {/* Modal de ações */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <ModalContent>
          <ModalTitle>Opções da compra</ModalTitle>
          <ActionButtons>
            <ActionButton onPress={editarCompra}>
              <ActionText>Editar</ActionText>
            </ActionButton>
            <ActionButton onPress={excluirCompra} bgColor="#ff5252">
              <ActionText>Excluir</ActionText>
            </ActionButton>
            <ActionButton onPress={visualizarCompra} bgColor="#2196f3">
              <ActionText>Visualizar</ActionText>
            </ActionButton>
          </ActionButtons>

          <CloseButton onPress={() => setModalVisible(false)}>
            <CloseText>Fechar</CloseText>
          </CloseButton>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default HistoryShop;
