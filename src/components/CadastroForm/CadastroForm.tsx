import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Container, Input, Button, Image, Label, ButtonText } from './styles';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const FormField = ({ label, value, onChangeText, secureTextEntry, keyboardType }: FormFieldProps) => {
  return (
    <>
      <Label>{label}:</Label>
      <Input
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </>
  );
};

interface CadastroFormProps {
  type: 'usuario' | 'compra' | 'fornecedor' | 'item' | 'produto' | 'cliente' | 'pedido' | 'venda';
  onSubmit: (data: any) => void;
}

const CadastroForm = ({ type, onSubmit }: CadastroFormProps) => {
  const [formData, setFormData] = useState<any>({});
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImagePicker = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          setFormData({
            ...formData,
            imagem: uri,
          });
        }
      }
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderFormFields = () => {
    switch (type) {
      case 'usuario':
        return (
          <>
            <FormField label="Nome" value={formData.nome} onChangeText={(value) => handleChange('nome', value)} />
            <FormField label="Email" value={formData.email} onChangeText={(value) => handleChange('email', value)} />
            <FormField label="Senha" value={formData.senha} onChangeText={(value) => handleChange('senha', value)} secureTextEntry />
          </>
        );
      case 'compra':
        return (
          <>
            <FormField label="Data" value={formData.data} onChangeText={(value) => handleChange('data', value)} />
            <FormField label="Valor Total" value={formData.valorTotal} onChangeText={(value) => handleChange('valorTotal', value)} keyboardType="numeric" />
            <FormField label="Fornecedor" value={formData.fornecedor} onChangeText={(value) => handleChange('fornecedor', value)} />
            <FormField label="Tipo da Compra" value={formData.tipoCompra} onChangeText={(value) => handleChange('tipoCompra', value)} />
            <FormField label="Tipo de pagamento" value={formData.tipoPagamento} onChangeText={(value) => handleChange('tipoPagamento', value)} />
            <FormField label="Forma de pagamento" value={formData.formaPagamento} onChangeText={(value) => handleChange('formaPagamento', value)} />
            <FormField label="Status" value={formData.status} onChangeText={(value) => handleChange('status', value)} />
            <FormField label="Prazo de pagamento" value={formData.prazoPagamento} onChangeText={(value) => handleChange('prazoPagamento', value)} />
            <FormField label="Produtos" value={formData.produtos} onChangeText={(value) => handleChange('produtos', value)} />
          </>
        );
      case 'fornecedor':
        return (
          <>
            <FormField label="Nome Fantasia" value={formData.nomeFantasia} onChangeText={(value) => handleChange('nomeFantasia', value)} />
            <FormField label="Nome do Contato" value={formData.nomeContato} onChangeText={(value) => handleChange('nomeContato', value)} />
            <FormField label="Telefone" value={formData.telefone} onChangeText={(value) => handleChange('telefone', value)} />
          </>
        );
      case 'item':
        return (
          <>
            <FormField label="Nome" value={formData.nome} onChangeText={(value) => handleChange('nome', value)} />
            <FormField label="Quantidade" value={formData.quantidade} onChangeText={(value) => handleChange('quantidade', value)} keyboardType="numeric" />
            <FormField label="Preço" value={formData.preco} onChangeText={(value) => handleChange('preco', value)} keyboardType="numeric" />
          </>
        );
      case 'produto':
        return (
          <>
          
            <FormField label="Nome" value={formData.nome} onChangeText={(value) => handleChange('nome', value)} />
            <FormField label="Descrição" value={formData.descricao} onChangeText={(value) => handleChange('descricao', value)} />
            <FormField label="Codigo do Produto" value={formData.codigo} onChangeText={(value) => handleChange('codigo', value)} />
            <FormField label="Preço de custo" value={formData.precoCusto} onChangeText={(value) => handleChange('precoCusto', value)} keyboardType="numeric" />
            <FormField label="Preço de venda" value={formData.precoVenda} onChangeText={(value) => handleChange('precoVenda', value)} keyboardType="numeric" />
            <FormField label="Quantidade" value={formData.quantidade} onChangeText={(value) => handleChange('quantidade', value)} keyboardType="numeric" />
            <FormField label="Fornecedor" value={formData.fornecedor} onChangeText={(value) => handleChange('fornecedor', value)} />
            <Button onPress={handleImagePicker}>
              <ButtonText>Selecionar Imagem</ButtonText>
            {imageUri && <Image source={{ uri: imageUri }}  />}
            </Button>
          </>
        );
      case 'cliente':
        return (
          <>
            <FormField label="Nome" value={formData.nome} onChangeText={(value) => handleChange('nome', value)} />
            <FormField label="Telefone" value={formData.telefone} onChangeText={(value) => handleChange('telefone', value)} />
          </>
        );
      case 'pedido':
        return (
          <>
            <FormField label="Data" value={formData.data} onChangeText={(value) => handleChange('data', value)} />
            <FormField label="Cliente" value={formData.cliente} onChangeText={(value) => handleChange('cliente', value)} />
            <FormField label="Produtos" value={formData.produtos} onChangeText={(value) => handleChange('produtos', value)} />
            <FormField label="Valor Total" value={formData.valorTotal} onChangeText={(value) => handleChange('valorTotal', value)} keyboardType="numeric" />
            <FormField label="Forma de pagamento" value={formData.formaPagamento} onChangeText={(value) => handleChange('formaPagamento', value)} />
            <FormField label="Status" value={formData.status} onChangeText={(value) => handleChange('status', value)} />
          </>
        );
      case 'venda':
        return (
          <>
            <FormField label="Data" value={formData.data} onChangeText={(value) => handleChange('data', value)} />
            <FormField label="Cliente" value={formData.cliente} onChangeText={(value) => handleChange('cliente', value)} />
            <FormField label="Produtos" value={formData.produtos} onChangeText={(value) => handleChange('produtos', value)} />
            <FormField label="Valor Total" value={formData.valorTotal} onChangeText={(value) => handleChange('valorTotal', value)} keyboardType="numeric" />
            <FormField label="Forma de pagamento" value={formData.formaPagamento} onChangeText={(value) => handleChange('formaPagamento', value)} />
            <FormField label="Status" value={formData.status} onChangeText={(value) => handleChange('status', value)} />
          </>
        );
      default:
        return null;
    }
  };

  return (
     <Container>
      {renderFormFields()}
      <Button onPress={handleImagePicker}>
        <ButtonText>Selecionar Imagem</ButtonText>
      </Button>
      {imageUri && <Image source={{ uri: imageUri }} />}
      <Button onPress={handleSubmit}>
        <ButtonText>Cadastrar</ButtonText>
      </Button>
    </Container>
  );
};

export default CadastroForm;