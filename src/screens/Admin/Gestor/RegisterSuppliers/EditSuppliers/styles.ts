import styled from "styled-components/native";

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

export const Button = styled.TouchableOpacity`
  background-color: #6200ee;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 20px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

export const CardTouchable = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px 20px;
  margin-right: 10px;
  elevation: 2;
`;

export const CardTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;
