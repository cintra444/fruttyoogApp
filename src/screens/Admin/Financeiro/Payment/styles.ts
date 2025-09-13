// styles.ts
import styled from "styled-components/native";

interface QuantityProps {
  lowStock?: boolean;
}

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const FilterContainer = styled.View`
  margin-bottom: 20px;
`;

export const FilterGroup = styled.View`
  margin-bottom: 15px;
`;

export const FilterLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 5px;
`;

interface ButtonProps {
  bgColor?: string;
}

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${(props) => props.bgColor || "#2196F3"};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const ProductItem = styled.View`
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

export const ProductText = styled.Text`
  font-size: 16px;
  margin-bottom: 3px;
`;

export const QuantityText = styled.Text<QuantityProps>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.lowStock ? "red" : "#000")};
`;
