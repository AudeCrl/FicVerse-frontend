import React from "react";
import { View, Text } from "react-native";
import Input from "../ui/Input";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function ChosenTitle({ value, onChange, isInvalid = false }) {
  const { currentTheme } = useTheme();
  const empty = value.trim().length === 0;
  const showError = isInvalid && empty; // Si on gardait que isInvalid, alors il restera rouge même si on remplit le champ. Là il n’affiche le rouge qu’après submit et se réinitialisera grâce à empty qui devient false

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ ...typography.label, color: showError ? "#E03131" : currentTheme.text, }}>Titre *</Text>
      <Input
        value={value}
        onChangeText={onChange}
        placeholder="L'Héritier des Serpents"
        isInvalid={showError}
        onBlur={() => onChange(value).trim()} // onBlur est un événement natif de React qui se déclenche à la fin de la saisie. On fait .trim() à la fin de la saisie
      />
    </View>
  );
}
