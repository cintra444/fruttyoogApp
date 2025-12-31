// screens/HistorySale/AddPayment/styles.ts
import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

export const Header = styled.View`
  background-color: #3498db;
  padding: 20px;
  padding-top: 50px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 1;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-top: 10px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-top: 5px;
`;

export const Content = styled.View`
  padding: 20px;
`;

export const Card = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const InfoLabel = styled.Text`
  font-size: 14px;
  color: #7f8c8d;
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
`;

export const FormGroup = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 16px;
  color: #2c3e50;
  border-width: 1px;
  border-color: #e0e0e0;
`;

export const ErrorText = styled.Text`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

export const PaymentMethodContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const PaymentMethodButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#3498db' : '#ecf0f1'};
  padding: 10px 15px;
  border-radius: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${props => props.selected ? '#2980b9' : '#ddd'};
`;

export const PaymentMethodText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : '#2c3e50'};
  font-weight: ${props => props.selected ? 'bold' : '500'};
  font-size: 14px;
`;

export const AmountInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

export const CurrencySymbol = styled.Text`
  padding: 12px 0 12px 15px;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
`;

export const AmountInput = styled.TextInput`
  flex: 1;
  padding: 12px 15px;
  font-size: 16px;
  color: #2c3e50;
`;

export const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#95a5a6' : '#2ecc71'};
  padding: 16px;
  border-radius: 10px;
  align-items: center;
  margin-top: 10px;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
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

export const SuccessContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: white;
`;

export const SuccessIcon = styled.View`
  background-color: #2ecc71;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const SuccessTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
`;

export const SuccessMessage = styled.Text`
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
`;

export const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const StatusText = styled.Text`
  font-size: 14px;
  color: #2c3e50;
  margin-left: 8px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
`;