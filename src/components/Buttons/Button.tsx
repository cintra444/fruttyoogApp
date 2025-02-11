import React from "react";
import { Text, GestureResponderEvent, TouchableOpacity } from "react-native";

import { styles } from "./styles";

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
}

const Button: React.FC<CustomButtonProps> = ({ title, onPress }: CustomButtonProps) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;