import styled from "styled-components/native";
import { colors, spacing, fontSizes } from "src/theme";

export const ButtonContainer = styled.TouchableOpacity`
  background-color: ${colors.background};
  padding: ${spacing.sm}px;
  margin-vertical: ${spacing.sm}px;
  margin-horizontal: ${spacing.lg}px;
  align-items: center;
  justify-content: center;
  border-color: ${colors.text};
  width: 80%;
  border-radius: 40px;
  border-width: 1px;
`;

export const ButtonText = styled.Text`
  color: ${colors.text};
  font-size: ${fontSizes.md}px;
  font-weight: bold;
  text-align: center;
`;