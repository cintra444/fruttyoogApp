// EditCustomers.tsx
import React, { useState, useEffect } from "react";
import { Alert, ScrollView, Text } from "react-native";
import {
  Container,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  CardContainer,
  CardTouchable,
  CardTitle,
  DeleteButton,
  DeleteButtonText,
} from "./styles";
import { Picker } from "@react-native-picker/picker";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { DeleteCliente, GetCliente, PutCliente } from "../../../../../Services/apiFruttyoog";

const tipoClienteOptions = [
  "ATACADO", "VAREJO", "REVENDA", "SUPERMERCADO", "PESSOA_FISICA",
  "PESSOA_JURIDICA", "DISTRIBUIDORA", "HORTIFRUTI", "MERCADO",
  "PADARIA", "RESTAURANTE", "LOJA_DE_CONVENIENCIA", "OUTROS",
];

const tipoPagamentoOptions = [
  "DINHEIRO", "PIX", "BOLETO", "TRANSFERENCIA", "CHEQUE",
  "DEBITO", "CREDITO", "FIADO", "A_PRAZO", "OUTROS",
];

interface Cliente {
  id: number;
  codigoCliente: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  referencia: string;
  tipoCliente: string;
  tipoPagamento: string;
}

const EditCustomers: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Formulário
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


  // Carregar clientes ao iniciar
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const data = await GetCliente();
        if (data) setClientes(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os clientes");
      }
    };
    loadClientes();
  }, []);

  const selecionarCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setCodigoCliente(cliente.codigoCliente);
    setNome(cliente.nome);
    setCpf(formatarCpf(cliente.cpf));
    setDataNascimento(cliente.dataNascimento);
    setTelefone(formatarTelefone(cliente.telefone));
    setEmail(cliente.email);
    setEndereco(cliente.endereco);
    setReferencia(cliente.referencia || "");
    setTipoCliente(cliente.tipoCliente);
    setTipoPagamento(cliente.tipoPagamento);
  };

  const atualizarCliente = async () => {
    if (!selectedCliente) return;
    try {
      const telefoneFormatado = telefone.replace(/\D/g, "");
      const cpfFormatado = cpf.replace(/\D/g, "");
      const dataFormatada = formatarDataBanco(dataNascimento);

      function formatarDataBanco(data: string) {
        if (!data) return "";
        const partes = data.split("/");
        if (partes.length !== 3) return data;
        const [dia, mes, ano] = partes;
        return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
      }

      await PutCliente({
        id: selectedCliente.id,
        codigoCliente,
        nome,
        cpf: cpfFormatado,
        dataNascimento: dataFormatada,
        telefone: telefoneFormatado,
        email,
        endereco,
        referencia,
        tipoCliente,
        tipoPagamento,
      });
      Alert.alert("Sucesso", "Cliente atualizado!");
    } catch {
      console.error("Erro ao atualizar cliente:", selectedCliente.id);
      Alert.alert("Erro", "Não foi possível atualizar o cliente");
    }
  };

  const deleteCliente = async () => {
    if (!selectedCliente) return;
    try {
      await DeleteCliente(selectedCliente.id);
      Alert.alert("Sucesso", "Cliente excluído!");
    } catch {
      console.error("Erro ao excluir cliente:", selectedCliente.id);
      Alert.alert("Erro", "Não foi possível excluir o cliente");
    }
  };

  // Funções auxiliares
  const formatarCpf = (value: string) => {
    let cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length > 9) return `${cleaned.slice(0,3)}.${cleaned.slice(3,6)}.${cleaned.slice(6,9)}-${cleaned.slice(9)}`;
    if (cleaned.length > 6) return `${cleaned.slice(0,3)}.${cleaned.slice(3,6)}.${cleaned.slice(6)}`;
    if (cleaned.length > 3) return `${cleaned.slice(0,3)}.${cleaned.slice(3)}`;
    return cleaned;
  };



  const formatarTelefone = (value: string) => {
    let cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length > 6 && cleaned.length <= 10) return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,6)}-${cleaned.slice(6)}`;
    if (cleaned.length > 10) return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`;
    if (cleaned.length > 2) return `(${cleaned.slice(0,2)}) ${cleaned.slice(2)}`;
    if (cleaned.length > 0) return `(${cleaned}`;
    return cleaned;
  };
  const formatarData = (value: string) => {
    let cleaned = value.replace(/\D/g, "").slice(0, 8);
    if (cleaned.length > 4)
      setDataNascimento(`${cleaned.slice(0,2)}/${cleaned.slice(2,4)}/${cleaned.slice(4)}`); 
    else if (cleaned.length > 2)
      setDataNascimento(`${cleaned.slice(0,2)}/${cleaned.slice(2)}`);
    else
      setDataNascimento(cleaned);
  }



  return (
    <Container>
      {/* Botão de voltar */}
                              <BackButton onPress={() => navigation.goBack()}>
                                <Icon name="arrow-left" size={33} color="#000" />
                                <BackButtonText>Voltar</BackButtonText>
                              </BackButton>
                              <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Editar Clientes</Text>
          
        
        <ScrollView style={{ marginBottom: 20 }}>
            <CardContainer>
        {clientes.length === 0 ? (
          <CardTitle >Nenhum cliente disponível</CardTitle>
        ) : (
              clientes.map((cliente) => (
                <CardTouchable key={cliente.id} onPress={() => selecionarCliente(cliente)}>
                  <CardTitle>{cliente.nome}</CardTitle>
                </CardTouchable>
              ))
            )}
            </CardContainer>
          </ScrollView>
        

        {selectedCliente && (
          <ScrollView >
            <Section>
              <Label>Código Cliente</Label>
              <Input value={codigoCliente} onChangeText={setCodigoCliente} />

              <Label>Nome</Label>
              <Input value={nome} onChangeText={setNome} />

              <Label>CPF</Label>
              <Input value={cpf} onChangeText={(t) => setCpf(formatarCpf(t))} keyboardType="numeric" />

              <Label>Data Nascimento</Label>
              <Input value={dataNascimento} onChangeText={formatarData} placeholder="DD-MM-AAAA" keyboardType="numeric" />

              <Label>Telefone</Label>
              <Input value={telefone} onChangeText={(t) => setTelefone(formatarTelefone(t))} keyboardType="phone-pad" />

              <Label>Email</Label>
              <Input value={email} onChangeText={setEmail} keyboardType="email-address" />

              <Label>Endereço</Label>
              <Input value={endereco} onChangeText={setEndereco} />

              <Label>Referência</Label>
              <Input value={referencia} onChangeText={setReferencia} />

              <Label>Tipo Cliente</Label>
              <Picker selectedValue={tipoCliente} onValueChange={setTipoCliente}>
                <Picker.Item label="Selecione o tipo" value="" />
                {tipoClienteOptions.map((option) => <Picker.Item key={option} label={option} value={option} />)}
              </Picker>

              <Label>Tipo Pagamento</Label>
              <Picker selectedValue={tipoPagamento} onValueChange={setTipoPagamento}>
                <Picker.Item label="Selecione o tipo" value="" />
                {tipoPagamentoOptions.map((option) => <Picker.Item key={option} label={option} value={option} />)}
              </Picker>

            </Section>

            <Button onPress={atualizarCliente}>
              <ButtonText>Atualizar</ButtonText>
            </Button>
            <DeleteButton onPress = {deleteCliente}>
              <DeleteButtonText>Deletar Cliente</DeleteButtonText>
            </DeleteButton>
          </ScrollView>
        )}
    
    </Container>
  );
};

export default EditCustomers;
