import React from 'react';
import { Pressable, Text } from 'react-native';
import { typography } from '../../styles/globalStyles.js';
import { useTheme } from '../../context/ThemeContext.js';

export default function RoundedButton({    
  label,
  active = false,
  onPress,
  style = {},
  textColor,
}) {
  const { currentTheme } = useTheme();
  
  return (
    <Pressable 
      onPress={onPress} 
      style={{
        justifyContent: 'center',      
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: active ? currentTheme.primary : currentTheme.inactive,
        minHeight: 40,
        ...style
      }}
    >
      <Text 
        style={{
          ...typography.body,
          fontWeight: '600',
          color: textColor || currentTheme.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/*
Liste des props :
  label,                ==> texte du bouton
  active = false,       ==> true = fond #DEDAFF, false = #E6E6E6
  onPress,              ==> la fonction qu'il appellera quand on va le press

<Pressable onPress={onPress} style={[styles.containerButton, {backgroundColor: background} ]}>  ==> BackgroundColor est une valeur dynamique donc elle est mise ici. Les valeurs statiques iront en bas dans StyleSheet

Dans le Stylesheet, containerButton indique le style du button et c'est statique. Idem pour text qui indique le style du texte, c'est statique.
*/