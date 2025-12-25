import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 22px;
  text-align: center;
  margin-bottom: 24px;
`;

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  margin-bottom: 10px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

export const ProductList = styled.ScrollView`
  max-height: 200px;
  margin-vertical: 10px;
`;

export const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  border-left-width: 4px;
  border-left-color: #3498db;
`;

export const ProductText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #2c3e50;
`;

export const RemoveButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 3px;
  margin-left: 10px;
`;

export const RemoveText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

export const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
`;

export const PaymentRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const PaymentInput = styled(Input)`
  background-color: #f8f9fa;
`;

export const CloseButton = styled.TouchableOpacity`
  background-color: #95a5a6;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
`;

export const CloseButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export const ShareButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
`;

export const ShareButtonText = styled.Text`
  color: white;
  font-weight: bold;
  text-align: center;
`;

export const PaymentSection = styled.View`
  margin-top: 10px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
`;

export const PaymentItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 8px;
  border-radius: 3px;
  margin-bottom: 5px;
  border-left-width: 3px;
  border-left-color: #2ecc71;
`;

export const PaymentItemText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #2c3e50;
`;

export const PaymentRemoveButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 4px 8px;
  border-radius: 3px;
  margin-left: 10px;
`;

export const PaymentRemoveText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 12px;
`;
export const TotalText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin-vertical: 5px;
`;
export const SubtotalText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
  margin-top: 10px;
  padding: 5px;
  background-color: #f8f9fa;
  border-radius: 5px;
`;
export const ModalButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const ModalButton = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  background-color: ${({ variant }) => variant === 'primary' ? '#3498db' : '#95a5a6'};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  elevation: 2;
  margin-horizontal: 5px;
`;

export const ModalButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;
