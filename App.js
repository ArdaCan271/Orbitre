import React from 'react';
import LogInScreen from './screens/LogInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StatusBar, Button } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen
          name="Login"
          component={LogInScreen}
          options={{header: () => (<View/>)}}/>
          <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}