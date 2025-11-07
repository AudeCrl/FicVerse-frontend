import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Input from "../ui/Input";
import Tags from "../fiction/Tags";
import Tag from "../fiction/Tag";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function ChosenTag({ fictionId, idTags, onTagInputFocus, onTagTyping }) {

  const token = useSelector((state) => state.user.value.token);
  const { currentTheme } = useTheme();

  const [input, setInput] = useState("");
  const [totalTags, setTotalTags] = useState([]);       // tous les tags du user
  const [selectedTags, setSelectedTags] = useState([]);  // tags sélectionnés

  // Charger tous les tags une seule fois
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_IP}/tag`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.result) setTotalTags(data.tags);  // tous les tags fetch du user vont dans totalTags
      } catch (error) {
        console.error("GET /tag failed", error);
      }
    })();
  }, [token]);

  // Préremplir en édition d'une fiction existante
  useEffect(() => {
    if (!fictionId) return;
    (async () => {
      try {
        const res = await fetch(`${API_IP}/fiction/${fictionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.result && data.fiction.tags) {
          setSelectedTags(data.fiction.tags);  // tous les tags d'une fiction sont ajoutés dans la ligne selectedTags
        }
      } catch (error) {
        console.error("GET /fiction/:id failed", error);
      }
    })();
  }, [fictionId, token]); // Pas idTags dans la liste de dépendances pour éviter des variations inutiles

  useEffect(() => { // synchroniser le parent UNIQUEMENT après rendu, une fois que selectedTags change
    if (!idTags) return;    
    idTags(selectedTags.map(tag => tag._id)); // on ne récupère que les ids et ce sont les ids de tous les tags liés à la fiction concernée. Ils seront transmis à ManageFictionScreen
  }, [selectedTags, idTags]); // idTags correspond à l'ensemble des tags de selectedTags, cad tous les tags de la fiction. On refait cette props ici car on actualise selectedTags.

  const suggestions = useMemo(() => {   // Grâce à useMemo, la liste des suggestions est enregistrée et ne change que si on modifie input (texte dans la barre recherche), totalTags (tous les tags du user) ou selectedTags (les tags sélectionnés)
  const inputTrim = input.trim().toLowerCase();

  const selectedIds = new Set(selectedTags.map(tag => tag._id)); // selectedIdsTags correspond aux id de tous les tags qui ont été sélectionnés. Set est utilisé pour nous permettre d'utiliser has. C'est pareil mais plus rapide que includes.
  const notSelected = totalTags.filter(tag => !selectedIds.has(tag._id)); //  On filtre pour ne garder que les tags qui ne sont pas sélectionnés. Si un tag fait partie des sélectionnés, ça va renvoyer false à cause de "!"

  if (!inputTrim) {    // Input vide → tri usageCount desc + alphabétique en cas d'égalité
    return [...notSelected]
      .sort((a, b) => {
        const diff = b.usageCount - a.usageCount;
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name, "fr", { sensitivity: "base" }); // Tri par ordre alphabétique. Et localeCompare est une native de sensibilité à la casse et aux accents. Ex : école, Ecole, éCole seront tous considérés identiques et triés ensemble. LocaleCompare() ne s’applique qu’aux chaînes de caractères donc pas utilisé sur usageCount.
      })
      .slice(0, 10);
  }

  // Input non vide → filtrage contains + tri alphabétique pur
  return notSelected
    .filter(tag => tag.name.toLowerCase().includes(inputTrim)) // parmi les tags non sélectionnés, on filtre pour qu'ils ne gardent que le mot-clé de l'input
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }))
    .slice(0, 10);
}, [input, totalTags, selectedTags]);

  // Ajouter un tag
  const addTag = (tag) => {
    setSelectedTags(prev => {                                                           // prev = la valeur actuelle du tableau selectedTags
      const next = prev.some(item => item._id === tag._id) ? prev : [...prev, tag];     // si aucun tag de selectedTags (cad item ici) ne correspond à tag._id alors on ajoute tag via [...prev, tag]. En revanche, s'il existe déjà alors on garde prev inchangé. 
      return next;
    });
    setInput("");
  };

  const removeTag = (id) => {
    setSelectedTags(prev => {
      const next = prev.filter(tag => tag._id !== id);  // on filtre pour garder tous les tags qui ne correspondent pas au tag qu'on veut delete
      return next;
    });
  };

// Création d’un tag puis ajout à la sélection
  const createTag = async (tagName) => {
    const name = String(tagName).trim().toLowerCase();
    if (!name) return;

    try {
      const res = await fetch(`${API_IP}/tag`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.result && data.tag._id) {
        const tag = data.tag;
        setTotalTags(prev => (prev.some(item => item._id === tag._id) ? prev : [...prev, tag])); // pas besoin de refaire un GET pour fetch totalTags car ici on dit que si un aucun tag de totalTags ne correspond au nouveau tag, alors on l'ajoute
        addTag(tag);  //  on met à jour selectedTags également
      }
    } catch (error) {
        console.error("POST /tag failed", error);}
  };

  const confirmCreate = () => {
    const inputTrim = input.trim().toLowerCase();
    if (!inputTrim) return;
    const exists = totalTags.find(tag => tag.name.toLowerCase() === inputTrim); // on vérifie si un tag dans totalTags correspond au texte de l'input
    if (!exists) createTag(inputTrim); // mais pour confirmer la création il faudra déclencher confirmCreate en appuyant sur le tag comme précisé ci-dessous dans le JSX
    setInput("");
  };

  const exactTag = useMemo(() => {
    const inputTrim = input.trim().toLowerCase();
    return inputTrim && totalTags.some(tag => tag.name.toLowerCase() === inputTrim); // si le nom d'un tag de totalTags correspond au texte de l'input alors exactTag est true
  }, [input, totalTags]);

  return (
    <View style={{ gap: 10 }}>

      <Text style={{ ...typography.label, color: currentTheme.text }}>Tags</Text>

      {/* Barre de recherche */}
      <Input
        value={input}
        onChangeText={(inputText) => { // scroller à chaque frappe
          setInput(inputText);
          onTagTyping?.();
        }}
        placeholder="Rechercher ou créer"
        leftIcon={<Ionicons name="search" size={18} />}
        onFocus={onTagInputFocus} // au focus, on scrolle tout en bas pour dégager les suggestions
      />

      {/* Tags sélectionnés */}
      <Tags
        tags={selectedTags}
        withCross={true}   // affiche la croix
        pressTag={(tag) => removeTag(tag._id)} // clic => retire
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Tags
        tags={suggestions}
        withCross={false}
        pressTag={(tag) => addTag(tag)} // clic => ajoute
        />
      )}

      {/* Créer si pas de correspondance exacte */}
      {!!input.trim() && !exactTag && (
        <Tag
        key="temporaryKey"  // React a besoin d'une key pour chaque item d'un tableau
        tag={{ _id: "temporaryKey", name: input.trim() }}
        label={`＋ Créer “${input.trim()}”`}
        onPress={confirmCreate}
        withCross={false}
        />
      )}
    </View>
  );
}
