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
  } from "./styles";
import {
  GetCliente,
  DeleteCliente,
} from "../../../..../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

  return (
    <Container>
<Title
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Clientes Cadastrados
      </Title>

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
              </ListItem>
            ))}
          </Section>
        </ScrollView>
      )}
    </Container>
  );
};

export default ClientList;

