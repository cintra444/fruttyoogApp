import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://milly-unreclusive-nonpreventively.ngrok-free.dev";
//configurando a base url da api
const api = axios.create({
  baseURL: API_URL || "http://192.168.1.8:8080" ,
  headers: {
     "Content-Type": "application/json",
   },
});
//configurando o interceptor para adicionar o token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

//interceptador para lidar com erros
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        AsyncStorage.removeItem("token");
        //redireciona para a tela de login
        
    } else 
        if (error.request) {
             console.error("Erro de rede: ", error.request);
    } else {
        console.error("Erro: ", error.message);
    }
    return Promise.reject(error);
    
});

interface ApiError {
    response?: {
        status: number;
        data: any;
    };
    request?: any;
    message?: string;
    config?: any;
}

const handleApiError = (error: any): void => {
    console.log('Erro completo: ', error);
    if (error.response) {
        console.error("Status: ", error.response.status);
        console.error('Resposta da API: ', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
        console.error("Requisição enviada: ", error.config.data);
    } else {
        console.error("Erro: ", error.message);
    }
};

//função para fazer cadastro usuario
interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface ApiResponse {
    data: any;
}

//função para fazer login usuario ou administrador
interface LoginData {
    email: string;
    password: string;
}

export const Login = async (data: LoginData): Promise<any> => {
    try {
        const response = await api.post("/login", {
            email: data.email,
            password: data.password,
        });
       const token = response.data.token;
       await AsyncStorage.setItem("token", token);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
        throw error;
    }
};

//funções do usuario - Get, Post, Put, Delete
interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}



interface PostUser {
    username: string;
    email: string;
    password: string;
    role: string;
}


//funcções do estoque - Get
interface StockItem {
    id: number;
    nomeProduto: string;
    categoria: string;
    quantidade: number;
}
export const GetStock = async (): Promise<StockItem[] | void> => {
    try {
        const response = await api.get<StockItem[]>("/stock");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};
export const GetStockByProduct = async (productName: string): Promise<StockItem[] | void> => {
    try {
        const response = await api.get<StockItem[]>(`/stock/product/${productName}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetStockByCategory = async (category: string): Promise<StockItem[] | void> => {
    try {
        const response = await api.get<StockItem[]>(`/stock/category/${category}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetStockByQuantity = async (quantity: number): Promise<StockItem[] | void> => {
    try {
        const response = await api.get<StockItem[]>(`/stock/quantity/${quantity}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

//funções do produto - Get, Post, Put, Delete
interface Categoria{
    id: number;
    nome: string;
}

interface Produtos {
    id: number;
    nome: string;
    descricao: string;
    codigoProduto: string;
    precoCusto: number;
    precoVenda: number;
    tipoUnidade: string;
    qtdeEstoque: number; 
    categoria: {
        id: number
    };
       
};

export const GetProducts = async (): Promise<Produtos[] | void> => {
    try {
        const response = await api.get<Produtos[]>("/produtos");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostProdutos {
    nome: string;
    descricao: string;
    codigoProduto: string;
    precoCusto: number;
    precoVenda: number;
    tipoUnidade: string;
    qtdeEstoque: number;
    categoria: {
       id: number;
    }
};

export const PostProdutos = async (data: PostProdutos): Promise<Produtos | void> => {
    try {
        const response = await api.post<Produtos>("/produtos", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }       
}

interface PutProdutos {
    id: number;
    nome: string;
    descricao: string;
    codigoProduto: string;
    precoCusto: number;
    precoVenda: number;
    tipoUnidade: string;
    qtdeEstoque: number;
    categoria: {
        id: number;
    }
};

export const PutProdutos = async (data: PutProdutos): Promise<Produtos | void> => {
    try {
        const response = await api.put<Produtos>(`/produtos/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }       
}

export const DeleteProdutos = async (id: number): Promise<void> => {
    try {
        await api.delete(`/produtos/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetProductById = async (id: number): Promise<Produtos | void> => {
    try {
        const response = await api.get<Produtos>(`/produtos/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetProductByName = async (name: string): Promise<Produtos[] | void> => {
    try {
        const response = await api.get<Produtos[]>(`/produtos/name/${name}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};


//função do pagamento - Get, Post, Put, Delete
interface Payment {
    id: number;
    idClient: number;
    formaPagamento: string;
    idVenda: number;
    dataPagamento: string;
    valor: number;
    status: string;
    criadoEm: string;
    atualizadoEm: string;
}

export const GetPayments = async (): Promise<Payment[] | void> => {
    try {
        const response = await api.get<Payment[]>("/payments");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostPayment {
    idClient: number;
    formaPagamento: string;
    idVenda: number;
    dataPagamento: string;
    valor: number;
    status: string;
}

export const PostPayment = async (data: PostPayment): Promise<Payment | void> => {
    try {
        const response = await api.post<Payment>("/payments", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }           
}

interface PutPayment {
    id: number;
    idClient: number;
    formaPagamento: string;
    idVenda: number;
    dataPagamento: string;
    valor: number;
    status: string;
}

export const PutPayment = async (data: PutPayment): Promise<Payment | void> => {
    try {
        const response = await api.put<Payment>(`/payments/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }       
}

export const DeletePayment = async (id: number): Promise<void> => {
    try {
        await api.delete(`/payments/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetPaymentsByStatus = async (status: string): Promise<Payment[] | void> => {
    try {
        const response = await api.get<Payment[]>(`/payments/status/${status}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetPaymentsByTipo = async (tipo: string): Promise<Payment[] | void> => {
    try {
        const response = await api.get<Payment[]>(`/payments/tipo/${tipo}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

//função item venda - Get, Post, Put, Delete
interface ItemVenda {
    id: number;
    notaVendaId: number;
    quantidade: number;
    valorUnitario: number;
    produtoId: number;
    subTotal: number;
}

export const GetItemVenda = async (): Promise<ItemVenda[] | void> => {
    try {
        const response = await api.get<ItemVenda[]>("/itemvenda");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

interface PostItemVenda {
    notaVendaId: number;
    quantidade: number;
    valorUnitario: number;
    produtoId: number;
    subTotal: number;
}

export const PostItemVenda = async (data: PostItemVenda): Promise<ItemVenda | void> => {
    try {
        const response = await api.post<ItemVenda>("/itemvenda", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

interface PutItemVenda {
    id: number;
    notaVendaId: number;
    quantidade: number;
    valorUnitario: number;
    produtoId: number;
    subTotal: number;
}

export const PutItemVenda = async (data: PutItemVenda): Promise<ItemVenda | void> => {
    try {
        const response = await api.put<ItemVenda>(`/itemvenda/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const DeleteItemVenda = async (id: number): Promise<void> => {
    try {
        await api.delete(`/itemvenda/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

// Função nota venda - Post
interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
    cep: string;
}

interface FormaPagamento {
  id: number;
  tipoPagamento: string;
  prazoDias: number;
}

interface Cliente {
  id: number;
  codigoCliente: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  endereco: string
  telefone: string;
  email: string;
  tipoCliente: string;
  formaPagamento: FormaPagamento;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  codigoProduto: string;
  precoCusto: number;
  precoVenda: number;
  imagem: {
    id: number;
    name: string;
    type: string;
    data: string[];
  }
  tipoUnidade: string;
  qtdeEstoque: number;
}

interface ItemVenda {
  id: number;
  quantidade: number;
  valorUnitario: number;
  produto: Produto;
  subTotal: number;
}

interface NotaVenda {
  id: number;
  dataVenda: string;
  valorTotal: number;
  cliente: Cliente;
  itemVendas: ItemVenda[];
  formaPagamento: FormaPagamento;
  dataEmissao: string;
  nomeVendedor: string;
  dataVencimento: string;
}



export const PostNotaVenda = async (data: NotaVenda): Promise<NotaVenda | void> => {
  try {
    const response = await api.post<NotaVenda>("/notavenda", data);
    return response.data;
  } catch (error) {
    handleApiError(error as ApiError);
  }
};



//funcoes para a imagem - put, post e get
interface Imagem {
    file: "string";
}

export const PostImagem = async (data: Imagem): Promise<Imagem | void> => {
    try {
        const response = await api.post<Imagem>("/imagem", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutImagem {
    id: number;
    file: "string";
}

export const PutImagem = async (data: PutImagem): Promise<Imagem | void> => {
    try {
        const response = await api.put<Imagem>(`/imagem/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const GetImagem = async (): Promise<Imagem[] | void> => {
    try {
        const response = await api.get<Imagem[]>("/imagem");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

//funcóes para fornecedor - Get, Post, Put, Delete
interface Fornecedor {
    id: number;
    nomeFantasia: string;
    nomeContato: string;
    telefone: string;
}

export const GetFornecedor = async (): Promise<Fornecedor[] | void> => {
    try {
        const response = await api.get<Fornecedor[]>("/fornecedor");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostFornecedor {
    nomeFantasia: string;
    nomeContato: string;
    telefone: string;
}

export const PostFornecedor = async (data: PostFornecedor): Promise<Fornecedor | void> => {
    try {
        const response = await api.post<Fornecedor>("/fornecedor", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutFornecedor {
    id: number;    
    nomeFantasia: string;
    nomeContato: string;
    telefone: string;
}

export const PutFornecedor = async (data: PutFornecedor): Promise<Fornecedor | void> => {
    try {
        const response = await api.put<Fornecedor>(`/fornecedor/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteFornecedor = async (id: number): Promise<void> => {
    try {
        await api.delete(`/fornecedor/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface GetFornecedorById {
    id: number;    
    nomeFantasia: string;
    nomeContato: string;
    telefone: string;
}
export const GetFornecedorById = async (id: number): Promise<Fornecedor | void> => {
    try {
        const response = await api.get<Fornecedor>(`/fornecedor/${id}`);
        return response.data;
    } catch (error) {

    }
};


//funcao para forma de pagamento - Get, Post, Put, Delete
interface PaymentMethods {
    id: number;
    tipoPagamento: string;
    prazoDias: number;
}

export const GetPaymentMethods = async (): Promise<PaymentMethods[] | void> => {
    try {
        const response = await api.get<PaymentMethods[]>("/formapagamento");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
}
};

interface PostPaymentMethods{
    tipoPagamento: string;
    prazoDias: number;
}

export const PostPaymentMethods = async (data: PostPaymentMethods): Promise<PaymentMethods | void> => {
    try {
        const response = await api.post<PaymentMethods>("/formapagamento", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutPaymentMethods {
    id: number;
    tipoPagamento: string;
    prazoDias: number;
}

export const PutPaymentMethods = async (data: PutPaymentMethods): Promise<PaymentMethods | void> => {
    try {
        const response = await api.put<PaymentMethods>(`/formapagamento/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeletePaymentMethods = async (id: number): Promise<void> => {
    try {
        await api.delete(`/formapagamento/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

// funcao para vendas
// apiFruttyoog.js - Funções para Venda (Get, Post, Put, Delete)

// Interfaces para venda
export interface ItemVendaRequest {
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
}

export interface PagamentoRequest {
  formaPagamento: string;  // Será mapeado para enum no backend
  valor: number;
  status: string;         // "PAGO" ou "PENDENTE"
  dataPagamento?: string;
}

export interface NovaVendaRequest {
  clienteId: number;
  usuarioId: number;
  dataVenda?: string;
  itens: ItemVendaRequest[];
  pagamentos: PagamentoRequest[];
}

export interface VendaResponse {
  id: number;
  dataVenda: string;
  valorTotal: number;
  valorTotalPago: number;
  saldoDevedor: number;
  cliente: {
    id: number;
    nome: string;
    telefone?: string;
    email?: string;
  };
  usuario: {
    id: number;
    nome: string;
  };
  itens: Array<{
    produto: {
      id: number;
      nome: string;
    };
    quantidade: number;
    valorUnitario: number;
    subTotal: number;
  }>;
  pagamentos: Array<{
    formaPagamento: string;
    valor: number;
    status: string;
    dataPagamento?: string;
  }>;
}

export interface NotaVendaResponse {
  id: number;
  valorTotal: number;
  cliente: {
    id: number;
    nome: string;
    telefone?: string;
    email?: string;
  };
  dataEmissaoISO: string;
  dataVencimentoISO: string;
  vendedor: {
    nome: string;
  };
  pagamento: {
    tipo: string;
    chavePix?: string;
  };
  itens: Array<{
    produto: {
      id: number;
      nome: string;
    };
    quantidade: number;
    valorUnitario: number;
    subTotal: number;
  }>;
}

// Função para mapear forma de pagamento do frontend para o backend
export const mapearFormaPagamento = (formaPagamento: string): string => {
  const mapeamento: { [key: string]: string} = {
    'Dinheiro': 'DINHEIRO',
    'Cartão de Crédito': 'CARTAO_CREDITO',
    'Cartão de Débito': 'CARTAO_DEBITO' ,
    'Debito' : 'CARTAO_DEBITO', 
    'PIX': 'PIX',
    'Fiado': 'FIADO',
    'Cheque': 'CHEQUE',
    'A Prazo': 'A_PRAZO',
    'Transferência': 'TRANSFERENCIA',
    'Boleto': 'BOLETO',
    'Outros': 'OUTROS'
  };
  
  // Primeiro tenta encontrar exato
  if (mapeamento[formaPagamento]) {
    return mapeamento[formaPagamento];
  }
  
  // Se não encontrar, tenta case insensitive
  const formaUpper = formaPagamento.toUpperCase();
  if (formaUpper.includes('DÉBITO') || formaUpper.includes('DEBITO')) {
    return 'CARTAO_DEBITO';
  }
  if (formaUpper.includes('CRÉDITO') || formaUpper.includes('CREDITO')) {
    return 'CARTAO_CREDITO';
  }
  if (formaUpper.includes('PIX')) {
    return 'PIX';
  }
  if (formaUpper.includes('FIADO')) {
    return 'FIADO';
  }
  if (formaUpper.includes('DINHEIRO') || formaUpper.includes('DINHEIRO')) {
    return 'DINHEIRO';
  }
  
  return 'OUTROS';
};
  
  


// Função para mapear status do pagamento
export const mapearStatusPagamento = (status: string): string => {
  if (!status) return 'PENDENTE';
  
  const statusUpper = status.toUpperCase();
  if (statusUpper === 'PAGO' || statusUpper === 'PENDENTE') {
    return statusUpper;
  }
  
  console.warn(`Status de pagamento "${status}" inválido, usando PENDENTE como fallback`);
  return 'PENDENTE';
};

// Função para buscar todas as vendas (para HistorySale)
export const GetVenda = async (): Promise<VendaResponse[] | null> => {
  try {
    const response = await api.get('/venda');
    // Ordenar por data da venda (mais recente primeiro)
    const vendasOrdenadas = response.data.sort((a: VendaResponse, b: VendaResponse) => 
      new Date(b.dataVenda).getTime() - new Date(a.dataVenda).getTime()
    );
    return vendasOrdenadas;
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return null;
  }
};

// Função para buscar uma venda por ID (para Invoice)
export const GetVendaById = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/venda/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar venda ID ${id}:`, error.response?.data || error.message);
    return null;
  }
};
// Salvar pagamento

export const SavePayment = async (paymentData: {
  vendaId: number;
  clienteId?: number;
  formaPagamento: string;
  valor: number;
  descricao?: string;
  dataPagamento: string;
  status: string;
  
}): Promise<{ success: boolean; message?: string; data?: any }> => {
  try {
    const response = await api.post('/api/pagamentos', paymentData);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Erro ao salvar pagamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao salvar pagamento'
    };
  }
};
// Função para criar nova venda (para NewSale)
export const PostVenda = async (vendaData: NovaVendaRequest): Promise<VendaResponse | null> => {
  try {
    // Preparar dados para envio
    const dadosParaEnvio = {
      ...vendaData,
      // Garantir que a data está no formato correto
      dataVenda: vendaData.dataVenda || new Date().toISOString(),
      // Mapear formas de pagamento para o formato do backend
      pagamentos: vendaData.pagamentos.map(pagamento => ({
        ...pagamento,
        formaPagamento: mapearFormaPagamento(pagamento.formaPagamento),
        status: mapearStatusPagamento(pagamento.status)
      }))
    };

    console.log('Enviando dados da venda:', dadosParaEnvio);
    
    const response = await api.post('/venda', dadosParaEnvio);
    console.log('Venda criada com sucesso:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Erro detalhado ao criar venda:');
    console.error('URL:', error.config?.url);
    console.error('Método:', error.config?.method);
    console.error('Dados enviados:', JSON.parse(error.config?.data || '{}'));
    console.error('Status:', error.response?.status);
    console.error('Resposta do servidor:', error.response?.data);
    console.error('Mensagem:', error.message);
    
    throw new Error(error.response?.data?.message || 'Erro ao processar venda');
  }
};

// Função para atualizar uma venda
export const PutVenda = async (vendaData: VendaResponse): Promise<VendaResponse | null> => {
  try {
    const response = await api.put(`/venda/${vendaData.id}`, vendaData);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar venda ID ${vendaData.id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para deletar uma venda
export const DeleteVenda = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/venda/${id}`);
    return true;
  } catch (error: any) {
    console.error(`Erro ao deletar venda ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para buscar nota fiscal por ID da venda
export const GetNotaVendaByVendaId = async (vendaId: number): Promise<any> => {
  try {
    const response = await api.get(`/notas-venda/venda/${vendaId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar nota fiscal para venda ${vendaId}:`, error.response?.data || error.message);
    return null;
  }
};

// Função para adicionar pagamento a uma venda existente
export const PostPagamentoVenda = async (vendaId: number, pagamento: PagamentoRequest): Promise<VendaResponse | null> => {
  try {
    const pagamentoMapeado = {
      ...pagamento,
      formaPagamento: mapearFormaPagamento(pagamento.formaPagamento),
      status: mapearStatusPagamento(pagamento.status)
    };
    
    const response = await api.post(`/venda/${vendaId}/pagamentos`, pagamentoMapeado);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao adicionar pagamento à venda ${vendaId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para buscar formas de pagamento disponíveis
export const GetFormasPagamento = async (): Promise<Array<{id: number, descricao: string}> | null> => {
  try {
    const response = await api.get("/formas-pagamento");
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar formas de pagamento:', error.response?.data || error.message);
    return null;
  }
};

// Função para buscar saldo devedor de uma venda
export const GetSaldoDevedorVenda = async (vendaId: number): Promise<number | null> => {
  try {
    const response = await api.get(`/venda/${vendaId}/saldo`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar saldo devedor da venda ${vendaId}:`, error.response?.data || error.message);
    return null;
  }
};

// Função para buscar formas de pagamento utilizadas em uma venda
export const GetFormasPagamentoVenda = async (vendaId: number): Promise<string[] | null> => {
  try {
    const response = await api.get(`/venda/${vendaId}/formas-pagamento`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar formas de pagamento da venda ${vendaId}:`, error.response?.data || error.message);
    return null;
  }
};

// Função para buscar valor total pago de uma venda
export const GetValorTotalPagoVenda = async (vendaId: number): Promise<number | null> => {
  try {
    const response = await api.get(`/venda/${vendaId}/valor-pago`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar valor total pago da venda ${vendaId}:`, error.response?.data || error.message);
    return null;
  }
};

// Função auxiliar para formatar dados de venda para envio
export const formatarVendaParaEnvio = (dados: {
  clienteId: number;
  usuarioId: number;
  produtos: Array<{id: number, quantidade: number, preco: number}>;
  pagamentos: Array<{formaPagamento: string, valor: number, status: string}>;
}): NovaVendaRequest => {
  return {
    clienteId: dados.clienteId,
    usuarioId: dados.usuarioId,
    dataVenda: new Date().toISOString(),
    itens: dados.produtos.map(produto => ({
      produtoId: produto.id,
      quantidade: produto.quantidade,
      valorUnitario: produto.preco
    })),
    pagamentos: dados.pagamentos.map(pagamento => ({
      formaPagamento: pagamento.formaPagamento,
      valor: pagamento.valor,
      status: pagamento.status
    }))
  };
};

// Exportar todos os tipos para uso em outros arquivos


//funcao para endereço - Get
interface Endereco {
   cep: string;
   numero: string;
   complemento: string;
}

export const GetEndereco = async (): Promise<Endereco[] | void> => {
    try {
        const response = await api.get<Endereco[]>("/endereco");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};


//funcao para cliente - Get, Post, Put, Delete

interface Cliente {
    id: number;
    codigoCliente: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    referencia: string;
    tipoCliente: string;
}

export const GetCliente = async (): Promise<Cliente[] | void> => {
    try {
        const response = await api.get<Cliente[]>("/cliente");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostCliente {
    id?: number;
    codigoCliente: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    referencia: string;
    tipoCliente: string;
}

export const PostCliente = async (data: PostCliente): Promise<Cliente | void> => {
    try {
        const response = await api.post<Cliente>("/cliente", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutCliente {
    id: number;
    codigoCliente: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    referencia: string;
    tipoCliente: string;
  
}

export const PutCliente = async (data: PutCliente): Promise<Cliente | void> => {
    try {
        const response = await api.put<Cliente>(`/cliente/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteCliente = async (id: number): Promise<void> => {
    try {
        await api.delete(`/cliente/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

//funcao para compra - Get, Post, Put, Delete

interface ItemCompraRequest {
    produtoId: number;
    quantidade: number;
    precoUnitarioReal: number;
    precoReferencia?: number;
    usarComoReferencia?: boolean;
}

interface PagamentoCompraRequest {
    tipo: string;
    valor: number;
    descricao?: string;
}
interface CompraRequest {
    fornecedorId: number;
    tipoCompra: string;
    dataCompra: string;
    valorNota: number;
    tipoPagamento: string;
    prazoPagamento: number;
    observacoes?: string;
    dataPagamento?: string;
    atualizarReferencia?: boolean;
    itens: ItemCompraRequest[];
    pagamentos: PagamentoCompraRequest[];
}

interface CompraResponse {
    id: number;
    fornecedorId: number;
    tipoCompra: string;
    dataCompra: string;
    valorNota: number;
    tipoPagamento: string;
    prazoPagamento: number;
    observacoes?: string;
    dataPagamento?: string;
    itens: ItemCompraResponse[];
    pagamentos: PagamentoCompraResponse[];
}
interface ItemCompraResponse {
    id: number;
    produtoId: number;
    produtoNome?: string;
    quantidade: number;
    precoUnitarioReal: number;
    subTotal: number;
    precoReferencia?: number;
}
interface PagamentoCompraResponse {
    id: number;
    tipo: string;
    valor: number;
    descricao?: string;
}
export const GetCompra = async (): Promise<CompraResponse[] | void> => {
    try {
        const response = await api.get<CompraResponse[]>("/compra");
        console.log('✅ Endpoint /compras encontrado:', response.data?.length || 0, 'compras');
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }


// Tentar endpoints alternativos
    const endpoints = [
      "/compra",
      "/purchase", 
      "/purchases",
      "/entrada",
      "/entradas",
      "/api/compras",
      "/api/compra"
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Tentando: ${endpoint}`);
        const altResponse = await api.get(endpoint);
        console.log(`✅ ${endpoint} funcionou!`, altResponse.data?.length || 0, 'compras');
        return altResponse.data || [];
      } catch (altError) {
        console.log(`❌ ${endpoint} falhou`);
      }
    }
    
    console.log('⚠️ Nenhum endpoint de compras encontrado. Usando dados de exemplo.');
    
    return getComprasExemplo();
    
  }



// Função de exemplo temporária
const getComprasExemplo = (): any[] => {
  console.log('📝 Usando dados de exemplo para compras');
  
  // Dados de exemplo - você pode ajustar conforme seus produtos
  return [
    {
      id: 1,
      dataCompra: new Date().toISOString(),
      itens: [
        { produto: { id: 1 }, quantidade: 50 },
        { produto: { id: 2 }, quantidade: 30 },
        { produto: { id: 3 }, quantidade: 20 },
        { produto: { id: 4 }, quantidade: 40 },
        { produto: { id: 5 }, quantidade: 25 },
        { produto: { id: 6 }, quantidade: 35 },
        { produto: { id: 7 }, quantidade: 15 },
        { produto: { id: 8 }, quantidade: 45 },
      ]
    }
  ];
};

export const GetCompraById = async (id: number): Promise<CompraResponse | void> => {
    try {
        const response = await api.get<CompraResponse>(`/compra/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const PostCompra = async (data: CompraRequest): Promise<CompraResponse | void> => {
    try {
        console.log("📤 Enviando dados para API:", JSON.stringify(data, null, 2));
        const response = await api.post<CompraResponse>("/compra", data);
        console.log("📥 Resposta da API:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const PutCompra = async (id: number, data: CompraRequest): Promise<CompraResponse | void> => {
    try {
        const response = await api.put<CompraResponse>(`/compra/${id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteCompra = async (id: number): Promise<void> => {
    try {
        await api.delete(`/compra/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const GetCompraByFornecedorId = async (fornecedorId: number): Promise<CompraResponse[] | void> => {
    try {
        const response = await api.get<CompraResponse[]>(`/compra/fornecedor/${fornecedorId}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

//funcao para categoria - Get, Post, Put, Delete

interface Categoria {
    id: number;
    nome: string;
}

export const GetCategoria = async (): Promise<Categoria[] | void> => {
    try {
        const response = await api.get<Categoria[]>("/categorias");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostCategoria {
    nome: string;
}

export const PostCategoria = async (data: PostCategoria): Promise<Categoria | void> => {
    try {
        console.log("📤 Enviando dados:", data);
        console.log("🔗 Endpoint:", "/categorias");
        const response = await api.post<Categoria>("/categorias", data);
        console.log("✅ Resposta:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Erro completo:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        handleApiError(error as ApiError);
    }
};

interface PutCategoria {
    id: number;
    nome: string;
}   

export const PutCategoria = async (data: PutCategoria): Promise<Categoria | void> => {
    try {
        const response = await api.put<Categoria>(`/categorias/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteCategoria = async (id: number): Promise<void> => {
    try {
        await api.delete(`/categorias/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};


// funcao para despesas - Get, Post, Put, Delete

interface Despesa {
    id: number;
    descricao: string;
    categoria: string;
    data: string;
    valor: number;
}

export const GetDespesa = async (): Promise<Despesa[] | void> => {
    try {
        const response = await api.get<Despesa[]>("/api/despesas");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostDespesa {
    descricao: string;
    categoria: string;
    data: string;
    valor: number;
}

export const PostDespesa = async (data: PostDespesa): Promise<Despesa | void> => {
    try {
        const response = await api.post<Despesa>("/api/despesas", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutDespesa {
    id: number;
    descricao: string;
    categoria: string;
    data: string;
    valor: number;
}

export const PutDespesa = async (data: PutDespesa): Promise<Despesa | void> => {
    try {
        const response = await api.put<Despesa>(`/api/despesas/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteDespesa = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/despesas/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};


//funcao para redefinir senha
interface RedefinirSenha {
    email: string;
}

export const RedefinirSenha = async (data: RedefinirSenha): Promise<void> => {
    try {
        await api.post("/redefinirsenha", data);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

//funcao para relatorios - get

export interface EstoqueItem {
    produtoId: number;
  nome: string;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
}

export const GetEstoque = async (): Promise<EstoqueItem[] | null> => {
  try {
    const response = await api.get('/estoque'); // Endpoint correto é /estoque
    console.log('Dados do estoque recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    return null;
  }
};


interface Report {
    categoria: string;
    produto: string;
    quantidade: number;
}
export const GetSalesReport = async (): Promise<Report[] | void> => {
    try {
        const response = await api.get<Report[]>("/relatorios");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const GetStockReport = async (): Promise<Report[] | void> => {
    try {
        const response = await api.get<Report[]>("/relatorios/estoque");        
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};



export const GetFinancialReport = async (): Promise<Report[] | void> => {
    try {
        const response = await api.get<Report[]>("/relatorios/financeiro");        
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

//Balanco mensal

interface Revenue {
    id: number;
    descricao: string;
    valor: number;
}

interface Expense {
    id: number;
    descricao: string;
    valor: number;
}

export const GetExpenses = async (): Promise<Expense[] | void> => {
    try {
        const response = await api.get<Expense[]>("/api/despesas");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const GetRevenues = async (): Promise<Revenue[] | void> => {
    try {
        const response = await api.get<Revenue[]>("/venda");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};






export default api;