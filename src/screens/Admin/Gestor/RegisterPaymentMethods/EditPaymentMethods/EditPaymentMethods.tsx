import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  Container,
  Title,
  PaymentItem,
  PaymentText,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  ActionsContainer,
} from "./styles";
import {
  GetPaymentMethods,
  PutPaymentMethods,
  DeletePaymentMethods,
} from "../../../../../Services/apiFruttyoog"; // ajuste o caminho

interface PaymentMethod {
  id: number;
  formaPagamento: string;
  prazo: string;
}

const EditPaymentMethods: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [prazo, setPrazo] = useState("");

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    try {
        const data = await GetPaymentMethods();
        if (data) {
            const formattedMethods = data.map((item) => ({
                id: item.id,
                formaPagamento: item.tipoPagamento,
                prazo: item.prazoDias.toString(),
            }));
            setMethods(formattedMethods);
        }
    } catch {
        Alert.alert("Erro", "Nao foi possivel carregar as formas de pagamento");       
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      Alert.alert("Atenção", "Selecione uma forma de pagamento para editar");
      return;
    }
    try {
      await PutPaymentMethods({ id: selectedId, tipoPagamento: formaPagamento, prazoDias: parseInt(prazo) });
      Alert.alert("Sucesso", "Forma de pagamento atualizada!");
      setSelectedId(null);
      setFormaPagamento("");
      setPrazo("");
      loadMethods();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await DeletePaymentMethods(id);
      Alert.alert("Sucesso", "Forma de pagamento excluída!");
      loadMethods();
    } catch {
      Alert.alert("Erro", "Não foi possível excluir");
    }
  };

  const selectMethod = (method: PaymentMethod) => {
    setSelectedId(method.id);
    setFormaPagamento(method.formaPagamento);
    setPrazo(method.prazo);
  };

  return (
    <Container>
      <Title>Editar Formas de Pagamento</Title>

      <FlatList
        data={methods}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PaymentItem
            onPress={() => selectMethod(item)}
            selected={item.id === selectedId}
          >
            <PaymentText>
              {item.formaPagamento} - {item.prazo}
            </PaymentText>
            <ActionsContainer>
              <Button onPress={() => selectMethod(item)} bgColor="#2196F3">
                <ButtonText>Editar</ButtonText>
              </Button>
              <Button onPress={() => handleDelete(item.id)} bgColor="#E53935">
                <ButtonText>Excluir</ButtonText>
              </Button>
            </ActionsContainer>
          </PaymentItem>
        )}
      />

      {selectedId && (
        <>
          <Section>
            <Label>Forma de Pagamento</Label>
            <Input
              value={formaPagamento}
              onChangeText={setFormaPagamento}
              placeholder="Ex: Cartão de Crédito"
            />
          </Section>

          <Section>
            <Label>Prazo</Label>
            <Input
              value={prazo}
              onChangeText={setPrazo}
              placeholder="Ex: 30 dias"
            />
          </Section>

          <Button onPress={handleUpdate} bgColor="#2196F3">
            <ButtonText>Atualizar</ButtonText>
          </Button>
        </>
      )}
    </Container>
  );
};

export default EditPaymentMethods;
