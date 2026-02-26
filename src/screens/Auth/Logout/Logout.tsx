import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "src/contexts/AppContext";
import { Container, Title, Button, ButtonText } from "./styles";

const Logout: React.FC = () => {
  const navigation = useNavigation();
  const { handleLogout: signOut } = useApp();

  const handleLogout = async () => {
    try {
      await signOut(navigation as never);
      Alert.alert("Sessão encerrada", "Você saiu da sua conta.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível encerrar a sessão.");
    }
  };

  return (
    <Container>
      <Title>Deseja realmente sair?</Title>

      <Button bgColor="#E53935" onPress={handleLogout}>
        <ButtonText>Sair</ButtonText>
      </Button>

      <Button bgColor="#4CAF50" onPress={() => navigation.navigate("Home" as never)}>
        <ButtonText>Cancelar</ButtonText>
      </Button>
    </Container>
  );
};

export default Logout;
