import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { RootStackParamList } from "src/Navigation/types";
import {
  HeaderContainer,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  IconButton,
  VersionText,
} from "./styles";

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <HeaderContainer style={{ paddingTop: insets.top }}>
      <HeaderLeft>
        <VersionText>Acessar</VersionText>
      </HeaderLeft>

      <HeaderCenter>
        <IconButton onPress={() => navigation.navigate("Login")}>
          <Icon name="sign-in" size={24} color="#000" />
        </IconButton>

        <IconButton onPress={() => navigation.navigate("Register")}>
          <Icon name="user-plus" size={24} color="#000" />
        </IconButton>
      </HeaderCenter>

      <HeaderRight>
        <VersionText>v1.0.0</VersionText>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
