import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../../Navigation/types";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";

const Refresh: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 3000); // tempo reduzido para 3s, mas pode deixar 7s se preferir

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.text}>Atualizando os dados...</Text>
    </View>
  );
};

export default Refresh;
