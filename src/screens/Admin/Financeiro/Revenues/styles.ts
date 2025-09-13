// styles.ts
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const Section = styled.View`
  margin-bottom: 15px;
`;

export const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 8px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  text-align: center;
  font-weight: bold;
`;

export const PaymentList = styled.View`
  margin-top: 10px;
`;

export const ExpenseItem = styled.View`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;
