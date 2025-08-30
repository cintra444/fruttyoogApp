import React, { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  Container,
  Title,
  FormGroup,
  Label,
  StyledPicker,
  PickerItem,
  StyledInput,
  SubmitButton,
} from "./styles";

type Fornecedor = { id: number; nome: string };
type Produto = { id: number; nome: string };
type TipoCompra = { id: number; descricao: string };
type TipoPagamento = { id: number; descricao: string };

const NewShop: React.FC = () => {
  const navigation = useNavigation();

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tiposCompra, setTiposCompra] = useState<TipoCompra[]>([]);
  const [tiposPagamento, setTiposPagamento] = useState<TipoPagamento[]>([]);

  const [selectedFornecedor, setSelectedFornecedor] = useState<number | null>(null);
  const [selectedProduto, setSelectedProduto] = useState<number | null>(null);
  const [selectedTipoCompra, setSelectedTipoCompra] = useState<number | null>(null);
  const [selectedTipoPagamento, setSelectedTipoPagamento] = useState<number | null>(null);
  const [valorNota, setValorNota] = useState<string>("");
  const [dataPagamento, setDataPagamento] = useState<string>("");
  const [prazoPagamento, setPrazoPagamento] = useState<string>("");

  useEffect(() => {
    axios.get("/api/fornecedores")
      .then(res => setFornecedores(res.data))
      .catch(() => setFornecedores([]));
  }, []);

  useEffect(() => {
    if (selectedFornecedor) {
      axios.get(`/api/fornecedores/${selectedFornecedor}/produtos`)
        .then(res => setProdutos(res.data))
        .catch(() => setProdutos([]));
    } else {
      setProdutos([]);
    }
  }, [selectedFornecedor]);

  useEffect(() => {
    axios.get("/api/tipos-compra")
      .then(res => setTiposCompra(res.data))
      .catch(() => setTiposCompra([]));
  }, []);

  useEffect(() => {
    axios.get("/api/tipos-pagamento")
      .then(res => setTiposPagamento(res.data))
      .catch(() => setTiposPagamento([]));
  }, []);

  const handleSubmit = () => {
    axios.post("/api/compras", {
      fornecedorId: selectedFornecedor,
      produtoId: selectedProduto,
      tipoCompraId: selectedTipoCompra,
      tipoPagamentoId: selectedTipoPagamento,
      valorNota,
      dataPagamento,
      prazoPagamento,
    })
      .then(() => {
        Alert.alert("Compra cadastrada com sucesso!");
        navigation.navigate("Compras" as never);
      })
      .catch(() => {
        Alert.alert("Erro ao cadastrar compra.");
      });
  };

  return (
    <Container>
      <Title>Nova Compra</Title>

      <FormGroup>
        <Label>Selecionar fornecedor</Label>
        <StyledPicker
          selectedValue={selectedFornecedor}
          onValueChange={(itemValue) => setSelectedFornecedor(Number(itemValue) || null)}
        >
          <PickerItem label="Selecione..." value={null} />
          {fornecedores.map((f) => (
            <PickerItem key={f.id} label={f.nome} value={f.id} />
          ))}
        </StyledPicker>
      </FormGroup>

      <FormGroup>
        <Label>Selecionar produto</Label>
        <StyledPicker
          selectedValue={selectedProduto}
          onValueChange={(itemValue) => setSelectedProduto(Number(itemValue) || null)}
          enabled={!!selectedFornecedor}
        >
          <PickerItem label="Selecione..." value={null} />
          {produtos.map((p) => (
            <PickerItem key={p.id} label={p.nome} value={p.id} />
          ))}
        </StyledPicker>
      </FormGroup>

      <FormGroup>
        <Label>Tipo de compra</Label>
        <StyledPicker
          selectedValue={selectedTipoCompra}
          onValueChange={(itemValue) => setSelectedTipoCompra(Number(itemValue) || null)}
        >
          <PickerItem label="Selecione..." value={null} />
          {tiposCompra.map((tc) => (
            <PickerItem key={tc.id} label={tc.descricao} value={tc.id} />
          ))}
        </StyledPicker>
      </FormGroup>

      <FormGroup>
        <Label>Tipo de pagamento</Label>
        <StyledPicker
          selectedValue={selectedTipoPagamento}
          onValueChange={(itemValue) => setSelectedTipoPagamento(Number(itemValue) || null)}
        >
          <PickerItem label="Selecione..." value={null} />
          {tiposPagamento.map((tp) => (
            <PickerItem key={tp.id} label={tp.descricao} value={tp.id} />
          ))}
        </StyledPicker>
      </FormGroup>

      <FormGroup>
        <Label>Valor da nota</Label>
        <StyledInput
          keyboardType="numeric"
          value={valorNota}
          onChangeText={setValorNota}
          placeholder="Valor"
        />
      </FormGroup>

      <FormGroup>
        <Label>Data de pagamento</Label>
        <StyledInput
          value={dataPagamento}
          onChangeText={setDataPagamento}
          placeholder="AAAA-MM-DD"
        />
      </FormGroup>

      <FormGroup>
        <Label>Prazo de pagamento (dias)</Label>
        <StyledInput
          keyboardType="numeric"
          value={prazoPagamento}
          onChangeText={setPrazoPagamento}
          placeholder="Dias"
        />
      </FormGroup>

      <SubmitButton onPress={handleSubmit}>
        <Text>Salvar compra</Text>
      </SubmitButton>
    </Container>
  );
};

export default NewShop;
