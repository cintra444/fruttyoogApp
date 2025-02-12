import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MyStack } from "./src/Routes/MyStack/mystack";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;