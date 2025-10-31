import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';


export default function PillButton({
    // Liste des props
  label,                // texte du bouton pillule
  active = false,       // true = fond #DEDAFF, false = #E6E6E6
  onPress,              // la fonction qu'il appellera quand on va le press
}) 

{
  const background = active ? '#DEDAFF' : '#E6E6E6';

  return (
    <Pressable onPress={onPress} style={[styles.containerButton, {backgroundColor: background} ]}>    {/* BackgroundColor est une valeur dynamique donc elle est mise ici. Les valeurs statiques iront en bas dans StyleShee*/}
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    containerButton: {                  // style du button, c'est statique
        justifyContent: 'center',      
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    text: {                             // style du texte, c'est statique
        fontSize: 14,
        fontWeight: '600',
        color: '#1E1E1E',
    },
});
