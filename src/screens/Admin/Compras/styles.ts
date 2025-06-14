// styles.ts
import styled from 'styled-components/native';

interface CardProps {
  borderColor: string;
}

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 16px;
`;

export const Card = styled.TouchableOpacity<CardProps>`
  width: 45%;
  margin: 8px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => props.borderColor};
  align-items: center;
  justify-content: center;
  elevation: 4;
`;

export const CardIcon = styled.View`
  margin-bottom: 8px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
