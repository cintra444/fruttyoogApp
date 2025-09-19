import React from "react";
import { Alert } from "react-native";
import {
  Container,
  Title,
  Section,
  SectionTitle,
  Item,
  ItemText,
  Logout,
  LogoutText,
} from "./styles";

const Settings: React.FC = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Você saiu da sua conta.");
    // aqui você pode limpar o token do AsyncStorage e redirecionar para Login
  };

  return (
    <Container>
      <Title>Configurações</Title>

      {/* Seção de Perfil */}
      <Section>
        <SectionTitle>Perfil</SectionTitle>
        <Item onPress={() => Alert.alert("Perfil", "Editar informações do perfil")}>
          <ItemText>Editar Perfil</ItemText>
        </Item>
        <Item onPress={() => Alert.alert("Segurança", "Alterar senha")}>
          <ItemText>Alterar Senha</ItemText>
        </Item>
      </Section>

      {/* Seção de Preferências */}
      <Section>
        <SectionTitle>Preferências</SectionTitle>
        <Item onPress={() => Alert.alert("Tema", "Escolher tema claro/escuro")}>
          <ItemText>Tema</ItemText>
        </Item>
        <Item onPress={() => Alert.alert("Notificações", "Configurar notificações")}>
          <ItemText>Notificações</ItemText>
        </Item>
      </Section>

      {/* Seção de Segurança */}
      <Section>
        <SectionTitle>Segurança</SectionTitle>
        <Item onPress={() => Alert.alert("Privacidade", "Configurações de privacidade")}>
          <ItemText>Privacidade</ItemText>
        </Item>
        <Item onPress={() => Alert.alert("2FA", "Ativar autenticação em duas etapas")}>
          <ItemText>Autenticação em 2 etapas</ItemText>
        </Item>
      </Section>

      {/* Botão de Logout */}
      <Logout onPress={handleLogout}>
        <LogoutText>Sair</LogoutText>
      </Logout>
    </Container>
  );
};

export default Settings;
