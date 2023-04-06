import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Registration from "./screens/Registration";
import Login from "./screens/Login";
import Cards from "./screens/Dashboard";
import CreateCard from "./screens/CreateCard";
import Card from "./screens/Card";
import Topup from "./screens/Topup";
import Transact from "./screens/Transact";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login to Account" }}
        />
        <Stack.Screen
          name="Cards"
          component={Cards}
          options={{ title: "Dashboard" }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{ title: "Create an Account" }}
        />
        <Stack.Screen
          name="CreateCard"
          component={CreateCard}
          options={{ title: "Create Card" }}
        />
        <Stack.Screen
          name="Card"
          component={Card}
          options={{ title: "My Card" }}
        />
        <Stack.Screen
          name="Topup"
          component={Topup}
          options={{ title: "Top up" }}
        />
        <Stack.Screen
          name="Transact"
          component={Transact}
          options={{ title: "Transact" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
