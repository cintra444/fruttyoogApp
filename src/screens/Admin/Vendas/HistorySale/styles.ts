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
  width: 100%;
  flex-direction: column;
  margin-top: 10px;
`;

export const ActionButton = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const ActionText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalContent = styled.View`
  width: 92%;
  max-width: 420px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  elevation: 5;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(15, 23, 42, 0.55);
  justify-content: center;
  align-items: center;
  padding: 16px;
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

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px;
`;

export const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #3498db;
  font-weight: 500;
  text-align: center;
`;

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px;
`;

export const ErrorText = styled.Text`
  font-size: 16px;
  color: #e74c3c;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
  line-height: 24px;
`;

export const FilterRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const ClearButton = styled.TouchableOpacity`
  background-color: #95a5a6;
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;

export const ClearButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;
