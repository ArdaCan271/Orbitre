import React, {useEffect} from 'react';
import LogInScreen from './screens/LogInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StatusBar, Button } from 'react-native';
import OneSignal from 'react-native-onesignal';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("227eebda-c07c-45f3-83c2-2011897161cc");
    //END OneSignal Init Code

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });

  },[])

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