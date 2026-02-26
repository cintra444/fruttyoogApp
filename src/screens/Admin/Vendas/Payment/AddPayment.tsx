// screens/HistorySale/AddPayment/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../Navigation/types";
import DateTimePicker from "react-native-date-picker";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Card,
  CardTitle,
  InfoRow,
  InfoLabel,
  InfoValue,
  FormGroup,
  Label,
  Input,
  ErrorText,
  PaymentMethodContainer,
  PaymentMethodButton,
  PaymentMethodText,
  AmountInputContainer,
  CurrencySymbol,
  AmountInput,
  Button,
  ButtonText,
  LoadingContainer,
  LoadingText,
  SuccessContainer,
  SuccessIcon,
  SuccessTitle,
  SuccessMessage,
  StatusContainer,
  Divider,
  StatusText,
} from "./styles";
import { SavePayment, GetVendaById } from "../../../../Services/apiFruttyoog";

type AddPaymentRouteProp = RouteProp<RootStackParamList, "AddPayment">;
type AddPaymentNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddPayment"
>;

const AddPayment = () => {
  const navigation = useNavigation<AddPaymentNavigationProp>();
  const route = useRoute<AddPaymentRouteProp>();
  const { saleId, customerId, customerName, balance, totalValue } =
    route.params;

  // Estados do formulário
  const [paymentMethod, setPaymentMethod] = useState<string>("DINHEIRO");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Estados de validação
  const [errors, setErrors] = useState<{
    amount?: string;
    paymentMethod?: string;
  }>({});

  // Estados de carregamento
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [saleDetails, setSaleDetails] = useState<any>(null);

  // Métodos de pagamento disponíveis
  const paymentMethods = [
    { id: "DINHEIRO", label: "Dinheiro" },
    { id: "PIX", label: "PIX" },
    { id: "CARTAO_CREDITO", label: "Cartão Crédito" },
    { id: "CARTAO_DEBITO", label: "Cartão Débito" },
    { id: "TRANSFERENCIA", label: "Transferência" },
    { id: "BOLETO", label: "Boleto" },
    { id: "CHEQUE", label: "Cheque" },
    { id: "OUTRO", label: "Outro" },
  ];

  // Carregar detalhes da venda
  useEffect(() => {
    loadSaleDetails();
  }, []);

  const loadSaleDetails = async () => {
    try {
      setLoading(true);
      const details = await GetVendaById(saleId);
      if (details) {
        setSaleDetails(details);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes da venda:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da venda");
    } finally {
      setLoading(false);
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors: any = {};

    // Validar valor
    if (!amount || amount.trim() === "") {
      newErrors.amount = "Informe o valor do pagamento";
    } else {
      const amountNum = parseFloat(amount.replace(",", "."));
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = "Valor inválido";
      } else if (amountNum > balance) {
        newErrors.amount = `Valor não pode ser maior que o saldo (${formatCurrency(balance)})`;
      }
    }

    // Validar método de pagamento
    if (!paymentMethod) {
      newErrors.paymentMethod = "Selecione um método de pagamento";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatadores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Manipular data
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };

  // Manipular valor do pagamento
  const handleAmountChange = (text: string) => {
    // Remover tudo que não é número, ponto ou vírgula
    let cleaned = text.replace(/[^\d,.]/g, "");

    // Garantir que há apenas uma vírgula ou ponto decimal
    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    if (hasComma && hasDot) {
      // Se tiver ambos, manter apenas o primeiro
      const commaIndex = cleaned.indexOf(",");
      const dotIndex = cleaned.indexOf(".");
      if (commaIndex < dotIndex) {
        cleaned = cleaned.replace(".", "");
      } else {
        cleaned = cleaned.replace(",", "");
      }
    }

    // Substituir ponto por vírgula para padrão BR
    if (hasDot && !hasComma) {
      cleaned = cleaned.replace(".", ",");
    }

    // Garantir no máximo 2 casas decimais
    const parts = cleaned.split(",");
    if (parts.length > 1) {
      cleaned = parts[0] + "," + parts[1].slice(0, 2);
    }

    setAmount(cleaned);
    // Limpar erro do campo
    if (errors.amount) {
      setErrors({ ...errors, amount: undefined });
    }
  };

  // Calcular novo saldo
  const calculateNewBalance = () => {
    if (!amount) return balance;
    const amountNum = parseFloat(amount.replace(",", "."));
    if (isNaN(amountNum)) return balance;
    return Math.max(0, balance - amountNum);
  };

  // Salvar pagamento
  const handleSavePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const amountNum = parseFloat(amount.replace(",", "."));
      const paymentData = {
        vendaId: saleId,
        clienteId: customerId,
        formaPagamento: paymentMethod,
        valor: amountNum,
        descricao: description || `Pagamento da venda #${saleId}`,
        dataPagamento: paymentDate.toISOString(),
        status: "PAGO", // Pode ser ajustado conforme necessário
      };

      const result = await SavePayment(paymentData);

      if (result && result.success) {
        setSuccess(true);
        // Atualizar saldo na venda
        setTimeout(() => {
          navigation.navigate("HistorySale");
        }, 3000);
      } else {
        throw new Error(result?.message || "Erro ao salvar pagamento");
      }
    } catch (error: any) {
      console.error("Erro ao salvar pagamento:", error);
      Alert.alert(
        "Erro",
        error.message ||
          "Não foi possível salvar o pagamento. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Renderizar tela de carregamento
  if (loading && !saleDetails) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#3498db" />
        <LoadingText>Carregando informações da venda...</LoadingText>
      </LoadingContainer>
    );
  }

  // Renderizar tela de sucesso
  if (success) {
    return (
      <SuccessContainer>
        <SuccessIcon>
          <Text style={{ fontSize: 40, color: "white" }}>✓</Text>
        </SuccessIcon>
        <SuccessTitle>Pagamento Registrado!</SuccessTitle>
        <SuccessMessage>
          O pagamento da venda #{saleId} foi registrado com sucesso.
        </SuccessMessage>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2ecc71",
            marginBottom: 10,
          }}
        >
          {formatCurrency(parseFloat(amount.replace(",", ".")))}
        </Text>
        <Text style={{ fontSize: 14, color: "#7f8c8d", marginBottom: 30 }}>
          Novo saldo: {formatCurrency(calculateNewBalance())}
        </Text>
        <Button onPress={() => navigation.navigate("HistorySale")}>
          <ButtonText>Voltar ao Histórico</ButtonText>
        </Button>
      </SuccessContainer>
    );
  }

  // Renderizar formulário principal
  const newBalance = calculateNewBalance();
  const amountNum = amount ? parseFloat(amount.replace(",", ".")) : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Container>
        <Header>
<Title>Adicionar Pagamento</Title>
          <Subtitle>Venda #{saleId}</Subtitle>
        </Header>

        <Content>
          {/* Informações da Venda */}
          <Card>
            <CardTitle>Informações da Venda</CardTitle>

            <InfoRow>
              <InfoLabel>Cliente:</InfoLabel>
              <InfoValue>{customerName || "Não informado"}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Valor Total:</InfoLabel>
              <InfoValue>{formatCurrency(totalValue)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Saldo Devedor:</InfoLabel>
              <InfoValue
                style={{
                  color: balance > 0 ? "#e74c3c" : "#2ecc71",
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(balance)}
              </InfoValue>
            </InfoRow>

            <Divider />

            {saleDetails?.pagamentos && saleDetails.pagamentos.length > 0 && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: 10,
                  }}
                >
                  Pagamentos Realizados
                </Text>
                {saleDetails.pagamentos.map((pagamento: any, index: number) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: 10,
                      borderRadius: 6,
                      marginBottom: 8,
                      borderLeftWidth: 4,
                      borderLeftColor:
                        pagamento.status === "PAGO" ? "#2ecc71" : "#f39c12",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#2c3e50" }}>
                        {pagamento.formaPagamento}
                      </Text>
                      <Text style={{ color: "#27ae60", fontWeight: "bold" }}>
                        {formatCurrency(pagamento.valor)}
                      </Text>
                    </View>
                    {pagamento.descricao && (
                      <Text
                        style={{ fontSize: 12, color: "#7f8c8d", marginTop: 2 }}
                      >
                        {pagamento.descricao}
                      </Text>
                    )}
                    {pagamento.dataPagamento && (
                      <Text style={{ fontSize: 12, color: "#7f8c8d" }}>
                        {new Date(pagamento.dataPagamento).toLocaleDateString(
                          "pt-BR",
                        )}
                      </Text>
                    )}
                  </View>
                ))}
              </>
            )}
          </Card>

          {/* Formulário de Pagamento */}
          <Card>
            <CardTitle>Novo Pagamento</CardTitle>

            {/* Método de Pagamento */}
            <FormGroup>
              <Label>Método de Pagamento *</Label>
              <PaymentMethodContainer>
                {paymentMethods.map((method) => (
                  <PaymentMethodButton
                    key={method.id}
                    selected={paymentMethod === method.id}
                    onPress={() => {
                      setPaymentMethod(method.id);
                      if (errors.paymentMethod) {
                        setErrors({ ...errors, paymentMethod: undefined });
                      }
                    }}
                  >
                    <PaymentMethodText selected={paymentMethod === method.id}>
                      {method.label}
                    </PaymentMethodText>
                  </PaymentMethodButton>
                ))}
              </PaymentMethodContainer>
              {errors.paymentMethod && (
                <ErrorText>{errors.paymentMethod}</ErrorText>
              )}
            </FormGroup>

            {/* Valor do Pagamento */}
            <FormGroup>
              <Label>Valor do Pagamento *</Label>
              <AmountInputContainer>
                <CurrencySymbol>R$</CurrencySymbol>
                <AmountInput
                  placeholder="0,00"
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="decimal-pad"
                  maxLength={15}
                />
              </AmountInputContainer>
              {errors.amount && <ErrorText>{errors.amount}</ErrorText>}

              {/* Sugestões de valores */}
              {balance > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {[balance, balance / 2, balance / 4].map(
                    (suggestion, index) => {
                      if (suggestion <= 0) return null;
                      const labels = ["Total", "Metade", "Quarta parte"];
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            setAmount(suggestion.toFixed(2).replace(".", ","))
                          }
                          style={{
                            backgroundColor: "#ecf0f1",
                            padding: 8,
                            borderRadius: 6,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                        >
                          <Text style={{ fontSize: 12, color: "#2c3e50" }}>
                            {labels[index]}: {formatCurrency(suggestion)}
                          </Text>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>
              )}
            </FormGroup>

            {/* Data do Pagamento */}
            <FormGroup>
              <Label>Data do Pagamento</Label>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <Text style={{ fontSize: 16, color: "#2c3e50" }}>
                  {formatDate(paymentDate)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  date={paymentDate}
                  mode="date"
                  onDateChange={setPaymentDate}
                />
              )}
            </FormGroup>

            {/* Descrição */}
            <FormGroup>
              <Label>Descrição (Opcional)</Label>
              <Input
                placeholder="Ex: Pagamento parcial, entrada, etc."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: "top" }}
              />
            </FormGroup>

            {/* Resumo */}
            <View
              style={{
                backgroundColor: "#f8f9fa",
                padding: 15,
                borderRadius: 8,
                marginTop: 20,
                borderWidth: 1,
                borderColor: "#e0e0e0",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: 10,
                }}
              >
                Resumo do Pagamento
              </Text>

              <InfoRow>
                <InfoLabel>Valor a pagar:</InfoLabel>
                <InfoValue style={{ fontWeight: "bold", color: "#27ae60" }}>
                  {amount ? formatCurrency(amountNum) : "R$ 0,00"}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Saldo anterior:</InfoLabel>
                <InfoValue>{formatCurrency(balance)}</InfoValue>
              </InfoRow>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#ddd",
                  marginVertical: 10,
                }}
              />

              <InfoRow>
                <InfoLabel>Novo saldo:</InfoLabel>
                <InfoValue
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: newBalance > 0 ? "#e74c3c" : "#2ecc71",
                  }}
                >
                  {formatCurrency(newBalance)}
                </InfoValue>
              </InfoRow>

              {newBalance === 0 && (
                <StatusContainer>
                  <Text style={{ fontSize: 20 }}>🎉</Text>
                  <StatusText>
                    Venda será quitada após este pagamento!
                  </StatusText>
                </StatusContainer>
              )}
            </View>

            {/* Botão de Salvar */}
            <Button
              onPress={handleSavePayment}
              disabled={
                loading || !amount || parseFloat(amount.replace(",", ".")) <= 0
              }
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ButtonText>
                  {newBalance === 0 ? "QUITAR VENDA" : "REGISTRAR PAGAMENTO"}
                </ButtonText>
              )}
            </Button>

            {/* Informações adicionais */}
            <Text
              style={{
                fontSize: 12,
                color: "#95a5a6",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              * Campos obrigatórios
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#bdc3c7",
                textAlign: "center",
                marginTop: 5,
              }}
            >
              Após registrar o pagamento, o histórico será atualizado
              automaticamente
            </Text>
          </Card>
        </Content>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default AddPayment;

