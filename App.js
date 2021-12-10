import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import LoginScreen from './app/screens/Login';
import BankingbotScreen from './app/screens/Bankingbot';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App(){
  return (
    <NavigationContainer initialRouteName="Login">
      <Stack.Navigator>
        <Stack.Screen 
        name= "Login" 
        component={LoginScreen} 
        options={{title: 'Login'}}
        />
        <Stack.Screen 
        name= "Bankingbot" 
        component={BankingbotScreen} 
        options={{title: 'Rodger'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

}