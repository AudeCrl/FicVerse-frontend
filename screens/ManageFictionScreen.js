import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Alert, View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import Header from '../components/Header';
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../styles/globalStyles";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function ManageFictionScreen({ route, navigation }) {

  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.user.value);
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
  const [rateValue, setRateValue] = useState(0);
  const [displayRate, setDisplayRate] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [fandomError, setFandomError] = useState(false);

  const setTagIdsStable = useCallback((ids) => setTagIds(ids), []);
  const scrollRef = useRef(null); // ref pour scroller automatiquement

  const { currentTheme } = useTheme();
  const styles = useMemo(() => createStyles(currentTheme), [currentTheme]);

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
          setRateValue(Number(data.fiction.rate.value));
          setDisplayRate(Boolean(data.fiction.rate.display));
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
  
const toggleHideRate = () => {
    setDisplayRate((toggle) => !toggle);
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
          rate: { value: rateValue, display: displayRate },
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
          rate: { value: rateValue, display: displayRate },
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
    <SafeAreaView style={styles.container} edges={["top, bottom"]}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"  // permet de taper sur les suggestions sans fermer le clavier
          keyboardDismissMode="on-drag"        // dès qu'on se met à scroller, le clavier se ferme automatiquement
          ref={scrollRef}                      // on pourra scroller au focus
        >
          <Header
         title={fictionId ? "Modifier une fanfiction" : "Ajouter une fanfiction"}
         screenName="manage"     //  eader spécifique à cette page uniquement
         showToggle={false}        // false pour masquer le switch ici
         onProfilePress={() => navigation.navigate("Profile")}
       />

          <View style={styles.section}>
            <ChosenFandom // On passe le flag d’erreur + reset flag au changement
            value={fandomName}
            onChange={(value) => {
              setFandomName(value);
              setFandomError(false);  // dès qu'on sélectionne à nouveau un fandom ce n'est plus true l'error. Et idem dans l'enfant ChosenFandom, showError devient false dès que !selected est false
            }}
            isInvalid={fandomError}
            />
          </View>

          <View style={styles.section}>
            <ChosenTitle 
            value={title}
            onChange={(value) => {
              setTitle(value);
              setTitleError(false);   // dès qu'on tape à nouveau dans l'input Title, l'error n'est plus true.
            }}
            isInvalid={titleError}
            />
          </View>

          <View style={styles.section}>
            <ChosenLink value={link} onChange={setLink} />
          </View>

          <View style={styles.section}>
            <ChosenAuthor
              value={author}
              onChange={setAuthor}
            />
          </View>

          <View style={styles.section}>
            <ChosenLanguage value={lang} onChange={setLang} />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Résumé</Text>
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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes personnelles</Text>
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
          </View>

          <View style={[styles.section, styles.numbersRow]}>
            <View style={styles.numberCol}>
              <Text style={styles.sectionLabel}>Nombre de chapitres</Text>
              <Input
                value={String(numberOfChapters)}       // TextInput n'accepte que des strings donc on transforme les chiffres de String
                onChangeText={(value) => setNumberOfChapters(value.replace(/[^0-9]/g, ""))} // tout ce qui n'est pas un chiffre est supprimé par replace (en vérité, remplacé par "")
                keyboardType="numeric"
                placeholder="21"
              />
            </View>

            <View style={styles.numberCol}>
              <Text style={styles.sectionLabel}>Nombre de mots</Text>
              <Input
                value={String(numberOfWords)}
                onChangeText={(value) => setNumberOfWords(value.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="97 012"
              />
            </View>
          </View>

          <View style={styles.section}>
            <ChosenStatus sectionLabel="Avancement de votre lecture" readingStatus={readingStatus} onPress={setReadingStatus}/>
          </View>

          <View style={styles.section}>
            <LastChapterRead value={lastChapterRead} onChange={setLastChapterRead} />{/* Dernier chapitre lu : Input + boutons +/- */}
          </View>

          <View style={styles.section}>
            <ChosenStatus sectionLabel="Statut de publication de la fanfiction" storyStatus={storyStatus} onPress={setStoryStatus}/>
          </View>

          <View style={styles.section}>
            <ChosenTag       // Tags : tout est géré par ChosenTag, on récupère juste les ids
              fictionId={fictionId}
              idTags={setTagIdsStable} // on récupère les id des tags de la fiction suite à idTags dans le fetch dans ChosenTag
              onTagInputFocus={() => scrollRef.current?.scrollToEnd({ animated: true })} // focus input => scroll en bas
              onTagTyping={() => scrollRef.current?.scrollToEnd({ animated: true })}     // chaque frappe => scroll en bas
            />
          </View>

          <View style={styles.section}>
            <Rate
              sectionLabel="Votre note"
              iconName={user.notationIcon}
              value={rateValue}
              onPress={setRateValue}
              hideRate={!displayRate}
              onToggleHide={toggleHideRate}
              editable={true}
            />
          </View>

          <View style={styles.section}>
            <RoundedButton label={fictionId ? "Modifier la fanfiction" : "Créer la fanfiction"} onPress={fictionId ? updateFiction : createFiction} />{/* Création d'une nouvelle fiction s'il n'y a pas de fictionId */}
          </View>

        </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      // paddingHorizontal: 16,
      // paddingTop: 12,
      paddingBottom: 28,
      rowGap: 12,
    },
    section: {
      marginTop: 6,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    sectionLabel: {
      ...typography.label,
      color: theme.text,
      marginBottom: 6,
      marginTop: 4,
    },
    numbersRow: {
      flexDirection: "row",
      gap: 12,
    },
    numberCol: {
      flex: 1,
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 12,
    },
  });