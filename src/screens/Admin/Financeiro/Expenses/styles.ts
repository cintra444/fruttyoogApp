// styles.ts
import styled from 'styled-components/native';

// Container principal - Mude para View se quiser scroll interno
export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 20px 0;
  padding: 0 10px;
`;

// Estatísticas
export const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 0 10px 20px;
`;

export const StatsCard = styled.View<{ backgroundColor?: string }>`
  background-color: ${props => props.backgroundColor || '#FF6B6B'};
  border-radius: 12px;
  padding: 15px;
  flex: 1;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const StatsTitle = styled.Text`
  color: white;
  font-size: 12px;
  text-align: center;
  margin-bottom: 5px;
  font-weight: 600;
`;

export const StatsValue = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

export const StatsLabel = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  text-align: center;
`;

// Filtros
export const FilterContainer = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 0 10px 15px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

export const FilterGroup = styled.View`
  margin-bottom: 10px;
`;

export const FilterLabel = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 600;
`;

// Inputs
export const Input = styled.TextInput`
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
`;

// Botões principais
export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${props => props.bgColor || '#FF6B6B'};
  padding: 12px 16px;
  border-radius: 6px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

// Botões de ação (em linha) - CORREÇÃO AQUI
export const ActionButtons = styled.View<{ small?: boolean }>`
  flex-direction: row;
  justify-content: ${props => props.small ? 'flex-end' : 'space-between'};
`;

export const ActionButton = styled.TouchableOpacity<{ bgColor?: string; small?: boolean }>`
  background-color: ${props => props.bgColor || '#FF6B6B'};
  padding: ${props => props.small ? '6px 12px' : '10px 15px'};
  border-radius: 6px;
  align-items: center;
  margin-left: ${props => props.small ? '8px' : '0'};
  flex: ${props => props.small ? 0 : 1};
`;

export const ActionText = styled.Text<{ small?: boolean }>`
  color: white;
  font-weight: bold;
  font-size: ${props => props.small ? '12px' : '14px'};
`;

// Item de despesa
export const ExpenseItem = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 0 10px 10px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: #333;
`;

// Categoria
export const CategoryBadge = styled.View<{ backgroundColor?: string }>`
  background-color: ${props => props.backgroundColor || '#6A6A6A'};
  padding: 4px 12px;
  border-radius: 12px;
  align-self: flex-start;
`;

export const CategoryText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

// Modal
export const ModalContent = styled.View`
  flex: 1;
  background-color: white;
  margin: 20px;
  border-radius: 15px;
  padding: 20px;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 15px;
  align-items: center;
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: #eee;
`;

export const CloseText = styled.Text`
  color: #FF6B6B;
  font-weight: bold;
  font-size: 16px;
`;

// Estados
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

export const LoadingText = styled.Text`
  margin-top: 10px;
  color: #666;
  font-size: 14px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  color: #666;
  font-size: 16px;
  text-align: center;
`;

// Seção
export const Section = styled.View`
  margin-bottom: 15px;
`;

// Container de conteúdo rolável
export const ScrollContent = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

// View principal
export const MainContainer = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;