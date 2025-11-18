import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "../ui/Input";
import Tags from "../fiction/Tags";
import Tag from "../fiction/Tag";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function TagSelector({
  availableTags = [], // Tous les tags du user (fetchés par le parent) et qui n'ont pas été sélectionnés
  selectedTags = [],  // Tags actuellement sélectionnés
  onAdd,              // Quand un tag est ajouté parmi les sélectionnés
  onRemove,           // Quand un tag est retiré
  onCreate,           // Quand un nouveau tag est créé
  onInputFocus,       // Au focus de l'input (finalité de la fonction : pour scroll lors du focus)
  onInputChange,      // A chaque frappe dans l'input (finalité de la fonction : pour scroll à chaque frappe)
}) {
  const { currentTheme } = useTheme();
  const [input, setInput] = useState("");
  
  // LINK - ../../docs-frontend/components/manageFiction/TagSelector.md#1
  const suggestions = useMemo(() => {
    const inputTrim = input.trim().toLowerCase();
    const selectedIds = new Set(selectedTags.map(tag => tag._id));
    const notSelected = availableTags.filter(tag => !selectedIds.has(tag._id));

    if (!inputTrim) {
      // Input vide → tri usageCount desc + tri alphabétique en cas d'égalité
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

  // Ajouter un tag existant : la seule finalité de cette fonction est de pouvoir reset l'input lorsqu'on a ajouté un tag suggéré parmi les sélectionnés
  const handleAdd = (tag) => {
    onAdd(tag);
    setInput(""); // quand le parent ManageFictionScreen a fait onAdd, on reset l'input ici
  };

  // Créer un nouveau tag
  const handleCreate = () => {
    const inputTrim = input.trim().toLowerCase();
    if (!inputTrim) return;

    // Vérifier que le tag n'existe pas déjà
    const exists = availableTags.find(tag => tag.name.toLowerCase() === inputTrim);
    if (!exists) {
      onCreate(inputTrim);  // On n'envoie pas au back _id: "temporaryId". En paramètre il n'y a que inputTrim qui correspond à tagName dans le paramètre de handleCreateTag.
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
          onInputChange(); // fonction s'active uniquement seulement à chaque fois que du texte est tapé dans l'input
        }}
        placeholder="Rechercher ou créer"
        leftIcon={<Ionicons name="search" size={18} />}
        onFocus={onInputFocus} // fonction s'active directement dès qu'il y a focus
      />

      {/* Tags sélectionnés */}
      <Tags
        tags={selectedTags}
        withCross={true}
        pressTag={(tag) => onRemove(tag._id)} // ici "tag._id" correspond à "tagId" chez const handleRemoveTag = (tagId) de ManageFictionScreen
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
          key="temporaryId"
          tag={{ _id: "temporaryId", name: input.trim() }}
          label={`＋ Créer "${input.trim()}"`}
          onPress={handleCreate}
          withCross={false}
        />
      )}
    </View>
  );
}
