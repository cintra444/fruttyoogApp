import React, { useState } from "react";
import { Alert, Share } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import {
  GetCliente,
  GetCompra,
  GetFornecedor,
  GetProducts,
  GetVenda,
} from "src/Services/apiFruttyoog";
import {
  Card,
  CardSubtitle,
  CardTitle,
  Container,
  Content,
  Description,
  ExportButton,
  ExportButtonText,
  Title,
} from "./styles";

type ExportType = "vendas" | "compras" | "clientes" | "produtos" | "fornecedores";

const escapeCsv = (value: unknown): string => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes(";") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const toCsv = (rows: Array<Record<string, unknown>>): string => {
  if (!rows.length) return "";

  const columns = Object.keys(rows[0]);
  const header = columns.map(escapeCsv).join(";");
  const body = rows
    .map((row) => columns.map((column) => escapeCsv(row[column])).join(";"))
    .join("\n");

  return `${header}\n${body}`;
};

const getExportRows = async (type: ExportType): Promise<Array<Record<string, unknown>>> => {
  if (type === "vendas") {
    const vendas = (await GetVenda()) ?? [];
    return vendas.map((venda) => ({
      id: venda.id,
      dataVenda: venda.dataVenda,
      cliente: venda.cliente?.nome ?? "",
      vendedor: venda.usuario?.nome ?? "",
      valorTotal: venda.valorTotal,
      valorPago: venda.valorTotalPago,
      saldoDevedor: venda.saldoDevedor,
      itens: venda.itens?.length ?? 0,
      pagamentos: venda.pagamentos?.length ?? 0,
    }));
  }

  if (type === "compras") {
    const compras = (await GetCompra()) ?? [];
    return compras.map((compra) => ({
      id: compra.id,
      dataCompra: compra.dataCompra,
      fornecedorId: compra.fornecedorId,
      tipoCompra: compra.tipoCompra,
      valorNota: compra.valorNota,
      tipoPagamento: compra.tipoPagamento,
      prazoPagamento: compra.prazoPagamento,
      itens: compra.itens?.length ?? 0,
      pagamentos: compra.pagamentos?.length ?? 0,
    }));
  }

  if (type === "clientes") {
    const clientes = (await GetCliente()) ?? [];
    return clientes.map((cliente) => ({
      id: cliente.id,
      codigoCliente: cliente.codigoCliente,
      nome: cliente.nome,
      cpf: cliente.cpf,
      dataNascimento: cliente.dataNascimento,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
      referencia: cliente.referencia,
      tipoCliente: cliente.tipoCliente,
    }));
  }

  if (type === "produtos") {
    const produtos = (await GetProducts()) ?? [];
    return produtos.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      codigoProduto: produto.codigoProduto,
      descricao: produto.descricao,
      precoCusto: produto.precoCusto,
      precoVenda: produto.precoVenda,
      tipoUnidade: produto.tipoUnidade,
      qtdeEstoque: produto.qtdeEstoque,
      categoriaId: produto.categoria?.id ?? "",
    }));
  }

  const fornecedores = (await GetFornecedor()) ?? [];
  return fornecedores.map((fornecedor) => ({
    id: fornecedor.id,
    nomeFantasia: fornecedor.nomeFantasia,
    nomeContato: fornecedor.nomeContato,
    telefone: fornecedor.telefone,
  }));
};

const ExportData: React.FC = () => {
  const [loading, setLoading] = useState<ExportType | null>(null);

  const exportType = async (type: ExportType, fileLabel: string) => {
    try {
      setLoading(type);
      const rows = await getExportRows(type);

      if (!rows.length) {
        Alert.alert("Sem dados", `Não há dados de ${fileLabel} para exportar.`);
        return;
      }

      const csv = toCsv(rows);
      const directory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
      if (!directory) {
        Alert.alert("Erro", "Não foi possível localizar diretório para exportação.");
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileUri = `${directory}${fileLabel}_${timestamp}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Share.share({
        message: `Arquivo de ${fileLabel} exportado: ${fileUri}`,
        url: fileUri,
      });
    } catch {
      Alert.alert("Erro", `Falha ao exportar ${fileLabel}.`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Exportação para Excel</Title>
        <Description>
          Exporte os dados em CSV. O arquivo pode ser aberto no Excel, Google Sheets ou LibreOffice.
        </Description>

        <Card>
          <CardTitle>Vendas</CardTitle>
          <CardSubtitle>Exporta dados financeiros e status de pagamento das vendas.</CardSubtitle>
          <ExportButton
            disabled={loading !== null}
            onPress={() => exportType("vendas", "vendas")}
          >
            <ExportButtonText>
              {loading === "vendas" ? "Exportando..." : "Exportar Vendas"}
            </ExportButtonText>
          </ExportButton>
        </Card>

        <Card>
          <CardTitle>Compras</CardTitle>
          <CardSubtitle>Exporta compras, valores e informações de pagamento.</CardSubtitle>
          <ExportButton
            disabled={loading !== null}
            onPress={() => exportType("compras", "compras")}
          >
            <ExportButtonText>
              {loading === "compras" ? "Exportando..." : "Exportar Compras"}
            </ExportButtonText>
          </ExportButton>
        </Card>

        <Card>
          <CardTitle>Clientes</CardTitle>
          <CardSubtitle>Exporta cadastro completo de clientes.</CardSubtitle>
          <ExportButton
            disabled={loading !== null}
            onPress={() => exportType("clientes", "clientes")}
          >
            <ExportButtonText>
              {loading === "clientes" ? "Exportando..." : "Exportar Clientes"}
            </ExportButtonText>
          </ExportButton>
        </Card>

        <Card>
          <CardTitle>Produtos</CardTitle>
          <CardSubtitle>Exporta produtos, categorias, preços e estoque.</CardSubtitle>
          <ExportButton
            disabled={loading !== null}
            onPress={() => exportType("produtos", "produtos")}
          >
            <ExportButtonText>
              {loading === "produtos" ? "Exportando..." : "Exportar Produtos"}
            </ExportButtonText>
          </ExportButton>
        </Card>

        <Card>
          <CardTitle>Fornecedores</CardTitle>
          <CardSubtitle>Exporta cadastro de fornecedores.</CardSubtitle>
          <ExportButton
            disabled={loading !== null}
            onPress={() => exportType("fornecedores", "fornecedores")}
          >
            <ExportButtonText>
              {loading === "fornecedores" ? "Exportando..." : "Exportar Fornecedores"}
            </ExportButtonText>
          </ExportButton>
        </Card>
      </Content>
    </Container>
  );
};

export default ExportData;
