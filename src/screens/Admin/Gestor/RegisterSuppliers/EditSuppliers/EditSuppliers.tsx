// EditSuppliers.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text } from "react-native";
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
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GetFornecedor, PutFornecedor, DeleteFornecedor } from "../../../../../Services/apiFruttyoog";

interface Supplier {
  id: number;
  nomeFantasia: string;
  nomeContato: string;
  telefone: string;
}

const EditSuppliers: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [nomeFantasia, setNomeFantasia] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [telefone, setTelefone] = useState("");

  // Carregar fornecedores
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await GetFornecedor();
        console.log("Fornecedores carregados:", data);
        if (data) setSuppliers(data);
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Não foi possível carregar os fornecedores");
      }
    };
    loadSuppliers();
  }, []);

  // Selecionar fornecedor
  const selectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setNomeFantasia(supplier.nomeFantasia);
    setVendedor(supplier.nomeContato);
    setTelefone(supplier.telefone);
  };

  // Atualizar fornecedor
  const updateSupplier = async () => {
    if (!selectedSupplier) return;

    if (!nomeFantasia || !vendedor || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await PutFornecedor({
        ...selectedSupplier,
        nomeFantasia,
        nomeContato: vendedor,
        telefone,
      });

      // Atualiza a lista localmente
      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.id === selectedSupplier.id
            ? { ...sup, nomeFantasia, nomeContato: vendedor, telefone }
            : sup
        )
      );

      Alert.alert("Sucesso", "Fornecedor atualizado!");
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
              setSuppliers((prev) => prev.filter((sup) => sup.id !== selectedSupplier.id));
              setSelectedSupplier(null);
              Alert.alert("Sucesso", "Fornecedor deletado!");
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
                        <BackButton onPress={() => navigation.goBack()}>
                          <Icon name="arrow-left" size={33} color="#000" />
                          <BackButtonText>Voltar</BackButtonText>
                        </BackButton>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Editar Fornecedor</Text>
          
      

      {/* Lista horizontal de fornecedores */}
      <ScrollView style={{ marginBottom: 20 }}>
        <CardContainer>
          {suppliers.length === 0 ? (
            <CardTitle>Nenhum fornecedor cadastrado</CardTitle>
          ) : (
            suppliers.map((sup) => (
              <CardTouchable key={sup.id} onPress={() => selectSupplier(sup)}>
                <CardTitle>{sup.nomeFantasia}</CardTitle>
              </CardTouchable>
            ))
          )}
        </CardContainer>
      </ScrollView>

      {/* Formulário de edição */}
      {selectedSupplier && (
        <ScrollView>
          <Section>
            <Label>Nome Fantasia</Label>
            <Input value={nomeFantasia} onChangeText={setNomeFantasia} />

            <Label>Vendedor</Label>
            <Input value={vendedor} onChangeText={setVendedor} />

            <Label>Telefone</Label>
            <Input value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          </Section>

          <Button onPress={updateSupplier}>
            <ButtonText>Atualizar</ButtonText>
          </Button>
          {/* Botão de exclusão */}
          <DeleteButton onPress={deleteSupplier}>
            <DeleteButtonText>Deletar Fornecedor</DeleteButtonText>
          </DeleteButton>
        </ScrollView>
      )}
    </Container>
  );
};


export default EditSuppliers;