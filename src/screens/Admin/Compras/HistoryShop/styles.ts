import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background: #fff;
  padding: 16px;
`;

export const Section = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
`;

export const PickerContainer = styled.View`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
`;

export const Button = styled.TouchableOpacity`
  background: #2196f3;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export const PurchaseList = styled.ScrollView`
  margin-top: 16px;
`;

export const PurchaseItem = styled.TouchableOpacity`
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const PurchaseText = styled.Text`
  font-size: 14px;
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 0;
`;

export const ActionButton = styled.TouchableOpacity<{ bgColor?: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor || "#4caf50"};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin: 0 4px;
`;

export const ActionText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export const ModalContent = styled.View`
  background: #fff;
  margin: 80px 16px;
  border-radius: 12px;
  padding: 16px;
  elevation: 5;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const CloseButton = styled.TouchableOpacity`
  background: #ccc;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

export const CloseText = styled.Text`
  font-weight: 600;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-top: 16px;
  color: #999;
`;
