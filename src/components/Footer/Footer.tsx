import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { FooterParamList } from "src/Navigation/FooterParamList";
import { FooterContainer, IconContainer } from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FooterItem {
  id: number;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: keyof Pick<
    FooterParamList,
    "Home" | "Settings" | "Refresh" | "Logout" | "Chat"
  >;
}

const footerItems: FooterItem[] = [
  { id: 1, name: "Home", icon: "home", route: "Home" },
  { id: 2, name: "Settings", icon: "settings", route: "Settings" },
  { id: 3, name: "Refresh", icon: "refresh", route: "Refresh" },
  { id: 4, name: "Logout", icon: "logout", route: "Logout" },
  { id: 5, name: "Chat", icon: "chat", route: "Chat" },
];

const Footer = () => {
  const navigation = useNavigation<NavigationProp<FooterParamList, any>>();
  const insets = useSafeAreaInsets();

  return (
    <FooterContainer style={{ paddingBottom: insets.bottom }}>
      {footerItems.map((item) => (
        <IconContainer
          key={item.id}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(item.route)}
        >
          <MaterialIcons name={item.icon} size={30} color="#000" />
        </IconContainer>
      ))}
    </FooterContainer>
  );
};

export default Footer;
