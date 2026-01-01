import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Container,
  Title,
  FilterContainer,
  Input,
  Button,
  ButtonText,
  ProductItem,
  ProductText,
  QuantityText,
  FilterGroup,
  FilterLabel,
  HeaderActions,
  ActionButton,
  ActionText,
  FilterBadge,
  FilterBadgeText,
  ClearFiltersButton,
  EmptyContainer,
  EmptyText,
  LoadingContainer,
  LoadingText,
} from "./styles";
import { getCurrentStock } from "../../../../Services/stockCalculator";

const { width } = Dimensions.get("window");

interface StockItem {
  id: number;
  nomeProduto: string;
  categoria?: string;
  quantidade: number;
  estoqueMinimo?: number;
}

const CurrentStock: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [produto, setProduto] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showOutOfStockOnly, setShowOutOfStockOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "low" | "out" | "search"
  >("all");

  useEffect(() => {
    loadStock();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stock, showLowStockOnly, showOutOfStockOnly, produto]);

  const loadStock = async () => {
    try {
      setLoading(true);
      console.log("🔄 Carregando estoque...");

      const stockFromApi = await getCurrentStock();
      setStock(stockFromApi);
      setFilteredStock(stockFromApi);
    } catch (error) {
      console.error("❌ Erro ao carregar estoque:", error);
      Alert.alert(
        "Erro",
        "Não foi possível calcular o estoque. Verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadStock();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStock();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...stock];

    // Filtro por estoque baixo
    if (showLowStockOnly) {
      filtered = filtered.filter(
        (item) => item.quantidade > 0 && item.quantidade <= 5
      );
      setActiveFilter("low");
    }

    // Filtro por estoque esgotado
    if (showOutOfStockOnly) {
      filtered = filtered.filter((item) => item.quantidade === 0);
      setActiveFilter("out");
    }

    // Filtro por nome do produto
    if (produto.trim() !== "") {
      const searchTerm = produto.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.nomeProduto.toLowerCase().includes(searchTerm) ||
          (item.categoria && item.categoria.toLowerCase().includes(searchTerm))
      );
      setActiveFilter("search");
    }

    // Se nenhum filtro especial, mostrar tudo
    if (!showLowStockOnly && !showOutOfStockOnly && produto.trim() === "") {
      setActiveFilter("all");
    }

    setFilteredStock(filtered);
  };

  const handleSearch = () => {
    if (produto.trim() === "") {
      Alert.alert("Atenção", "Digite o nome do produto para filtrar");
      return;
    }
    applyFilters();
  };

  const handleShowLowStock = () => {
    setShowLowStockOnly(!showLowStockOnly);
    setShowOutOfStockOnly(false);
    if (produto) setProduto("");
  };

  const handleShowOutOfStock = () => {
    setShowOutOfStockOnly(!showOutOfStockOnly);
    setShowLowStockOnly(false);
    if (produto) setProduto("");
  };

  const handleClearFilters = () => {
    setProduto("");
    setShowLowStockOnly(false);
    setShowOutOfStockOnly(false);
    setActiveFilter("all");
  };

  const getStockStatus = (quantity: number, estoqueMinimo: number = 5) => {
    if (quantity === 0)
      return { label: "ESGOTADO", color: "#e74c3c", icon: "🛑" };
    if (quantity <= Math.min(2, estoqueMinimo))
      return { label: "CRÍTICO", color: "#e74c3c", icon: "⚠️" };
    if (quantity <= estoqueMinimo)
      return { label: "BAIXO", color: "#f39c12", icon: "⚠️" };
    if (quantity <= estoqueMinimo * 2)
      return { label: "ATENÇÃO", color: "#f1c40f", icon: "📊" };
    return { label: "OK", color: "#2ecc71", icon: "✅" };
  };

  const renderItem = ({ item }: { item: StockItem }) => {
    const status = getStockStatus(item.quantidade, item.estoqueMinimo);
    const isCritical = item.quantidade <= (item.estoqueMinimo || 5);

    return (
      <ProductItem status={status.label}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <ProductText style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.nomeProduto}
              </ProductText>
              {item.categoria && item.categoria !== "Sem categoria" && (
                <ProductText
                  style={{ fontSize: 12, color: "#7f8c8d", marginTop: 2 }}
                >
                  📦 {item.categoria}
                </ProductText>
              )}
            </View>
            <View
              style={{
                backgroundColor: status.color,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 12,
                marginLeft: 10,
                alignItems: "center",
                minWidth: 80,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
              >
                {status.icon} {status.label}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <View>
              <Text style={{ fontSize: 14, color: "#7f8c8d" }}>
                Quantidade em estoque:
              </Text>
              <QuantityText
                lowStock={isCritical}
                style={{ fontSize: 18, marginTop: 2 }}
              >
                {item.quantidade} unidades
              </QuantityText>
              {item.estoqueMinimo && item.estoqueMinimo !== 5 && (
                <Text style={{ fontSize: 11, color: "#95a5a6", marginTop: 2 }}>
                  Estoque mínimo: {item.estoqueMinimo}
                </Text>
              )}
            </View>

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: status.color + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: status.color,
                  }}
                >
                  {item.quantidade}
                </Text>
              </View>
            </View>
          </View>

          {/* Barra de progresso */}
          {item.quantidade > 0 && (
            <View style={{ marginTop: 15 }}>
              <View
                style={{
                  height: 8,
                  backgroundColor: "#ecf0f1",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.min((item.quantidade / Math.max(item.estoqueMinimo || 5, 1)) * 2 * 100, 100)}%`,
                    height: "100%",
                    backgroundColor: status.color,
                    borderRadius: 4,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <Text style={{ fontSize: 10, color: "#95a5a6" }}>0</Text>
                <Text style={{ fontSize: 10, color: "#95a5a6" }}>
                  {item.estoqueMinimo || 5} (mínimo)
                </Text>
                <Text style={{ fontSize: 10, color: "#95a5a6" }}>
                  {(item.estoqueMinimo || 5) * 2}+
                </Text>
              </View>
            </View>
          )}
        </View>
      </ProductItem>
    );
  };

  const getStats = () => {
    const total = stock.length;
    const outOfStock = stock.filter((item) => item.quantidade === 0).length;
    const lowStock = stock.filter(
      (item) => item.quantidade > 0 && item.quantidade <= 5
    ).length;
    const inStock = stock.filter((item) => item.quantidade > 5).length;

    return { total, outOfStock, lowStock, inStock };
  };

  // Renderiza o header da lista
  const renderHeader = () => {
    const stats = getStats();
    const cardWidth = (width - 45) / 2;

    return (
      <View>
        <Title>📦 Estoque Atual</Title>
        <Text
          style={{
            textAlign: "center",
            color: "#7f8c8d",
            marginBottom: 15,
            paddingHorizontal: 20,
          }}
        >
          Estoque base atualizado pelas vendas
        </Text>

        {/* Botões de filtro rápido */}
        <HeaderActions>
          <ActionButton
            onPress={handleShowLowStock}
            active={showLowStockOnly}
            style={{
              backgroundColor: showLowStockOnly ? "#f39c12" : "#fef3e2",
            }}
          >
            <ActionText
              active={showLowStockOnly}
              style={{
                color: showLowStockOnly ? "white" : "#f39c12",
                fontSize: 13,
              }}
            >
              ⚠️ {showLowStockOnly ? "Baixo Estoque" : "Baixo"}
            </ActionText>
          </ActionButton>

          <ActionButton
            onPress={handleShowOutOfStock}
            active={showOutOfStockOnly}
            style={{
              backgroundColor: showOutOfStockOnly ? "#e74c3c" : "#fdedec",
            }}
          >
            <ActionText
              active={showOutOfStockOnly}
              style={{
                color: showOutOfStockOnly ? "white" : "#e74c3c",
                fontSize: 13,
              }}
            >
              🛑 {showOutOfStockOnly ? "Esgotados" : "Esgotado"}
            </ActionText>
          </ActionButton>
        </HeaderActions>

        {/* Caixa de pesquisa */}
        <FilterContainer>
          <FilterGroup>
            <FilterLabel>Buscar Produto:</FilterLabel>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Input
                placeholder="Nome do produto ou categoria"
                value={produto}
                onChangeText={setProduto}
                style={{
                  flex: 1,
                  marginRight: 10,
                }}
                onSubmitEditing={handleSearch}
              />
              <Button
                onPress={handleSearch}
                bgColor="#3498db"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ButtonText style={{ fontSize: 18 }}>🔍</ButtonText>
              </Button>
            </View>
          </FilterGroup>

          {/* Badges de filtro ativo */}
          {activeFilter !== "all" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                paddingTop: 15,
                borderTopWidth: 1,
                borderTopColor: "#f0f0f0",
              }}
            >
              <FilterBadge>
                <FilterBadgeText>
                  {activeFilter === "low"
                    ? "Estoque Baixo"
                    : activeFilter === "out"
                      ? "Esgotados"
                      : "Busca Ativa"}
                </FilterBadgeText>
              </FilterBadge>

              <ClearFiltersButton
                onPress={handleClearFilters}
                style={{ marginLeft: 10 }}
              >
                <Text
                  style={{ color: "#e74c3c", fontSize: 12, fontWeight: "600" }}
                >
                  Limpar Filtros
                </Text>
              </ClearFiltersButton>
            </View>
          )}
        </FilterContainer>

        {/* Cards de estatísticas (2 por linha) */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 15,
            marginTop: 5,
            marginBottom: 15,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#f8f9fa",
              padding: 15,
              borderRadius: 12,
              width: cardWidth,
              marginBottom: 10,
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: "#7f8c8d", marginBottom: 8 }}>
              Total Produtos
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#2c3e50" }}
            >
              {stats.total}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              backgroundColor: "#fff8e1",
              padding: 15,
              borderRadius: 12,
              width: cardWidth,
              marginBottom: 10,
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: "#7f8c8d", marginBottom: 8 }}>
              Estoque Baixo
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#f39c12" }}
            >
              {stats.lowStock}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              backgroundColor: "#ffebee",
              padding: 15,
              borderRadius: 12,
              width: cardWidth,
              marginBottom: 10,
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: "#7f8c8d", marginBottom: 8 }}>
              Esgotados
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#e74c3c" }}
            >
              {stats.outOfStock}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              backgroundColor: "#e8f5e9",
              padding: 15,
              borderRadius: 12,
              width: cardWidth,
              marginBottom: 10,
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: "#7f8c8d", marginBottom: 8 }}>
              Em Estoque
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#2ecc71" }}
            >
              {stats.inStock}
            </Text>
          </View>
        </View>

        {/* Informações da lista */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: "#f8f9fa",
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}
        >
          <Text style={{ color: "#7f8c8d", fontSize: 14, fontWeight: "600" }}>
            Mostrando {filteredStock.length} de {stock.length} produtos
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              padding: 12,
              backgroundColor: "#e3f2fd",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 8 }}>💡</Text>
            <Text style={{ fontSize: 12, color: "#1976d2", flex: 1 }}>
              Estoque calculado automaticamente (Estoque Base - Vendas)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#3498db" />
        <LoadingText>Calculando estoque...</LoadingText>
        <Text
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#95a5a6",
            textAlign: "center",
          }}
        >
          Analisando produtos e vendas
        </Text>
      </LoadingContainer>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ecf0f1" }}>
      <FlatList
        data={filteredStock}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3498db"]}
            tintColor="#3498db"
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyContainer>
            <Text style={{ fontSize: 60, marginBottom: 20 }}>
              {activeFilter === "low"
                ? "📉"
                : activeFilter === "out"
                  ? "🛑"
                  : "📦"}
            </Text>
            <EmptyText>
              {activeFilter === "low"
                ? "Nenhum produto com estoque baixo"
                : activeFilter === "out"
                  ? "Nenhum produto esgotado"
                  : produto
                    ? `Nenhum produto encontrado para "${produto}"`
                    : "Nenhum produto em estoque"}
            </EmptyText>
            {(activeFilter !== "all" || produto) && (
              <TouchableOpacity
                onPress={handleClearFilters}
                style={{
                  marginTop: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  backgroundColor: "#3498db",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                >
                  Ver Todos os Produtos
                </Text>
              </TouchableOpacity>
            )}
          </EmptyContainer>
        }
      />
    </SafeAreaView>
  );
};

export default CurrentStock;
