import styled from "styled-components/native";
import { colors, spacing, fontSizes } from "src/theme";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
  padding: ${spacing.lg}px;
`;

export const Logo = styled.Image`
  width: 220px;
  height: 90px;
  resize-mode: contain;
  margin-bottom: ${spacing.lg}px;
`;

export const WelcomeText = styled.Text`
  font-size: ${fontSizes.lg}px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: ${spacing.sm}px;
  text-align: center;
`;

export const QuestionText = styled.Text`
  font-size: ${fontSizes.md}px;
  color: ${colors.text};
  margin-bottom: ${spacing.md}px;
  text-align: center;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  background-color: ${colors.background};
  border-radius: 10px;
  padding: 0 15px;
  margin-bottom: ${spacing.sm}px;
  font-size: ${fontSizes.md}px;
  border-width: 1px;
  border-color: ${colors.text};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${colors.primary};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${spacing.sm}px;
`;

export const ButtonText = styled.Text`
  color: ${colors.primaryText};
  font-size: ${fontSizes.md}px;
  font-weight: bold;
`;
