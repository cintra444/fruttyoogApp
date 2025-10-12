// NewProduct.tsx
import React, { useState } from "react";
import { ScrollView, Alert,View, PermissionsAndroid, Platform, Image, TouchableOpacity } from "react-native";
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
import { PostProdutos } from "../../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api
import api from "../../../../../Services/apiFruttyoog";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from "@react-native-picker/picker";

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

const NewProduct: React.FC = () => {
  // Formulário novo produto
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);

  
// Permissão para usar a câmera
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permissão para usar a câmera",
            message: "O aplicativo precisa de permissão para usar a câmera",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Seleção de imagem da galeria
  const selectImageLibrary = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.errorCode) {
        console.log('Erro: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImagem(response.assets[0].uri || null);
      }
    });
  };

  // Seleção de imagem da câmera
  const selectImageCamera = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permissão para usar a câmera negada');
        return;
      }
    }
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a foto');
      } else if (response.errorCode) {
        console.log('Erro: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImagem(response.assets[0].uri || null);
      }
    });
  };

// Função para adicionar produto com imagem
  const handleAddProduct = async () => {
  if (!name || !descricao || !precoCusto || !precoVenda || !qtdeEstoque || !codigoProduto || !tipoUnidade) {
    Alert.alert("Erro", "Preencha todos os campos");
    return;
  }

  try {
    const produto = {
      name,
      descricao,
      precoCusto: parseFloat(precoCusto),
      precoVenda: parseFloat(precoVenda),
      qtdeEstoque: parseInt(qtdeEstoque),
      codigoProduto,
      tipoUnidade
    };

    const formData = new FormData();
    formData.append('produto', JSON.stringify(produto));
    
    if (imagem) {
      formData.append('file', {
        uri: imagem,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg'
      } as any);
    }

    await api.post("/produtos/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    Alert.alert("Sucesso", "Produto cadastrado com sucesso");

    // resetar formulário
    setName("");  
    setDescricao("");  
    setPrecoCusto("");  
    setPrecoVenda("");  
    setQtdeEstoque("");  
    setCodigoProduto("");  
    setTipoUnidade("");
    setImagem(null);
  } catch (error: any) {
    console.error(error);
    Alert.alert("Erro", "Não foi possível cadastrar o produto");
  }
};
      

  return (
    <Container>
      <Title>Novo Produto</Title>
      <ScrollView>
        <Section>
          <Label>Nome</Label>
          <Input value={name} onChangeText={setName} />

          <Label>Descrição</Label>
          <Input value={descricao} onChangeText={setDescricao} />

          <Label>Preço de Custo</Label>
          <Input value={precoCusto} onChangeText={setPrecoCusto} keyboardType="numeric" />

          <Label>Preço de Venda</Label>
          <Input value={precoVenda} onChangeText={setPrecoVenda} keyboardType="numeric" />

          <Label>Quantidade</Label>
          <Input value={qtdeEstoque} onChangeText={setQtdeEstoque} keyboardType="numeric" />

          <Label>Código do Produto</Label>
          <Input value={codigoProduto} onChangeText={setCodigoProduto} />

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
            <Picker.Item label="Selecione o tipo" value="" />
            {tipoUnidadeOption.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          

          <Label>Imagem</Label>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 }}>
            <TouchableOpacity onPress={selectImageLibrary} style={{ marginRight: 10 }}>
              <Icon name="image" size={40} color="#005006" />
            </TouchableOpacity>
            <TouchableOpacity onPress={selectImageCamera}>
              <Icon name="camera" size={40} color="#005006" />
            </TouchableOpacity>
          </View>

          {imagem && (
            <Image source={{ uri: imagem }} style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center', borderRadius: 10}} />
          )}
            
        </Section>

        <Button onPress={handleAddProduct}>
          <ButtonText>Salvar</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};

export default NewProduct;