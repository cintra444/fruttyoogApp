import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, Platform, Text } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { PostCliente } from "../../../../../Services/apiFruttyoog"; 
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
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

const tipoPagamentoOptions = [
  "DINHEIRO",
    "PIX",
    "BOLETO",
    "TRANSFERENCIA",
    "CHEQUE",
    "DEBITO",
    "CREDITO",
    "FIADO",
    "A_PRAZO",
    "OUTROS",
];

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
  const [tipoPagamento, setTipoPagamento] = useState("");
  

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

  // ---- Converter "dd/MM/yyyy" para "yyyy-MM-dd" ---- //
  const formatarParaISO = (data: string) => {
    if (!data) return "";
    const partes = data.split(/[/-]/);
    if (partes.length !== 3) return "";
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const salvarCliente = async () => {
    if (!nome || !telefone || !email) {
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
        cpf: cpfFormatado,
        dataNascimento: dataFormatada || "",
        telefone: telefoneFormatado || "",
        email,
        endereco,
        referencia,
        tipoCliente,
        tipoPagamento,
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
      setTipoPagamento("");
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
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Novo Cliente</Text>
                
              
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
        <Input value={cpf} onChangeText={setCpf} keyboardType="numeric" />

        <Label>Data Nascimento</Label>
        <Input
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric" 
        />
        <Label>Telefone</Label>
        <Input value={telefone} onChangeText={setTelefone} keyboardType="phone-pad"/>

        <Label>Email</Label>
        <Input value={email} onChangeText={setEmail}  keyboardType="email-address"/>

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
          {tipoClienteOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
          </Picker>

        <Label>Tipo Pagamento</Label>
        <Picker
          selectedValue={tipoPagamento}
          onValueChange={(itemValue) => setTipoPagamento(itemValue)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            marginBottom: 15,
          }}
        >
          <Picker.Item label="Selecione o tipo" value="" />
          {tipoPagamentoOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />  
          ))}
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
