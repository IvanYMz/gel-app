import * as React from 'react';
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';

const App = () => {
  return (
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <StackNavigator />
      </NavigationContainer>
  );
};

export default App;