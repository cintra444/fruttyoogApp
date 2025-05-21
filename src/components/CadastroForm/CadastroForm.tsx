import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Container, Input, Button, Image, Label, ButtonText } from './styles';
import { fields } from './fields';

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
  type: keyof typeof fields;
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

  return (
    <Container>
      {fields[type].map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          value={formData[field.name]}
          onChangeText={(value) => handleChange(field.name, value)}
          />
      ))}
      {type === 'produto' && (
        <Button onPress={handleImagePicker}>
          <ButtonText>Selecionar Imagem</ButtonText>
          {imageUri && <Image source={{ uri: imageUri }} />}
        </Button>
      )}
      <Button onPress={handleSubmit}>
        <ButtonText>Cadastrar</ButtonText>
      </Button>
    </Container>
  );
};

export default CadastroForm;