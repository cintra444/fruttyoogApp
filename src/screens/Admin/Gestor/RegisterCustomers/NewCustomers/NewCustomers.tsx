import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { PostCliente } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho conforme seu projeto


interface Endereco {
  cep: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

const NewCustomers: React.FC = () => {
  // Formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");

  const salvarCliente = async () => {
    try {
      await PostCliente({
        nome,
        telefone,
        email,
        cpf,
        codigoCliente,
        dataNascimento,
        tipoCliente,
        endereco: { cep, complemento },
      });
      Alert.alert("Sucesso", "Cliente cadastrado!");

      // limpar formulário após salvar
      setNome("");
      setTelefone("");
      setEmail("");
      setCpf("");
      setCodigoCliente("");
      setDataNascimento("");
      setTipoCliente("");
      setCep("");
      setComplemento("");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o cliente");
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
      <Title>Novo Cliente</Title>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
      
      <Section>
        <Label>Nome</Label>
        <Input value={nome} onChangeText={setNome} />

        <Label>Telefone</Label>
        <Input value={telefone} onChangeText={setTelefone} />

        <Label>Email</Label>
        <Input value={email} onChangeText={setEmail} />

        <Label>CPF</Label>
        <Input value={cpf} onChangeText={setCpf} keyboardType="numeric" />

        <Label>Código Cliente</Label>
        <Input value={codigoCliente} onChangeText={setCodigoCliente} />

        <Label>Data Nascimento</Label>
        <Input
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="AAAA-MM-DD"
          keyboardType="numeric"
        />

        <Label>Tipo Cliente</Label>
        <Input value={tipoCliente} onChangeText={setTipoCliente} />

        <Label>CEP</Label>
        <Input value={cep} onChangeText={setCep}  keyboardType="numeric"/>

        <Label>Complemento</Label>
        <Input value={complemento} onChangeText={setComplemento} />
      </Section>

      <Button onPress={salvarCliente}>
        <ButtonText>Salvar</ButtonText>
      </Button>
      
      </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default NewCustomers;
