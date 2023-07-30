import * as React from 'react';
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { StateProvider } from './Globals';

const App = () => {
  return (
    <StateProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <StackNavigator />
      </NavigationContainer>
    </StateProvider>
  );
};

export default App;