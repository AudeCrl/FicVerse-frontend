import { Provider } from 'react-redux';
import store from './store';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AuthScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/HomeScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='AuthScreen' component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>    
  );
}