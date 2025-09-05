import React, { useState, useEffect } from "react";
import { Modal, Alert, ScrollView } from "react-native";
import {
  Container,
  CardContainer,
  CardTouchable,
  CardTitle,
  ModalContent,
  ModalTitle,
  CloseButton,
  CloseText,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import { GetCliente, PostCliente, PutCliente } from "../../../../Services/apiFruttyoog"; // ajuste o caminho conforme seu projeto

interface Endereco {
  cep: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

interface Cliente {
  id: number;
  codigoCliente: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  tipoCliente: string;
}

const RegisterCustomers: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

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

  // Carregar clientes
  const loadClientes = async () => {
    try {
      const data = await GetCliente();
      if (data) setClientes(data);
      setModalVisible(true);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os clientes");
    }
  };

  const abrirModalNovo = () => {
    setSelectedCliente(null);
    setNome("");
    setTelefone("");
    setEmail("");
    setCpf("");
    setCodigoCliente("");
    setDataNascimento("");
    setTipoCliente("");
    setCep("");
    setComplemento("");
    setModalVisible(true);
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setCpf(cliente.cpf);
    setCodigoCliente(cliente.codigoCliente);
    setDataNascimento(cliente.dataNascimento);
    setTipoCliente(cliente.tipoCliente);
    setCep(cliente.endereco.cep);
    setComplemento(cliente.endereco.complemento || "");
    setModalVisible(true);
  };

  const salvarCliente = async () => {
    try {
      if (selectedCliente) {
        await PutCliente({
          id: selectedCliente.id,
          nome,
          telefone,
          email,
          cpf,
          codigoCliente,
          dataNascimento,
          tipoCliente,
          endereco: { cep, complemento },
        });
        Alert.alert("Sucesso", "Cliente atualizado!");
      } else {
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
      }
      setModalVisible(false);
      loadClientes();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o cliente");
    }
  };

  return (
    <Container>
      <CardContainer>
        <CardTouchable onPress={abrirModalNovo}>
          <CardTitle>Novo Cliente</CardTitle>
        </CardTouchable>

        <CardTouchable onPress={loadClientes}>
          <CardTitle>Editar Cliente</CardTitle>
        </CardTouchable>
      </CardContainer>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <ScrollView>
          <ModalContent>
            <ModalTitle>{selectedCliente ? "Editar Cliente" : "Novo Cliente"}</ModalTitle>

            <Section>
              <Label>Nome</Label>
              <Input value={nome} onChangeText={setNome} />

              <Label>Telefone</Label>
              <Input value={telefone} onChangeText={setTelefone} />

              <Label>Email</Label>
              <Input value={email} onChangeText={setEmail} />

              <Label>CPF</Label>
              <Input value={cpf} onChangeText={setCpf} />

              <Label>Código Cliente</Label>
              <Input value={codigoCliente} onChangeText={setCodigoCliente} />

              <Label>Data Nascimento</Label>
              <Input value={dataNascimento} onChangeText={setDataNascimento} placeholder="AAAA-MM-DD" />

              <Label>Tipo Cliente</Label>
              <Input value={tipoCliente} onChangeText={setTipoCliente} />

              <Label>CEP</Label>
              <Input value={cep} onChangeText={setCep} />

              <Label>Complemento</Label>
              <Input value={complemento} onChangeText={setComplemento} />
            </Section>

            <Button onPress={salvarCliente}>
              <ButtonText>{selectedCliente ? "Atualizar" : "Salvar"}</ButtonText>
            </Button>

            <CloseButton onPress={() => setModalVisible(false)}>
              <CloseText>Fechar</CloseText>
            </CloseButton>
          </ModalContent>
        </ScrollView>
      </Modal>
    </Container>
  );
};

export default RegisterCustomers;
