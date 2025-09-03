import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 22px;
  text-align: center;
  margin-bottom: 24px;
`;

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
`;

export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor || "#6200ee"};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;

export const PurchaseList = styled.View``;

export const PurchaseItem = styled.TouchableOpacity`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  elevation: 2;
`;

export const PurchaseText = styled.Text`
  font-size: 16px;
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const ActionButton = styled.TouchableOpacity<{ bgColor?: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor || "#6200ee"};
  padding: 12px;
  margin: 0 5px;
  border-radius: 8px;
`;

export const ActionText = styled.Text`
  color: white;
  text-align: center;
`;

export const ModalContent = styled.View`
  flex: 1;
  justify-content: center;
  background-color: white;
  margin: 40px;
  padding: 20px;
  border-radius: 12px;
  elevation: 5;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  background-color: #ccc;
  padding: 12px;
  border-radius: 8px;
`;

export const CloseText = styled.Text`
  text-align: center;
  font-size: 16px;
`;
