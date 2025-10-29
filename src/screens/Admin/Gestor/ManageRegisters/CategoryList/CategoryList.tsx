// CategoryList.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
import {
  Container,
  Title,
  Section,
  Label,
  ListItem,
  ListText,
  DeleteButton,
  DeleteButtonText,
  CardTouchable,
  CardTitle,
} from "./styles";
import {
  GetCategoria,
  DeleteCategoria,
} from "../../../../../Services/apiFruttyoog";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/Navigation/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BackButton, BackButtonText } from "../../styles";
import EditCategory from "../../RegisterCategories/EditCategory/EditCategory";

interface Category {
  id: number;
  nome: string;
}

const CategoryList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await GetCategoria();
      if (data) {
        const updatedCategories = data.map((cat: any) => ({
          id: cat.id,
          nome: cat.nome || cat.nomeCategoria,
        }));
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: number, categoryName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a categoria "${categoryName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteCategoria(categoryId);
              Alert.alert("Sucesso", "Categoria excluída com sucesso!");
              loadCategories();
            } catch (error) {
              console.error("Erro ao excluir categoria:", error);
              Alert.alert("Erro", "Não foi possível excluir a categoria");
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={33} color="#000" />
        <BackButtonText>Voltar</BackButtonText>
      </BackButton>

      <Title>Categorias Cadastradas</Title>

      {loading ? (
        <Text style={{ textAlign: "center", padding: 20 }}>
          Carregando categorias...
        </Text>
      ) : categories.length === 0 ? (
        <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
          Nenhuma categoria cadastrada
        </Text>
      ) : (
        <ScrollView>
          <Section>
            <Label style={{ fontSize: 16, marginBottom: 10 }}>
              Total: {categories.length} categoria(s)
            </Label>

            {categories.map((category) => (
              <ListItem key={category.id}>
                <View style={{ flex: 1 }}>
                  <ListText style={{ fontWeight: "bold", fontSize: 16 }}>
                    {category.nome}
                  </ListText>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <CardTouchable
                    onPress={() => category}
                    style={{
                      backgroundColor: "#2196F3",
                      padding: 8,
                      borderRadius: 4,
                      marginBottom: 5,
                      minWidth: 80,
                    }}
                  >
                    <CardTitle style={{ fontSize: 12, color: "#fff" }}>
                      Editar
                    </CardTitle>
                  </CardTouchable>

                  <DeleteButton
                    onPress={() => handleDelete(category.id, category.nome)}
                    style={{ padding: 8, minWidth: 80 }}
                  >
                    <DeleteButtonText style={{ fontSize: 12 }}>
                      Excluir
                    </DeleteButtonText>
                  </DeleteButton>
                </View>
              </ListItem>
            ))}
          </Section>
        </ScrollView>
      )}
    </Container>
  );
};

export default CategoryList;
