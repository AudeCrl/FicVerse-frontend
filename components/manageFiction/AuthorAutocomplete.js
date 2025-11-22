import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../ui/Input";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function AuthorAutocomplete({
  value = "",         // Valeur actuelle de l'input author
  suggestions = [],   // authorList : Liste des auteurs suggérés (fetchés par le parent : totalité des authors du user, sans doublons et triés par ordre alphabétique)
  onChange,           // Callback quand la valeur change
}) {
  const { currentTheme } = useTheme();
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);

  // LINK - ../../docs-frontend/components/manageFiction/AuthorAutocomplete.md#1
  useEffect(() => {
    setInput(value);
  }, [value]);

  // Filtrer les suggestions selon l'input
  const filteredSuggestions = useMemo(() => {
    const inputValue = input.trim().toLowerCase();
    const filtered = !inputValue
      ? suggestions
      : suggestions.filter((author) => author.toLowerCase().includes(inputValue));
    return filtered.slice(0, 10);
  }, [input, suggestions]);

  const handleSelect = (name) => {
    setInput(name);
    onChange(name); // on prévient le parent de ce que l'utilisateur a sélectionné
    setOpen(false);
  };

  const handleInputChange = (text) => {
    setInput(text);
    onChange(text); // on prévient le parent de ce que l'utilisateur tape
    setOpen(true);
  };

  const handleBlur = () => {
    const trimmed = input.trim();
    setInput(trimmed);
    onChange(trimmed);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: currentTheme.text }]}>
        Auteur ou autrice
      </Text>

      <View style={styles.row}>
        <Ionicons
          name="search"
          size={18}
          style={[styles.icon, { color: currentTheme.text }]}
        />

        <View style={styles.inputWrapper}>
          <Input
            value={input}
            onChangeText={handleInputChange}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
            placeholder="Rechercher ou créer"
            autoCapitalize="words"
          />
        </View>

        <Pressable onPress={() => setOpen((prev) => !prev)}>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={18}
            style={[styles.icon, { color: currentTheme.text }]}
          />
        </Pressable>
      </View>

      {open && filteredSuggestions.length > 0 && (
        <View style={styles.dropdown}>
          {filteredSuggestions.map((name) => (
            <Pressable
              style={styles.dropdownItem}
              key={name}
              onPress={() => handleSelect(name)}
            >
              <Text>{name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { ...typography.label, marginBottom: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  icon: { opacity: 0.7 },
  inputWrapper: { flex: 1 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
    overflow: "hidden",
    marginTop: 4,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
});
