// NewProduct.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert,Text, ActivityIndicator } from "react-native";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {
  Container,
    Title,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
} from "./styles";
import api from "../../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from "@react-native-picker/picker";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";

const tipoUnidadeOption = [
    "UNIDADE",
    "CAIXA",
    "LITRO",
    "POTE_VIDRO",
    "POTE_PLASTICO",
    "PACOTE",
    "EMBALAGEM",
    "CAIXA_PLASTICA",
    "DUZIA",
    "KG",
    "GRAMA",
    "OUTRO"
];

interface Categoria {
  id: number;
  nome: string;
}

interface Fornecedor {
  id: number;
  nomeFantasia: string;
}

const NewProduct: React.FC = () => {
  // Navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Formulário novo produto
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState("");


useEffect(() => {
    loadFornecedores();
  }, []);

    const loadFornecedores = async () => {
  try {
    console.log("🔄 Buscando fornecedores...");
    const response = await api.get("/fornecedor");
    console.log("📦 Resposta da API - Fornecedores:", response.data);
    console.log("📊 Status:", response.status);
    
    if (response.data && Array.isArray(response.data)) {
      setFornecedores(response.data);
      console.log(`✅ ${response.data.length} fornecedores carregados`);
    } else {
      console.log("❌ Resposta não é um array ou está vazia:", response.data);
      setFornecedores([]);
    }
  } catch (error: any) {
    console.error("❌ Erro ao carregar fornecedores:", error);
    console.log("🔗 URL tentada:", "/fornecedor");
    console.log("📋 Mensagem de erro:", error.message);
    console.log("🔍 Response error:", error.response?.data);
    setFornecedores([]);
  }
};

useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categorias");

      if( response.data && Array.isArray(response.data)){
        setCategorias(response.data);
      } else {
        setError("Nenhuma categoria encontrada");
      }

    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    } finally {
      setLoading(false);
    }

  };
const handleAddProduct = async () => {
  if (!name || !descricao || !precoCusto || !precoVenda || !qtdeEstoque || !codigoProduto || !tipoUnidade || !selectedCategoriaId) {
    Alert.alert("Erro", "Preencha todos os campos");
    return;
  }

  try {
    const produto = {
      name,
      descricao,
      precoCusto: parseFloat(precoCusto),
      precoVenda: parseFloat(precoVenda),
      qtdeEstoque: parseInt(qtdeEstoque, 10),
      codigoProduto,
      tipoUnidade,
      categoria: {
        id: parseInt(selectedCategoriaId, 10),
      },
      fornecedor: selectedFornecedorId ? { 
        id: parseInt(selectedFornecedorId, 10) 
      } : undefined,
    };

    await api.post("/produtos", produto);
    Alert.alert("Sucesso", "Produto cadastrado com sucesso!");

    
    // resetar formulário
    setName("");  
    setDescricao("");  
    setPrecoCusto("");  
    setPrecoVenda("");  
    setQtdeEstoque("");  
    setCodigoProduto("");  
    setTipoUnidade("");
    setSelectedCategoriaId("");

  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    Alert.alert("Erro", "Não foi possível cadastrar o produto");
  }
};
      

  return (
    <Container>
     {/* Botão de voltar */}
                                   <BackButton onPress={() => navigation.goBack()}>
                                     <Icon name="arrow-left" size={33} color="#000" />
                                     <BackButtonText>Voltar</BackButtonText>
                                   </BackButton>
                                   <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Novo Produto</Text>
               
             
      <ScrollView>
        <Section>
          <Label>Nome</Label>
          <Input value={name} onChangeText={setName} 
          placeholder="Digite o nome do produto"/>

          <Label>Descrição</Label>
          <Input value={descricao} onChangeText={setDescricao} 
          placeholder="Digite a descrição do produto"/>

          <Label>Preço de Custo</Label>
          <Input value={precoCusto} onChangeText={setPrecoCusto} keyboardType="numeric"
          placeholder="0.00" />

          <Label>Preço de Venda</Label>
          <Input value={precoVenda} onChangeText={setPrecoVenda} keyboardType="numeric" 
          placeholder="0.00"/>

          <Label>Quantidade</Label>
          <Input value={qtdeEstoque} onChangeText={setQtdeEstoque} keyboardType="numeric" 
          placeholder="0"/>

          <Label>Código do Produto</Label>
          <Input value={codigoProduto} onChangeText={setCodigoProduto}
          placeholder="Digite o código do produto" />

          <Label>Categoria</Label>
          {loading ? (
            <ActivityIndicator size="small" color="#005006" />
          ) : error ? (
            <Label style={{ color: 'red' }}>{error}</Label>
          ):(
          <Picker
            selectedValue={selectedCategoriaId}
            onValueChange={(itemValue) => setSelectedCategoriaId(itemValue)}
            style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            marginBottom: 15,
          }}          >
            <Picker.Item label="Selecione a categoria" value="" />
            {categorias.map((categoria) => (
              <Picker.Item 
                key={categoria.id} 
                label={categoria.nome} 
                value={categoria.id ? categoria.id.toString() : ""} 
              />
            ))}
          </Picker>
          )}
          <Label>Tipo de Unidade</Label>
          <Picker
            selectedValue={tipoUnidade}
            onValueChange={(itemValue) => setTipoUnidade(itemValue)}
            style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            marginBottom: 15,
          }}
          >
            <Picker.Item label="Selecione o tipo de unidade" value="" />
            {tipoUnidadeOption.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>   
          <Label>Fornecedor (Opcional)</Label>
          <Picker
            selectedValue={selectedFornecedorId}
            onValueChange={(itemValue) => setSelectedFornecedorId(itemValue)}
            style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            marginBottom: 15,
            }}         
          >
            <Picker.Item label="Selecione o fornecedor" value="" />
            {fornecedores.map((fornecedor: any) => (
              <Picker.Item 
                key={fornecedor.id} 
                label={fornecedor.nomeFantasia} 
                value={fornecedor.id ? fornecedor.id.toString() : ""} 
              />
            ))}
          </Picker>
        </Section>

        <Button onPress={handleAddProduct}>
          <ButtonText>Salvar</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewProduct;