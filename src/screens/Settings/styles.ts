import styled from "styled-components/native";
import { colors, spacing, fontSizes } from "src/theme";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.background};
  padding: ${spacing.lg}px;
`;

export const Title = styled.Text`
  font-size: ${fontSizes.lg}px;
  font-weight: bold;
  text-align: center;
  margin-bottom: ${spacing.lg}px;
  color: ${colors.text};
`;

export const Section = styled.View`
  margin-bottom: ${spacing.lg}px;
  background-color: ${colors.background};
  border-radius: 12px;
  padding: ${spacing.md}px;
  elevation: 2;
`;

export const SectionTitle = styled.Text`
  font-size: ${fontSizes.md}px;
  font-weight: bold;
  margin-bottom: ${spacing.sm}px;
  color: ${colors.text};
`;

export const Item = styled.TouchableOpacity`
  padding-vertical: ${spacing.sm}px;
  padding-horizontal: ${spacing.xs}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.text};
`;

export const ItemText = styled.Text`
  font-size: ${fontSizes.md}px;
  color: ${colors.text};
`;

export const Logout = styled.TouchableOpacity`
  background-color: ${colors.accent};
  padding: ${spacing.md}px;
  border-radius: 10px;
  margin-top: ${spacing.lg}px;
`;

export const LogoutText = styled.Text`
  font-size: ${fontSizes.md}px;
  font-weight: bold;
  text-align: center;
  color: ${colors.primaryText};
`;
