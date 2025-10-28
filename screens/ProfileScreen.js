import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ProfileScreen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#72034473',    
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