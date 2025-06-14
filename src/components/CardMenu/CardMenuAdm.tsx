import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CardContainer, IconContainer, CardContent, Title, Description } from "./styles";

type CardMenuItem = {
    id: string;
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    description: string;
    screen: string;
};

interface CardProps {   

    item: CardMenuItem;
    onPress: () => void;
}


export const Card: React.FC<CardProps> = ({ item, onPress }) => {


    return (
       
        <CardContainer onPress={onPress}>
            <IconContainer>
                <MaterialIcons name={item.icon} size={32} color="#005006" />
            </IconContainer>
            <CardContent>
                <Title>{item.title}</Title>
                <Description>{item.description}</Description>
            </CardContent>
        </CardContainer>
       
    );
};