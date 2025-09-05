import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 22px;
  text-align: center;
  margin-bottom: 24px;
`;

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  margin-bottom: 10px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

export const ProductList = styled.View`
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #eee;
`;

export const ProductText = styled.Text`
  font-size: 15px;
  color: #333;
  flex: 1;
`;

export const RemoveButton = styled.TouchableOpacity`
  background-color: #ff5252;
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;

export const RemoveText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;
