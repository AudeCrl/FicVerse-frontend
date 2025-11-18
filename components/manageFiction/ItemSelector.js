import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Input from "../ui/Input";
import RoundedButton from "../ui/RoundedButton";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

/**
 * ItemSelector - Composant DUMB pour sélectionner un item parmi une liste
 * Utilisé pour Fandom et Language
 *
 * Props:
 * - items: Array - Liste des items disponibles (fetchés par le parent)
 * - selectedValue: String - Valeur actuellement sélectionnée
 * - onSelect: Function(name) - Callback quand un item est sélectionné
 * - onCreate: Function(name) - Callback quand un nouvel item est créé
 * - label: String - Label du champ (ex: "Fandom *", "Langue")
 * - getItemLabel: Function(item) - Fonction pour extraire le label d'un item
 * - getItemKey: Function(item) - Fonction pour extraire la clé d'un item
 * - placeholder: String - Placeholder de l'input de création
 * - isRequired: Boolean - Si true, affiche en rouge si vide
 * - isInvalid: Boolean - Si true et vide, affiche l'erreur
 */
export default function ItemSelector({
  items = [],
  selectedValue = "",
  onSelect,
  onCreate,
  label = "Item",
  getItemLabel = (item) => item.name,
  getItemKey = (item) => item._id || item.name,
  placeholder = "Nouveau",
  isRequired = false,
  isInvalid = false,
}) {
  const { currentTheme } = useTheme();
  const [showCreator, setShowCreator] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");

  const handleSelect = (name) => {
    onSelect?.(name);
  };

  const handleCreate = () => {
    const name = String(newItemValue).trim();
    if (!name) return;

    onCreate?.(name);
    setNewItemValue("");
    setShowCreator(false);
  };

  const showError = isRequired && isInvalid && !selectedValue;

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ ...typography.label, color: showError ? "#E03131" : currentTheme.text }}>
        {label}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, alignItems: "center" }}
      >
        {items.map((item) => (
          <RoundedButton
            key={getItemKey(item)}
            label={getItemLabel(item)}
            active={selectedValue.toLowerCase() === String(getItemLabel(item)).toLowerCase()}
            onPress={() => handleSelect(getItemLabel(item))}
          />
        ))}

        <RoundedButton label="＋" onPress={() => setShowCreator(true)} />
      </ScrollView>

      {showCreator && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Input
            value={newItemValue}
            onChangeText={setNewItemValue}
            placeholder={placeholder}
          />
          <RoundedButton label="OK" onPress={handleCreate} />
        </View>
      )}
    </View>
  );
}
