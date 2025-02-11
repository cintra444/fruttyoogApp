import React, { useState } from 'react';

interface CadastroFormProps {
    type: 'usuario' | 'compra' | 'fornecedor' | 'item' | 'produto' | 'cliente' | 'pedido' | 'venda';
    onSubmit: (data: any) => void;
}

const CadastroForm: React.FC<CadastroFormProps> = ({ type, onSubmit }) => {
    const [formData, setFormData] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else{
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderFormFields = () => {
        switch (type) {
            case 'usuario':
                return (
                    <>
                        <label>
                            Nome:
                            <input type="text" name="nome" onChange={handleChange} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" onChange={handleChange} />
                        </label>
                        <label>
                            Senha:
                            <input type="password" name="senha" onChange={handleChange} />
                        </label>
                    </>
                );
                case 'compra':
                return (
                    <>
                        <label>
                            Data:
                            <input type="date" name="data" onChange={handleChange} />
                        </label>
                        <label>
                            Valor Total:
                            <input type="number" name="valorTotal" onChange={handleChange} />
                        </label>
                        <label>
                            Fornecedor:
                            <input type="text" name="fornecedor" onChange={handleChange} />
                        </label>
                        <label>
                            Tipo da Compra:
                            <input type="text" name="tipoCompra" onChange={handleChange} />
                        </label>
                        <label>
                            Tipo de pagamento:
                            <input type="text" name="tipoPagamento" onChange={handleChange} />
                        </label>
                        <label>
                            Forma de pagamento:
                            <input type="text" name="formaPagamento" onChange={handleChange} />
                        </label>
                        <label>
                            Status:
                            <input type="text" name="status" onChange={handleChange} />
                        </label>
                        <label>
                            Prazo de pagamento:
                            <input type="text" name="prazoPagamento" onChange={handleChange} />
                        </label>
                        <label>
                            Produtos:
                            <input type="text" name="produtos" onChange={handleChange} />
                        </label>
                    </> 
                )
            case 'fornecedor':
                return (
                    <>
                        <label>
                            Nome Fantasia:
                            <input type="text" name="nomeFantasia" onChange={handleChange} />
                        </label>
                        <label>
                            Nome do Contato:
                            <input type="text" name="nomeContato" onChange={handleChange} />
                        </label>
                        <label>
                            Telefone:
                            <input type="text" name="telefone" onChange={handleChange} />
                        </label>
                    </>
                );
            case 'item':
                return (
                    <>
                        <label>
                            Nome:
                            <input type="text" name="nome" onChange={handleChange} />
                        </label>
                        <label>
                            Quantidade:
                            <input type="number" name="quantidade" onChange={handleChange} />
                        </label>
                        <label>
                            Preço:
                            <input type="number" name="preco" onChange={handleChange} />
                        </label>
                    </>
                );
            case 'produto':
                return (
                    <>
                        <label>
                            Nome:
                            <input type="text" name="nome" onChange={handleChange} />
                        </label>
                        <label>
                            Descrição:
                            <input type="text" name="descricao" onChange={handleChange} />
                        </label>
                        <label>
                            Codigo do Produto:
                            <input type="text" name="codigo" onChange={handleChange} />
                        </label>
                        <label>
                            Preço de custo:
                            <input type="number" name="precoCusto" onChange={handleChange} />
                        </label>
                        <label>
                            Preço de venda:
                            <input type="number" name="precoVenda" onChange={handleChange} />
                        </label>
                        <label>
                            Quantidade:
                            <input type="number" name="quantidade" onChange={handleChange} />
                        </label>
                        <label>
                            Fornecedor:
                            <input type="text" name="fornecedor" onChange={handleChange} />
                        </label>
                        <label>
                            Imagem do Produto:
                            <input type="file" name="imagem" onChange={handleChange} />
                        </label>
                    </>
                );
            case 'cliente':
                return (
                    <>
                        <label>
                            Nome:
                            <input type="text" name="nome" onChange={handleChange} />
                        </label>
                        <label>
                            Telefone:
                            <input type="text" name="telefone" onChange={handleChange} />
                        </label>
                    </>
                );
            case 'pedido':
                return (
                    <>
                        <label>
                            Data:
                            <input type="date" name="data" onChange={handleChange} />
                        </label>
                        <label>
                            Cliente:
                            <input type="text" name="cliente" onChange={handleChange} />
                        </label>
                        <label>
                            Produtos:
                            <input type="text" name="produtos" onChange={handleChange} />
                        </label>
                        <label>
                            Valor Total:
                            <input type="number" name="valorTotal" onChange={handleChange} />
                        </label>
                        <label>
                            Forma de pagamento:
                            <input type="text" name="formaPagamento" onChange={handleChange} />
                        </label>
                        <label>
                            Status:
                            <input type="text" name="status" onChange={handleChange} />
                        </label>
                    </>
                );
            case 'venda':
                return (
                    <>
                        <label>
                            Data:
                            <input type="date" name="data" onChange={handleChange} />
                        </label>
                        <label>
                            Cliente:
                            <input type="text" name="cliente" onChange={handleChange} />
                        </label>
                        <label>
                            Produtos:
                            <input type="text" name="produtos" onChange={handleChange} />
                        </label>
                        <label>
                            Valor Total:
                            <input type="number" name="valorTotal" onChange={handleChange} />
                        </label>
                        <label>
                            Forma de pagamento:
                            <input type="text" name="formaPagamento" onChange={handleChange} />
                        </label>
                        <label>
                            Status:
                            <input type="text" name="status" onChange={handleChange} />
                        </label>
                    </>
                );
            default:
                return null;
            }
            };
    return (
        <form onSubmit={handleSubmit}>
            {renderFormFields()}
            <button type="submit">Cadastrar</button>
        </form>
    );
};

export default CadastroForm;