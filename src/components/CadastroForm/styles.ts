import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;
  
export const Input = styled.TextInput`
  height: 40px;
  margin: 12px;
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
`;
  
export const Button = styled.TouchableOpacity`
  align-items: center;
  background-color: #ddd;
  padding: 10px;
`;

export const ButtonText = styled.Text`
  font-size: 16px;
`;

export const Image = styled.Image`
  width: 200px;
  height: 200px;
  `;