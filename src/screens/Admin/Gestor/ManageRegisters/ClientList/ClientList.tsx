// ClientList.tsx
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
  GetCliente,
  DeleteCliente,
} from "../../../..../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BackButton, BackButtonText } from "../../styles";

interface Client {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
}

const ClientList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      // Você precisará criar essa função na apiFruttyoog
      const data = await GetCliente();
      if (data) setClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      Alert.alert("Erro", "Não foi possível carregar os clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId: number, clientName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o cliente "${clientName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteCliente(clientId);
              Alert.alert("Sucesso", "Cliente excluído com sucesso!");
              loadClients();
            } catch (error) {
              console.error("Erro ao excluir cliente:", error);
              Alert.alert("Erro", "Não foi possível excluir o cliente");
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

      <Title>Clientes Cadastrados</Title>

      {loading ? (
        <Text style={{ textAlign: "center", padding: 20 }}>
          Carregando clientes...
        </Text>
      ) : clients.length === 0 ? (
        <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
          Nenhum cliente cadastrado
        </Text>
      ) : (
        <ScrollView>
          <Section>
            <Label style={{ fontSize: 16, marginBottom: 10 }}>
              Total: {clients.length} cliente(s)
            </Label>

            {clients.map((client) => (
              <ListItem key={client.id}>
                <View style={{ flex: 1 }}>
                  <ListText style={{ fontWeight: "bold", fontSize: 16 }}>
                    {client.nome}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Email: {client.email}
                  </ListText>
                  <ListText style={{ color: "#666", fontSize: 14 }}>
                    Telefone: {client.telefone}
                  </ListText>
                  {client.endereco && (
                    <ListText style={{ color: "#666", fontSize: 12 }}>
                      Endereço: {client.endereco}
                    </ListText>
                  )}
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <CardTouchable
                    onPress={() => client}
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
                    onPress={() => handleDelete(client.id, client.nome)}
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

export default ClientList;
