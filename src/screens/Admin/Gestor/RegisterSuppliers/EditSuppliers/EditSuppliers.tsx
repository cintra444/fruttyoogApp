// EditSuppliers.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  CardContainer,
  CardTouchable,
  CardTitle,
  DeleteButton,
  DeleteButtonText,
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  GetFornecedor,
  PutFornecedor,
  DeleteFornecedor,
} from "../../../../../Services/apiFruttyoog";

interface Supplier {
  id: number;
  nomeFantasia: string;
  nomeContato: string;
  telefone: string;
}

const EditSuppliers: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [telefone, setTelefone] = useState("");

  //funcao para formatar telefone
  const formatarTelefone = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      return cleaned.length === 0 ? "" : `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      // Para celular com 11 dígitos (xx) xxxxx-xxxx
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  // Carregar fornecedores

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await GetFornecedor();

      if (data) {
        setSuppliers(data);

        if (
          selectedSupplier &&
          !data.find((sup) => sup.id === selectedSupplier.id)
        ) {
          limparFormulario();
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os fornecedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // ordenar fornecedor ordem alfabética
  const suppliersOrdenados = useMemo(() => {
    return [...suppliers].sort((a, b) =>
      a.nomeFantasia.localeCompare(b.nomeFantasia, "pt-BR", {
        sensitivity: "base",
      })
    );
  }, [suppliers]);

  // Selecionar fornecedor
  const selectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setNomeFantasia(supplier.nomeFantasia);
    setVendedor(supplier.nomeContato);
    setTelefone(formatarTelefone(supplier.telefone || ""));
  };

  // Limpar formulário
  const limparFormulario = () => {
    setSelectedSupplier(null);
    setNomeFantasia("");
    setVendedor("");
    setTelefone("");
  };

  // Atualizar fornecedor
  const updateSupplier = async () => {
    if (!selectedSupplier) return;

    if (!nomeFantasia || !vendedor || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const telefoneFormatado = telefone.replace(/\D/g, "");

      await PutFornecedor({
        ...selectedSupplier,
        nomeFantasia,
        nomeContato: vendedor,
        telefone: telefoneFormatado,
      });

      Alert.alert("Sucesso", "Fornecedor atualizado!");

      // recarregar lista após atualização
      await loadSuppliers();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar o fornecedor");
    }
  };

  // Deletar fornecedor
  const deleteSupplier = async () => {
    if (!selectedSupplier) return;

    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente deletar o fornecedor ${selectedSupplier.nomeFantasia}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteFornecedor(selectedSupplier.id);
              Alert.alert("Sucesso", "Fornecedor deletado!");

              await loadSuppliers();
              limparFormulario();
            } catch (error) {
              console.log(error);
              Alert.alert("Erro", "Não foi possível deletar o fornecedor");
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      {/* Botão de voltar */}
<Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Editar Fornecedor
      </Text>

      {/* Seção da Lista de Fornecedores com rolagem */}
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Label>Selecione um fornecedor:</Label>

        <CardContainer
          style={{
            maxHeight: 250,
            flexDirection: "column",
            flex: 1,
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {loading ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Carregando fornecedores...
              </CardTitle>
            ) : suppliersOrdenados.length === 0 ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Nenhum fornecedor cadastrado
              </CardTitle>
            ) : (
              suppliersOrdenados.map((supplier) => (
                <CardTouchable
                  key={supplier.id}
                  onPress={() => selectSupplier(supplier)}
                  style={{
                    marginBottom: 10,
                    backgroundColor:
                      selectedSupplier?.id === supplier.id ? "#E3F2FD" : "#fff",
                    borderWidth: selectedSupplier?.id === supplier.id ? 2 : 1,
                    borderColor:
                      selectedSupplier?.id === supplier.id ? "#2196F3" : "#ccc",
                  }}
                >
                  <CardTitle
                    style={{
                      fontWeight:
                        selectedSupplier?.id === supplier.id ? "600" : "400",
                    }}
                  >
                    {supplier.nomeFantasia}
                  </CardTitle>
                  {supplier.nomeContato && (
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      Contato: {supplier.nomeContato}
                    </Text>
                  )}
                </CardTouchable>
              ))
            )}
          </ScrollView>
        </CardContainer>
      </View>

      {/* Seção do Formulário de Edição */}
      {selectedSupplier && (
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 15,
              color: "#6200ee",
            }}
          >
            Editando: {selectedSupplier.nomeFantasia}
          </Text>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Section>
              <Label>Nome Fantasia *</Label>
              <Input
                value={nomeFantasia}
                onChangeText={setNomeFantasia}
                placeholder="Nome fantasia do fornecedor"
              />

              <Label>Vendedor/Contato *</Label>
              <Input
                value={vendedor}
                onChangeText={setVendedor}
                placeholder="Nome do vendedor/contato"
              />

              <Label>Telefone *</Label>
              <Input
                value={telefone}
                onChangeText={(text) => setTelefone(formatarTelefone(text))}
                keyboardType="phone-pad"
                maxLength={15}
                placeholder="(XX) XXXXX-XXXX"
              />
            </Section>

            <Button onPress={updateSupplier}>
              <ButtonText>Atualizar Fornecedor</ButtonText>
            </Button>

            {/* Botão para recarregar manualmente */}
            <Button
              onPress={loadSuppliers}
              style={{
                backgroundColor: "#4CAF50",
                marginTop: 10,
                padding: 8,
              }}
            >
              <ButtonText>Recarregar Lista</ButtonText>
            </Button>

            <DeleteButton onPress={deleteSupplier}>
              <DeleteButtonText>Excluir Fornecedor</DeleteButtonText>
            </DeleteButton>
          </ScrollView>
        </View>
      )}
    </Container>
  );
};

export default EditSuppliers;

