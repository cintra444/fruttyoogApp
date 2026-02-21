import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MyStack } from "./src/Routes/MyStack/mystack";
import { AppProvider } from "src/contexts/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        </AppProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
