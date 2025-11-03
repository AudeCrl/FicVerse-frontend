import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { typography } from '../../styles/globalStyles.js';

export default function Input({    
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  isInvalid = false,    // bordure rouge contrôlée par AuthScreen ou ManageFictionScreen
  style,
  ...rest

}) {
  
  return (
    <TextInput 
    style={[styles.input, isInvalid && styles.inputInvalid, style]} // 3 styles qui se succèdent
    // input est le style de RoundedButton
    // inputInvalid va mettre en rouge si isInvalid est true
    // style est le style côté parent si on veut ajouter d'autres modifs
    {...rest}  // Pour pouvoir ajouter d'autres props côté parent si on le souhaite, en dehors de celles mises dans le composant
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}/>           
  );
}

const styles = StyleSheet.create ({
    input: {
        ...typography.input,    
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    inputInvalid: {
        borderColor: "#E03131",
    },
});