// styles.ts
import styled from "styled-components/native";
import { colors, spacing, fontSizes } from "src/theme";

interface CardProps {
  borderColor: string;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
  padding: ${spacing.md}px;
`;

export const Card = styled.TouchableOpacity<CardProps>`
  width: 45%;
  margin: ${spacing.sm}px;
  padding: ${spacing.md}px;
  background-color: ${colors.background};
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => props.borderColor};
  align-items: center;
  justify-content: center;
  elevation: 4; 
`;

export const CardIcon = styled.View`
  margin-bottom: ${spacing.xs}px;
`;

export const CardTitle = styled.Text`
  font-size: ${fontSizes.md}px;
  font-weight: bold;
  text-align: center;
  color: ${colors.text};
`;

export const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: ${spacing.lg}px;
  margin-left: ${spacing.sm}px;
`;
export const BackButtonText = styled.Text`
  font-size: ${fontSizes.md}px;
  font-weight: bold;
  color: ${colors.accent};
  margin-left: ${spacing.xs}px;
`;
