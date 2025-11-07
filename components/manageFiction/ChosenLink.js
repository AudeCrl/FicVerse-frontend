import React from "react";
import { View, Text } from "react-native";
import Input from "../ui/Input";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function ChosenLink({ value, onChange }) {
  const { currentTheme } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ ...typography.label, color: currentTheme.text }}>Lien</Text>
      <Input
        value={typeof value === "string" ? value : ""}
        onChangeText={onChange}
        placeholder="https://archiveofourown.org/..."
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        onBlur={() => onChange(value.trim())}
      />
    </View>
  );
}
