import styled from 'styled-components/native';

// Container principal (agora é View, não ScrollView)
export const Container = styled.View`
  flex: 1;
  background-color: #ecf0f1;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin: 20px 0 10px 0;
`;

export const FilterContainer = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  border-width: 1px;
  border-color: #e0e0e0;
  margin-horizontal: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

export const FilterGroup = styled.View`
  margin-bottom: 10px;
`;

export const FilterLabel = styled.Text`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const Input = styled.TextInput`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 16px;
  color: #2c3e50;
  border-width: 1px;
  border-color: #e0e0e0;
  flex: 1;
`;

export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${props => props.bgColor || '#3498db'};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ProductItem = styled.View<{ status?: string }>`
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  margin-horizontal: 15px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  border-left-width: 4px;
  border-left-color: ${props => {
    switch(props.status) {
      case 'ESGOTADO': return '#e74c3c';
      case 'CRÍTICO': return '#e74c3c';
      case 'BAIXO': return '#f39c12';
      case 'ATENÇÃO': return '#f1c40f';
      case 'OK': return '#2ecc71';
      default: return '#3498db';
    }
  }};
`;

export const ProductText = styled.Text`
  font-size: 14px;
  color: #2c3e50;
`;

export const QuantityText = styled.Text<{ lowStock?: boolean }>`
  font-size: 16px;
  color: ${props => props.lowStock ? '#e74c3c' : '#27ae60'};
  font-weight: 600;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-horizontal: 15px;
`;

export const ActionButton = styled.TouchableOpacity<{ active?: boolean }>`
  background-color: ${props => props.active ? '#3498db' : '#ecf0f1'};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-horizontal: 5px;
`;

export const ActionText = styled.Text<{ active?: boolean }>`
  color: ${props => props.active ? 'white' : '#2c3e50'};
  font-weight: 600;
  font-size: 14px;
`;

export const FilterBadge = styled.View`
  background-color: #3498db;
  padding: 6px 12px;
  border-radius: 12px;
`;

export const FilterBadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const ClearFiltersButton = styled.TouchableOpacity`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e74c3c;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
  min-height: 300px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 10px;
  line-height: 22px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

export const LoadingText = styled.Text`
  margin-top: 15px;
  font-size: 16px;
  color: #7f8c8d;
`;