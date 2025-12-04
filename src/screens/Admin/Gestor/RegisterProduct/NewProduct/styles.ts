// styles.ts
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
export const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const PriceInfo = styled.View`
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
`;

export const PriceLabel = styled.Text`
  font-size: 12px;
  color: #666;
`;

export const PriceValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const InfoText = styled.Text`
  font-size: 11px;
  color: #6c757d;
  margin-top: 2px;
`;