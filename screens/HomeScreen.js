import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        HomeScreen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#03147273',    
    // 2. Prendre toute la hauteur et largeur de l'écran
    flex: 1,    
    // 3. Centrer le contenu horizontalement
    alignItems: 'center',    
    // 4. Centrer le contenu verticalement
    justifyContent: 'center', 
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});