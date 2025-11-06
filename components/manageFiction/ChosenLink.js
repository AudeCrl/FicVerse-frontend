import React from "react";
import { View, Text } from "react-native";
import Input from "../ui/Input";

export default function ChosenLink({ value, onChange }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: "600" }}>Lien</Text>
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
