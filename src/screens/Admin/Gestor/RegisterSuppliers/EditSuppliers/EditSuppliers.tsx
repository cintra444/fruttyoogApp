// EditSuppliers.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import {
  Container,
    Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  CardContainer,
  CardTouchable,
  CardTitle,
} from "./styles";
import { GetFornecedor, PutFornecedor } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho


interface Supplier {
  id: number;
  nomeFantasia: string;
  vendedor: string;
  telefone: string;
}

const EditSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [nomeFantasia, setNomeFantasia] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [telefone, setTelefone] = useState("");

{/*}  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await GetFornecedor();
        setSuppliers(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os fornecedores");
      }
    };
    loadSuppliers();
  }, []);
  */}

  const selectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setNomeFantasia(supplier.nomeFantasia);
    setVendedor(supplier.vendedor);
    setTelefone(supplier.telefone);
  };

  const updateSupplier = async () => {
    if (!selectedSupplier) return;

    try {
      await PutFornecedor({
        ...selectedSupplier,
        nomeFantasia,
        nomeContato: vendedor,
        telefone,
      });
      Alert.alert("Sucesso", "Fornecedor atualizado!");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o fornecedor");
    }
  };

  return (
    <Container>
        <Title>Editar Fornecedor</Title>
      {/* Lista horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <CardContainer>
          {suppliers.length === 0 && <CardTitle>Nenhum fornecedor cadastrado</CardTitle>}
          {suppliers.map((sup) => (
            <CardTouchable key={sup.id} onPress={() => selectSupplier(sup)}>
              <CardTitle>{sup.nomeFantasia}</CardTitle>
            </CardTouchable>
          ))}
        </CardContainer>
      </ScrollView>

      {/* Formulário */}
      {selectedSupplier && (
        <ScrollView>
          <Section>
            <Label>Nome Fantasia</Label>
            <Input value={nomeFantasia} onChangeText={setNomeFantasia} />
            <Label>Vendedor</Label>
            <Input value={vendedor} onChangeText={setVendedor} />
            <Label>Telefone</Label>
            <Input value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          </Section>
          <Button onPress={updateSupplier}>
            <ButtonText>Atualizar</ButtonText>
          </Button>
        </ScrollView>
      )}
    </Container>
  );
};

export default EditSuppliers;
