import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Input from "../ui/Input";
import RoundedButton from "../ui/RoundedButton";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ChosenLanguage({ value, onChange }) {
  const token = useSelector((state) => state.user.value.token);
  const { currentTheme } = useTheme();

  const [languages, setLanguages] = useState([]); // [{ name, position }]
  const [chosenLang, setChosenLang] = useState(value || "");
  const [creationLang, setCreationLang] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {     // Charger les langues triées par position depuis le back
    (async () => {
      try {
        const res = await fetch(`${API_URL}/fiction/lang`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.result && data.languages) {
          setLanguages(data.languages); // déjà triées côté back par ordre croissant de position
        }
      } catch (error) {
        console.error("GET /fiction/lang failed", error);
      }
    })();
  }, [token]);

  useEffect(() => {   // Synchroniser la sélection avec la valeur reçue du parent. Lorsque ManageFictionScreen va fetch ou après son 1er render, il va nous envoyer la value de la langue sélectionnée (ou des langues sélectionnées)
    if (typeof value === "string") setChosenLang(value);
  }, [value]);

  const selectLanguage = (name) => {     // Sélection d'une langue existante
    setChosenLang(name);
    onChange(name);
  };

  const confirmCreate = () => {   // Création locale d'une nouvelle langue
    const nameLang = String(newLanguage).trim();
    if (!nameLang) return;  // cad si nameLang est un champ vide, on return

    setLanguages((prev) => {    // Si l'une des langues déjà existantes, cad de setLanguages, match avec la langue de l'input, alors on garde le tableau de langues inchangé
      if (prev.some((lang) => lang.name.toLowerCase() === nameLang.toLowerCase())) return prev;
      return [...prev, { name: nameLang, position: prev.length + 1 }];      // Ajout en fin, position = dernière + 1 (juste pour l'affichage)
    });

    setNewLanguage("");
    setCreationLang(false);
    selectLanguage(nameLang); // sélection immédiate
  };

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ ...typography.label, color: currentTheme.text }}>Langue</Text>

      <ScrollView     // Barre de boutons de langues
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, alignItems: "center" }}
      >
        {languages.map((lang) => (
          <RoundedButton
            key={lang.name}
            label={lang.name}
            active={chosenLang.toLowerCase() === lang.name.toLowerCase()}
            onPress={() => selectLanguage(lang.name)}
          />
        ))}

        <RoundedButton label="＋" onPress={() => setCreationLang(true)} />{/* Bouton + pour ajouter une langue */}
      </ScrollView>

      {creationLang && (      // Zone de création
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Input
            value={newLanguage}
            onChangeText={setNewLanguage}
            placeholder="Nouvelle langue"
            autoCapitalize="sentences"
          />
          <RoundedButton label="OK" onPress={confirmCreate} />
        </View>
      )}
    </View>
  );
}