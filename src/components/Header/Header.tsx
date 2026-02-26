import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native";
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
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();
  const routeName = route.name === "Home" ? "Fruttyoog" : route.name;

  return (
    <HeaderContainer style={{ paddingTop: insets.top }}>
      <HeaderLeft>
        {canGoBack ? (
          <IconButton onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color="#111827" />
          </IconButton>
        ) : null}
      </HeaderLeft>

      <HeaderCenter>
        <VersionText>{routeName}</VersionText>
      </HeaderCenter>

      <HeaderRight>
        <VersionText>v1</VersionText>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
