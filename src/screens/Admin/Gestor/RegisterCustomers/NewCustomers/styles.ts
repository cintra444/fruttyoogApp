// styles.ts (para RegisterCustomers)
import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 16px;
  
`;

export const Title = styled.Text`
  font-size: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

export const Section = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  background-color: #fff;
  margin-bottom: 12px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 10px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
