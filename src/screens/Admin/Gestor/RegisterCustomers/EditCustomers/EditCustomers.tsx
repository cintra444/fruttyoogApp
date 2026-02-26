// EditCustomers.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
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
import { } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import {
  DeleteCliente,
  GetCliente,
  PutCliente,
} from "../../../../../Services/apiFruttyoog";

const tipoClienteOptions = ["REVENDEDOR", "MERCADO", "CLIENTE", "OUTROS"];

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
}

const EditCustomers: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);

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

  // Carregar clientes ao iniciar o componente
  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await GetCliente();
      if (data) {
        setClientes(data);

        if (selectedCliente && data.find((c) => c.id === selectedCliente.id)) {
          limparFormulario();
        }
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const clientesOrdenados = useMemo(() => {
    return [...clientes].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [clientes]);

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

  const selecionarCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setCodigoCliente(cliente.codigoCliente || "");
    setNome(cliente.nome || "");
    setCpf(formatarCpf(cliente.cpf || ""));

    if (cliente.dataNascimento) {
      const partes = cliente.dataNascimento.split("-");
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        setDataNascimento(`${dia}/${mes}/${ano}`);
      } else {
        setDataNascimento("");
      }
    } else {
      setDataNascimento("");
    }

    setTelefone(formatarTelefone(cliente.telefone || ""));
    setEmail(cliente.email || "");
    setEndereco(cliente.endereco || "");
    setReferencia(cliente.referencia || "");
    setTipoCliente(cliente.tipoCliente || "");
  };

  const limparFormulario = () => {
    setSelectedCliente(null);
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

  const atualizarCliente = async () => {
    if (!selectedCliente) return;

    if (!nome || !telefone) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const telefoneFormatado = telefone.replace(/\D/g, "");
      const cpfFormatado = cpf.replace(/\D/g, "");
      const dataFormatada = formatarParaISO(dataNascimento);

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
      });
      Alert.alert("Sucesso", "Cliente atualizado!");

      // Recarregar a lista de clientes após a atualização
      await loadClientes();
    } catch {
      console.error("Erro ao atualizar cliente:", selectedCliente.id);
      Alert.alert("Erro", "Não foi possível atualizar o cliente");
    }
  };

  const deleteCliente = async () => {
    if (!selectedCliente) return;
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o cliente "${selectedCliente.nome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteCliente(selectedCliente.id);
              Alert.alert("Sucesso", "Cliente excluído com sucesso!");

              // Recarregar lista após exclusão
              await loadClientes();

              // Limpar formulário
              limparFormulario();
            } catch (error) {
              console.error("Erro ao excluir cliente:", error);
              Alert.alert("Erro", "Não foi possível excluir o cliente");
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      {/* Botão de voltar */}
<Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Editar Clientes
      </Text>

      {/* Seção da Lista de Clientes com rolagem */}
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Label>Selecione um cliente:</Label>

        <CardContainer
          style={{
            maxHeight: 250, // Altura máxima para rolagem
            flexDirection: "column",
            flex: 1,
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
            refreshControl={undefined}
          >
            {loading ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Carregando clientes...
              </CardTitle>
            ) : clientesOrdenados.length === 0 ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Nenhum cliente disponível
              </CardTitle>
            ) : (
              clientesOrdenados.map((cliente) => (
                <CardTouchable
                  key={cliente.id}
                  onPress={() => selecionarCliente(cliente)}
                  style={{
                    marginBottom: 10,
                    backgroundColor:
                      selectedCliente?.id === cliente.id ? "#E3F2FD" : "#fff",
                    borderWidth: selectedCliente?.id === cliente.id ? 2 : 1,
                    borderColor:
                      selectedCliente?.id === cliente.id ? "#2196F3" : "#ccc",
                  }}
                >
                  <CardTitle
                    style={{
                      fontWeight:
                        selectedCliente?.id === cliente.id ? "600" : "400",
                    }}
                  >
                    {cliente.nome}
                  </CardTitle>
                  {cliente.tipoCliente && (
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      Tipo: {cliente.tipoCliente}
                    </Text>
                  )}
                </CardTouchable>
              ))
            )}
          </ScrollView>
        </CardContainer>
      </View>

      {/* Seção do Formulário de Edição com rolagem separada */}
      {selectedCliente && (
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 15,
              color: "#6200ee",
            }}
          >
            Editando: {selectedCliente.nome}
          </Text>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Section>
              <Label>Código Cliente</Label>
              <Input
                value={codigoCliente}
                onChangeText={setCodigoCliente}
                placeholder="Código do cliente"
              />

              <Label>Nome *</Label>
              <Input
                value={nome}
                onChangeText={setNome}
                placeholder="Nome completo"
              />

              <Label>CPF</Label>
              <Input
                value={cpf}
                onChangeText={(text) => setCpf(formatarCpf(text))}
                keyboardType="numeric"
                maxLength={14}
                placeholder="XXX.XXX.XXX-XX"
              />

              <Label>Data Nascimento</Label>
              <Input
                value={dataNascimento}
                onChangeText={(text) => setDataNascimento(formatarData(text))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />

              <Label>Telefone *</Label>
              <Input
                value={telefone}
                onChangeText={(text) => setTelefone(formatarTelefone(text))}
                keyboardType="phone-pad"
                maxLength={15}
                placeholder="(XX) XXXXX-XXXX"
              />

              <Label>Email</Label>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="email@exemplo.com"
              />

              <Label>Endereço</Label>
              <Input
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Endereço completo"
              />

              <Label>Referência</Label>
              <Input
                value={referencia}
                onChangeText={setReferencia}
                placeholder="Ponto de referência"
              />

              <Label>Tipo Cliente</Label>
              <Picker
                selectedValue={tipoCliente}
                onValueChange={setTipoCliente}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  marginBottom: 15,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Picker.Item label="Selecione o tipo" value="" />
                {tipoClienteOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </Section>

            <Button onPress={atualizarCliente}>
              <ButtonText>Atualizar Cliente</ButtonText>
            </Button>
            {/* Botão para recarregar manualmente */}
            <Button
              onPress={loadClientes}
              style={{
                backgroundColor: "#4CAF50",
                marginTop: 10,
                padding: 8,
              }}
            >
              <ButtonText>Recarregar Lista</ButtonText>
            </Button>

            <DeleteButton onPress={deleteCliente}>
              <DeleteButtonText>Excluir Cliente</DeleteButtonText>
            </DeleteButton>
          </ScrollView>
        </View>
      )}
    </Container>
  );
};

export default EditCustomers;

