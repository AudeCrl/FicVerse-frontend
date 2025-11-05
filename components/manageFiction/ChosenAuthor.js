import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../ui/Input";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function ChosenAuthor({ value, onChange }) {
  const token = useSelector((state) => state.user.value.token);

  const [input, setInput] = useState(value || "");
  const [totalAuthors, setTotalAuthors] = useState([]);   // tous les auteurs (distincts)
  const [open, setOpen] = useState(false);            // ouverture/fermeture du menu déroulant

  useEffect(() => {      // Synchronise avec la valeur reçue du parent ManageFictionScreen (lors du pré-remplissage). Par ex lorsqu'on arrive sur la page ou après le fetch /fiction/:id.
    if (typeof value === "string") setInput(value);
  }, [value]);

  useEffect(() => {
    (async () => {
      try {
        const statusList = ["reading", "to-read", "finished"];  // Ce périmètre permet de récupérer les auteurs présents dans la totalité des fictions du user
        const headers = { Authorization: `Bearer ${token}` };

        const results = [];

        for (const status of statusList) {    // Pour "reading" etc, on applique le fetch de GET fiction/status/:readingStatus
          try {
            const res = await fetch(`${API_IP}/fiction/status/${status}`, { headers });
            const data = await res.json();
            results.push(data);   // Donc ici on a un tableau results = [data de reading, data de to-read, data de finished];
            } catch (error) {
              console.error(`GET /fiction/status/${status} failed`, error);
              results.push({ result: false });
            }
          }   

        const names = new Set();  // Set n'est pas un tableau et je veux qu'il enregistre les valeurs de results
        for (const res of results) {  // res de reading, res de to-read, res de finished
          if (!res.result || !res.fandoms) continue;
          res.fandoms.forEach((fandom) => {   // forEach ne parcourt que des tableaux, mais il ne retourne rien contrairement à map qui retourne un tableau
            (fandom.fictions || []).forEach((fiction) => {  // On applique forEach à chaque fandom puis à l'intérieur, on réapplique forEach à chaque fiction. Le `|| []` garantit qu’on ne boucle pas sur undefined si un fandom n’a pas de fictions.
              const nameAuthor = (fiction.author).trim();   // forEach va enregistrer chaque auteur dans chaque fiction et on applique .trim()
              if (nameAuthor) names.add(nameAuthor);  // Mais forEach ne retourne rien (juste undefined), donc on envoie ces auteurs dans Set via la méthode add et Set se chargera de supprimer les doublons
            }); // Set.add() ajoute un élément dans le Set. Si cet élément existe déjà, il n’est pas dupliqué.
          });
        }

        const sorted = Array.from(names).sort((a, b) =>     // Array.from() transforme en tableau. On fait ça car on a besoin d'appliquer la méthode .sort()
          a.localeCompare(b, "fr", { sensitivity: "base" })
        );
        setTotalAuthors(sorted);   // La liste de tous les auteurs du user est triée par ordre alphabétique
      } catch (e) {
        console.error("GET authors from fictions failed", e);
      }
    })();
  }, [token]);

  const suggestions = useMemo(() => {  // Liste des auteurs suggérés
    const inputValue = input.trim().toLowerCase();
    const suggestionList = !inputValue   // Si le champ input est vide, on retourne la totalité des auteurs (mais juste les 10 premiers). Si elle n'est pas vide, on applique le filtre sur la totalité des auteurs pour voir si includes la value du champ input.
      ? totalAuthors
      : totalAuthors.filter((author) => author.toLowerCase().includes(inputValue));
    return suggestionList.slice(0, 10);
  }, [input, totalAuthors]);

  const chooseAuthor = (name) => {    // Chaque auteur du menu déroulant est un button. Dès qu'on appuie sur un auteur, cette fonction s'active.
    setInput(name);                   // Elle remplace l'input par le nom de l'auteur sélectionné
    onChange(name);                   // Elle envoie le nom de l'auteur au parent ManageFictionScreen
    setOpen(false);                   // Elle referme le menu déroulant
  };

  const authorTrim = () => {
    const inpuTrim = input.trim();
    setInput(inpuTrim);
    onChange(inpuTrim);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Auteur ou autrice</Text>

      <View style={styles.row}> {/* Barre d’entrée avec icônes */}
        <Ionicons name="search" size={18} style={styles.icon} />

        <View style={styles.inputWrapper}>
          <Input
            value={input}
            onChangeText={(inputText) => {
              setInput(inputText);
              onChange(inputText);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}  // on ouvre la barre déroulante dès qu'on appuie sur l'input, même s'il est vide.
            onBlur={authorTrim}  // Dès qu'on a fini la saisie, on applique la fonction Trim aussitôt
            placeholder="Rechercher ou créer"
            autoCapitalize="words"
          />
        </View>

        <Pressable onPress={() => setOpen((toggle) => !toggle)}>
          <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} style={styles.icon} />
        </Pressable>
      </View>

      {open && suggestions.length > 0 && (   // Menu déroulant
        <View style={styles.dropdown}>
          {suggestions.map((name) => (
            <Pressable
            style={styles.dropdownItem}
            key={name}
            onPress={() => chooseAuthor(name)}
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

  label: { fontWeight: "600" },

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
