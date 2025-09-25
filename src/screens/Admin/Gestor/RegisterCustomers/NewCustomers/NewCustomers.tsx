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
import { Picker } from "@react-native-picker/picker";

const tipoClienteOptions = [
  "ATACADO",
  "VAREJO",
  "REVENDA",
  "SUPERMERCADO",
  "PESSOA_FISICA",
  "PESSOA_JURIDICA",
  "DISTRIBUIDORA",
  "HORTIFRUTI",
  "MERCADO",
  "PADARIA",
  "RESTAURANTE",
  "LOJA_DE_CONVENIENCIA",
  "OUTROS",
];

const NewCustomers: React.FC = () => {

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");

  //----mascaras ----//
  const formatarData = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if(cleaned.length > 8) cleaned = cleaned.slice(0,8);
    // Adiciona a barra após o quarto dígito
    if (cleaned.length > 4) {
      setDataNascimento(`${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4)}`);
    } else if (cleaned.length > 2) {
      setDataNascimento(`${cleaned.slice(0, 2)}-${cleaned.slice(2)}`);
    } else {
      setDataNascimento(cleaned);
    }
  };

  const formatarCpf = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if(cleaned.length > 11) cleaned = cleaned.slice(0,11);
    
    if (cleaned.length > 9) {
      setCpf(`${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`);
    } else if (cleaned.length > 6) {
      setCpf(`${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`);
    } else if (cleaned.length > 3) {
      setCpf(`${cleaned.slice(0, 3)}.${cleaned.slice(3)}`);
    } else {
      setCpf(cleaned);
    }
  };

  const formatarCep = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if(cleaned.length > 8) cleaned = cleaned.slice(0,8);
    if (cleaned.length > 5) {
      setCep(`${cleaned.slice(0, 5)}-${cleaned.slice(5)}`);
    } else {
      setCep(cleaned);
    }
  };

  const formatarTelefone = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if(cleaned.length > 11) cleaned = cleaned.slice(0,11);
    
    if (cleaned.length > 6 && cleaned.length <= 10) {
      setTelefone(`(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`);
    } else if (cleaned.length > 10) {
      setTelefone(`(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`);
    } else if (cleaned.length > 2) {
      setTelefone(`(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`);
    } else if (cleaned.length > 0) {
      setTelefone(`(${cleaned}`);
    } else {
      setTelefone(cleaned);
    }
  };

  const salvarCliente = async () => {

    if (!nome || !telefone || !email) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      let dataFormatada = "";
      if(dataNascimento){
        const [dia, mes, ano] = dataNascimento.split("/");
        if(dia && mes && ano){
          dataFormatada = `${ano}-${mes}-${dia}`;
        }
      }

      let cepFormatado = "";
      if(cep){
        const [parte1, parte2] = cep.split("-");
        if(parte1 && parte2){
          cepFormatado = `${parte1.padStart(5, '0')}-${parte2.padStart(3, '0')}`;
        }
      }

      let telefoneFormatado = "";
      if(telefone){
        const [parte1, parte2, parte3] = telefone.split("-");
        if(parte1 && parte2 && parte3){
          telefoneFormatado = `(${parte1.padStart(2, '0')}) ${parte2.padStart(5, '0')}-${parte3.padStart(4, '0')}`;
        }
      }

      const response = await PostCliente({
        nome,
        telefone: telefoneFormatado.replace(/\D/g, "") || "",
        email,
        cpf: cpf.replace(/\D/g, "") || "",
        codigoCliente: codigoCliente,
        dataNascimento: dataFormatada || "",
        tipoCliente,
        endereco: { cep: cep.replace(/\D/g, "") || "", 
        complemento: complemento || "" },        
      });

      // Supondo que PostCliente retorna um objeto Cliente, não uma resposta HTTP
      if (response) {
        Alert.alert("Sucesso", "Cliente cadastrado!");
        limparFormulario();
      } else {
        Alert.alert("Erro", "Não foi possível salvar o cliente");
      }
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      Alert.alert("Erro", "Não foi possível salvar o cliente");
    }
  };

  const formatDataToLocalDate = (data: string) => {
    if(!data) return "";
    const [ano, mes, dia] = data.split("/");
    if(!dia || !mes || !ano) return "";
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0') }`; // Formata para "YYYY-MM-DD"}/${mes}/${ano}`;
  }

      // limpar formulário após salvar
  const limparFormulario = () => {
      setNome("");
      setTelefone("");
      setEmail("");
      setCpf("");
      setCodigoCliente("");
      setDataNascimento("");
      setTipoCliente("");
      setCep("");
      setComplemento("");
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
        <Input value={telefone} onChangeText={setTelefone} keyboardType="phone-pad"/>

        <Label>Email</Label>
        <Input value={email} onChangeText={setEmail}  keyboardType="email-address"/>

        <Label>CPF</Label>
        <Input value={cpf} onChangeText={setCpf} keyboardType="numeric" />

        <Label>Código Cliente</Label>
        <Input value={codigoCliente} onChangeText={setCodigoCliente} />

        <Label>Data Nascimento</Label>
        <Input
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
        />

        <Label>Tipo Cliente</Label>
        <Picker
          selectedValue={tipoCliente}
          onValueChange={(itemValue) => setTipoCliente(itemValue)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            marginBottom: 15,
          }}
        >
          <Picker.Item label="Selecione o tipo" value="" />
          {tipoClienteOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
          </Picker>

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
