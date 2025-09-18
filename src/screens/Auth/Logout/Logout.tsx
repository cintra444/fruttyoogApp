import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Container, Title, Button, ButtonText } from "./styles";

const Logout: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // remove o JWT salvo
      Alert.alert("Sessão encerrada", "Você saiu da sua conta.");

      // Redireciona para a tela de Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
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

      <Button bgColor="#4CAF50" onPress={() => navigation.goBack()}>
        <ButtonText>Cancelar</ButtonText>
      </Button>
    </Container>
  );
};

export default Logout;
