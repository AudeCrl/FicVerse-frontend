import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Input from "../ui/Input";
import RoundedButton from "../ui/RoundedButton";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function ChosenFandom({ value, onChange, isInvalid = false }) {
  const token = useSelector((state) => state.user.value.token);
  const { currentTheme } = useTheme();

  const [fandoms, setFandoms] = useState([]);        // { avec chaque fandom qui possède son _id, name, position }
  const [selected, setSelected] = useState(value || "");
  const [showCreator, setShowCreator] = useState(false);
  const [newFandom, setNewFandom] = useState("");

  useEffect(() => {  // Charger tous les fandoms du user (triés par position côté back)
    (async () => {
      try {
        const res = await fetch(`${API_IP}/fandom`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.result && data.fandoms) {
          setFandoms(data.fandoms);
        }
      } catch (error) {
        console.error("GET /fandom failed", error);
      }
    })();
  }, [token]);

  useEffect(() => {   // Synchronise avec la valeur reçue du parent ManageFictionScreen. Par ex lorsqu'on arrive sur la page ou après le fetch /fiction/:id. + de détails ci-dessous
    if (typeof value === "string") {
      setSelected(value);
    }
  }, [value]);

  const selectedFandom = (name) => {
    setSelected(name);
    onChange(name);   // Quand l'user va cliquer sur un fandomn, on envoie cette valeur actualisée au parent ManageFictionScreen
  };

  /*
Le fetch /fiction/:id part tout de suite au 1er render, mais il revient après (asynchrone). Du coup la séquence est :
    1/ Render 1.
    fandomName, title, etc. sont encore vides ("").
    ChoosenFandom reçoit value="" et affiche rien de sélectionné.

    2/ Le fetch se termine.
    Je fais setFandomName(...), setTitle(...), etc. dans le parent.

    3/ Render 2 (réactif).
    Le parent repasse value={fandomName} avec la vraie valeur.
    Dans ChoosenFandom, le useEffect([value]) se déclenche et fait setSelected(value) → l’UI enfant se synchronise.

    4/ Actions utilisateur.
    Quand l’utilisateur clique/crée un fandom, l’enfant appelle onChange(name) → le parent met à jour fandomName.
  */

  const confirmCreate = async () => {     // Création immédiate côté back
    const name = String(newFandom).trim();
    if (!name) return;

    try {
      const res = await fetch(`${API_IP}/fandom`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.result && data.fandom) {
        setFandoms((prev) => {        // injecter/mettre à jour la liste (préserver l’ordre par position)
          const exists = prev.some((fandomItem) => fandomItem._id === data.fandom._id);     // s'il y au moins un fandom présent dans la liste actuelle qui correspond au fandom du fetch alors garder la liste inchangée.
          if (exists) return prev;
          return [...prev, data.fandom].sort((a, b) => a.position - b.position || 0);     // s'il y a un nouveau fandom et qui est absent dans la liste actuelle alors on le rajoute et en triant par position.
        });
        setNewFandom("");
        setShowCreator(false);
        selectedFandom(data.fandom.name);
      }
    } catch (error) {
      console.error("POST /fandom failed", error);
    }
  };

  const showError = isInvalid && !selected;   // isInvalid est vrai seulement si le parent (donc fonction saveFiction dans ManageFictionScreen) a signalé une erreur. Et !selected vérifie qu’aucun fandom n’est choisi.

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ ...typography.label, color: showError ? "#E03131" : currentTheme.text }}>Fandom *</Text>

      <ScrollView   // Scroll horizontal
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, alignItems: "center" }}
      >
        {fandoms.map((fandom) => (    // Liste des fandoms qui va se succéder horizontalement et triés par position dans le back déjà
          <RoundedButton
            key={fandom._id}
            label={fandom.name}
            active={selected.toLowerCase() === String(fandom.name).toLowerCase()}
            onPress={() => selectedFandom(fandom.name)}
          />
        ))}

        <RoundedButton label="＋" onPress={() => setShowCreator(true)} />{/* bouton "+" et quand j'appuie dessus, l'input en dessous apparaît pour créer le nouveau fandom */}
      </ScrollView>

      {showCreator && (     // input pour créer le nouveau fandom
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Input
            value={newFandom}
            onChangeText={setNewFandom}
            placeholder="Nouveau fandom"
          />
          <RoundedButton label="OK" onPress={confirmCreate} />
        </View>
      )}
    </View>
  );
}
