import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Input from "../ui/Input";
import RoundedButton from "../ui/RoundedButton";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function ItemSelector({
  items = [],                                       // Liste des items disponibles (fetchés par le parent)
  selectedValue = "",                               // Valeur actuellement sélectionnée
  onSelect,                                         // Fonction pour sélectionner un item
  onCreate,                                         // Fonction pour créer un nouvel item
  label = "Item",                                   // Label du champ (ex: "Fandom *", "Langue")
  getItemLabel = (item) => item.name,               // Fonction pour extraire le label d'un item
  getItemKey = (item) => item._id || item.name,     // Fonction pour extraire la clé d'un item
  placeholder = "Nouveau",                          // Placeholder de l'input de création
  isRequired = false,                               // Si true, affiche en rouge si selectedValue est vide
  isInvalid = false,                                // Si true et selectedValue est vide, affiche l'erreur
}) {
  const { currentTheme } = useTheme();
  const [itemCreation, setItemCreation] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");

  const showError = isRequired && isInvalid && !selectedValue;

  const handleSelect = (name) => {
    onSelect(name);
  };

  const handleCreate = () => {
    const name = newItemValue.trim();
    if (!name) return;

    onCreate(name);
    setNewItemValue("");
    setItemCreation(false);
  };

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

        <RoundedButton label="＋" onPress={() => setItemCreation(true)} />
      </ScrollView>

      {itemCreation && (
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
