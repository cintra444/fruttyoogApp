import React from "react";  
import { TouchableOpacity } from "react-native";
import { Image, Text, View } from "react-native";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

type RootStackParamList = {
    Home: { item: { id: string; title: string; icon: string; description: string } };
};
type HomeNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
export interface CardProps {
    item: {
        id: string;
        title: string;
        icon: string;
        description: string;
    }
}

export const Card: React.FC<CardProps> = ({ item }) => {
    const navigation = useNavigation<HomeNavigationProp>();

    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => navigation.navigate('Home', { item })}>
            <MaterialIcons name={item.icon as any} size={50} style={styles.icon}/>
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );
};