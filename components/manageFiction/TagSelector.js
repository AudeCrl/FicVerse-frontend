import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "../ui/Input";
import Tags from "../fiction/Tags";
import Tag from "../fiction/Tag";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

/**
 * TagSelector - Composant DUMB pour la sélection de tags
 *
 * Props:
 * - availableTags: Array - Tous les tags disponibles (fetchés par le parent)
 * - selectedTags: Array - Tags actuellement sélectionnés
 * - onAdd: Function(tag) - Callback quand un tag est ajouté
 * - onRemove: Function(tagId) - Callback quand un tag est retiré
 * - onCreate: Function(tagName) - Callback quand un nouveau tag est créé
 * - onInputFocus: Function - Callback au focus de l'input (pour scroll)
 * - onInputChange: Function - Callback à chaque frappe (pour scroll)
 */
export default function TagSelector({
  availableTags = [],
  selectedTags = [],
  onAdd,
  onRemove,
  onCreate,
  onInputFocus,
  onInputChange,
}) {
  const { currentTheme } = useTheme();
  const [input, setInput] = useState("");

  // Suggestions filtrées (tags non sélectionnés qui matchent l'input)
  const suggestions = useMemo(() => {
    const inputTrim = input.trim().toLowerCase();
    const selectedIds = new Set(selectedTags.map(tag => tag._id));
    const notSelected = availableTags.filter(tag => !selectedIds.has(tag._id));

    if (!inputTrim) {
      // Input vide → tri usageCount desc + alphabétique
      return [...notSelected]
        .sort((a, b) => {
          const diff = b.usageCount - a.usageCount;
          if (diff !== 0) return diff;
          return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
        })
        .slice(0, 10);
    }

    // Input non vide → filtrage + tri alphabétique
    return notSelected
      .filter(tag => tag.name.toLowerCase().includes(inputTrim))
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }))
      .slice(0, 10);
  }, [input, availableTags, selectedTags]);

  // Vérifie si un tag avec ce nom exact existe déjà
  const exactTagExists = useMemo(() => {
    const inputTrim = input.trim().toLowerCase();
    return inputTrim && availableTags.some(tag => tag.name.toLowerCase() === inputTrim);
  }, [input, availableTags]);

  // Ajouter un tag existant
  const handleAdd = (tag) => {
    onAdd?.(tag);
    setInput("");
  };

  // Retirer un tag
  const handleRemove = (tagId) => {
    onRemove?.(tagId);
  };

  // Créer un nouveau tag
  const handleCreate = () => {
    const inputTrim = input.trim().toLowerCase();
    if (!inputTrim) return;

    // Vérifier que le tag n'existe pas déjà
    const exists = availableTags.find(tag => tag.name.toLowerCase() === inputTrim);
    if (!exists) {
      onCreate?.(inputTrim);
    }
    setInput("");
  };

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ ...typography.label, color: currentTheme.text }}>Tags</Text>

      {/* Barre de recherche */}
      <Input
        value={input}
        onChangeText={(text) => {
          setInput(text);
          onInputChange?.();
        }}
        placeholder="Rechercher ou créer"
        leftIcon={<Ionicons name="search" size={18} />}
        onFocus={onInputFocus}
      />

      {/* Tags sélectionnés */}
      <Tags
        tags={selectedTags}
        withCross={true}
        pressTag={(tag) => handleRemove(tag._id)}
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Tags
          tags={suggestions}
          withCross={false}
          pressTag={(tag) => handleAdd(tag)}
        />
      )}

      {/* Créer si pas de correspondance exacte */}
      {!!input.trim() && !exactTagExists && (
        <Tag
          key="temporaryKey"
          tag={{ _id: "temporaryKey", name: input.trim() }}
          label={`＋ Créer "${input.trim()}"`}
          onPress={handleCreate}
          withCross={false}
        />
      )}
    </View>
  );
}
