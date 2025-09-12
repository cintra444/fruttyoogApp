import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  Container,
  Title,
  CategoryItem,
  CategoryText,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  ActionsContainer,
} from "./styles";
import {
  GetCategoria,
  PutCategoria,
  DeleteCategoria,
} from "../../../../../Services/apiFruttyoog"; // ajuste o caminho

interface Category {
  id: number;
  nome: string;
}

const EditCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nomeCategoria, setNomeCategoria] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await GetCategoria();
      if (res) {
        const updateCategories = res.map((categoria: any) => ({
            id: categoria.id,
            nome: categoria.nomeCategoria,
        }));
        setCategories(updateCategories);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar categorias");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      Alert.alert("Atenção", "Selecione uma categoria para editar");
      return;
    }
    try {
      await PutCategoria({ id: selectedId, nomeCategoria: nomeCategoria });
      Alert.alert("Sucesso", "Categoria atualizada!");
      setSelectedId(null);
      setNomeCategoria("");
      loadCategories();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await DeleteCategoria(id);
      Alert.alert("Sucesso", "Categoria excluída!");
      loadCategories();
    } catch {
      Alert.alert("Erro", "Não foi possível excluir");
    }
  };

  const selectCategory = (category: Category) => {
    setSelectedId(category.id);
    setNomeCategoria(category.nome);
  };

  return (
    <Container>
      <Title>Editar Categorias</Title>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategoryItem
            onPress={() => selectCategory(item)}
            selected={item.id === selectedId}
          >
            <CategoryText>{item.nome}</CategoryText>
            <ActionsContainer>
              <Button onPress={() => selectCategory(item)} bgColor="#2196F3">
                <ButtonText>Editar</ButtonText>
              </Button>
              <Button onPress={() => handleDelete(item.id)} bgColor="#E53935">
                <ButtonText>Excluir</ButtonText>
              </Button>
            </ActionsContainer>
          </CategoryItem>
        )}
      />

      {selectedId && (
        <>
          <Section>
            <Label>Nome da Categoria</Label>
            <Input
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
              placeholder="Ex: Queijo, Doce, Biscoito..."
            />
          </Section>

          <Button onPress={handleUpdate} bgColor="#2196F3">
            <ButtonText>Atualizar</ButtonText>
          </Button>
        </>
      )}
    </Container>
  );
};

export default EditCategory;
