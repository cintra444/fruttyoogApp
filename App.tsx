import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MyStack } from "./src/Routes/MyStack/mystack";
import { MyTabs } from "./src/Routes/MyTabs/myTabs";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <MyStack />
      <MyTabs />
    </NavigationContainer>
  );
};

export default App;