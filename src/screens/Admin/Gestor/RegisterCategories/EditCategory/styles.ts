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

export const Section = styled.View`
  margin-bottom: 12px;
`;

export const Label = styled.Text`
  font-size: 14px;
  margin-bottom: 4px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
`;

export const Button = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#4CAF50"};
  padding: 10px 14px;
  border-radius: 8px;
  margin-top: 8px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const CategoryItem = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? "#BBDEFB" : "#f5f5f5")};
`;

export const CategoryText = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;
