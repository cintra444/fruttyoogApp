import React from "react";
import { Text, GestureResponderEvent, TouchableOpacity } from "react-native";

import { ButtonContainer, ButtonText } from "./styles";

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
}

const Button  = ({ title, onPress }: CustomButtonProps) => {
    return (
        <ButtonContainer onPress={onPress} activeOpacity={0.7}>
            <ButtonText>{title}</ButtonText>
        </ButtonContainer>
    );
};

export default Button;