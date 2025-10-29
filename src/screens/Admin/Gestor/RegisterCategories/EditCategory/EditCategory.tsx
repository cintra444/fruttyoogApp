// EditCategory.tsx - ESTILO SIMPLIFICADO
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text } from "react-native";
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
  DeleteButton,
  DeleteButtonText,
} from "./styles";
import {
  GetCategoria,
  PutCategoria,
  DeleteCategoria,
} from "../../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import { BackButton, BackButtonText } from "../../../Gestor/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Category {
  id: number;
  nome: string;
}

const EditCategory: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [nome, setNome] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await GetCategoria();
      if (res) {
        const updatedCategories = res.map((categoria: any) => ({
          id: categoria.id,
          nome: categoria.nome || categoria.nomeCategoria,
        }));
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    }
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setNome(category.nome);
  };

  const deleteCategory = () => {
    if (!selectedCategory) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta categoria?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await DeleteCategoria(selectedCategory.id);

              // Atualiza a lista localmente
              const updatedCategories = categories.filter(
                (cat) => cat.id !== selectedCategory.id
              );
              setCategories(updatedCategories);
              setSelectedCategory(null);
              setNome("");

              Alert.alert("Sucesso", "Categoria deletada com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar categoria:", error);
              Alert.alert("Erro", "Não foi possível deletar a categoria");
            }
          },
        },
      ]
    );
  };

  const updateCategory = async () => {
    if (!selectedCategory) return;

    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome da categoria");
      return;
    }

    try {
      await PutCategoria({
        id: selectedCategory.id,
        nome: nome,
      });
      Alert.alert("Sucesso", "Categoria atualizada!");

      // Recarregar a lista
      const data = await GetCategoria();
      if (data) {
        const updatedCategories = data.map((categoria: any) => ({
          id: categoria.id,
          nome: categoria.nome || categoria.nomeCategoria,
        }));
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      Alert.alert("Erro", "Não foi possível atualizar a categoria");
    }
  };

  return (
    <Container>
      {/* Botão de voltar */}
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Editar Categorias
      </Text>

      {/* Lista horizontal de categorias */}
      <ScrollView style={{ marginBottom: 20 }}>
        <CardContainer>
          {categories.length === 0 && (
            <CardTitle>Nenhuma categoria cadastrada ainda</CardTitle>
          )}
          {categories.map((cat) => (
            <CardTouchable
              key={cat.id}
              onPress={() => selectCategory(cat)}
              style={{
                backgroundColor:
                  selectedCategory?.id === cat.id ? "#005006" : "#fff",
              }}
            >
              <CardTitle
                style={{
                  color: selectedCategory?.id === cat.id ? "#fff" : "#005006",
                }}
              >
                {cat.nome}
              </CardTitle>
            </CardTouchable>
          ))}
        </CardContainer>
      </ScrollView>

      {/* Formulário de edição */}
      {selectedCategory && (
        <ScrollView>
          <Section>
            <Label>Nome da Categoria</Label>
            <Input
              value={nome}
              onChangeText={setNome}
              placeholder="Nome da categoria"
            />
          </Section>

          <Button onPress={updateCategory}>
            <ButtonText>Atualizar Categoria</ButtonText>
          </Button>

          <DeleteButton onPress={deleteCategory}>
            <DeleteButtonText>Deletar Categoria</DeleteButtonText>
          </DeleteButton>
        </ScrollView>
      )}
    </Container>
  );
};

export default EditCategory;
