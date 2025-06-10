import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { Container, Input, Button, Image, Label, ButtonText } from './styles';
import { fields } from '..//CadastroForm/Fields';

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
        placeholder={`Digite seu ${label.toLowerCase()}`}
        placeholderTextColor="#999"
      />
    </>
  );
};

interface CadastroFormProps {
  type: keyof typeof fields;
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
    const requeridFields = fields[type].map(field => field.name);

    const missingFields = requeridFields.filter(field => {
      const value = formData[field];
      return !value || value.trim() === '';
    });

    if (missingFields.length > 0) {
      const missingLabels = fields[type]
        .filter(field => missingFields.includes(field.name))
        .map(field => `- ${field.label}`)
        .join('\n');

      Alert.alert('Campos obrigatórios', `Por favor, preencha os campos: \n${missingLabels}`);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Container>
      {fields[type].map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          value={formData[field.name] || ''}
          onChangeText={(value) => handleChange(field.name, value)}
          
          />
      ))}
      {type === 'produto' && (
          <>
        <Button onPress={handleImagePicker}>
          <ButtonText>Selecionar Imagem</ButtonText>
        </Button>
          {imageUri && <Image source={{ uri: imageUri }} />}
          </>
      )}
      <Button onPress={handleSubmit}>
        <ButtonText>Cadastrar</ButtonText>
      </Button>
    </Container> 
  );
};

export default CadastroForm;