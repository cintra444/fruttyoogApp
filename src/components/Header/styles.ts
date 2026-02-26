import styled from "styled-components/native";
import { colors, spacing, fontSizes } from "src/theme";

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${spacing.sm}px ${spacing.md}px;
  background-color: ${colors.background};
  border-bottom-width: 1px;
  border-color: #e5e7eb;
  min-height: 56px;
`;

export const HeaderLeft = styled.View`
  width: 48px;
  justify-content: center;
  align-items: flex-start;
`;

export const HeaderCenter = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const HeaderRight = styled.View`
  width: 48px;
  align-items: flex-end;
  justify-content: center;
`;

export const IconButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
`;

export const VersionText = styled.Text`
  font-size: ${fontSizes.md}px;
  color: ${colors.text};
  font-weight: 700;
`;
