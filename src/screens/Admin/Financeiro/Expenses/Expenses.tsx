// Expenses.tsx - VERSÃO CORRIGIDA
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import {
  Container,
  Title,
  Section,
  ExpenseItem,
  Label,
  Input,
  Button,
  ButtonText,
  FilterContainer,
  FilterGroup,
  FilterLabel,
  ActionButtons,
  ActionButton,
  ActionText,
  ModalContent,
  ModalTitle,
  CloseButton,
  CloseText,
  LoadingContainer,
  LoadingText,
  EmptyContainer,
  EmptyText,
  CategoryBadge,
  CategoryText,
  StatsContainer,
  StatsCard,
  StatsTitle,
  StatsValue,
  StatsLabel,
  ScrollContent,
  MainContainer,
} from "./styles";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

import {
  GetDespesa,
  PostDespesa,
  PutDespesa,
  DeleteDespesa,
} from "../../../../Services/apiFruttyoog";

const { width } = Dimensions.get("window");

interface Despesa {
  id: number;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
}

interface DespesaForm {
  id?: number;
  descricao: string;
  categoria: string;
  data: string;
  valor: string;
}

interface DespesaStats {
  totalGeral: number;
  totalPorCategoria: Record<string, number>;
  totalPorMes: Record<string, number>;
  totalDespesas: number;
}

// Categorias disponíveis (baseado no seu enum do backend)
const CATEGORIAS = [
  "ALIMENTACAO",
  "COMBUSTIVEL",
  "LIMPEZA",
  "SALARIO_HUGO",
  "SALARIO_MAZINHO",
  "MEI",
  "SANGRIA",
  "OUTROS",
];

// Funções auxiliares para formatação de data
const formatDateInput = (text: string): string => {
  let numbers = text.replace(/\D/g, "");

  if (numbers.length > 8) {
    numbers = numbers.substring(0, 8);
  }

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
  } else {
    return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4, 8)}`;
  }
};

const formatDateToApi = (dateString: string): string => {
  if (!dateString) return "";

  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    // Verifica se o ano tem 4 dígitos
    if (year.length === 4) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else if (year.length === 2) {
      // Assume século 20 para anos de 2 dígitos
      return `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return dateString;
};

const formatDateFromApi = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);

  try {
    // Tenta diferentes formatos
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    } else if (dateString.includes("-")) {
      return new Date(dateString);
    } else {
      return new Date(dateString);
    }
  } catch {
    return new Date(0);
  }
};

const Expenses: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [despesasFiltradas, setDespesasFiltradas] = useState<Despesa[]>([]);
  const [stats, setStats] = useState<DespesaStats>({
    totalGeral: 0,
    totalPorCategoria: {},
    totalPorMes: {},
    totalDespesas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedDespesa, setSelectedDespesa] = useState<Despesa | null>(null);
  const [form, setForm] = useState<DespesaForm>({
    descricao: "",
    categoria: CATEGORIAS[0],
    data: new Date().toISOString().split("T")[0],
    valor: "",
  });
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [dataFormatada, setDataFormatada] = useState("");

  useEffect(() => {
    loadDespesas();
  }, []);

  const loadDespesas = async () => {
    try {
      setLoading(true);
      console.log("Buscando despesas...");
      const data = await GetDespesa();

      console.log("Dados recebidos da API:", data);

      if (data && Array.isArray(data)) {
        // Ordenar por data (mais recente primeiro) usando parseDate
        const despesasOrdenadas = [...data].sort((a, b) => {
          const dateA = parseDate(a.data);
          const dateB = parseDate(b.data);
          return dateB.getTime() - dateA.getTime();
        });

        setDespesas(despesasOrdenadas);
        setDespesasFiltradas(despesasOrdenadas);
        calculateStats(despesasOrdenadas);
      } else {
        setDespesas([]);
        setDespesasFiltradas([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
      Alert.alert("Erro", "Não foi possível carregar as despesas");
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDataFormatada(formatted);

    if (formatted.length === 10) {
      const apiDate = formatDateToApi(formatted);
      setFiltroData(apiDate);
      setForm((prev) => ({ ...prev, dataDespesa: apiDate }));
    } else {
      setFiltroData("");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDespesas();
    setRefreshing(false);
  };

  const calculateStats = (despesasList: Despesa[]) => {
    const stats: DespesaStats = {
      totalGeral: 0,
      totalPorCategoria: {},
      totalPorMes: {},
      totalDespesas: despesasList.length,
    };

    despesasList.forEach((despesa) => {
      const valor = Number(despesa.valor) || 0;
      const categoria = despesa.categoria || "OUTROS";

      try {
        const data = parseDate(despesa.data);
        const mesAno = `${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()}`;

        stats.totalGeral += valor;
        stats.totalPorCategoria[categoria] =
          (stats.totalPorCategoria[categoria] || 0) + valor;
        stats.totalPorMes[mesAno] = (stats.totalPorMes[mesAno] || 0) + valor;
      } catch (error) {
        console.error(
          "Erro ao processar data da despesa:",
          despesa.data,
          error
        );
      }
    });

    setStats(stats);
  };

  const aplicarFiltros = () => {
    let filtradas = [...despesas];

    if (filtroCategoria) {
      filtradas = filtradas.filter((d) =>
        d.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
      );
    }

    if (filtroDescricao) {
      filtradas = filtradas.filter((d) =>
        d.descricao.toLowerCase().includes(filtroDescricao.toLowerCase())
      );
    }

    if (filtroData) {
      filtradas = filtradas.filter((d) => {
        try {
          const dataDespesa = parseDate(d.data);
          const filtroDate = parseDate(filtroData);

          return (
            dataDespesa.getFullYear() === filtroDate.getFullYear() &&
            dataDespesa.getMonth() === filtroDate.getMonth() &&
            dataDespesa.getDate() === filtroDate.getDate()
          );
        } catch {
          return false;
        }
      });
    }

    setDespesasFiltradas(filtradas);
  };

  const limparFiltros = () => {
    setFiltroCategoria("");
    setFiltroDescricao("");
    setFiltroData("");
    setDataFormatada("");
    setDespesasFiltradas(despesas);
  };

  const abrirModalAdicionar = () => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, "0");
    const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
    const ano = hoje.getFullYear();
    const dataApi = `${ano}-${mes}-${dia}`;

    setForm({
      descricao: "",
      categoria: CATEGORIAS[0],
      data: dataApi,
      valor: "",
    });
    setDataFormatada(`${dia}/${mes}/${ano}`);
    setModalMode("add");
    setModalVisible(true);
  };

  const abrirModalEditar = (despesa: Despesa) => {
    console.log("Editando despesa:", despesa);
    setSelectedDespesa(despesa);
    setForm({
      id: despesa.id,
      descricao: despesa.descricao,
      categoria: despesa.categoria,
      data: despesa.data,
      valor: despesa.valor.toString(),
    });
    setDataFormatada(formatDateFromApi(despesa.data));
    setModalMode("edit");
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedDespesa(null);
    setForm({
      descricao: "",
      categoria: CATEGORIAS[0],
      data: new Date().toISOString().split("T")[0],
      valor: "",
    });
    setDataFormatada("");
  };

  const handleSubmit = async () => {
    // Validações
    if (!form.descricao.trim()) {
      Alert.alert("Erro", "Informe a descrição da despesa");
      return;
    }

    if (
      !form.valor.trim() ||
      isNaN(Number(form.valor)) ||
      Number(form.valor) <= 0
    ) {
      Alert.alert("Erro", "Informe um valor válido");
      return;
    }

    // Usa a data do form ou converte da dataFormatada
    let dataApi = form.data;
    if (dataFormatada && dataFormatada.length === 10) {
      dataApi = formatDateToApi(dataFormatada);
    }

    console.log("Data para API:", {
      dataApi,
      dataFormatada,
      formData: form.data,
    });

    if (!dataApi) {
      Alert.alert("Erro", "Informe uma data válida no formato DD/MM/AAAA");
      return;
    }

    try {
      const despesaData = {
        descricao: form.descricao.trim(),
        categoria: form.categoria,
        data: dataApi,
        valor: Number(form.valor),
      };

      console.log("Enviando dados para API:", despesaData);

      if (modalMode === "add") {
        console.log("Chamando PostDespesa...");
        const resultado = await PostDespesa(despesaData);
        console.log("Resultado do PostDespesa:", resultado);
        Alert.alert("Sucesso", "Despesa adicionada com sucesso!");
      } else {
        console.log("Chamando PutDespesa...");
        const resultado = await PutDespesa({ ...despesaData, id: form.id! });
        console.log("Resultado do PutDespesa:", resultado);
        Alert.alert("Sucesso", "Despesa atualizada com sucesso!");
      }

      fecharModal();
      await loadDespesas();
    } catch (error: any) {
      console.error("Erro detalhado ao salvar despesa:", error);
      console.error("Mensagem:", error.message);
      console.error("Resposta:", error.response?.data);
      Alert.alert(
        "Erro",
        `Não foi possível salvar a despesa: ${error.message}`
      );
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta despesa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteDespesa(id);
              Alert.alert("Sucesso", "Despesa excluída com sucesso!");
              await loadDespesas();
            } catch (error) {
              console.error("Erro ao excluir despesa:", error);
              Alert.alert("Erro", "Não foi possível excluir a despesa");
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      ALIMENTACAO: "#FF6B6B",
      COMBUSTIVEL: "#4ECDC4",
      LIMPEZA: "#FFD166",
      SALARIO_HUGO: "#06D6A0",
      SALARIO_MAZINHO: "#118AB2",
      MEI: "#7209B7",
      SANGRIA: "#073B4C",
      OUTROS: "#6A6A6A",
    };
    return colors[categoria] || "#6A6A6A";
  };

  const getCategoriaName = (categoria: string) => {
    const names: Record<string, string> = {
      ALIMENTACAO: "Alimentação",
      COMBUSTIVEL: "Combustível",
      LIMPEZA: "Limpeza",
      SALARIO_HUGO: "Salário Hugo",
      SALARIO_MAZINHO: "Salário Mazinho",
      MEI: "MEI",
      SANGRIA: "Sangria",
      OUTROS: "Outros",
    };
    return names[categoria] || categoria;
  };

  if (loading && !refreshing) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <LoadingText>Carregando despesas...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <MainContainer>
      <ScrollContent
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Title>Despesas</Title>

        {/* Estatísticas */}
        <StatsContainer>
          <StatsCard backgroundColor="#FF6B6B">
            <StatsTitle>Total Geral</StatsTitle>
            <StatsValue>{formatCurrency(stats.totalGeral)}</StatsValue>
            <StatsLabel>{stats.totalDespesas} despesas</StatsLabel>
          </StatsCard>

          <StatsCard backgroundColor="#4ECDC4">
            <StatsTitle>Último Mês</StatsTitle>
            <StatsValue>
              {formatCurrency(
                Object.entries(stats.totalPorMes)
                  .sort(([mesA], [mesB]) => {
                    const [mesA_num, anoA] = mesA.split("/").map(Number);
                    const [mesB_num, anoB] = mesB.split("/").map(Number);
                    if (anoA !== anoB) return anoB - anoA;
                    return mesB_num - mesA_num;
                  })
                  .map(([, valor]) => valor)[0] || 0
              )}
            </StatsValue>
            <StatsLabel>
              {Object.keys(stats.totalPorMes).sort((a, b) => {
                const [mesA_num, anoA] = a.split("/").map(Number);
                const [mesB_num, anoB] = b.split("/").map(Number);
                if (anoA !== anoB) return anoB - anoA;
                return mesB_num - mesA_num;
              })[0] || "N/A"}
            </StatsLabel>
          </StatsCard>
        </StatsContainer>

        {/* Filtros */}
        <FilterContainer>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ width: width < 400 ? "100%" : "48%", marginBottom: 10 }}
            >
              <FilterLabel>Descrição:</FilterLabel>
              <Input
                placeholder="Buscar por descrição"
                value={filtroDescricao}
                onChangeText={setFiltroDescricao}
              />
            </View>

            <View
              style={{ width: width < 400 ? "100%" : "48%", marginBottom: 10 }}
            >
              <FilterLabel>Categoria:</FilterLabel>
              <Input
                placeholder="Ex: ALIMENTACAO"
                value={filtroCategoria}
                onChangeText={setFiltroCategoria}
              />
            </View>

            <View
              style={{ width: width < 400 ? "100%" : "48%", marginBottom: 15 }}
            >
              <FilterLabel>Data (DD/MM/AAAA):</FilterLabel>
              <Input
                placeholder="DD/MM/AAAA"
                value={dataFormatada}
                onChangeText={handleDataChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={aplicarFiltros}
              style={{
                flex: 1,
                backgroundColor: "#4ECDC4",
                padding: 12,
                borderRadius: 8,
                marginRight: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                🔍
              </Text>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
              >
                Aplicar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={limparFiltros}
              style={{
                flex: 1,
                backgroundColor: "#FFD166",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                marginHorizontal: 5,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                🗑️
              </Text>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
              >
                Limpar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={abrirModalAdicionar}
              style={{
                flex: 1,
                backgroundColor: "#06D6A0",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                marginLeft: 5,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                ➕
              </Text>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
              >
                Nova
              </Text>
            </TouchableOpacity>
          </View>
        </FilterContainer>

        {/* Lista de Despesas */}
        {despesasFiltradas.length === 0 ? (
          <EmptyContainer>
            <Text style={{ fontSize: 60, marginBottom: 20 }}>📊</Text>
            <EmptyText>
              {despesas.length === 0
                ? "Nenhuma despesa registrada"
                : "Nenhuma despesa encontrada com os filtros aplicados"}
            </EmptyText>
            {despesas.length > 0 && (
              <TouchableOpacity
                onPress={limparFiltros}
                style={{
                  backgroundColor: "#FF6B6B",
                  padding: 12,
                  borderRadius: 6,
                  alignItems: "center",
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 14,
                    marginRight: 8,
                  }}
                >
                  🔄
                </Text>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                >
                  Limpar Filtros
                </Text>
              </TouchableOpacity>
            )}
          </EmptyContainer>
        ) : (
          <View style={{ paddingHorizontal: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ fontSize: 14, color: "#666" }}>
                {despesasFiltradas.length} despesa(s) encontrada(s)
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#FF6B6B" }}
              >
                Total: {formatCurrency(stats.totalGeral)}
              </Text>
            </View>

            {/* Despesas ordenadas por data */}
            {despesasFiltradas.map((despesa) => (
              <ExpenseItem key={despesa.id}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#333",
                        marginBottom: 5,
                      }}
                    >
                      {despesa.descricao}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <Text
                        style={{ fontSize: 12, color: "#666", marginRight: 8 }}
                      >
                        📅 {formatDateFromApi(despesa.data)}
                      </Text>
                      <CategoryBadge
                        backgroundColor={getCategoriaColor(despesa.categoria)}
                      >
                        <CategoryText>
                          {getCategoriaName(despesa.categoria)}
                        </CategoryText>
                      </CategoryBadge>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: "#FF6B6B",
                    }}
                  >
                    {formatCurrency(despesa.valor)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => abrirModalEditar(despesa)}
                    style={{
                      backgroundColor: "#4ECDC4",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(despesa.id)}
                    style={{
                      backgroundColor: "#FF6B6B",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </ExpenseItem>
            ))}
          </View>
        )}

        {/* Resumo por Categoria */}
        {Object.keys(stats.totalPorCategoria).length > 0 && (
          <View
            style={{
              padding: 15,
              backgroundColor: "#f8f9fa",
              margin: 10,
              borderRadius: 8,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 15,
                color: "#333",
              }}
            >
              📊 Distribuição por Categoria
            </Text>

            {Object.entries(stats.totalPorCategoria)
              .sort(([, valorA], [, valorB]) => valorB - valorA)
              .map(([categoria, valor]) => {
                const porcentagem =
                  stats.totalGeral > 0
                    ? ((valor / stats.totalGeral) * 100).toFixed(1)
                    : "0";

                return (
                  <View key={categoria} style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: getCategoriaColor(categoria),
                            marginRight: 8,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#333",
                            fontWeight: "500",
                          }}
                        >
                          {getCategoriaName(categoria)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#FF6B6B",
                        }}
                      >
                        {formatCurrency(valor)}
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 6,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${parseFloat(porcentagem)}%` as any,
                          height: "100%",
                          backgroundColor: getCategoriaColor(categoria),
                          borderRadius: 3,
                        }}
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 11,
                        color: "#666",
                        textAlign: "right",
                        marginTop: 2,
                      }}
                    >
                      {porcentagem}% do total
                    </Text>
                  </View>
                );
              })}
          </View>
        )}
      </ScrollContent>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={fecharModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxHeight: "85%",
              backgroundColor: "white",
              borderRadius: 15,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
                {modalMode === "add" ? "Nova Despesa" : "Editar Despesa"}
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <Text style={{ fontSize: 24, color: "#999" }}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 14, color: "#333", marginBottom: 5 }}>
                  Descrição *
                </Text>
                <Input
                  placeholder="Descrição da despesa"
                  value={form.descricao}
                  onChangeText={(text) => setForm({ ...form, descricao: text })}
                  style={{ marginBottom: 15 }}
                />

                <Text style={{ fontSize: 14, color: "#333", marginBottom: 5 }}>
                  Categoria *
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 15,
                  }}
                >
                  {CATEGORIAS.map((categoria) => (
                    <TouchableOpacity
                      key={categoria}
                      onPress={() => setForm({ ...form, categoria: categoria })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 15,
                        backgroundColor:
                          form.categoria === categoria
                            ? getCategoriaColor(categoria)
                            : "#f0f0f0",
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            form.categoria === categoria ? "white" : "#666",
                          fontSize: 12,
                        }}
                      >
                        {getCategoriaName(categoria)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ fontSize: 14, color: "#333", marginBottom: 5 }}>
                  Data (DD/MM/AAAA) *
                </Text>
                <Input
                  placeholder="DD/MM/AAAA"
                  value={dataFormatada}
                  onChangeText={handleDataChange}
                  keyboardType="numeric"
                  maxLength={10}
                  style={{ marginBottom: 15 }}
                />

                <Text style={{ fontSize: 14, color: "#333", marginBottom: 5 }}>
                  Valor (R$) *
                </Text>
                <Input
                  placeholder="0,00"
                  value={form.valor}
                  onChangeText={(text) =>
                    setForm({ ...form, valor: text.replace(/[^0-9.,]/g, "") })
                  }
                  keyboardType="decimal-pad"
                  style={{ marginBottom: 15 }}
                />
              </View>
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={fecharModal}
                style={{
                  flex: 1,
                  backgroundColor: "#f5f5f5",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#666", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  flex: 1,
                  backgroundColor: "#06D6A0",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {modalMode === "add" ? "Salvar" : "Atualizar"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </MainContainer>
  );
};

export default Expenses;
