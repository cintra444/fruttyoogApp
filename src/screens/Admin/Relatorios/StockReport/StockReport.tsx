import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  Title,
  Card,
  CardTitle,
  CardContent,
  FilterContainer,
  Button,
  ButtonText,
  StatValue,
  SectionTitle,
  Row,
  LoaderContainer,
  NoDataText,
  InfoContainer,
  InfoText,
  FilterRow,
  FilterButtonContainer,
  ChartCard,
  SearchInput,
  CategoryFilter,
  CategoryButton,
  CategoryButtonText,
  StockTable,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderText,
  TableCellText,
  StatusIndicator,
  Pagination,
  PaginationButton,
  PaginationText,
} from "./styles";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import { GetEstoque, EstoqueItem } from "../../../../Services/apiFruttyoog";

/* =======================
   TIPAGENS
======================= */

interface EstoqueCategoria {
  categoria: string;
  quantidadeTotal: number;
  produtosCount: number;
  estoqueBaixoCount: number;
}

type FilterType = "todos" | "estoque-baixo" | "estoque-ok" | "sem-estoque";
type SortField = "nome" | "quantidade" | "categoria";
type SortOrder = "asc" | "desc";

/* =======================
   COMPONENTE
======================= */

const StockReport: React.FC = () => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [filteredEstoque, setFilteredEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("todos");
  const [sortField, setSortField] = useState<SortField>("nome");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);

  /* =======================
     CARREGAMENTO
  ======================= */

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await GetEstoque();

      console.log("Dados recebidos do estoque:", data);

      if (data && Array.isArray(data)) {
        const mappedData: EstoqueItem[] = data.map((item: any) => ({
          produtoId: item.produtoId,
          nome: item.nome,
          categoria: item.categoria,
          quantidade: item.quantidade,
          estoqueMinimo: item.estoqueMinimo,
        }));
        setEstoque(mappedData);
        applyFilters(mappedData, searchTerm, selectedCategory, filterType);
        setError(null);
      } else {
        setEstoque([]);
        setFilteredEstoque([]);
        setError("Nenhum dado de estoque encontrado");
      }
    } catch (e) {
      console.error("Erro ao carregar estoque:", e);
      setError("Erro ao buscar estoque. Tente novamente.");
      setEstoque([]);
      setFilteredEstoque([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (
    data: EstoqueItem[],
    search: string,
    category: string,
    filter: FilterType
  ) => {
    let filtered = [...data];

    // Filtro por busca
    if (search.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.nome.toLowerCase().includes(search.toLowerCase()) ||
          item.categoria.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por categoria
    if (category) {
      filtered = filtered.filter((item) => item.categoria === category);
    }

    // Filtro por status do estoque
    switch (filter) {
      case "estoque-baixo":
        filtered = filtered.filter(
          (item) => item.quantidade > 0 && item.quantidade <= item.estoqueMinimo
        );
        break;
      case "estoque-ok":
        filtered = filtered.filter(
          (item) => item.quantidade > item.estoqueMinimo
        );
        break;
      case "sem-estoque":
        filtered = filtered.filter((item) => item.quantidade === 0);
        break;
      case "todos":
      default:
        // Mantém todos
        break;
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "quantidade":
          aValue = a.quantidade;
          bValue = b.quantidade;
          break;
        case "categoria":
          aValue = a.categoria;
          bValue = b.categoria;
          break;
        case "nome":
        default:
          aValue = a.nome;
          bValue = b.nome;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEstoque(filtered);
    setCurrentPage(1); // Reset para primeira página ao aplicar filtros
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters(estoque, searchTerm, selectedCategory, filterType);
  }, [searchTerm, selectedCategory, filterType, sortField, sortOrder, estoque]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  /* =======================
     CÁLCULOS E ESTATÍSTICAS
  ======================= */

  const estatisticas = useMemo(() => {
    const total = {
      produtos: estoque.length,
      quantidadeTotal: estoque.reduce((sum, item) => sum + item.quantidade, 0),
      valorEstoque: estoque.reduce(
        (sum, item) => sum + item.quantidade * 10,
        0
      ), // Exemplo: R$10 por item
      estoqueBaixo: estoque.filter(
        (item) => item.quantidade > 0 && item.quantidade <= item.estoqueMinimo
      ).length,
      semEstoque: estoque.filter((item) => item.quantidade === 0).length,
      categoriasUnicas: new Set(estoque.map((item) => item.categoria)).size,
    };

    const categorias = Array.from(
      new Set(estoque.map((item) => item.categoria))
    )
      .map((categoria) => {
        const produtosCategoria = estoque.filter(
          (item) => item.categoria === categoria
        );
        return {
          categoria,
          quantidadeTotal: produtosCategoria.reduce(
            (sum, item) => sum + item.quantidade,
            0
          ),
          produtosCount: produtosCategoria.length,
          estoqueBaixoCount: produtosCategoria.filter(
            (item) =>
              item.quantidade > 0 && item.quantidade <= item.estoqueMinimo
          ).length,
        };
      })
      .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal);

    const topProdutos = [...estoque]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    const produtosEstoqueBaixo = estoque
      .filter(
        (item) => item.quantidade > 0 && item.quantidade <= item.estoqueMinimo
      )
      .sort((a, b) => a.quantidade - b.quantidade);

    return {
      total,
      categorias,
      topProdutos,
      produtosEstoqueBaixo,
    };
  }, [estoque]);

  /* =======================
     DADOS DOS GRÁFICOS
  ======================= */

  // 📊 Distribuição por Categoria
  const categoryChartData = useMemo(() => {
    const categoriasData = estatisticas.categorias.slice(0, 6); // Top 6 categorias

    if (categoriasData.length === 0) {
      return {
        labels: ["Sem dados"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: categoriasData.map((item) =>
        item.categoria.length > 10
          ? item.categoria.slice(0, 10) + "..."
          : item.categoria
      ),
      datasets: [{ data: categoriasData.map((item) => item.quantidadeTotal) }],
    };
  }, [estatisticas.categorias]);

  // 🥧 Status do Estoque
  const stockStatusChartData = useMemo(() => {
    const status = [
      {
        name: "Estoque OK",
        population:
          estatisticas.total.produtos -
          estatisticas.total.estoqueBaixo -
          estatisticas.total.semEstoque,
        color: "#4CAF50",
      },
      {
        name: "Estoque Baixo",
        population: estatisticas.total.estoqueBaixo,
        color: "#FF9800",
      },
      {
        name: "Sem Estoque",
        population: estatisticas.total.semEstoque,
        color: "#F44336",
      },
    ];

    return status.filter((item) => item.population > 0);
  }, [estatisticas.total]);

  // 📈 Top Produtos em Estoque
  const topProductsChartData = useMemo(() => {
    const topProdutos = estatisticas.topProdutos;

    if (topProdutos.length === 0) {
      return {
        labels: ["Sem dados"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: topProdutos.map((item) =>
        item.nome.length > 10 ? item.nome.slice(0, 10) + "..." : item.nome
      ),
      datasets: [{ data: topProdutos.map((item) => item.quantidade) }],
    };
  }, [estatisticas.topProdutos]);

  /* =======================
     PAGINAÇÃO
  ======================= */

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstoque.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEstoque.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  /* =======================
     CONFIGURAÇÃO DOS GRÁFICOS
  ======================= */

  const screenWidth = Dimensions.get("window").width - 40;

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: { fontSize: 10 },
    style: {
      borderRadius: 16,
    },
  };

  const pieChartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  /* =======================
     RENDER
  ======================= */

  if (loading) {
    return (
      <LoaderContainer>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 20, color: "#666" }}>
          Carregando relatório de estoque...
        </Text>
      </LoaderContainer>
    );
  }

  if (error) {
    return (
      <Container
        style={{ justifyContent: "center", alignItems: "center", padding: 40 }}
      >
        <Text
          style={{ color: "#F44336", marginBottom: 20, textAlign: "center" }}
        >
          {error}
        </Text>
        <Button bgColor="#2196F3" onPress={loadData}>
          <ButtonText>Tentar novamente</ButtonText>
        </Button>
      </Container>
    );
  }

  if (estoque.length === 0) {
    return (
      <Container
        style={{ justifyContent: "center", alignItems: "center", padding: 40 }}
      >
        <NoDataText>Nenhum produto cadastrado no estoque</NoDataText>
        <Button bgColor="#2196F3" onPress={loadData} style={{ marginTop: 20 }}>
          <ButtonText>↻ Recarregar</ButtonText>
        </Button>
      </Container>
    );
  }

  const categoriasUnicas = Array.from(
    new Set(estoque.map((item) => item.categoria))
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Container>
        <Title>📦 Dashboard de Estoque</Title>

        <InfoContainer>
          <InfoText>
            Monitoramento completo do estoque. Acompanhe níveis, identifique
            produtos com baixa disponibilidade e gerencie categorias.
          </InfoText>
        </InfoContainer>

        {/* Filtros e Busca */}
        <FilterContainer>
          <SearchInput
            placeholder="🔍 Buscar produto ou categoria..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          <Text
            style={{
              fontSize: 14,
              color: "#666",
              marginVertical: 10,
              fontWeight: "500",
            }}
          >
            Filtrar por Status:
          </Text>

          <View style={{ marginBottom: 10 }}>
            {/* Primeira linha - 2 botões */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Button
                active={filterType === "todos"}
                onPress={() => setFilterType("todos")}
                style={{ flex: 1, marginRight: 5 }}
              >
                <ButtonText active={filterType === "todos"}>
                  📋 Todos ({estatisticas.total.produtos})
                </ButtonText>
              </Button>

              <Button
                active={filterType === "estoque-ok"}
                onPress={() => setFilterType("estoque-ok")}
                style={{ flex: 1, marginLeft: 5 }}
              >
                <ButtonText active={filterType === "estoque-ok"}>
                  ✅ Estoque OK
                </ButtonText>
              </Button>
            </View>

            {/* Segunda linha - 2 botões */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                active={filterType === "estoque-baixo"}
                onPress={() => setFilterType("estoque-baixo")}
                style={{ flex: 1, marginRight: 5 }}
              >
                <ButtonText active={filterType === "estoque-baixo"}>
                  Estoque Baixo ({estatisticas.total.estoqueBaixo})
                </ButtonText>
              </Button>

              <Button
                active={filterType === "sem-estoque"}
                onPress={() => setFilterType("sem-estoque")}
                style={{ flex: 1, marginLeft: 5 }}
              >
                <ButtonText active={filterType === "sem-estoque"}>
                  ❌ Sem Estoque ({estatisticas.total.semEstoque})
                </ButtonText>
              </Button>
            </View>
          </View>

          {categoriasUnicas.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginVertical: 10,
                  fontWeight: "500",
                }}
              >
                Filtrar por Categoria:
              </Text>
              <CategoryFilter>
                <CategoryButton
                  selected={!selectedCategory}
                  onPress={() => setSelectedCategory("")}
                >
                  <CategoryButtonText selected={!selectedCategory}>
                    Todas ({estatisticas.total.categoriasUnicas})
                  </CategoryButtonText>
                </CategoryButton>
                {categoriasUnicas.map((categoria) => (
                  <CategoryButton
                    key={categoria}
                    selected={selectedCategory === categoria}
                    onPress={() => setSelectedCategory(categoria)}
                  >
                    <CategoryButtonText
                      selected={selectedCategory === categoria}
                    >
                      {categoria}
                    </CategoryButtonText>
                  </CategoryButton>
                ))}
              </CategoryFilter>
            </>
          )}

          <Text
            style={{
              fontSize: 14,
              color: "#666",
              marginVertical: 10,
              fontWeight: "500",
            }}
          >
            Ordenar por:
          </Text>
          <FilterButtonContainer>
            <Button
              bgColor={sortField === "nome" ? "#2196F3" : "#E0E0E0"}
              onPress={() => {
                setSortField("nome");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              style={{ flex: 1, marginRight: 5 }}
            >
              <ButtonText
                style={{ color: sortField === "nome" ? "white" : "#666" }}
              >
                Nome {sortField === "nome" && (sortOrder === "asc" ? "↑" : "↓")}
              </ButtonText>
            </Button>
            <Button
              bgColor={sortField === "quantidade" ? "#2196F3" : "#E0E0E0"}
              onPress={() => {
                setSortField("quantidade");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              style={{ flex: 1, marginHorizontal: 5 }}
            >
              <ButtonText
                style={{ color: sortField === "quantidade" ? "white" : "#666" }}
              >
                Quantidade{" "}
                {sortField === "quantidade" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </ButtonText>
            </Button>
            <Button
              bgColor={sortField === "categoria" ? "#2196F3" : "#E0E0E0"}
              onPress={() => {
                setSortField("categoria");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              style={{ flex: 1, marginLeft: 5 }}
            >
              <ButtonText
                style={{ color: sortField === "categoria" ? "white" : "#666" }}
              >
                Categoria{" "}
                {sortField === "categoria" && (sortOrder === "asc" ? "↑" : "↓")}
              </ButtonText>
            </Button>
          </FilterButtonContainer>
        </FilterContainer>

        {/* Estatísticas */}
        <SectionTitle>📈 Resumo do Estoque</SectionTitle>
        <Card>
          <Row style={{ marginBottom: 15 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Total de Produtos
              </Text>
              <StatValue>{estatisticas.total.produtos}</StatValue>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Quantidade Total
              </Text>
              <StatValue>{estatisticas.total.quantidadeTotal}</StatValue>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
                Categorias
              </Text>
              <StatValue>{estatisticas.total.categoriasUnicas}</StatValue>
            </View>
          </Row>

          <Row
            style={{
              paddingTop: 15,
              borderTopWidth: 1,
              borderTopColor: "#eee",
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#4CAF50",
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{ fontSize: 14, color: "#666", fontWeight: "500" }}
                >
                  Estoque OK
                </Text>
              </View>
              <StatValue style={{ color: "#4CAF50" }}>
                {estatisticas.total.produtos -
                  estatisticas.total.estoqueBaixo -
                  estatisticas.total.semEstoque}
              </StatValue>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#FF9800",
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{ fontSize: 14, color: "#666", fontWeight: "500" }}
                >
                  Estoque Baixo
                </Text>
              </View>
              <StatValue style={{ color: "#FF9800" }}>
                {estatisticas.total.estoqueBaixo}
              </StatValue>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#F44336",
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{ fontSize: 14, color: "#666", fontWeight: "500" }}
                >
                  Sem Estoque
                </Text>
              </View>
              <StatValue style={{ color: "#F44336" }}>
                {estatisticas.total.semEstoque}
              </StatValue>
            </View>
          </Row>
        </Card>

        {/* Gráficos */}
        <SectionTitle>📊 Distribuição por Categoria</SectionTitle>
        <ChartCard>
          <CardTitle>Top Categorias por Quantidade</CardTitle>
          <CardContent>
            {categoryChartData.labels[0] !== "Sem dados" ? (
              <BarChart
                data={categoryChartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={45}
                showValuesOnTopOfBars
                fromZero
                style={{ borderRadius: 8 }}
                yAxisLabel=""
                yAxisSuffix=""
              />
            ) : (
              <NoDataText>Não há dados por categoria</NoDataText>
            )}
          </CardContent>
        </ChartCard>

        <SectionTitle>📈 Status do Estoque</SectionTitle>
        <ChartCard>
          <CardTitle>Distribuição do Estoque</CardTitle>
          <CardContent>
            {stockStatusChartData.length > 0 ? (
              <View style={{ alignItems: "center" }}>
                <PieChart
                  data={stockStatusChartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={pieChartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            ) : (
              <NoDataText>Não há dados de status</NoDataText>
            )}
          </CardContent>
        </ChartCard>

        <SectionTitle>🏆 Produtos com Mais Estoque</SectionTitle>
        <ChartCard>
          <CardTitle>Top 5 Produtos</CardTitle>
          <CardContent>
            {topProductsChartData.labels[0] !== "Sem dados" ? (
              <BarChart
                data={topProductsChartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={45}
                showValuesOnTopOfBars
                fromZero
                style={{ borderRadius: 8 }}
                yAxisLabel=""
                yAxisSuffix=""
              />
            ) : (
              <NoDataText>Não há dados de produtos</NoDataText>
            )}
          </CardContent>
        </ChartCard>

        {/* Tabela de Produtos */}
        <SectionTitle>📋 Lista de Produtos</SectionTitle>
        <Card>
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>
              Mostrando {currentItems.length} de {filteredEstoque.length}{" "}
              produtos
              {selectedCategory && ` na categoria "${selectedCategory}"`}
              {filterType !== "todos" && ` (${filterType.replace("-", " ")})`}
            </Text>
          </View>

          {currentItems.length > 0 ? (
            <>
              <StockTable>
                <TableHeader>
                  <TableCell style={{ flex: 2 }}>
                    <TableHeaderText>Produto</TableHeaderText>
                  </TableCell>
                  <TableCell>
                    <TableHeaderText>Categoria</TableHeaderText>
                  </TableCell>
                  <TableCell>
                    <TableHeaderText>Estoque</TableHeaderText>
                  </TableCell>
                  <TableCell>
                    <TableHeaderText>Status</TableHeaderText>
                  </TableCell>
                </TableHeader>

                {currentItems.map((item, index) => {
                  let status = "";
                  let statusColor = "";

                  if (item.quantidade === 0) {
                    status = "Sem Estoque";
                    statusColor = "#F44336";
                  } else if (item.quantidade <= item.estoqueMinimo) {
                    status = "Baixo";
                    statusColor = "#FF9800";
                  } else {
                    status = "OK";
                    statusColor = "#4CAF50";
                  }

                  return (
                    <TableRow key={item.produtoId} even={index % 2 === 0}>
                      <TableCell style={{ flex: 2 }}>
                        <TableCellText style={{ fontWeight: "500" }}>
                          {item.nome}
                        </TableCellText>
                        <TableCellText style={{ fontSize: 11, color: "#666" }}>
                          ID: {item.produtoId}
                        </TableCellText>
                      </TableCell>
                      <TableCell>
                        <TableCellText>{item.categoria}</TableCellText>
                      </TableCell>
                      <TableCell>
                        <TableCellText
                          style={{ fontWeight: "bold", fontSize: 14 }}
                        >
                          {item.quantidade}
                        </TableCellText>
                        <TableCellText style={{ fontSize: 11, color: "#666" }}>
                          Mín: {item.estoqueMinimo}
                        </TableCellText>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator color={statusColor}>
                          <TableCellText
                            style={{
                              color: "white",
                              fontSize: 11,
                              fontWeight: "bold",
                            }}
                          >
                            {status}
                          </TableCellText>
                        </StatusIndicator>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </StockTable>

              {/* Paginação */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationButton
                    disabled={currentPage === 1}
                    onPress={() => paginate(currentPage - 1)}
                  >
                    <PaginationText disabled={currentPage === 1}>
                      ← Anterior
                    </PaginationText>
                  </PaginationButton>

                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationButton
                          key={pageNum}
                          active={currentPage === pageNum}
                          onPress={() => paginate(pageNum)}
                        >
                          <PaginationText active={currentPage === pageNum}>
                            {pageNum}
                          </PaginationText>
                        </PaginationButton>
                      );
                    })}
                  </View>

                  <PaginationButton
                    disabled={currentPage === totalPages}
                    onPress={() => paginate(currentPage + 1)}
                  >
                    <PaginationText disabled={currentPage === totalPages}>
                      Próxima →
                    </PaginationText>
                  </PaginationButton>
                </Pagination>
              )}
            </>
          ) : (
            <NoDataText style={{ padding: 20 }}>
              Nenhum produto encontrado com os filtros selecionados
            </NoDataText>
          )}
        </Card>

        {/* Alerta de Estoque Baixo */}
        {estatisticas.produtosEstoqueBaixo.length > 0 && (
          <Card
            style={{
              backgroundColor: "#FFF3E0",
              borderLeftWidth: 4,
              borderLeftColor: "#FF9800",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#E65100" }}
              >
                Estoque Baixo
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#E65100", marginBottom: 10 }}>
              {estatisticas.produtosEstoqueBaixo.length} produto(s) precisam de
              reposição:
            </Text>
            {estatisticas.produtosEstoqueBaixo.slice(0, 3).map((item) => (
              <View
                key={item.produtoId}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontSize: 13, color: "#666" }}>
                  • {item.nome}
                </Text>
                <Text
                  style={{ fontSize: 13, color: "#F44336", fontWeight: "bold" }}
                >
                  {item.quantidade}/{item.estoqueMinimo}
                </Text>
              </View>
            ))}
            {estatisticas.produtosEstoqueBaixo.length > 3 && (
              <Text
                style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}
              >
                + {estatisticas.produtosEstoqueBaixo.length - 3} produto(s) com
                estoque baixo
              </Text>
            )}
          </Card>
        )}

        {/* Botão de atualizar */}
        <Button
          bgColor="#2196F3"
          onPress={loadData}
          style={{ marginTop: 20, marginBottom: 30 }}
        >
          <ButtonText>↻ Atualizar Estoque</ButtonText>
        </Button>
      </Container>
    </ScrollView>
  );
};

export default StockReport;

