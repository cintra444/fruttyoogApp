import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Title,
  Container,
  Label,
  Input,
  Button,
  ButtonText,
  Section,
  ProductList,
  ProductItem,
  ProductText,
  RemoveButton,
  RemoveText,
  ModalContainer,
  ModalContent,
  PaymentRow,
  PaymentInput,
  CloseButton,
  CloseButtonText,
  PaymentSection,
  PaymentItem,
  PaymentItemText,
  PaymentRemoveButton,
  PaymentRemoveText,
  TotalText,
  SubtotalText,
} from "./styles";
import {
  GetCliente,
  GetProducts,
  GetFormasPagamento,
  PostVenda,
  mapearFormaPagamento,
  mapearStatusPagamento,
  type NovaVendaRequest,
  type ItemVendaRequest,
  type PagamentoRequest,
} from "../../../../Services/apiFruttyoog";

// Tipos
type Cliente = {
  id: number;
  nome: string;
};

type Produto = {
  id: number;
  nome: string;
  precoVenda: number;
  qtdeEstoque: number;
};

type FormaPagamento = {
  id: number;
  descricao: string;
};

type ProdutoSelecionado = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
};

type PagamentoSelecionado = {
  id?: number;
  formaPagamento: string;
  valor: string;
  status: "PAGO" | "PENDENTE" | "CANCELADO";
  dataPagamento?: string;
};

const NewSale: React.FC = () => {
  const navigation = useNavigation();

  // Estados da API
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(
    null
  );
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(
    null
  );
  const [quantidade, setQuantidade] = useState<string>("1");
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    ProdutoSelecionado[]
  >([]);
  const [pagamentosSelecionados, setPagamentosSelecionados] = useState<
    PagamentoSelecionado[]
  >([]);

  // Estados para modal de pagamento
  const [modalPagamentoVisible, setModalPagamentoVisible] = useState(false);
  const [pagamentoAtual, setPagamentoAtual] = useState<PagamentoSelecionado>({
    formaPagamento: "",
    valor: "",
    status: "PAGO",
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
    carregarUsuarioId();
  }, []);

  const carregarUsuarioId = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setUsuarioId(user.id);
      } else {
        // Fallback para usuário padrão
        setUsuarioId(1);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      setUsuarioId(1);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);

      // Carregar clientes
      const clientesData = await GetCliente();
      if (clientesData) {
        setClientes(clientesData);
      }

      // Carregar produtos
      const produtosData = await GetProducts();
      if (produtosData) {
        setProdutos(produtosData);
      }

      // Carregar formas de pagamento
      const formasData = await GetFormasPagamento();
      if (formasData) {
        setFormasPagamento(formasData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados iniciais");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar produto ao carrinho
  const handleAddProduto = () => {
    if (!produtoSelecionado) {
      Alert.alert("Erro", "Selecione um produto!");
      return;
    }

    const produto = produtos.find((p) => p.id === produtoSelecionado);
    if (!produto) {
      Alert.alert("Erro", "Produto não encontrado!");
      return;
    }

    const quantidadeNum = parseInt(quantidade) || 1;

    if (quantidadeNum <= 0) {
      Alert.alert("Erro", "Quantidade deve ser maior que zero!");
      return;
    }

    // Verificar estoque
    if (quantidadeNum > produto.qtdeEstoque) {
      Alert.alert(
        "Estoque insuficiente",
        `${produto.nome}\nDisponível: ${produto.qtdeEstoque} unidades\nSolicitado: ${quantidadeNum}`
      );
      return;
    }

    const jaExiste = produtosSelecionados.find((p) => p.id === produto.id);

    if (jaExiste) {
      // Verificar se a nova quantidade total excede o estoque
      const novaQuantidadeTotal = jaExiste.quantidade + quantidadeNum;
      if (novaQuantidadeTotal > produto.qtdeEstoque) {
        Alert.alert(
          "Estoque insuficiente",
          `Quantidade total excede o estoque disponível!\nDisponível: ${produto.qtdeEstoque}\nTotal após adição: ${novaQuantidadeTotal}`
        );
        return;
      }

      // Atualizar quantidade se já existe
      setProdutosSelecionados((prev) =>
        prev.map((p) =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + quantidadeNum }
            : p
        )
      );
    } else {
      setProdutosSelecionados((prev) => [
        ...prev,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.precoVenda,
          quantidade: quantidadeNum,
          estoque: produto.qtdeEstoque,
        },
      ]);
    }

    setProdutoSelecionado(null);
    setQuantidade("1");
  };

  // Remover produto
  const handleRemoveProduto = (id: number) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id));
  };

  // Calcular total dos produtos
  const calcularTotalProdutos = () =>
    produtosSelecionados.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  // Calcular total já pago
  const calcularTotalPago = () =>
    pagamentosSelecionados
      .filter((p) => p.status === "PAGO")
      .reduce((acc, p) => acc + parseFloat(p.valor || "0"), 0);

  // Calcular saldo devedor
  const calcularSaldoDevedor = () => {
    const total = calcularTotalProdutos();
    const pago = calcularTotalPago();
    return total - pago;
  };

  // Adicionar pagamento
  const handleAddPagamento = () => {
    if (!pagamentoAtual.formaPagamento) {
      Alert.alert("Erro", "Selecione uma forma de pagamento!");
      return;
    }

    if (!pagamentoAtual.valor || parseFloat(pagamentoAtual.valor) <= 0) {
      Alert.alert("Erro", "Digite um valor válido!");
      return;
    }

    const formaPagamentoMapeada = mapearFormaPagamento(
      pagamentoAtual.formaPagamento
    );
    const statusMapeado = mapearStatusPagamento(pagamentoAtual.status);

    const novoPagamento: PagamentoSelecionado = {
      ...pagamentoAtual,
      id: Date.now(),
      formaPagamento: formaPagamentoMapeada,
      status: statusMapeado as "PAGO" | "PENDENTE",
    };

    setPagamentosSelecionados((prev) => [...prev, novoPagamento]);
    setPagamentoAtual({
      formaPagamento: "",
      valor: "",
      status: "PAGO",
    });
    setModalPagamentoVisible(false);
  };

  // Remover pagamento
  const handleRemovePagamento = (id: number) => {
    setPagamentosSelecionados((prev) => prev.filter((p) => p.id !== id));
  };

  // Validar venda antes de enviar
  const validarVenda = () => {
    if (!clienteSelecionado) {
      return "Selecione um cliente!";
    }

    if (produtosSelecionados.length === 0) {
      return "Adicione pelo menos um produto!";
    }

    if (!usuarioId) {
      return "Usuário não identificado!";
    }

    const totalVenda = calcularTotalProdutos();
    const totalPago = calcularTotalPago();

    if (totalPago > totalVenda) {
      return "O valor pago não pode ser maior que o total da venda!";
    }

    return null;
  };

  // Preparar dados para envio
  const prepararDadosVenda = (): NovaVendaRequest => {
    const totalVenda = calcularTotalProdutos();
    const totalPago = calcularTotalPago();
    const saldoDevedor = totalVenda - totalPago;

    // Preparar itens da venda
    const itens: ItemVendaRequest[] = produtosSelecionados.map((p) => ({
      produtoId: p.id,
      quantidade: p.quantidade,
      valorUnitario: p.preco,
    }));

    // Preparar pagamentos
    const pagamentos: PagamentoRequest[] = [...pagamentosSelecionados].map(
      (p) => ({
        formaPagamento: p.formaPagamento,
        valor: parseFloat(p.valor),
        status: p.status,
        dataPagamento:
          p.dataPagamento ||
          (p.status === "PAGO"
            ? new Date().toISOString().split("T")[0]
            : undefined),
      })
    );

    // Se ainda houver saldo devedor, adicionar pagamento pendente
    if (saldoDevedor > 0) {
      pagamentos.push({
        formaPagamento: "FIADO",
        valor: saldoDevedor,
        status: "PENDENTE",
        dataPagamento: undefined,
      });
    }

    // Preparar venda request
    const vendaRequest: NovaVendaRequest = {
      clienteId: clienteSelecionado as number,
      usuarioId: usuarioId!,
      dataVenda: new Date().toISOString(),
      itens,
      pagamentos,
    };

    return vendaRequest;
  };

  // Finalizar venda
  const handleFinalizarVenda = async () => {
    const erro = validarVenda();
    if (erro) {
      Alert.alert("Erro", erro);
      return;
    }

    try {
      const vendaRequest = prepararDadosVenda();
      console.log("Enviando venda:", vendaRequest);

      Alert.alert(
        "Confirmar Venda",
        `Total: R$ ${calcularTotalProdutos().toFixed(2)}\nPago: R$ ${calcularTotalPago().toFixed(2)}\nSaldo: R$ ${calcularSaldoDevedor().toFixed(2)}\n\nDeseja finalizar a venda?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Finalizar",
            style: "default",
            onPress: async () => {
              try {
                setLoading(true);
                const vendaCriada = await PostVenda(vendaRequest);

                if (vendaCriada) {
                  Alert.alert(
                    "Sucesso!",
                    `Venda #${vendaCriada.id} registrada com sucesso!`,
                    [
                      {
                        text: "Ver Nota",
                        onPress: () =>
                          (navigation as any).navigate("Invoice", {
                            vendaId: vendaCriada.id,
                          }),
                      },
                      {
                        text: "Nova Venda",
                        onPress: () => {
                          // Limpar formulário
                          setClienteSelecionado(null);
                          setProdutosSelecionados([]);
                          setPagamentosSelecionados([]);
                          setProdutoSelecionado(null);
                          setQuantidade("1");
                        },
                      },
                    ]
                  );
                }
              } catch (error: any) {
                console.error("Erro ao criar venda:", error);
                Alert.alert("Erro", error.message || "Erro ao processar venda");
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao preparar venda:", error);
      Alert.alert("Erro", "Ocorreu um erro ao preparar a venda");
      setLoading(false);
    }
  };

  // Limpar formulário
  const limparFormulario = () => {
    setClienteSelecionado(null);
    setProdutosSelecionados([]);
    setPagamentosSelecionados([]);
    setProdutoSelecionado(null);
    setQuantidade("1");
    setPagamentoAtual({
      formaPagamento: "",
      valor: "",
      status: "PAGO",
    });
  };

  // Verificar se pode finalizar
  const podeFinalizar = () => {
    return clienteSelecionado && produtosSelecionados.length > 0 && usuarioId;
  };

  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toFixed(2).replace(".", ",");
  };

  if (loading) {
    return (
      <Container>
        <Title>Carregando...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Nova Venda</Title>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cliente */}
        <Section>
          <Label>Cliente *</Label>
          <Picker
            selectedValue={clienteSelecionado}
            onValueChange={(value) => setClienteSelecionado(value)}
            style={{ backgroundColor: "#f8f9fa", borderRadius: 5 }}
          >
            <Picker.Item label="Selecione um cliente" value={null} />
            {clientes.map((c) => (
              <Picker.Item key={c.id} label={c.nome} value={c.id} />
            ))}
          </Picker>
        </Section>

        {/* Produto */}
        <Section>
          <Label>Produto *</Label>
          <Picker
            selectedValue={produtoSelecionado}
            onValueChange={(value) => setProdutoSelecionado(value)}
            style={{ backgroundColor: "#f8f9fa", borderRadius: 5 }}
          >
            <Picker.Item label="Selecione um produto" value={null} />
            {produtos.map((p) => (
              <Picker.Item
                key={p.id}
                label={`${p.nome} - R$ ${p.precoVenda.toFixed(2)} (Estoque: ${p.qtdeEstoque})`}
                value={p.id}
              />
            ))}
          </Picker>

          <Label>Quantidade</Label>
          <Input
            keyboardType="numeric"
            value={quantidade}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setQuantidade(text);
              }
            }}
            placeholder="Quantidade"
          />

          <Button onPress={handleAddProduto}>
            <ButtonText>Adicionar Produto</ButtonText>
          </Button>
        </Section>

        {/* Lista de produtos selecionados */}
        {produtosSelecionados.length > 0 && (
          <Section>
            <Label>Produtos Selecionados:</Label>
            <ProductList>
              {produtosSelecionados.map((p) => (
                <ProductItem key={p.id}>
                  <ProductText>
                    <Text style={{ fontWeight: "bold" }}>{p.nome}</Text>
                    {"\n"}
                    {p.quantidade} x R$ {p.preco.toFixed(2)} = R${" "}
                    {(p.preco * p.quantidade).toFixed(2)}
                    {"\n"}
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      Estoque restante: {p.estoque - p.quantidade}
                    </Text>
                  </ProductText>
                  <RemoveButton onPress={() => handleRemoveProduto(p.id)}>
                    <RemoveText>X</RemoveText>
                  </RemoveButton>
                </ProductItem>
              ))}
            </ProductList>

            <SubtotalText>
              Subtotal: R$ {calcularTotalProdutos().toFixed(2)}
            </SubtotalText>
          </Section>
        )}

        {/* Pagamentos */}
        <Section>
          <Label>Pagamentos</Label>

          <Button onPress={() => setModalPagamentoVisible(true)}>
            <ButtonText>Adicionar Pagamento</ButtonText>
          </Button>

          {pagamentosSelecionados.length > 0 && (
            <PaymentSection>
              {pagamentosSelecionados.map((p) => (
                <PaymentItem key={p.id}>
                  <PaymentItemText>
                    {p.formaPagamento} - R$ {parseFloat(p.valor).toFixed(2)} (
                    {p.status})
                  </PaymentItemText>
                  <PaymentRemoveButton
                    onPress={() => p.id && handleRemovePagamento(p.id)}
                  >
                    <PaymentRemoveText>X</PaymentRemoveText>
                  </PaymentRemoveButton>
                </PaymentItem>
              ))}

              <PaymentItemText style={{ marginTop: 10, fontWeight: "bold" }}>
                Total Pago: R$ {calcularTotalPago().toFixed(2)}
              </PaymentItemText>
            </PaymentSection>
          )}
        </Section>

        {/* Resumo da venda */}
        <Section>
          <Label>Resumo da Venda</Label>

          <TotalText>Total: R$ {calcularTotalProdutos().toFixed(2)}</TotalText>

          <Text style={{ fontSize: 16, marginVertical: 3, color: "#27ae60" }}>
            Pago: R$ {calcularTotalPago().toFixed(2)}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginVertical: 5,
              color: calcularSaldoDevedor() > 0 ? "#e74c3c" : "#27ae60",
            }}
          >
            {calcularSaldoDevedor() > 0 ? "Saldo Devedor:" : "Troco:"} R${" "}
            {Math.abs(calcularSaldoDevedor()).toFixed(2)}
          </Text>
        </Section>

        {/* Botões de ação */}
        <Section>
          <Button
            onPress={limparFormulario}
            style={{
              backgroundColor: "#95a5a6",
              marginBottom: 10,
            }}
            disabled={!podeFinalizar()}
          >
            <ButtonText>Limpar</ButtonText>
          </Button>

          <Button
            onPress={handleFinalizarVenda}
            style={{
              backgroundColor:
                calcularSaldoDevedor() <= 0 ? "#27ae60" : "#3498db",
              marginBottom: 20,
            }}
            disabled={!podeFinalizar() || loading}
          >
            <ButtonText>
              {loading
                ? "Processando..."
                : calcularSaldoDevedor() <= 0
                  ? "Finalizar Venda"
                  : "Salvar Venda com Saldo"}
            </ButtonText>
          </Button>
        </Section>
      </ScrollView>

      {/* Modal de Pagamento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPagamentoVisible}
        onRequestClose={() => setModalPagamentoVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <Title>Adicionar Pagamento</Title>

            <Label>Forma de Pagamento *</Label>
            <Picker
              selectedValue={pagamentoAtual.formaPagamento}
              onValueChange={(value) =>
                setPagamentoAtual({ ...pagamentoAtual, formaPagamento: value })
              }
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: 5,
                marginBottom: 15,
                height: 50,
              }}
            >
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="Dinheiro" value="Dinheiro" />
              <Picker.Item
                label="Cartão de Crédito"
                value="Cartão de Crédito"
              />
              <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
              <Picker.Item label="PIX" value="PIX" />
              <Picker.Item label="Fiado" value="Fiado" />
              <Picker.Item label="Cheque" value="Cheque" />
              <Picker.Item label="A Prazo" value="A Prazo" />
              <Picker.Item label="Transferência" value="Transferência" />
              <Picker.Item label="Boleto" value="Boleto" />
              <Picker.Item label="Outros" value="Outros" />
            </Picker>

            <Label>Valor *</Label>
            <PaymentInput
              keyboardType="numeric"
              value={pagamentoAtual.valor}
              onChangeText={(text) => {
                // Permitir apenas números e ponto decimal
                const cleaned = text.replace(/[^0-9.]/g, "");
                // Garantir apenas um ponto decimal
                const parts = cleaned.split(".");
                if (parts.length > 2) return;
                // Limitar a 2 casas decimais
                if (parts[1] && parts[1].length > 2) return;
                setPagamentoAtual({ ...pagamentoAtual, valor: cleaned });
              }}
              placeholder="R$ 0,00"
              style={{ height: 50 }}
            />

            <Label>Status</Label>
            <Picker
              selectedValue={pagamentoAtual.status}
              onValueChange={(value) =>
                setPagamentoAtual({ ...pagamentoAtual, status: value })
              }
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: 5,
                marginBottom: 20,
                height: 50,
              }}
            >
              <Picker.Item label="Pago" value="PAGO" />
              <Picker.Item label="Pendente" value="PENDENTE" />
            </Picker>

            {/* Botões padronizados */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalPagamentoVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#95a5a6",
                  padding: 15,
                  borderRadius: 8,
                  marginRight: 10,
                  alignItems: "center",
                  elevation: 2,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddPagamento}
                style={{
                  flex: 1,
                  backgroundColor: "#3498db",
                  padding: 15,
                  borderRadius: 8,
                  marginLeft: 10,
                  alignItems: "center",
                  elevation: 2,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Adicionar
                </Text>
              </TouchableOpacity>
            </View>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default NewSale;
