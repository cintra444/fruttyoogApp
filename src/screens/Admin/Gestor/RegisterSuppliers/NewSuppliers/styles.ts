import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  text-align: center;
  margin-bottom: 24px;
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
