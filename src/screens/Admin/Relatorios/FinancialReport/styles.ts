import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const FilterContainer = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  margin-bottom: 20px;
`;

export const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;


export const Button = styled.TouchableOpacity<{ active?: boolean; bgColor?: string }>`
  background-color: ${props => 
    props.bgColor ? props.bgColor : 
    props.active ? '#4CAF50' : '#e0e0e0'
  };
  padding: 10px 15px;
  border-radius: 20px;
  flex: 1;
  margin-horizontal: 5px;
  align-items: center;
`;

export const ButtonText = styled.Text<{ active?: boolean }>`
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 12px;
`;

export const ChartContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  margin-bottom: 20px;
`;

export const ChartTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
`;

export const ChartTypeSelector = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 3px;
`;

export const ChartTypeButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 8px;
  border-radius: 20px;
  background-color: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  align-items: center;
  justify-content: center;
  min-width: 70px;
`;

export const ChartTypeText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 12px;
  text-align: center;
`;

export const LegendContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 5px 10px;
  min-width: 45%;
`;

export const LegendColor = styled.View<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

export const LegendText = styled.Text`
  font-size: 12px;
  color: #555;
  flex: 1;
`;

export const SummaryContainer = styled.View`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  border-left-width: 4px;
  border-left-color: #4CAF50;
`;

export const SummaryItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const SummaryText = styled.Text`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export const SummaryValue = styled.Text`
  font-size: 14px;
  color: #333;
  font-weight: bold;
`;

export const NoDataText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-vertical: 40px;
  font-style: italic;
`;

export const DataTable = styled.View`
  background-color: #fff;
  border-radius: 10px;
  margin-vertical: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 3px;
  overflow: hidden;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  background-color: #4CAF50;
  padding: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export const TableRow = styled.View<{ even: boolean }>`
  flex-direction: row;
  background-color: ${props => props.even ? '#f9f9f9' : '#fff'};
  padding: 14px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const TableCell = styled.View`
  flex: 1;
  justify-content: center;
  padding-right: 5px;
`;

export const TableHeaderText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
`;

export const TableCellText = styled.Text`
  color: #333;
  font-size: 13px;
  text-align: center;
`;

export const LoaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const ErrorText = styled.Text`
  color: #f44336;
  text-align: center;
  margin: 10px 0;
  font-size: 14px;
`;

export const InfoContainer = styled.View`
  background-color: #e3f2fd;
  padding: 12px;
  border-radius: 8px;
  margin-vertical: 10px;
  border-left-width: 4px;
  border-left-color: #2196F3;
`;

export const InfoText = styled.Text`
  color: #1565c0;
  font-size: 13px;
  line-height: 18px;
`;

export const PeriodText = styled.Text`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 500;
`;

export const RefreshButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 8px;
  z-index: 1;
`;

export const DateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const DateLabel = styled.Text`
  color: #666;
  font-size: 14px;
  margin-right: 10px;
  min-width: 80px;
`;

export const TotalContainer = styled.View`
  background-color: #4CAF50;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
`;

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const TotalLabel = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

export const TotalValue = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

export const FilterTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

export const CategoryFilter = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const CategoryButton = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 8px 12px;
  border-radius: 20px;
  background-color: ${props => props.selected ? '#4CAF50' : '#e0e0e0'};
  margin-right: 8px;
  margin-bottom: 8px;
`;

export const CategoryButtonText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : '#666'};
  font-size: 12px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

export const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: #4CAF50;
`;

export const Card = styled.View<{ small?: boolean }>`
  background-color: white;
  border-radius: 12px;
  padding: ${props => props.small ? '15px' : '20px'};
  margin-vertical: 8px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const FlexRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const IconButton = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 25px;
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  width: 90%;
  max-height: 80%;
`;

export const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 5px;
`;

export const FilterSection = styled.View`
  margin-bottom: 15px;
`;

export const InputLabel = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
`;
export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;
export const CardContent = styled.View`
  padding: 5px 0;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
export const StatCard = styled.View<{ warning?: boolean }>`
  background-color: ${props => props.warning ? '#FFEBEE' : '#f8f9fa'};
  border-radius: 10px;
  padding: 15px;
  flex: 1;
  margin-horizontal: 5px;
  align-items: center;
  border-left-width: 4px;
  border-left-color: ${props => props.warning ? '#F44336' : '#4CAF50'};
`;
export const StatValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;
export const StatLabel = styled.Text`
  font-size: 12px;
  color: #666;
  text-align: center;
`;
export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;


export const DateInputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const FilterButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;

export const ChartCard = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-vertical: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-offset: 0px 1px;
`;


export const SearchInput = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background-color: #fff;
  margin-bottom: 10px;
`;

export const StockTable = styled.View`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 3px;
  margin-bottom: 15px;
`;

export const StatusIndicator = styled.View<{ color: string }>`
  background-color: ${props => props.color};
  padding: 4px 8px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

export const Pagination = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top-width: 1px;
  border-top-color: #eee;
`;

export const PaginationButton = styled.TouchableOpacity<{ active?: boolean; disabled?: boolean }>`
  padding: 8px 12px;
  border-radius: 6px;
  background-color: ${props => 
    props.active ? '#2196F3' : 
    props.disabled ? '#F5F5F5' : '#E0E0E0'
  };
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

export const PaginationText = styled.Text<{ active?: boolean; disabled?: boolean }>`
  color: ${props => 
    props.active ? 'white' : 
    props.disabled ? '#999' : '#666'
  };
  font-size: 12px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;


export const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  background-color: white;
  border-radius: 10px;
  padding: 5px;
  elevation: 1;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

export const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 12px 8px;
  border-radius: 8px;
  background-color: ${props => props.active ? '#F3E5F5' : 'transparent'};
  align-items: center;
  margin-horizontal: 2px;
`;

export const TabButtonText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? '#9C27B0' : '#666'};
  font-size: 12px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  text-align: center;
`;

export const FinancialTable = styled.View`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  elevation: 1;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  margin-bottom: 15px;
`;

export const Badge = styled.View<{ type: 'success' | 'warning' | 'danger' | 'info' }>`
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 12px;
  background-color: ${props => 
    props.type === 'success' ? '#E8F5E9' : 
    props.type === 'warning' ? '#FFF3E0' : 
    props.type === 'danger' ? '#FFEBEE' : '#E3F2FD'
  };
  align-self: flex-start;
`;

export const BadgeText = styled.Text<{ type: 'success' | 'warning' | 'danger' | 'info' }>`
  font-size: 10px;
  font-weight: bold;
  color: ${props => 
    props.type === 'success' ? '#2E7D32' : 
    props.type === 'warning' ? '#F57C00' : 
    props.type === 'danger' ? '#C62828' : '#1565C0'
  };
`;

export const MonthPicker = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const YearPicker = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

// Ajuste o DateInput se necessário
export const DateInput = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  background-color: #fff;
  min-height: 50px;
`;
