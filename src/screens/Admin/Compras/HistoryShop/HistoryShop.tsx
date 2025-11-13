import React, { useEffect, useState } from "react";
import { Modal, Alert, ScrollView, Text, View } from "react-native";
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
  FilterRow,
  DateButton,
  DateButtonText,
  StatsContainer,
  StatItem,
  StatLabel,
  StatValue,
  DetailItem,
  DetailLabel,
  DetailValue,
  SearchInput,
} from "./styles";
import {
  GetCompra,
  DeleteCompra,
  PutCompra,
  GetFornecedor,
} from "../../../../Services/apiFruttyoog";

interface Fornecedor {
  id: number;
  nome: string;
}

interface Compra {
  id: number;
  dataCompra: string;
  valorTotal: number;
  fornecedorId: number;
  tipoCompra: string;
  tipoPagamento: string;
  observacao?: string;
  fornecedorNome?: string;
}

const HistoryShop: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [comprasFiltradas, setComprasFiltradas] = useState<Compra[]>([]);
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [buscaRapida, setBuscaRapida] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroFornecedor, filtroDataInicio, filtroDataFim, buscaRapida]);

  const carregarDados = async () => {
    await carregarFornecedores();
    await listarTodas();
  };

  const carregarFornecedores = async () => {
    const data = await GetFornecedor();
    if (data) setFornecedores(data);
  };

  const listarTodas = async () => {
    const data = await GetCompra();
    if (data) {
      const comprasComFornecedor = data.map((compra) => ({
        ...compra,
        fornecedorNome:
          fornecedores.find((f) => f.id === compra.fornecedorId)?.nome ||
          "Fornecedor não encontrado",
      }));
      setCompras(comprasComFornecedor);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...compras];

    if (filtroFornecedor) {
      filtradas = filtradas.filter((compra) =>
        compra.fornecedorNome
          ?.toLowerCase()
          .includes(filtroFornecedor.toLowerCase())
      );
    }

    if (filtroDataInicio) {
      filtradas = filtradas.filter(
        (compra) => compra.dataCompra >= filtroDataInicio
      );
    }

    if (filtroDataFim) {
      filtradas = filtradas.filter(
        (compra) => compra.dataCompra <= filtroDataFim
      );
    }

    if (buscaRapida) {
      filtradas = filtradas.filter(
        (compra) =>
          compra.id.toString().includes(buscaRapida) ||
          compra.tipoCompra.toLowerCase().includes(buscaRapida.toLowerCase()) ||
          compra.tipoPagamento
            .toLowerCase()
            .includes(buscaRapida.toLowerCase()) ||
          compra.observacao
            ?.toLowerCase()
            .includes(buscaRapida.toLowerCase()) ||
          compra.fornecedorNome
            ?.toLowerCase()
            .includes(buscaRapida.toLowerCase())
      );
    }
    setComprasFiltradas(filtradas);
  };

  const limparFiltros = () => {
    setFiltroFornecedor("");
    setFiltroDataInicio("");
    setFiltroDataFim("");
    setBuscaRapida("");
    Alert.alert(
      "Filtros Limpados",
      "Todos os filtros foram removidos e a lista foi restaurada."
    );
  };

  const abrirModal = (compra: Compra) => {
    setSelectedCompra(compra);
    setModalVisible(true);
  };

  const editarCompra = async () => {
    if (!selectedCompra) return;

    // Aqui você pode navegar para uma tela de edição
    Alert.alert("Editar", "Redirecionar para tela de edição?");
    setModalVisible(false);
  };

  const excluirCompra = async () => {
    if (!selectedCompra) return;

    Alert.alert(
      "Confirmar Exclusão",
      `Deseja excluir a compra #${selectedCompra.id}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await DeleteCompra(selectedCompra.id);
            Alert.alert("Sucesso", "Compra excluída!");
            await listarTodas();
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const visualizarDetalhes = () => {
    if (!selectedCompra) return;

    Alert.alert(
      `Detalhes da Compra #${selectedCompra.id}`,
      `Fornecedor: ${selectedCompra.fornecedorNome}\n` +
        `Data: ${formatarData(selectedCompra.dataCompra)}\n` +
        `Valor Total: R$ ${selectedCompra.valorTotal.toFixed(2)}\n` +
        `Tipo: ${selectedCompra.tipoCompra}\n` +
        `Pagamento: ${selectedCompra.tipoPagamento}\n` +
        (selectedCompra.observacao
          ? `Observações: ${selectedCompra.observacao}`
          : "")
    );
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2)}`;
  };

  // Estatísticas
  const totalCompras = comprasFiltradas.length;
  const valorTotal = comprasFiltradas.reduce(
    (sum, compra) => sum + compra.valorTotal,
    0
  );
  const valorMedio = totalCompras > 0 ? valorTotal / totalCompras : 0;

  return (
    <Container>
      <ScrollView>
        <Title>Histórico de Compras</Title>

        {/* Estatísticas Rápidas */}
        <StatsContainer>
          <StatItem>
            <StatLabel>Total de Compras</StatLabel>
            <StatValue>{totalCompras}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Valor Total</StatLabel>
            <StatValue>{formatarMoeda(valorTotal)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Valor Médio</StatLabel>
            <StatValue>{formatarMoeda(valorMedio)}</StatValue>
          </StatItem>
        </StatsContainer>

        {/* Filtros */}
        <Section>
          <Label>Busca Rápida</Label>
          <SearchInput
            placeholder="ID, fornecedor, tipo, pagamento..."
            value={buscaRapida}
            onChangeText={setBuscaRapida}
          />

          <FilterRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Label>Fornecedor</Label>
              <Input
                placeholder="Nome do fornecedor"
                value={filtroFornecedor}
                onChangeText={setFiltroFornecedor}
              />
            </View>
          </FilterRow>

          <FilterRow>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Label>Data Início</Label>
              <Input
                placeholder="AAAA-MM-DD"
                value={filtroDataInicio}
                onChangeText={setFiltroDataInicio}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Label>Data Fim</Label>
              <Input
                placeholder="AAAA-MM-DD"
                value={filtroDataFim}
                onChangeText={setFiltroDataFim}
              />
            </View>
          </FilterRow>

          <FilterRow>
            <Button
              onPress={limparFiltros}
              bgColor="#6c757d"
              style={{ flex: 1, marginRight: 10 }}
            >
              <ButtonText>Limpar Filtros</ButtonText>
            </Button>
            <Button onPress={listarTodas} bgColor="#4caf50" style={{ flex: 1 }}>
              <ButtonText>Recarregar</ButtonText>
            </Button>
          </FilterRow>
        </Section>

        {/* Lista de Compras */}
        <Label>
          {comprasFiltradas.length === compras.length
            ? `Todas as compras (${compras.length})`
            : `Compras filtradas (${comprasFiltradas.length} de ${compras.length})`}
        </Label>

        <PurchaseList>
          {comprasFiltradas.map((compra) => (
            <PurchaseItem key={compra.id} onPress={() => abrirModal(compra)}>
              <PurchaseText style={{ fontWeight: "bold", fontSize: 16 }}>
                Compra #{compra.id} - {formatarMoeda(compra.valorTotal)}
              </PurchaseText>
              <PurchaseText>
                📅 {formatarData(compra.dataCompra)} | 🏢{" "}
                {compra.fornecedorNome}
              </PurchaseText>
              <PurchaseText>
                📦 {compra.tipoCompra} | 💳 {compra.tipoPagamento}
              </PurchaseText>
            </PurchaseItem>
          ))}
        </PurchaseList>

        {comprasFiltradas.length === 0 && (
          <View style={{ alignItems: "center", padding: 20 }}>
            <Text style={{ color: "#666", fontStyle: "italic" }}>
              Nenhuma compra encontrada
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Ações */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <ModalContent>
          <ModalTitle>Compra #{selectedCompra?.id}</ModalTitle>

          {selectedCompra && (
            <View style={{ marginBottom: 20 }}>
              <DetailItem>
                <DetailLabel>Fornecedor:</DetailLabel>
                <DetailValue>{selectedCompra.fornecedorNome}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Data:</DetailLabel>
                <DetailValue>
                  {formatarData(selectedCompra.dataCompra)}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Valor:</DetailLabel>
                <DetailValue>
                  {formatarMoeda(selectedCompra.valorTotal)}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Tipo:</DetailLabel>
                <DetailValue>{selectedCompra.tipoCompra}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Pagamento:</DetailLabel>
                <DetailValue>{selectedCompra.tipoPagamento}</DetailValue>
              </DetailItem>
              {selectedCompra.observacao && (
                <DetailItem>
                  <DetailLabel>Observações:</DetailLabel>
                  <DetailValue>{selectedCompra.observacao}</DetailValue>
                </DetailItem>
              )}
            </View>
          )}

          <ActionButtons>
            <ActionButton onPress={visualizarDetalhes} bgColor="#2196f3">
              <ActionText>👁️ Detalhes</ActionText>
            </ActionButton>
            <ActionButton onPress={editarCompra} bgColor="#ff9800">
              <ActionText>✏️ Editar</ActionText>
            </ActionButton>
            <ActionButton onPress={excluirCompra} bgColor="#ff5252">
              <ActionText>🗑️ Excluir</ActionText>
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
