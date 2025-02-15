import axios from "axios";

//configurando a base url da api
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});
//configurando o interceptor para adicionar o token automaticamente
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
//configurando o interceptor para lidar com erros
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        //redireciona para a tela de login
        window.location.href = "/login";
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

export const Register = async (data: RegisterData): Promise<ApiResponse | void> => {
    try {
        const response = await api.post<ApiResponse>("/register", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

//função para fazer login usuario ou administrador
interface LoginData {
    email: string;
    password: string;
}

export const Login = async (data: LoginData): Promise<any> => {
    try {
        
        //faz a requisição para a api
        const response = await api.post("/login", {
            email: data.email,
            password: data.password,
        });
        //salva o token no localStorage
        const token = response.data.token;
        localStorage.setItem("token", token);
       
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
        throw error;
    }
};
// funcao para fazer logout
export const Logout = async (): Promise<void> => {
    try {
        await api.delete("/logout");
        localStorage.removeItem("token");
        window.location.href = "/login";
    } catch (error) {
        handleApiError(error as ApiError);
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

export const GetUsers = async (): Promise<User[] | void> => {
    try {
        const response = await api.get<User[]>("/users");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostUser {
    username: string;
    email: string;
    password: string;
    role: string;
}

export const PostUser = async (data: PostUser): Promise<User | void> => {
    try {
        const response = await api.post<User>("/users", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }   
}

interface PutUser {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}

export const PutUser = async (data: PutUser): Promise<User | void> => {
    try {
        const response = await api.put<User>(`/users/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }       
}

export const DeleteUser = async (id: number): Promise<void> => {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

//funções do produto - Get, Post, Put, Delete
interface Product {
    id: number;
    name: string;
    descricao: string;
    codigoProduto: string;
    precoCusto: number;
    precoVenda: number;
    imagem: string;
    tipoUnidade: string;
    qtdeEstoque: number; 
    categoria: {
        id: number;
        nomeCategoria: string;
    }
};

export const GetProducts = async (): Promise<Product[] | void> => {
    try {
        const response = await api.get<Product[]>("/products");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostProduct {
    name: string;
    descricao: string;
    codigoProduto: string;
    precoCusto: number;
    precoVenda: number;
    imagem: string;
    tipoUnidade: string;
    qtdeEstoque: number;
    categoria: {
        id: number;
        nomeCategoria: string;
    }
};

export const PostProduct = async (data: PostProduct): Promise<Product | void> => {
    try {
        const response = await api.post<Product>("/products", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }       
}

interface PutProduct {
    id: number;
    name: string;
    descricao: string;
    codigoProduto: string;
    precoCusto: number;
    precoVenda: number;
    imagem: string;
    tipoUnidade: string;
    qtdeEstoque: number;
    categoria: {
        id: number;
        nomeCategoria: string;
    }
};

export const PutProduct = async (data: PutProduct): Promise<Product | void> => {
    try {
        const response = await api.put<Product>(`/products/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }       
}

export const DeleteProduct = async (id: number): Promise<void> => {
    try {
        await api.delete(`/products/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetProductById = async (id: number): Promise<Product | void> => {
    try {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
}

export const GetProductByName = async (name: string): Promise<Product[] | void> => {
    try {
        const response = await api.get<Product[]>(`/products/name/${name}`);
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
  cliente: string;
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
  endereco: Endereco;
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
  };
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

export const GetFornecedorById = async (id: number): Promise<Fornecedor | void> => {
    try {
        const response = await api.get<Fornecedor>(`/fornecedor/${id}`);
        return response.data;
    } catch (error) {

    }
};


//funcao para forma de pagamento - Get, Post, Put, Delete
interface FormaPagamento {
    id: number;
    tipoPagamento: string;
    prazoDias: number;
}

export const GetFormaPagamento = async (): Promise<FormaPagamento[] | void> => {
    try {
        const response = await api.get<FormaPagamento[]>("/formapagamento");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostFormaPagamento {
    tipoPagamento: string;
    prazoDias: number;
}

export const PostFormaPagamento = async (data: PostFormaPagamento): Promise<FormaPagamento | void> => {
    try {
        const response = await api.post<FormaPagamento>("/formapagamento", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutFormaPagamento {
    id: number;
    tipoPagamento: string;
    prazoDias: number;
}

export const PutFormaPagamento = async (data: PutFormaPagamento): Promise<FormaPagamento | void> => {
    try {
        const response = await api.put<FormaPagamento>(`/formapagamento/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteFormaPagamento = async (id: number): Promise<void> => {
    try {
        await api.delete(`/formapagamento/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

//funcao para venda - Get, Post, Put, Delete
interface ItemVenda {
    id: number;
    notaVendaId: number;
    quantidade: number;
    valorUnitario: number;
    produtoId: number;
    subTotal: number;
}

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
interface Venda {
    id: number;
    dataVenda: string;
    valorTotal: number;
    clienteid: number;
    usuarioId: number;
    itemVendas: ItemVenda[];
    pagamentos: Payment[];
}

export const GetVenda = async (): Promise<Venda[] | void> => {
    try {
        const response = await api.get<Venda[]>("/venda");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostVenda {
    dataVenda: string;
    valorTotal: number;
    clienteid: number;
    usuarioId: number;
    itemVendas: ItemVenda[];
    pagamentos: Payment[];
}

export const PostVenda = async (data: PostVenda): Promise<Venda | void> => {
    try {
        const response = await api.post<Venda>("/venda", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutVenda {
    id: number;
    dataVenda: string;
    valorTotal: number;
    clienteid: number;
    usuarioId: number;
    itemVendas: ItemVenda[];
    pagamentos: Payment[];
}

export const PutVenda = async (data: PutVenda): Promise<Venda | void> => {
    try {
        const response = await api.put<Venda>(`/venda/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteVenda = async (id: number): Promise<void> => {
    try {
        await api.delete(`/venda/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

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

interface Endereco {
    id: number;
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    numero: string;
    idCliente: number;
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
    telefone: string;
    email: string;
    endereco: Endereco;
    tipoCliente: string;
    formaPagamento: FormaPagamento;
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
    codigoCliente: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: Endereco;
    tipoCliente: string;
    formaPagamento: FormaPagamento;
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
    endereco: Endereco;
    tipoCliente: string;
    formaPagamento: FormaPagamento;
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

interface Compra {
    id: number;
    fornecedorId: number;
    tipoCompra: string;
    dataCompra: string;
    valorTotal: number;
    tipoPagamento: string;
    diasPrazo: number;
    produtoId: number;
    quantidade: number;
}

export const GetCompra = async (): Promise<Compra[] | void> => {
    try {
        const response = await api.get<Compra[]>("/compra");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostCompra {
    fornecedorId: number;
    tipoCompra: string;
    dataCompra: string;
    valorTotal: number;
    tipoPagamento: string;
    diasPrazo: number;
    produtoId: number;
    quantidade: number;
}

export const PostCompra = async (data: PostCompra): Promise<Compra | void> => {
    try {
        const response = await api.post<Compra>("/compra", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutCompra {
    id: number;
    fornecedorId: number;
    tipoCompra: string;
    dataCompra: string;
    valorTotal: number;
    tipoPagamento: string;
    diasPrazo: number;
    produtoId: number;
    quantidade: number;
}

export const PutCompra = async (data: PutCompra): Promise<Compra | void> => {
    try {
        const response = await api.put<Compra>(`/compra/${data.id}`, data);
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

//funcao para categoria - Get, Post, Put, Delete

interface Categoria {
    id: number;
    nomeCategoria: string;
}

export const GetCategoria = async (): Promise<Categoria[] | void> => {
    try {
        const response = await api.get<Categoria[]>("/categoria");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostCategoria {
    nomeCategoria: string;
}

export const PostCategoria = async (data: PostCategoria): Promise<Categoria | void> => {
    try {
        const response = await api.post<Categoria>("/categoria", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutCategoria {
    id: number;
    nomeCategoria: string;
}   

export const PutCategoria = async (data: PutCategoria): Promise<Categoria | void> => {
    try {
        const response = await api.put<Categoria>(`/categoria/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteCategoria = async (id: number): Promise<void> => {
    try {
        await api.delete(`/categoria/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};


// funcao para despesas - Get, Post, Put, Delete

interface Despesa {
    id: number;
    descricaoDespesa: string;
    categoriaDespesa: string;
    dataDespesa: string;
    valor: number;
}

export const GetDespesa = async (): Promise<Despesa[] | void> => {
    try {
        const response = await api.get<Despesa[]>("/despesa");
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PostDespesa {
    descricaoDespesa: string;
    categoriaDespesa: string;
    dataDespesa: string;
    valor: number;
}

export const PostDespesa = async (data: PostDespesa): Promise<Despesa | void> => {
    try {
        const response = await api.post<Despesa>("/despesa", data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

interface PutDespesa {
    id: number;
    descricaoDespesa: string;
    categoriaDespesa: string;
    dataDespesa: string;
    valor: number;
}

export const PutDespesa = async (data: PutDespesa): Promise<Despesa | void> => {
    try {
        const response = await api.put<Despesa>(`/despesa/${data.id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

export const DeleteDespesa = async (id: number): Promise<void> => {
    try {
        await api.delete(`/despesa/${id}`);
    } catch (error) {
        handleApiError(error as ApiError);
    }
};

// funcao para balanco mensal - get

interface BalancoMensal {
  ano: number;
    mes: number;
}

export const GetBalancoMensal = async (): Promise<BalancoMensal[] | void> => {
    try {
        const response = await api.get<BalancoMensal[]>("/balancomensal");
        return response.data;
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


export default api;