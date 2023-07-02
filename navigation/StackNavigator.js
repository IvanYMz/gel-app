import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Define a new stack navigator
const Stack = createNativeStackNavigator();

// Import screens
import Route from "../screens/Ruta";
import Clients from "../screens/Clientes";
import RawMaterial from "../screens/Materia_Prima";

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ruta/Home" component={Route} />
        <Stack.Screen name="Clientes" component={Clients} />
        <Stack.Screen name="Materia Prima" component={RawMaterial} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;