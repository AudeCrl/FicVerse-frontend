import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function RoundedButton({    
  label,
  active = false,
  onPress,
}) {
  const background = active ? '#DEDAFF' : '#E6E6E6';

  return (
    <Pressable onPress={onPress} style={[styles.containerButton, {backgroundColor: background} ]}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    containerButton: {
        justifyContent: 'center',      
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E1E1E',
    },
});

/*
Liste des props :
  label,                ==> texte du bouton
  active = false,       ==> true = fond #DEDAFF, false = #E6E6E6
  onPress,              ==> la fonction qu'il appellera quand on va le press

<Pressable onPress={onPress} style={[styles.containerButton, {backgroundColor: background} ]}>  ==> BackgroundColor est une valeur dynamique donc elle est mise ici. Les valeurs statiques iront en bas dans StyleSheet

Dans le Stylesheet, containerButton indique le style du button et c'est statique. Idem pour text qui indique le style du texte, c'est statique.
*/