import React, { useEffect, useState } from "react";
import { Alert, ActivityIndicator, View, Text, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Input from "../components/ui/Input";
import RoundedButton from "../components/ui/RoundedButton";
import ChosenTag from "../components/manageFiction/ChosenTag";
import ChosenFandom from "../components/manageFiction/ChosenFandom";
import ChosenTitle from "../components/manageFiction/ChosenTitle";
import ChosenLink from "../components/manageFiction/ChosenLink";
import ChosenAuthor from "../components/manageFiction/ChosenAuthor";
import ChosenLanguage from "../components/manageFiction/ChosenLanguage";
import ChosenStatus from "../components/manageFiction/ChosenStatus";
import LastChapterRead from "../components/manageFiction/LastChapterRead"; 
import Rate from "../components/fiction/Rate";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function ManageFictionScreen({ route, navigation }) {

  const token = useSelector((state) => state.user.value.token);
  const fictionId = route?.params?.fictionId;   // si jamais c'est undefined lorsque j'ouvre en création d'une nouvelle fiction

  const [fandomName, setFandomName] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [author, setAuthor] = useState("");
  const [lang, setLang] = useState("");
  const [summary, setSummary] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");
  const [numberOfChapters, setNumberOfChapters] = useState("");
  const [numberOfWords, setNumberOfWords] = useState("");
  const [lastChapterRead, setLastChapterRead] = useState(0);
  const [tagIds, setTagIds] = useState([]);   // tagIds remontés par ChosenTag
  const [readingStatus, setReadingStatus] = useState("reading");  // le back doit recevoir "reading" au lieu de "en cours"
  const [storyStatus, setStoryStatus] = useState("in-progress");

  const [titleError, setTitleError] = useState(false);
  const [fandomError, setFandomError] = useState(false);

  useEffect(() => { // Pré-remplissage de tous les champs si fiction déjà existante
    if (!fictionId) return; // si pas de fictionId alors cela veut dire nouvelle fiction et donc pas de fetch
    (async () => {
      try {
        const res = await fetch(`${API_IP}/fiction/${fictionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.result && data.fiction) {    // Les champs pré-remplis apparaissent ici. Sauf les tags, qui sont pré-remplis par leur composant ChosenTag via GET /fiction/:id
          setFandomName(data.fiction.fandomName);
          setTitle(data.fiction.title);
          setLink(data.fiction.link);
          setAuthor(data.fiction.author);
          setLang(data.fiction.lang.name);
          setSummary(data.fiction.summary);
          setPersonalNotes(data.fiction.personalNotes);
          setNumberOfChapters(String(data.fiction.numberOfChapters));  // Quand la réponse du back est parsée (res.json), numberOfChapters redevient un nombre. Or, dans le front numberOfChapters correspond à textInput et doit être en string
          setNumberOfWords(String(data.fiction.numberOfWords));
          setLastChapterRead(Number(data.fiction.lastChapterRead));
          setReadingStatus(data.fiction.readingStatus);
          setStoryStatus(data.fiction.storyStatus);
        }
      } catch (error) {
        console.error("GET /fiction/:id failed", error);
      }
    })();
  }, [fictionId, token]);   // Si une nouvelle fiction nous ramène sur cette page, alors on relance le fetch

  const validationBeforeSave = () => {
    const titleEmpty = String(title).trim().length === 0;
      const fandomEmpty = String(fandomName).trim().length === 0; // fandomName contient la valeur remontée par l'enfant via onChange. Avec le length, on vérifie que le name est vraiment vide.
      setTitleError(titleEmpty);
      setFandomError(fandomEmpty);                                // Donc fandomError devient true si fandomName est vide cad non sélectionné
      return !(titleEmpty || fandomEmpty);                        // Retourne true si tout est OK
  }  
  
  const resetFields = () => {
  setFandomName("");
  setTitle("");
  setLink("");
  setAuthor("");
  setLang("");
  setSummary("");
  setPersonalNotes("");
  setNumberOfChapters("");
  setNumberOfWords("");
  setLastChapterRead(0);
  setTagIds([]);
  setReadingStatus("reading");
  setStoryStatus("in-progress");
  setTitleError(false);
  setFandomError(false);
};

  const createFiction = async () => {   // création d'une nouvelle fiction
    if (!validationBeforeSave()) return Alert.alert("Champs requis", "Titre et fandom sont obligatoires.");

    try {
      const res = await fetch(`${API_IP}/fiction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fandomName,
          title,
          link,
          author,
          langName: lang,   // Pour correspondre au back
          summary,
          personalNotes,
          numberOfChapters: Number(numberOfChapters), // on convertit en nombre avant d'envoyer au backend, car il attend un nombre d'après notre modèle
          numberOfWords: Number(numberOfWords),
          lastChapterRead,
          tags: tagIds,    // Envoyer les tags dès la création
          readingStatus,
          storyStatus,
        }),
      });
      const data = await res.json();

      if (data.result) {
        Alert.alert("Succès", "Fiction créée !");
        navigation.navigate("Home", { screen: "HomeMain" }); 
      } else {
        Alert.alert("Erreur", data.error || "Création échouée");
      }
    } catch (error) {
      console.error(error);
      resetFields(); // vide tous les champs
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  const updateFiction = async () => {     // Modification d'une fiction existante s'il y a une fictionId
    if (!validationBeforeSave()) return Alert.alert("Champs requis", "Titre et fandom sont obligatoires.");

    try {
      const res = await fetch(`${API_IP}/fiction/${fictionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fandomName,
          title,
          link,
          author,
          langName: lang,
          summary,
          personalNotes,
          numberOfChapters: Number(numberOfChapters),
          numberOfWords: Number(numberOfWords),
          lastChapterRead,
          tagIds,    // Dans req.params.id côté back, on attend "tagIds"
          readingStatus,
          storyStatus,
        }),
      });

      const data = await res.json();
      if (data.result) {
        Alert.alert("Succès", "Fiction mise à jour !");
        navigation.navigate("Home", { screen: "HomeMain" }); 
      } else {
        Alert.alert("Erreur", data.error || "Mise à jour échouée");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        {fictionId ? "Modifier la fiction" : "Ajouter une fiction"}
      </Text>

      <ChosenFandom // On passe le flag d’erreur + reset flag au changement
      value={fandomName}
      onChange={(value) => {
        setFandomName(value);
        setFandomError(false);  // dès qu'on sélectionne à nouveau un fandom ce n'est plus true l'error. Et idem dans l'enfant ChosenFandom, showError devient false dès que !selected est false
      }}
      isInvalid={fandomError}
      />

      <ChosenTitle 
      value={title}
      onChange={(value) => {
        setTitle(value);
        setTitleError(false);   // dès qu'on tape à nouveau dans l'input Title, l'error n'est plus true.
      }}
      isInvalid={titleError}
      />

      <ChosenLink value={link} onChange={setLink} />

      <ChosenAuthor value={author} onChange={setAuthor} />

      <ChosenLanguage value={lang} onChange={setLang} /> 
      
      <Text style={{ fontWeight: "600" }}>Résumé</Text>
      <Input
        value={summary}
        onChangeText={setSummary}
        onBlur={() => setSummary(summary.trim())} // trim dès qu'on finit la saisie
        placeholder="Copier/coller le résumé d’origine, ou écrire le vôtre !"
        multiline
        numberOfLines={5}
        style={{ minHeight: 100, textAlignVertical: "top" }}
        autoCapitalize="sentences"
      />

      <Text style={{ fontWeight: "600", marginTop: 8 }}>Notes personnelles</Text>
      <Input
        value={personalNotes}
        onChangeText={setPersonalNotes}
        onBlur={() => setPersonalNotes(personalNotes.trim())}
        placeholder="Vos impressions"
        multiline   // au début j'allais mettre <Input multiline={true} /> mais c'est la même chose
        numberOfLines={5}
        style={{ minHeight: 100, textAlignVertical: "top" }}
        autoCapitalize="sentences"
      />

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>Nombre de chapitres</Text>
          <Input
            value={String(numberOfChapters)}       // TextInput n'accepte que des strings donc on transforme les chiffres de String
            onChangeText={(value) => setNumberOfChapters(value.replace(/[^0-9]/g, ""))} // tout ce qui n'est pas un chiffre est supprimé par replace (en vérité, remplacé par "")
            keyboardType="numeric"
            placeholder="21"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>Nombre de mots</Text>
          <Input
            value={String(numberOfWords)}
            onChangeText={(value) => setNumberOfWords(value.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            placeholder="97 012"
          />
        </View>
      </View>

      <ChosenStatus sectionLabel="Avancement de votre lecture" readingStatus={readingStatus} onPress={setReadingStatus}/>

      <LastChapterRead value={lastChapterRead} onChange={setLastChapterRead} />{/* Dernier chapitre lu : Input + boutons +/- */}

      <ChosenStatus sectionLabel="Statut de publication de la fanfiction" storyStatus={storyStatus} onPress={setStoryStatus}/>

      <ChosenTag       // Tags : tout est géré par ChosenTag, on récupère juste les ids
        fictionId={fictionId}
        idTags={setTagIds} // on récupère les id des tags de la fiction suite à idTags dans le fetch dans ChosenTag
      />

      <Rate iconName = "heart"/>

      <RoundedButton label={fictionId ? "Modifier la fanfiction" : "Créer la fanfiction"} onPress={fictionId ? updateFiction : createFiction} />{/* Création d'une nouvelle fiction s'il n'y a pas de fictionId */}

      <View><Text>Je n'existe que pour monter le dernier bouton</Text></View>

    </ScrollView>
  );
}
