import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const CardTouchable = styled.TouchableOpacity`
  flex: 0.48;
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

export const CardTitle = styled.Text`
  color: #6200ee;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;


export const ModalContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const Section = styled.View`
  margin-bottom: 15px;
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

export const CloseButton = styled.TouchableOpacity`
  background-color: #f44336;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

export const CloseText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ProductList = styled.ScrollView`
  margin-top: 20px;
`;

export const ProductItem = styled.TouchableOpacity`
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  elevation: 2;
`;
