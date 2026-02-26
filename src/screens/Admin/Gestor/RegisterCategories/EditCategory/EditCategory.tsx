// EditCategory.tsx - ESTILO SIMPLIFICADO
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
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
import { } from "../../../Gestor/styles";
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
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await GetCategoria();
      if (res) {
        const updatedCategories = res.map((categoria: any) => ({
          id: categoria.id,
          nome: categoria.nome || categoria.nomeCategoria,
        }));
        setCategories(updatedCategories);

        if (
          selectedCategory &&
          updatedCategories.find((cat) => cat.id === selectedCategory.id)
        ) {
          limparFormulario();
        }
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  //ordenar categorias alfabeticamente
  const categoriesOrdenadas = useMemo(() => {
    return categories.sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    );
  }, [categories]);

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setNome(category.nome);
  };

  const limparFormulario = () => {
    setSelectedCategory(null);
    setNome("");
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
      await loadCategories();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      Alert.alert("Erro", "Não foi possível atualizar a categoria");
    }
  };

  const deleteCategory = () => {
    if (!selectedCategory) return;

    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir a categoria"${selectedCategory.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteCategoria(selectedCategory.id);
              Alert.alert("Sucesso", "Categoria deletada com sucesso!");

              // Recarregar a lista
              await loadCategories();

              // Limpar formulário
              limparFormulario();
            } catch (error) {
              console.error("Erro ao deletar categoria:", error);
              Alert.alert("Erro", "Não foi possível deletar a categoria");
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
        Editar Categorias
      </Text>

      {/* Seção da Lista de Categorias com rolagem */}
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Label>Selecione uma categoria:</Label>

        <CardContainer
          style={{
            maxHeight: 250,
            flexDirection: "column",
            flex: 1,
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {loading ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Carregando categorias...
              </CardTitle>
            ) : categoriesOrdenadas.length === 0 ? (
              <CardTitle
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#666",
                }}
              >
                Nenhuma categoria cadastrada
              </CardTitle>
            ) : (
              categoriesOrdenadas.map((category) => (
                <CardTouchable
                  key={category.id}
                  onPress={() => selectCategory(category)}
                  style={{
                    marginBottom: 10,
                    backgroundColor:
                      selectedCategory?.id === category.id ? "#E3F2FD" : "#fff",
                    borderWidth: selectedCategory?.id === category.id ? 2 : 1,
                    borderColor:
                      selectedCategory?.id === category.id ? "#2196F3" : "#ccc",
                  }}
                >
                  <CardTitle
                    style={{
                      fontWeight:
                        selectedCategory?.id === category.id ? "600" : "400",
                      color: "#333",
                    }}
                  >
                    {category.nome}
                  </CardTitle>
                </CardTouchable>
              ))
            )}
          </ScrollView>
        </CardContainer>
      </View>

      {/* Seção do Formulário de Edição */}
      {selectedCategory && (
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 15,
              color: "#6200ee",
            }}
          >
            Editando: {selectedCategory.nome}
          </Text>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Section>
              <Label>Nome da Categoria *</Label>
              <Input
                value={nome}
                onChangeText={setNome}
                placeholder="Digite o nome da categoria"
              />
            </Section>

            <Button onPress={updateCategory}>
              <ButtonText>Atualizar Categoria</ButtonText>
            </Button>

            {/* Botão para recarregar manualmente */}
            <Button
              onPress={loadCategories}
              style={{
                backgroundColor: "#4CAF50",
                marginTop: 10,
                padding: 8,
              }}
            >
              <ButtonText>Recarregar Lista</ButtonText>
            </Button>

            <DeleteButton onPress={deleteCategory}>
              <DeleteButtonText>Excluir Categoria</DeleteButtonText>
            </DeleteButton>
          </ScrollView>
        </View>
      )}
    </Container>
  );
};

export default EditCategory;

