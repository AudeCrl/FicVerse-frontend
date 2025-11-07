import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"; // import of the module "material top tabs"
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FandomCard from "../components/fiction/FandomCard";
import ReadingList from "../components/fiction/ReadingList";
import Header from "../components/Header";
import RoundedButton from "../components/ui/RoundedButton";
import { useTheme } from "../context/ThemeContext.js";

/* 
Fonction TopTabs qui permet de customiser la barre incluant les 3 toptabs

state, descriptors et navigation sont les 3 props à mettre obligatoirement dans une barre d'onglets customisée (custom tabBar).
Ces trois props sont fournies automatiquement par React Navigation. 
*/

function TopTabs({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 8,
        justifyContent: "space-between",
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        return (
          <RoundedButton
            key={route.key}
            label={label}
            active={focused}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
}

/*
flexDirection: 'row',  ==>  on place les 3 buttons côte à côte
gap: 8,  ==> espace entre les boutons

{state.routes.map((route, index) => {       ==> On parcourt les 3 routes déclarées dans le Tab.Navigator, via le map. Pour chaque route, on crée dans le return un PillButton.
const focused = state.index === index;      ==> chaque route a un index. Lorsque le map aura un index égale à celui de la route, elle saura que cet onglet est l'onglet actif.
const { options } = descriptors[route.key]; ==> chaque route a un descriptior qui permet de récupérer les infos dans options. Ex plus bas : options={{ title: 'En cours' }} 
const label = options.title ?? route.name;  ==> On met le title qui était dans options (ex : "En cours"), sinon le nom de la route. Ex : name="Reading" 

<TopTab
  key={route.key}     ==> key pour dérouler le map
  label={label}       ==> texte du button : son title
  active={focused}    ==> si l'index de la route est égal à l'index du map alors focused = true, sinon focused = false. Et dans notre composant PillButton, si active = true alors c'est violet.
  onPress={() => navigation.navigate(route.name)}     ==> en appuyant dessus, ça nous amène sur la route Reading par exemple. Puis la route Reading fait appel au composant enfant "ReadingList". Ce composant enfant va passer en prop "reading" qui va fetch les fictions ayant ce status "reading".
/>


On a fait state.routes.map au lieu de faire directement routes.map car routes.map n'est pas accessible directement.
Il faut d'abord aller dans state puis dans route. State est comme ça :
{
  index: 0, // index de l’onglet actif
  key: 'TopTabs-xxxx',
  routeNames: ['Reading', 'ToRead', 'Finished'],
  routes: [ ... ] ===> tableau de toutes les routes
  
  Et routes n'est pas routes: ['Reading', 'ToRead', 'Finished']
  routes contient un tableau d'objets. Chaque route dedans est un objet contenant des infos comme key, name etc.
  Ex : 
  routes : [
    { key: 'Reading-123', name: 'Reading' },
    { key: 'ToRead-456', name: 'ToRead' },
    etc
    ]
*/

const Tab = createMaterialTopTabNavigator(); // import of the module "material top tabs"

export default function HomeScreen({ navigation, route }) {
  const { currentTheme } = useTheme();
  const [globalSort, setGlobalSort] = useState({
    sort: "lastReadAt",
    order: "desc",
  });
  const [searchResults, setSearchResults] = useState(null);
  const [originalSearchResults, setOriginalSearchResults] = useState(null);
  const [searchType, setSearchType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Update state when route params change
  useEffect(() => {
    const newFictions = route?.params?.fictions || null;
    setSearchResults(newFictions);
    // Only set original results if they haven't been set yet (first search)
    if (!originalSearchResults && newFictions) {
      setOriginalSearchResults(newFictions);
    }
    setSearchType(route?.params?.searchType || "");
    setSearchTerm(route?.params?.searchTerm || "");
  }, [
    route?.params?.fictions,
    route?.params?.searchType,
    route?.params?.searchTerm,
  ]);

  const handleGlobalSortChange = (newSortType, newSortOrder) => {
    setGlobalSort({ sort: newSortType, order: newSortOrder });
  };

  // ✅ Mettre à jour immuablement une fiction dans la liste
  const handleFictionUpdated = (updatedFiction) => {
    if (searchResults) {
      const updatedResults = searchResults.map((fiction) =>
        fiction._id === updatedFiction._id ? updatedFiction : fiction
      );
      setSearchResults(updatedResults);

      // Mettre à jour aussi originalSearchResults
      if (originalSearchResults) {
        const updatedOriginal = originalSearchResults.map((fiction) =>
          fiction._id === updatedFiction._id ? updatedFiction : fiction
        );
        setOriginalSearchResults(updatedOriginal);
      }
    }
  };

  const closeSearchResults = () => {
    setOriginalSearchResults(null);
    navigation.navigate("Home", { screen: "HomeMain", params: {} });
  };

  // Find tag color by name
  const getTagColor = (tagName) => {
    if (!originalSearchResults || searchType !== "tag") return 2; // default color index

    for (const fiction of originalSearchResults) {
      if (fiction.tags && Array.isArray(fiction.tags)) {
        const foundTag = fiction.tags.find((t) => t.name === tagName);
        if (foundTag) {
          return foundTag.color || 2;
        }
      }
    }
    return 2; // default fallback
  };

  // Group fictions by fandom for search results
  const groupedByFandom = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];

    const grouped = {};
    searchResults.forEach((fiction) => {
      const fandomId = fiction.fandomId || "other";
      const fandomName = fiction.fandomName || "Autres";

      if (!grouped[fandomId]) {
        grouped[fandomId] = {
          _id: fandomId,
          name: fandomName,
          fictions: [],
        };
      }
      grouped[fandomId].fictions.push(fiction);
    });
    return Object.values(grouped);
  }, [searchResults]);

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: currentTheme.background,
        },
        tabs: {
          flex: 1,
          paddingTop: 10,
        },
        searchHeader: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.primary,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: currentTheme.primary + "80",
        },
        searchHeaderContent: {
          flex: 1,
          marginRight: 12,
        },
        closeButton: {
          padding: 4,
        },
        searchTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: currentTheme.text,
          marginBottom: 4,
        },
        searchSubtitle: {
          fontSize: 14,
          color: currentTheme.text,
          opacity: 0.7,
        },
        resultCount: {
          fontSize: 12,
          color: currentTheme.text,
          opacity: 0.7,
          marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 12,
        },
        noResults: {
          textAlign: "center",
          marginTop: 40,
          fontSize: 16,
          color: currentTheme.text,
          opacity: 0.5,
        },
        fandomContainer: {
          marginHorizontal: 14,
          marginBottom: 16,
        },
      }),
    [currentTheme]
  );

  //   <Tab.Navigator
  //   initialRouteName="Reading" // tab "En cours" by default

  //   screenOptions={{          // screenOptions définit les options par défaut pour tous les onglets.
  //     swipeEnabled: true,     // Permet le swipe
  //     lazy: true,             //  seul l'onglet visible cad En cours est monté. Les autres onglets sont créés uniquement quand on les appelle
  //     tabBarIndicatorStyle: { height: 0 },   // Par défaut, il y a un trait bleu sous l'onglet actif. height: 0 permet de le disparaître
  //     tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },    // La barre des 3 tabs reste transparente grâce à background transparent. elevation:0 supprime l'ombre qui apparaît par défaut
  //   }}

  //   tabBar={(props) => <TopTabs {...props} />} // La barre qui inclut les 3 onglets. On la customise avec TopPills en haut.
  // >

  return (
    <SafeAreaView style={styles.container} edges={["top, bottom"]}>
      {/* Header */}
      <Header onProfilePress={() => navigation.navigate("Profile")} />

      {/* Display search results or normal tabs */}
      {searchResults ? (
        // Search Results View
        <ScrollView style={styles.tabs} showsVerticalScrollIndicator={false}>
          <View style={styles.searchHeader}>
            <View style={styles.searchHeaderContent}>
              <Text style={styles.searchTitle}>
                {searchType === "title"
                  ? "Résultats pour le titre"
                  : searchType === "tag"
                  ? "Résultats pour le tag"
                  : searchType === "author"
                  ? "Résultats pour l'auteur"
                  : searchType === "summary"
                  ? "Résultats pour résumé/notes"
                  : "Résultats de recherche"}
              </Text>
              {searchType === "author" ? (
                <View
                  style={{
                    backgroundColor: currentTheme.tagPalette[3],
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: "flex-start",
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: currentTheme.text, fontWeight: "500" }}>
                    {searchTerm}
                  </Text>
                </View>
              ) : searchType === "tag" ? (
                <View
                  style={{
                    backgroundColor:
                      currentTheme.tagPalette[getTagColor(searchTerm) - 1],
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: "flex-start",
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: currentTheme.text, fontWeight: "500" }}>
                    {searchTerm}
                  </Text>
                </View>
              ) : (
                <Text style={styles.searchSubtitle}>{searchTerm}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeSearchResults}
            >
              <MaterialIcons name="close" size={24} color={currentTheme.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.resultCount}>
            {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}
          </Text>

          {groupedByFandom.length > 0 ? (
            groupedByFandom.map((fandom) => (
              <View key={fandom._id} style={styles.fandomContainer}>
                <FandomCard
                  fandomName={fandom.name}
                  fictions={fandom.fictions}
                  navigation={navigation}
                  allFictions={originalSearchResults}
                  onGlobalSortChange={handleGlobalSortChange}
                  currentGlobalSort={globalSort}
                  onFictionUpdated={handleFictionUpdated}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noResults}>Aucun résultat trouvé</Text>
          )}
        </ScrollView>
      ) : (
        // Normal Tabs View
        <View style={styles.tabs}>
          <Tab.Navigator
            initialRouteName="Reading"
            screenOptions={{
              swipeEnabled: true,
              lazy: true,
              tabBarIndicatorStyle: { height: 0 },
              tabBarStyle: { backgroundColor: "transparent", elevation: 0 },
            }}
            tabBar={(props) => <TopTabs {...props} />}
          >
            <Tab.Screen
              name="Reading"
              options={{ title: "En cours" }}
              children={() => (
                <ReadingList readingStatus="reading" navigation={navigation} />
              )}
            />

            <Tab.Screen
              name="ToRead"
              options={{ title: "À lire" }}
              children={() => (
                <ReadingList readingStatus="to-read" navigation={navigation} />
              )}
            />

            <Tab.Screen
              name="Finished"
              options={{ title: "Terminées" }}
              children={() => (
                <ReadingList readingStatus="finished" navigation={navigation} />
              )}
            />
          </Tab.Navigator>
        </View>
      )}
    </SafeAreaView>
  );
}
