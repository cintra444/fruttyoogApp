// EditCustomers/styles.ts
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9f9;
  padding: 16px;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  padding: 10px 0;
`;

export const CardTouchable = styled.TouchableOpacity`
  background-color: #ffffff;
  padding: 14px 20px;
  border-radius: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
`;

export const Input = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  background-color: #fff;
  margin-bottom: 16px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
