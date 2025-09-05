import React, { useEffect, useState } from "react";
import { Modal, Alert } from "react-native";
import {
  Container,
  CardContainer,
  CardTouchable,
  CardTitle,
  ModalContainer,
  Section,
  Label,
  Input,
  Button,
  ButtonText,
  CloseButton,
  CloseText,
  ProductList,
  ProductItem,
} from "./styles";
import {
  GetProducts,
  PostProduct,
  PutProduct,
} from "../../../../Services/apiFruttyoog"; // ajuste o caminho da sua api

interface Product {
  id: number;
  name: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  qtdeEstoque: number;
  codigoProduto: string;
  tipoUnidade: string;
  imagem?: string;
}

const RegisterProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Formulário novo produto
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [qtdeEstoque, setQtdeEstoque] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await GetProducts();
    if (res) setProducts(res);
  };

  const handleAddProduct = async () => {
    if (!name || !descricao || !precoCusto || !precoVenda || !qtdeEstoque || !codigoProduto || !tipoUnidade) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await PostProduct({
        name,
        descricao,
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        qtdeEstoque: Number(qtdeEstoque),
        codigoProduto,
        tipoUnidade,
        imagem: "",
      });
      Alert.alert("Sucesso", "Produto cadastrado!");
      setModalVisible(false);
      loadProducts();
      // resetar formulário
      setName(""); setDescricao(""); setPrecoCusto(""); setPrecoVenda(""); setQtdeEstoque(""); setCodigoProduto(""); setTipoUnidade("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o produto");
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    try {
      await PutProduct({
        ...selectedProduct,
        precoCusto: Number(selectedProduct.precoCusto),
        precoVenda: Number(selectedProduct.precoVenda),
        qtdeEstoque: Number(selectedProduct.qtdeEstoque),
      });
      Alert.alert("Sucesso", "Produto atualizado!");
      setEditModalVisible(false);
      loadProducts();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o produto");
    }
  };

  return (
    <Container>
  <CardContainer>
    <CardTouchable onPress={() => setModalVisible(true)}>
      <CardTitle>Novo Produto</CardTitle>
    </CardTouchable>

    <CardTouchable onPress={ () => { if (products.length === 0) { Alert.alert("Atenção", "Nenhum produto cadastrado ainda."); } else { Alert.alert("Produtos carregados", `Total de produtos: ${products.length}`); } }}>
      <CardTitle>Editar Produto</CardTitle>
    </CardTouchable>
  </CardContainer>


      {/* Modal Novo Produto */}
      <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => {}}>
        <ModalContainer>
          <Section>
            <Label>Nome</Label>
            <Input value={name} onChangeText={setName} />
          </Section>
          <Section>
            <Label>Descrição</Label>
            <Input value={descricao} onChangeText={setDescricao} />
          </Section>
          <Section>
            <Label>Preço de Custo</Label>
            <Input value={precoCusto} onChangeText={setPrecoCusto} keyboardType="numeric" />
          </Section>
          <Section>
            <Label>Preço de Venda</Label>
            <Input value={precoVenda} onChangeText={setPrecoVenda} keyboardType="numeric" />
          </Section>
          <Section>
            <Label>Quantidade</Label>
            <Input value={qtdeEstoque} onChangeText={setQtdeEstoque} keyboardType="numeric" />
          </Section>
          <Section>
            <Label>Código do Produto</Label>
            <Input value={codigoProduto} onChangeText={setCodigoProduto} />
          </Section>
          <Section>
            <Label>Tipo de Unidade</Label>
            <Input value={tipoUnidade} onChangeText={setTipoUnidade} />
          </Section>
          <Button onPress={handleAddProduct}><ButtonText>Salvar</ButtonText></Button>
          <CloseButton onPress={() => setModalVisible(false)}><CloseText>Fechar</CloseText></CloseButton>
        </ModalContainer>
      </Modal>

      {/* Modal Editar Produto */}
      <Modal visible={editModalVisible} animationType="slide" transparent={false} onRequestClose={() => {}}>
        <ModalContainer>
          {selectedProduct && (
            <>
              <Section>
                <Label>Descrição</Label>
                <Input
                  value={selectedProduct.descricao}
                  onChangeText={(text) => setSelectedProduct({ ...selectedProduct, descricao: text })}
                />
              </Section>
              <Section>
                <Label>Preço de Custo</Label>
                <Input
                  value={String(selectedProduct.precoCusto)}
                  onChangeText={(text) => setSelectedProduct({ ...selectedProduct, precoCusto: Number(text) })}
                  keyboardType="numeric"
                />
              </Section>
              <Section>
                <Label>Preço de Venda</Label>
                <Input
                  value={String(selectedProduct.precoVenda)}
                  onChangeText={(text) => setSelectedProduct({ ...selectedProduct, precoVenda: Number(text) })}
                  keyboardType="numeric"
                />
              </Section>
              <Section>
                <Label>Quantidade</Label>
                <Input
                  value={String(selectedProduct.qtdeEstoque)}
                  onChangeText={(text) => setSelectedProduct({ ...selectedProduct, qtdeEstoque: Number(text) })}
                  keyboardType="numeric"
                />
              </Section>
              <Button onPress={handleUpdateProduct}><ButtonText>Atualizar</ButtonText></Button>
              <CloseButton onPress={() => setEditModalVisible(false)}><CloseText>Fechar</CloseText></CloseButton>
            </>
          )}
        </ModalContainer>
      </Modal>

      {/* Lista de produtos para Adicionar */}
      <ProductList>
        {products.map((prod) => (
          <ProductItem key={prod.id} onPress={() => openEditModal(prod)}>
            <CardText>{prod.name}</CardText>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
};

export default RegisterProduct;
