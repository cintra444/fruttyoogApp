
import styled from 'styled-components/native';

// Container principal
export const Container = styled.ScrollView`
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
  justify-content: space-between;
  margin: 0 10px 20px;
`;

export const StatsCard = styled.View<{ backgroundColor?: string }>`
  background-color: ${props => props.backgroundColor || '#3498db'};
  border-radius: 12px;
  padding: 15px;
  flex: 1;
  margin: 0 5px;
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
  font-size: 16px;
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

export const YearSelector = styled.ScrollView`
  margin-bottom: 10px;
`;

export const YearButton = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 15px;
  background-color: ${props => props.selected ? '#3498db' : '#f8f9fa'};
  border-radius: 20px;
  margin-right: 8px;
  border-width: 1px;
  border-color: ${props => props.selected ? '#3498db' : '#e0e0e0'};
`;

export const YearButtonText = styled.Text<{ selected?: boolean }>`
  color: ${props => props.selected ? 'white' : '#666'};
  font-size: 12px;
  font-weight: ${props => props.selected ? 'bold' : '500'};
`;

export const MonthSelector = styled.ScrollView``;

export const MonthButton = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 12px;
  background-color: ${props => props.selected ? '#2ecc71' : '#f8f9fa'};
  border-radius: 8px;
  margin-right: 6px;
  min-width: 50px;
  align-items: center;
  border-width: 1px;
  border-color: ${props => props.selected ? '#2ecc71' : '#e0e0e0'};
`;

export const MonthButtonText = styled.Text<{ selected?: boolean }>`
  color: ${props => props.selected ? 'white' : '#666'};
  font-size: 11px;
  font-weight: ${props => props.selected ? 'bold' : '500'};
`;

// Card de Receita
export const RevenueCard = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin: 0 10px 15px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const RevenueMonth = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const RevenueValue = styled.Text<{ color?: string }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.color || '#333'};
`;

export const RevenueDetails = styled.View`
  margin-top: 15px;
  padding-top: 15px;
  border-top-width: 1px;
  border-top-color: #eee;
`;

export const DetailItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const DetailLabel = styled.Text`
  font-size: 14px;
  color: #666;
`;

export const DetailValue = styled.Text<{ positive?: boolean; negative?: boolean; color?: string }>`
  font-size: 14px;
  font-weight: bold;
  color: ${props => {
    if (props.color) return props.color;
    if (props.positive) return '#2ecc71';
    if (props.negative) return '#e74c3c';
    return '#333';
  }};
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
  padding: 40px 20px;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text`
  color: #666;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
`;