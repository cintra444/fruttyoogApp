import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 22px;
  text-align: center;
  margin-bottom: 24px;
`;

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
`;

export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#6200ee"};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const PurchaseList = styled.ScrollView``;

export const PurchaseItem = styled.TouchableOpacity`
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  elevation: 2;
`;

export const PurchaseText = styled.Text`
  font-size: 14px;
  color: #333;
`;

export const ModalContent = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;

export const ActionButton = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#6200ee"};
  padding: 10px 15px;
  border-radius: 8px;
`;

export const ActionText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

export const CloseText = styled.Text`
  color: #6200ee;
  font-size: 16px;
  font-weight: bold;
`;
