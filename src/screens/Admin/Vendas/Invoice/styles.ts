import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 22px;
  text-align: center;
  margin-bottom: 24px;
  font-weight: bold;
  color: #2c3e50;
`;

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

export const Section = styled.View`
  margin-bottom: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
`;

export const Input = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  font-size: 16px;
`;

export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#3498db"};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 10px;
  elevation: 2;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const Card = styled.View`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  elevation: 2;
  border-left-width: 4px;
  border-left-color: #3498db;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
`;

export const CardText = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
`;

// Estilos específicos para Invoice
export const InvoiceHeader = styled.View`
  align-items: center;
  margin-bottom: 25px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;

export const InvoiceTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 5px;
`;

export const InvoiceInfo = styled.View`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  elevation: 2;
`;

export const InvoiceTotal = styled.View`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  elevation: 3;
  border-top-width: 2px;
  border-top-color: #3498db;
`;

export const InfoTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoText = styled.Text`
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 22px;
`;

export const ShareButton = styled.TouchableOpacity`
  background-color: #2ecc71;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 10px;
  elevation: 2;
  flex: 1;
`;

export const ShareButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const ProductText = styled.Text`
  font-size: 14px;
  color: #2c3e50;
  flex: 1;
  line-height: 20px;
`;

export const PaymentItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const PaymentText = styled.Text`
  font-size: 14px;
  color: #2c3e50;
  line-height: 20px;
`;

// Estilos para status
export const StatusBadge = styled.View<{ status: string }>`
  background-color: ${({ status }) => 
    status === 'PAGO' ? '#2ecc71' : 
    status === 'PENDENTE' ? '#e74c3c' : 
    '#f39c12'};
  padding: 4px 10px;
  border-radius: 12px;
  align-self: flex-start;
`;

export const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

// Estilos para valores
export const ValueText = styled.Text<{ type?: 'positive' | 'negative' | 'neutral' }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ type }) => 
    type === 'positive' ? '#27ae60' : 
    type === 'negative' ? '#e74c3c' : 
    '#2c3e50'};
`;

// Estilos para cabeçalho de seção
export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: #3498db;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
`;

// Estilos para linha de total
export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

export const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
`;

export const TotalValue = styled.Text<{ highlight?: boolean }>`
  font-size: ${({ highlight }) => highlight ? '20px' : '16px'};
  font-weight: ${({ highlight }) => highlight ? 'bold' : 'normal'};
  color: ${({ highlight }) => highlight ? '#e74c3c' : '#2c3e50'};
`;

// Estilos para notas e observações
export const NoteContainer = styled.View`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  border-left-width: 4px;
  border-left-color: #95a5a6;
`;

export const NoteText = styled.Text`
  font-size: 14px;
  color: #7f8c8d;
  font-style: italic;
  line-height: 20px;
`;

// Estilos para botões de ação
export const ActionButton = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background-color: ${({ variant }) => 
    variant === 'primary' ? '#3498db' : 
    variant === 'secondary' ? '#95a5a6' : 
    variant === 'danger' ? '#e74c3c' : 
    '#3498db'};
  padding: 12px 20px;
  border-radius: 6px;
  align-items: center;
  margin: 5px;
  flex: 1;
  elevation: 2;
`;

export const ActionButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

// Estilos para linha de ações
export const ActionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

// Estilos para loading
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

export const LoadingText = styled.Text`
  margin-top: 15px;
  font-size: 16px;
  color: #7f8c8d;
`;

// Estilos para mensagem de erro
export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f9f9f9;
`;

export const ErrorText = styled.Text`
  font-size: 16px;
  color: #e74c3c;
  text-align: center;
  margin-bottom: 20px;
`;

// Estilos para header da nota
export const InvoiceLogo = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

export const InvoiceNumber = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #3498db;
  margin-top: 5px;
`;

export const InvoiceDate = styled.Text`
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
`;

// Estilos para detalhes do cliente
export const ClientInfo = styled.View`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  elevation: 2;
`;

export const ClientName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
`;

export const ClientDetail = styled.Text`
  font-size: 14px;
  color: #34495e;
  margin-bottom: 5px;
`;

// Estilos para lista de itens
export const ItemList = styled.View`
  margin-bottom: 20px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  padding: 10px 0;
  border-bottom-width: 2px;
  border-bottom-color: #ddd;
  margin-bottom: 5px;
`;

export const ItemHeaderText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #7f8c8d;
  flex: 1;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  align-items: center;
`;

export const ItemColumn = styled.View<{ width?: string }>`
  flex: ${({ width }) => width || '1'};
  padding-right: 10px;
`;

export const ItemText = styled.Text<{ bold?: boolean }>`
  font-size: 14px;
  color: #2c3e50;
  font-weight: ${({ bold }) => bold ? 'bold' : 'normal'};
  line-height: 20px;
`;

// Estilos para resumo de pagamentos
export const PaymentSummary = styled.View`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  elevation: 2;
`;

export const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
`;

export const SummaryLabel = styled.Text`
  font-size: 14px;
  color: #7f8c8d;
`;

export const SummaryValue = styled.Text<{ highlight?: boolean }>`
  font-size: ${({ highlight }) => highlight ? '16px' : '14px'};
  font-weight: ${({ highlight }) => highlight ? 'bold' : 'normal'};
  color: ${({ highlight }) => highlight ? '#2c3e50' : '#34495e'};
`;

// Estilos para rodapé
export const Footer = styled.View`
  margin-top: 30px;
  padding-top: 20px;
  border-top-width: 1px;
  border-top-color: #ddd;
  align-items: center;
`;

export const FooterText = styled.Text`
  font-size: 12px;
  color: #95a5a6;
  text-align: center;
  margin-bottom: 5px;
`;