import React, { useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CardContainer, IconContainer, CardContent, Title, Description } from "./styles";

export interface CardProps {
    item: {
        id: string;
        title: string;
        icon: keyof typeof MaterialIcons.glyphMap;
        description: string;
        screen: string;
    }
    onPress?: () => void;
}


export const Card: React.FC<CardProps> = ({ item, onPress }) => {


    return (
        <CardContainer activeOpacity={0.8} onPress={onPress}>
            <IconContainer>
                <MaterialIcons name={item.icon} size={50} />
            </IconContainer>
            <CardContent>
                <Title>{item.title}</Title>
                <Description>{item.description}</Description>
            </CardContent>
        </CardContainer>
    );
};