import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import { Container, Section, Label, Input, Button, ButtonText } from "./styles";
import { PostCliente } from "../../../../../Services/apiFruttyoog";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { Picker } from "@react-native-picker/picker";

const tipoClienteOptions = ["REVENDEDOR", "MERCADO", "CLIENTE", "OUTROS"];

const NewCustomers: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [codigoCliente, setCodigoCliente] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");

  //----mascaras ----//
  const formatarData = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    // Adiciona a barra após o quarto dígito
    if (cleaned.length > 6) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    } else if (cleaned.length > 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return cleaned;
    }
  };

  const formatarCpf = (value: string) => {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

    // Aplica a formatação XXX.XXX.XXX-XX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    } else if (cleaned.length <= 9) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    } else {
      // Para 10 ou 11 dígitos
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
    }
  };

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

  // ---- Converter "dd/MM/yyyy" para "yyyy-MM-dd" ---- //
  const formatarParaISO = (data: string) => {
    if (!data) return "";
    const partes = data.split("/");
    if (partes.length !== 3) return "";

    const [dia, mes, ano] = partes;

    let anoCompleto = ano;
    if (ano.length === 2) {
      anoCompleto = parseInt(ano, 10) > 50 ? `19${ano}` : `20${ano}`;
    }

    return `${anoCompleto}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  // salvar cliente
  const salvarCliente = async () => {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const dataFormatada = formatarParaISO(dataNascimento);
      const telefoneFormatado = telefone.replace(/\D/g, "");
      const cpfFormatado = cpf.replace(/\D/g, "");

      const response = await PostCliente({
        id: 0,
        codigoCliente,
        nome,
        cpf: cpfFormatado || "",
        dataNascimento: dataFormatada || "",
        telefone: telefoneFormatado || "",
        email: email || "",
        endereco: endereco || "",
        referencia: referencia || "",
        tipoCliente,
      });

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

  // limpar formulário após salvar
  const limparFormulario = () => {
    setCodigoCliente("");
    setNome("");
    setCpf("");
    setDataNascimento("");
    setTelefone("");
    setEmail("");
    setEndereco("");
    setReferencia("");
    setTipoCliente("");
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        {/* Botão de voltar */}
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={33} color="#000" />
          <BackButtonText>Voltar</BackButtonText>
        </BackButton>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          Novo Cliente
        </Text>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Section>
            <Label>Código Cliente</Label>
            <Input value={codigoCliente} onChangeText={setCodigoCliente} />

            <Label>Nome</Label>
            <Input value={nome} onChangeText={setNome} />

            <Label>CPF</Label>
            <Input
              value={cpf}
              onChangeText={(text) => setCpf(formatarCpf(text))}
              placeholder="XXX.XXX.XXX-XX"
              keyboardType="numeric"
              maxLength={14}
            />

            <Label>Data Nascimento</Label>
            <Input
              value={dataNascimento}
              onChangeText={(text) => setDataNascimento(formatarData(text))}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
            <Label>Telefone</Label>
            <Input
              value={telefone}
              onChangeText={(text) => setTelefone(formatarTelefone(text))}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="phone-pad"
              maxLength={15}
            />

            <Label>Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="email@email.com"
              keyboardType="email-address"
            />

            <Label>Endereço</Label>
            <Input value={endereco} onChangeText={setEndereco} />

            <Label>Referência</Label>
            <Input value={referencia} onChangeText={setReferencia} />

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
              <Picker.Item label="REVENDEDOR" value="REVENDEDOR" />
              <Picker.Item label="MERCADO" value="MERCADO" />
              <Picker.Item label="CLIENTE" value="CLIENTE" />
              <Picker.Item label="OUTROS" value="OUTROS" />
            </Picker>
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
