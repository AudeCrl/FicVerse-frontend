import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../ui/Input";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

/**
 * AuthorAutocomplete - Composant DUMB pour l'autocomplétion d'auteur
 *
 * Props:
 * - value: String - Valeur actuelle de l'input
 * - suggestions: Array<String> - Liste des auteurs suggérés (fetchés par le parent)
 * - onChange: Function(name) - Callback quand la valeur change
 */
export default function AuthorAutocomplete({
  value = "",
  suggestions = [],
  onChange,
}) {
  const { currentTheme } = useTheme();
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);

  // Synchronise l'input avec la valeur du parent (pré-remplissage)
  React.useEffect(() => {
    if (typeof value === "string") setInput(value);
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
    onChange?.(name);
    setOpen(false);
  };

  const handleInputChange = (text) => {
    setInput(text);
    onChange?.(text);
    setOpen(true);
  };

  const handleBlur = () => {
    const trimmed = input.trim();
    setInput(trimmed);
    onChange?.(trimmed);
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
