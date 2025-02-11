import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from './styles';

interface CadastroFormProps {
    type: 'usuario' | 'compra' | 'fornecedor' | 'item' | 'produto' | 'cliente' | 'pedido' | 'venda';
    onSubmit: (data: any) => void;
}

const CadastroForm: React.FC<CadastroFormProps> = ({ type, onSubmit }) => {
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
                        <Text>Nome:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('nome', value)} />
                        <Text>Email:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('email', value)} />
                        <Text>Senha:</Text>
                        <TextInput style={styles.input} secureTextEntry onChangeText={(value) => handleChange('senha', value)} />
                    </>
                );
            case 'compra':
                return (
                    <>
                        <Text>Data:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('data', value)} />
                        <Text>Valor Total:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('valorTotal', value)} />
                        <Text>Fornecedor:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('fornecedor', value)} />
                        <Text>Tipo da Compra:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('tipoCompra', value)} />
                        <Text>Tipo de pagamento:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('tipoPagamento', value)} />
                        <Text>Forma de pagamento:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('formaPagamento', value)} />
                        <Text>Status:</Text>
                        <TextInput style={styles.input}onChangeText={(value) => handleChange('status', value)} />
                        <Text>Prazo de pagamento:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('prazoPagamento', value)} />
                        <Text>Produtos:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('produtos', value)} />
                    </>
                );
            case 'fornecedor':
                return (
                    <>
                        <Text>Nome Fantasia:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('nomeFantasia', value)} />
                        <Text>Nome do Contato:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('nomeContato', value)} />
                        <Text>Telefone:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('telefone', value)} />
                    </>
                );
            case 'item':
                return (
                    <>
                        <Text>Nome:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('nome', value)} />
                        <Text>Quantidade:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('quantidade', value)} />
                        <Text>Preço:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('preco', value)} />
                    </>
                );
            case 'produto':
                return (
                    <>
                        <Text>Nome:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('nome', value)} />
                        <Text>Descrição:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('descricao', value)} />
                        <Text>Codigo do Produto:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('codigo', value)} />
                        <Text>Preço de custo:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('precoCusto', value)} />
                        <Text>Preço de venda:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('precoVenda', value)} />
                        <Text>Quantidade:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('quantidade', value)} />
                        <Text>Fornecedor:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('fornecedor', value)} />
                        <Text>Imagem do Produto:</Text>
                        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                            <Text>Selecionar Imagem</Text>
                        </TouchableOpacity>
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
                    </>
                );
            case 'cliente':
                return (
                    <>
                        <Text>Nome:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('nome', value)} />
                        <Text>Telefone:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('telefone', value)} />
                    </>
                );
            case 'pedido':
                return (
                    <>
                        <Text>Data:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('data', value)} />
                        <Text>Cliente:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('cliente', value)} />
                        <Text>Produtos:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('produtos', value)} />
                        <Text>Valor Total:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('valorTotal', value)} />
                        <Text>Forma de pagamento:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('formaPagamento', value)} />
                        <Text>Status:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('status', value)} />
                    </>
                );
            case 'venda':
                return (
                    <>
                        <Text>Data:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('data', value)} />
                        <Text>Cliente:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('cliente', value)} />
                        <Text>Produtos:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('produtos', value)} />
                        <Text>Valor Total:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('valorTotal', value)} />
                        <Text>Forma de pagamento:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('formaPagamento', value)} />
                        <Text>Status:</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleChange('status', value)} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <View>
            {renderFormFields()}
            <Button title="Cadastrar" onPress={handleSubmit} />
        </View>
    );
};

export default CadastroForm;