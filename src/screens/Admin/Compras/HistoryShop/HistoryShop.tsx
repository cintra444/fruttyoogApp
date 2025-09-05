import React, { useEffect, useState } from "react";
import { Modal, Alert } from "react-native";
import {
  Title,
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
} from "./styles";
import { GetCompra, DeleteCompra, PutCompra, GetFornecedor } from "../../../../Services/apiFruttyoog";

interface Fornecedor {
  id: number;
  nome: string;
}

interface Compra {
  id: number;
  dataCompra: string;
  valorTotal: number;
  fornecedorid: number;
}

const HistoryShop: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  useEffect(() => {
    carregarFornecedores();
    listarTodas();
  }, []);

  const carregarFornecedores = async () => {
    const data = await GetFornecedor();
    if (data) setFornecedores(data);
  };

  const filtrarCompras = async () => {
    const data = await GetCompra();
    if (data) {
      let filtradas = data;
      if (filtroFornecedor) {
        filtradas = filtradas.filter((c) =>
          String(c.fornecedorid).includes(filtroFornecedor)
        );
      }
      if (filtroData) {
        filtradas = filtradas.filter((c) => c.dataCompra.startsWith(filtroData));
      }
      setCompras(filtradas);
    }
  };

  const listarTodas = async () => {
    const data = await GetCompra();
    if (data) setCompras(data);
  };

  const abrirModal = (compra: Compra) => {
    setSelectedCompra(compra);
    setModalVisible(true);
  };

  const editarCompra = async () => {
    if (!selectedCompra) return;
    await PutCompra({ ...selectedCompra, valorTotal: selectedCompra.valorTotal });
    Alert.alert("Sucesso", "Compra editada!");
    listarTodas();
    setModalVisible(false);
  };

  const excluirCompra = async () => {
    if (!selectedCompra) return;
    await DeleteCompra(selectedCompra.id);
    Alert.alert("Sucesso", "Compra excluída!");
    listarTodas();
    setModalVisible(false);
  };

  const visualizarCompra = () => {
    Alert.alert(
      "Detalhes da Compra",
      `ID: ${selectedCompra?.id}\nFornecedor: ${selectedCompra?.fornecedorid}\nData: ${selectedCompra?.dataCompra}\nTotal: R$ ${selectedCompra?.valorTotal}`
    );
    setModalVisible(false);
  };

  return (
    <Container>
      <Title>Histórico de Compras</Title>
      {/* Filtros */}
      <Section>
        <Label>Fornecedor</Label>
        <Input
          placeholder="ID do fornecedor"
          value={filtroFornecedor}
          onChangeText={setFiltroFornecedor}
        />

        <Label>Data da compra</Label>
        <Input
          placeholder="AAAA-MM-DD"
          value={filtroData}
          onChangeText={setFiltroData}
        />

        <Button onPress={filtrarCompras}>
          <ButtonText>Filtrar Compras</ButtonText>
        </Button>

        <Button onPress={listarTodas} bgColor="#4caf50">
          <ButtonText>Listar Todas</ButtonText>
        </Button>
      </Section>

      {/* Lista */}
      <PurchaseList>
        {compras.map((compra) => (
          <PurchaseItem key={compra.id} onPress={() => abrirModal(compra)}>
            <PurchaseText>Compra #{compra.id}</PurchaseText>
            <PurchaseText>
              Data: {compra.dataCompra} - R$ {compra.valorTotal}
            </PurchaseText>
          </PurchaseItem>
        ))}
      </PurchaseList>

      {/* Modal */}
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
