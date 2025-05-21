
interface Field {
  label: string;
  name: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}



export const fields = {
  usuario: [
    { label: 'Nome', name: 'nome' },
    { label: 'Email', name: 'email' },
    { label: 'Senha', name: 'senha', secureTextEntry: true },
  ],
  compra: [
    { label: 'Data', name: 'data' },
    { label: 'Valor Total', name: 'valorTotal', keyboardType: 'numeric' },
    { label: 'Fornecedor', name: 'fornecedor' },
    { label: 'Tipo da Compra', name: 'tipoCompra' },
    { label: 'Tipo de pagamento', name: 'tipoPagamento' },
    { label: 'Forma de pagamento', name: 'formPagamento' },
    { label: 'Status', name: 'status' },
    { label: 'Prazo de pagamento', name: 'prazoPagamento' },
    { label: 'Produtos', name: 'produtos' },
  ],
  fornecedor: [
    { label: 'Nome Fantasia', name: 'nomeFantasia' },
    { label: 'Nome do Contato', name: 'nomeContato' },
    { label: 'Telefone', name: 'telefone' },
  ],
  item: [
    { label: 'Nome', name: 'nome' },
    { label: 'Quantidade', name: 'quantidade', keyboardType: 'numeric' },
    { label: 'Preço', name: 'preco', keyboardType: 'numeric' },
  ],
  produto: [
    { label: 'Nome', name: 'nome' },
    { label: 'Descrição', name: 'descricao' },
    { label: 'Codigo do Produto', name: 'codigo' },
    { label: 'Preço de custo', name: 'precoCusto', keyboardType: 'numeric' },
    { label: 'Preço de venda', name: 'precoVenda', keyboardType: 'numeric' },
    { label: 'Quantidade', name: 'quantidade', keyboardType: 'numeric' },
    { label: 'Fornecedor', name: 'fornecedor' },
  ],
  cliente: [
    { label: 'Nome', name: 'nome' },
    { label: 'Telefone', name: 'telefone' },
  ],
  pedido: [
    { label: 'Data', name: 'data' },
    { label: 'Cliente', name: 'cliente' },
    { label: 'Produtos', name: 'produtos' },
    { label: 'Valor Total', name: 'valorTotal', keyboardType: 'numeric' },
    { label: 'Forma de pagamento', name: 'formaPagamento' },
    { label: 'Status', name: 'status' },
  ],
  venda: [
    { label: 'Data', name: 'data' },
    { label: 'Cliente', name: 'cliente' },
    { label: 'Produtos', name: 'produtos' },
    { label: 'Valor Total', name: 'valorTotal', keyboardType: 'numeric' },
    { label: 'Forma de pagamento', name: 'formaPagamento' },
    { label: 'Status', name: 'status' },
  ],
};