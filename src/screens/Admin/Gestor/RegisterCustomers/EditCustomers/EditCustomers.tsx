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
} from "../styles";
import { GetCliente, PutCliente } from "../../../../../Services/apiFruttyoog";

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

const EditCustomers: React.FC = () => {
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
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setCpf(cliente.cpf);
    setCodigoCliente(cliente.codigoCliente);
    setDataNascimento(cliente.dataNascimento);
    setTipoCliente(cliente.tipoCliente);
    setCep(cliente.endereco.cep);
    setComplemento(cliente.endereco.complemento || "");
  };

  const atualizarCliente = async () => {
    if (!selectedCliente) return;
    try {
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
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o cliente");
    }
  };

  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20 }}>
        Editar Clientes
      </Text>
      {clientes.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 20 }}>
          Nenhum cliente disponível
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <CardContainer>
            {clientes.map((cliente) => (
              <CardTouchable
                key={cliente.id}
                onPress={() => selecionarCliente(cliente)}
              >
                <CardTitle>{cliente.nome}</CardTitle>
              </CardTouchable>
            ))}
          </CardContainer>
        </ScrollView>
      )}

      {/* Formulário de edição */}
      {selectedCliente && (
        <ScrollView>
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
            <Input
              value={dataNascimento}
              onChangeText={setDataNascimento}
              placeholder="AAAA-MM-DD"
            />

            <Label>Tipo Cliente</Label>
            <Input value={tipoCliente} onChangeText={setTipoCliente} />

            <Label>CEP</Label>
            <Input value={cep} onChangeText={setCep} />

            <Label>Complemento</Label>
            <Input value={complemento} onChangeText={setComplemento} />
          </Section>

          <Button onPress={atualizarCliente}>
            <ButtonText>Atualizar</ButtonText>
          </Button>
        </ScrollView>
      )}
    </Container>
  );
};

export default EditCustomers;
