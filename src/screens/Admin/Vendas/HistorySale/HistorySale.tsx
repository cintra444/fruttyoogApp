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
import { GetVenda, DeleteVenda, GetCliente, PutVenda } from '../../../../Services/apiFruttyoog'

interface Cliente {
  id: number;
  nome: string;
}

interface Venda {
  id: number;
  dataVenda: string;
  valorTotal: number;
  clienteid: number;
}

const HistorySale: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  useEffect(() => {
    carregarClientes();
    listarTodas();
  }, []);

  const carregarClientes = async () => {
    const data = await GetCliente();
    if (data) setClientes(data);
  };

  const filtrarVendas = async () => {
    const data = await GetVenda();
    if (data) {
      let filtradas = data;
      if (filtroCliente) {
        filtradas = filtradas.filter((v) =>
          String(v.clienteid).includes(filtroCliente)
        );
      }
      if (filtroData) {
        filtradas = filtradas.filter((v) => v.dataVenda.startsWith(filtroData));
      }
      setVendas(filtradas);
    }
  };

  const listarTodas = async () => {
    const data = await GetVenda();
    if (data) setVendas(data);
  };

  const abrirModal = (venda: Venda) => {
    setSelectedVenda(venda);
    setModalVisible(true);
  };

  const editarVenda = async () => {
    if (!selectedVenda) return;
    // exemplo: atualizar valor total (aqui vc pode abrir outro form de edição se quiser)
    await PutVenda({ ...selectedVenda, valorTotal: selectedVenda.valorTotal });
    Alert.alert("Sucesso", "Venda editada!");
    listarTodas();
    setModalVisible(false);
  };

  const excluirVenda = async () => {
    if (!selectedVenda) return;
    await DeleteVenda(selectedVenda.id);
    Alert.alert("Sucesso", "Venda excluída!");
    listarTodas();
    setModalVisible(false);
  };

  const visualizarVenda = () => {
    Alert.alert(
      "Detalhes da Venda",
      `ID: ${selectedVenda?.id}\nCliente: ${selectedVenda?.clienteid}\nData: ${selectedVenda?.dataVenda}\nTotal: R$ ${selectedVenda?.valorTotal}`
    );
    setModalVisible(false);
  };

  return (
    <Container>

      <Title>Histórico de Vendas</Title>
      {/* Filtros */}
      <Section>
        <Label>Cliente</Label>
        <Input
          placeholder="ID do cliente"
          value={filtroCliente}
          onChangeText={setFiltroCliente}
        />

        <Label>Data da venda</Label>
        <Input
          placeholder="AAAA-MM-DD"
          value={filtroData}
          onChangeText={setFiltroData}
        />

        <Button onPress={filtrarVendas}>
          <ButtonText>Filtrar Vendas</ButtonText>
        </Button>

        <Button onPress={listarTodas} bgColor="#4caf50">
          <ButtonText>Listar Todas</ButtonText>
        </Button>
      </Section>

      {/* Lista */}
      <PurchaseList>
        {vendas.map((venda) => (
          <PurchaseItem key={venda.id} onPress={() => abrirModal(venda)}>
            <PurchaseText>Venda #{venda.id}</PurchaseText>
            <PurchaseText>
              Data: {venda.dataVenda} - R$ {venda.valorTotal}
            </PurchaseText>
          </PurchaseItem>
        ))}
      </PurchaseList>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <ModalContent>
          <ModalTitle>Opções da venda</ModalTitle>
          <ActionButtons>
            <ActionButton onPress={editarVenda}>
              <ActionText>Editar</ActionText>
            </ActionButton>
            <ActionButton onPress={excluirVenda} bgColor="#ff5252">
              <ActionText>Excluir</ActionText>
            </ActionButton>
            <ActionButton onPress={visualizarVenda} bgColor="#2196f3">
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

export default HistorySale;
