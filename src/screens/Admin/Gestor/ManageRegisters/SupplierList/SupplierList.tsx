// SupplierList.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  ListItem,
  ListText,
  DeleteButton,
  DeleteButtonText,
  CardTouchable,
  CardTitle,
} from "./styles";
import {
  GetFornecedor,
  DeleteFornecedor,
} from "../../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BackButton, BackButtonText } from "../../styles";

interface Supplier {
  id: number;
  nomeFantasia: string;
  nomeContato: string;
  telefone: string;
}

const SupplierList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      // Você precisará criar essa função na apiFruttyoog
      const data = await GetFornecedor();
      if (data) setSuppliers(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      Alert.alert("Erro", "Não foi possível carregar os fornecedores");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (supplierId: number, supplierName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o fornecedor "${supplierName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteFornecedor(supplierId);
              Alert.alert("Sucesso", "Fornecedor excluído com sucesso!");
              loadSuppliers();
            } catch (error) {
              console.error("Erro ao excluir fornecedor:", error);
              Alert.alert("Erro", "Não foi possível excluir o fornecedor");
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Title>Fornecedores Cadastrados</Title>

      {loading ? (
        <Text style={{ textAlign: "center", padding: 20 }}>
          Carregando fornecedores...
        </Text>
      ) : suppliers.length === 0 ? (
        <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
          Nenhum fornecedor cadastrado
        </Text>
      ) : (
        <ScrollView>
          <Section>
            <Label style={{ fontSize: 16, marginBottom: 10 }}>
              Total: {suppliers.length} fornecedor(es)
            </Label>

            {suppliers.map((supplier) => (
              <ListItem key={supplier.id}>
                <View style={{ flex: 1 }}>
                  <ListText style={{ fontWeight: "bold", fontSize: 16 }}>
                    {supplier.nomeFantasia}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Contato: {supplier.nomeContato}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Telefone: {supplier.telefone}
                  </ListText>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <CardTouchable
                    onPress={() => supplier}
                    style={{
                      backgroundColor: "#2196F3",
                      padding: 8,
                      borderRadius: 4,
                      marginBottom: 5,
                      minWidth: 80,
                    }}
                  >
                    <CardTitle style={{ fontSize: 12, color: "#fff" }}>
                      Editar
                    </CardTitle>
                  </CardTouchable>

                  <DeleteButton
                    onPress={() =>
                      handleDelete(supplier.id, supplier.nomeFantasia)
                    }
                    style={{ padding: 8, minWidth: 80 }}
                  >
                    <DeleteButtonText style={{ fontSize: 12 }}>
                      Excluir
                    </DeleteButtonText>
                  </DeleteButton>
                </View>
              </ListItem>
            ))}
          </Section>
        </ScrollView>
      )}
    </Container>
  );
};

export default SupplierList;
