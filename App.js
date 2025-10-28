import { Provider } from 'react-redux';
import store from './store';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  return (
    <ProfileScreen />
  );
}