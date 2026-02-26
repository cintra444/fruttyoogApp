import styled from "styled-components/native";
import { colors, spacing, fontSizes } from "src/theme";

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: ${spacing.md}px;
    background-color: ${colors.background};
    padding: 20px;
`;

export const Logo = styled.Image`
    width: 80%;
    height: 20%;
    resize-mode: contain;
    margin-bottom: 20px;
`;

export const WelcomeText = styled.Text`
    font-size: ${fontSizes.lg}px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: ${colors.text};
`;


export const QuestionText = styled.Text`
    font-size: ${fontSizes.md}px;
    margin-bottom: 20px;
    text-align: center;
    color: ${colors.text};
`;
    
export const Button = styled.TouchableOpacity`
    background-color: ${colors.primary};
    padding: ${spacing.sm}px;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 80%;
    align-items: center;
`;

export const ButtonText = styled.Text`
    color: ${colors.secondaryText};
    font-weight: bold;
    font-size: ${fontSizes.lg}px;
`;

export const AdminButton = styled.TouchableOpacity`
    background-color: ${colors.accent};
    padding: ${spacing.sm}px;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 80%;
    align-items: center;
`;
export const AdminButtonText = styled.Text`
    color: ${colors.primaryText};    
    font-weight: bold;
    font-size: ${fontSizes.lg}px;
`;