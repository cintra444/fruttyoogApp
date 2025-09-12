import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
  padding: 16px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

export const FilterContainer = styled.View`
  margin-bottom: 16px;
  
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#4CAF50"};
  padding: 10px 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ProductItem = styled.View`
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const ProductText = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
`;

export const QuantityText = styled.Text<{ lowStock?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ lowStock }) => (lowStock ? "#E53935" : "#4CAF50")};
`;

export const FilterGroup = styled.View`
  margin-bottom: 40px;
  `;

export const FilterLabel = styled.Text`
  font-weight: bold;
  margin-bottom: 5px;
`;

