import styled from "styled-components/native";
import { colors, spacing } from "src/theme";

export const FooterContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: ${spacing.sm}px;
    background-color: ${colors.background};
    border-top-width: 1px;
    border-color: ${colors.text};
    min-height: 60px;
`;

export const IconContainer = styled.TouchableOpacity`
    padding: ${spacing.sm}px;
    align-items: center;
`;