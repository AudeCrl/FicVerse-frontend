import { useEffect, useState, useMemo, useRef } from "react";
import { Alert, View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import Header from '../components/Header';
import Input from "../components/ui/Input";
import RoundedButton from "../components/ui/RoundedButton";
import TagSelector from "../components/manageFiction/TagSelector";
import ItemSelector from "../components/manageFiction/ItemSelector";
import AuthorAutocomplete from "../components/manageFiction/AuthorAutocomplete";
import ChosenTitle from "../components/manageFiction/ChosenTitle";
import ChosenLink from "../components/manageFiction/ChosenLink";
import ChosenStatus from "../components/manageFiction/ChosenStatus";
import LastChapterRead from "../components/manageFiction/LastChapterRead";
import Rate from "../components/fiction/Rate";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../styles/globalStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ManageFictionScreen({ route, navigation }) {

  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const fictionId = route.params?.fictionId;  // ? après params dans le cas où on ne transmet pas de fictionId et donc go sur création de fiction

  // États pour les données fetchées
  const [fandoms, setFandoms] = useState([]);
  const [tags, setTags] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [authors, setAuthors] = useState([]);

  // LINK - ../docs-frontend/screens/ManageFictionScreen.md#1
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [readingStatus, setReadingStatus] = useState("reading");  // le back doit recevoir "reading" au lieu de "en cours"
  const [storyStatus, setStoryStatus] = useState("in-progress");
  const [rateValue, setRateValue] = useState(0);
  const [displayRate, setDisplayRate] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [fandomError, setFandomError] = useState(false);

  const scrollRef = useRef(null); // ref pour scroller automatiquement

  const { currentTheme } = useTheme();
  const styles = useMemo(() => createStyles(currentTheme), [currentTheme]);

  // Fetch initial : 4 requêtes en parallèle pour chargement des fandoms, tags, langues et auteurs en parallèle
  useEffect(() => {
    const baseData = async () => {
      try {
        const [fandomsResponse, tagsResponse, languagesResponse, authorsResponse] = await Promise.all([ // LINK - ../docs-frontend/screens/ManageFictionScreen.md#2
          fetch(`${API_URL}/fandom`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/tag`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/fiction/lang`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/fiction/author`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [fandomsData, tagsData, languagesData, authorsData] = await Promise.all([
          fandomsResponse.json(),
          tagsResponse.json(),
          languagesResponse.json(),
          authorsResponse.json(),
        ]);

        // LINK - ../docs-frontend/screens/ManageFictionScreen.md#3
        if (fandomsData.result) setFandoms(fandomsData.fandoms);
        if (tagsData.result) setTags(tagsData.tags);
        if (languagesData.result) setLanguages(languagesData.languages);
        if (authorsData.result) setAuthors(authorsData.authors);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    baseData();
  }, [token]);

  // Pré-remplissage si modification d'une fiction existante
  useEffect(() => {
    if (!fictionId) return; // si pas de fictionId alors cela veut dire nouvelle fiction et donc pas de fetch
    (async () => {
      try {
        const res = await fetch(`${API_URL}/fiction/${fictionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.result && data.fiction) {        // Ci-dessous les champs pré-remplis
          setFandomName(data.fiction.fandomName);
          setTitle(data.fiction.title);
          setLink(data.fiction.link);
          setAuthor(data.fiction.author);
          setLang(data.fiction.lang.name);
          setSummary(data.fiction.summary);
          setPersonalNotes(data.fiction.personalNotes);
          setNumberOfChapters(String(data.fiction.numberOfChapters)); // Quand la réponse du back est parsée (res.json), numberOfChapters redevient un nombre. Or, dans le front numberOfChapters correspond à textInput et doit être reçu dans le front en string
          setNumberOfWords(String(data.fiction.numberOfWords));
          setLastChapterRead(Number(data.fiction.lastChapterRead));
          setReadingStatus(data.fiction.readingStatus);
          setStoryStatus(data.fiction.storyStatus);
          setRateValue(Number(data.fiction.rate.value));
          setDisplayRate(Boolean(data.fiction.rate.display));
          if (data.fiction.tags) setSelectedTags(data.fiction.tags);
        }
      } catch (error) {
        console.error("GET /fiction/:id failed", error);
      }
    })();
  }, [fictionId, token]);   // Avec fictionId en dépendance, si une nouvelle fiction nous ramène sur cette page, alors on relance le fetch

  // Handlers pour TagSelector // LINK - ../docs-frontend/screens/ManageFictionScreen.md#4
  const handleAddTag = (tag) => {
    setSelectedTags(prev => {
      if (prev.some(t => t._id === tag._id)) return prev;
      return [...prev, tag];
    });
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTags(prev => prev.filter(tag => tag._id !== tagId));
  };

  const handleCreateTag = async (tagName) => {  // Création d’un tag puis ajout à la sélection
    try {
      const res = await fetch(`${API_URL}/tag`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tagName }),
      });
      const data = await res.json();
      if (data.result && data.tag) {
        // Ajouter aux tags disponibles : le useState tags qui contient tous les tags fecthées se voit ajouté ce nouveau tag supplémentaire
        setTags(prev => {
          if (prev.some(t => t._id === data.tag._id)) return prev;
          return [...prev, data.tag];
        });
        // Ajouter aux tags sélectionnés
        handleAddTag(data.tag);
      }
    } catch (error) {
      console.error("POST /tag failed", error);
    }
  };

  // Handler pour créer un fandom
  const handleCreateFandom = async (name) => {
    try {
      const res = await fetch(`${API_URL}/fandom`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.result && data.fandom) {
        setFandoms(prev => {
          if (prev.some(f => f._id === data.fandom._id)) return prev;
          return [...prev, data.fandom].sort((a, b) => a.position - b.position);
        });
        setFandomName(data.fandom.name);
        setFandomError(false);
      }
    } catch (error) {
      console.error("POST /fandom failed", error);
    }
  };

  // Handler pour créer une langue (locale seulement)
  const handleCreateLanguage = (name) => {
    setLanguages(prev => {
      if (prev.some(l => l.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, { name, position: prev.length + 1 }];
    });
    setLang(name);
  };

  const validationBeforeSave = () => {
    const titleEmpty = String(title).trim().length === 0;
    const fandomEmpty = String(fandomName).trim().length === 0;
    setTitleError(titleEmpty);
    setFandomError(fandomEmpty);
    return !(titleEmpty || fandomEmpty);
  };

  const validationChapter = () => {
    const totalChapters = Number(numberOfChapters) || 0;
    if (lastChapterRead > totalChapters && totalChapters > 0) {
      Alert.alert(
        "Erreur de validation",
        `Le dernier chapitre lu (${lastChapterRead}) ne peut pas dépasser le nombre total de chapitres (${totalChapters}).`
      );
      return false;
    }
    return true;
  };

  const toggleHideRate = () => {
    setDisplayRate((toggle) => !toggle);
  };

  const createFiction = async () => {
    if (!validationBeforeSave()) return Alert.alert("Champs requis", "Titre et fandom sont obligatoires.");
    if (!validationChapter()) return;

    try {
      const res = await fetch(`${API_URL}/fiction`, {
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
          langName: lang,
          summary,
          personalNotes,
          numberOfChapters: Number(numberOfChapters),
          numberOfWords: Number(numberOfWords),
          lastChapterRead,
          tags: selectedTags.map(tag => tag._id),
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

  const updateFiction = async () => {
    if (!validationBeforeSave()) return Alert.alert("Champs requis", "Titre et fandom sont obligatoires.");

    try {
      const res = await fetch(`${API_URL}/fiction/${fictionId}`, {
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
          tagIds: selectedTags.map(tag => tag._id),
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ref={scrollRef}
        >
          <Header
            title={fictionId ? "Modifier une fanfiction" : "Ajouter une fanfiction"}
            screenName="manage"
            showToggle={false}
            onProfilePress={() => navigation.navigate("Profile")}
          />

          <View style={styles.section}>
            <ItemSelector
              items={fandoms}
              selectedValue={fandomName}
              onSelect={(name) => {
                setFandomName(name);
                setFandomError(false);
              }}
              onCreate={handleCreateFandom}
              label="Fandom *"
              getItemLabel={(f) => f.name}
              getItemKey={(f) => f._id}
              placeholder="Nouveau fandom"
              isRequired={true}
              isInvalid={fandomError}
            />
          </View>

          <View style={styles.section}>
            <ChosenTitle
              value={title}
              onChange={(value) => {
                setTitle(value);
                setTitleError(false);
              }}
              isInvalid={titleError}
            />
          </View>

          <View style={styles.section}>
            <ChosenLink value={link} onChange={setLink} />
          </View>

          <View style={styles.section}>
            <AuthorAutocomplete
              value={author}
              suggestions={authors}
              onChange={setAuthor}
            />
          </View>

          <View style={styles.section}>
            <ItemSelector
              items={languages}
              selectedValue={lang}
              onSelect={setLang}
              onCreate={handleCreateLanguage}
              label="Langue"
              getItemLabel={(l) => l.name}
              getItemKey={(l) => l.name}
              placeholder="Nouvelle langue"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Résumé</Text>
            <Input
              value={summary}
              onChangeText={setSummary}
              onBlur={() => setSummary(summary.trim())}
              placeholder="Copier/coller le résumé d'origine, ou écrire le vôtre !"
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
              multiline
              numberOfLines={5}
              style={{ minHeight: 100, textAlignVertical: "top" }}
              autoCapitalize="sentences"
            />
          </View>

          <View style={[styles.section, styles.numbersRow]}>
            <View style={styles.numberCol}>
              <Text style={styles.sectionLabel}>Nombre de chapitres</Text>
              <Input
                value={String(numberOfChapters)}
                onChangeText={(value) => setNumberOfChapters(value.replace(/[^0-9]/g, ""))}
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
            <LastChapterRead value={lastChapterRead} onChange={setLastChapterRead} />
          </View>

          <View style={styles.section}>
            <ChosenStatus sectionLabel="Statut de publication de la fanfiction" storyStatus={storyStatus} onPress={setStoryStatus}/>
          </View>

          <View style={styles.section}>
            <TagSelector
              availableTags={tags}
              selectedTags={selectedTags}
              onAdd={handleAddTag}
              onRemove={handleRemoveTag}
              onCreate={handleCreateTag}
              onInputFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              onInputChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
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
            <RoundedButton
              label={fictionId ? "Modifier la fanfiction" : "Créer la fanfiction"}
              onPress={fictionId ? updateFiction : createFiction}
            />
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
