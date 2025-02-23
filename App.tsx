import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MyStack } from "./src/Routes/MyStack/Mystack";
import { AppProvider } from "src/contexts/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AppProvider>
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
    </AppProvider>
    </GestureHandlerRootView>
  );
};

export default App;