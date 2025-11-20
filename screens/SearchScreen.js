import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import SearchByAuthor from "../components/search/SearchByAuthor";
import SearchBySummary from "../components/search/SearchBySummary";
import SearchByTag from "../components/search/SearchByTag";
import SearchByTitle from "../components/search/SearchByTitle";
import RoundedButton from "../components/ui/RoundedButton.js";
import { useTheme } from "../context/ThemeContext.js";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const Tab = createMaterialTopTabNavigator();

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

export default function SearchScreen({ navigation }) {
  const { currentTheme } = useTheme();
  const user = useSelector((state) => state.user.value);
  const [allFictions, setAllFictions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);

  // Fetch all fictions, tags, and authors on mount
  useEffect(() => {
    fetchAllData();
  }, [user.token]);

  const fetchAllData = async () => {
    try {
      // Check if user is authenticated
      if (!user || !user.token) {
        console.warn("User not authenticated");
        return;
      }

      // Fetch all fictions from all reading statuses
      const statuses = ["to-read", "reading", "finished"];
      let fictions = [];

      for (const status of statuses) {
        const url = `${API_URL}/fiction/status/${status}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.fandoms) {
            data.fandoms.forEach((fandom) => {
              if (fandom.fictions) {
                fictions = [...fictions, ...fandom.fictions];
              }
            });
          }
        }
      }

      setAllFictions(fictions);

      // Fetch tags directly from backend
      const tagsResponse = await fetch(`${API_URL}/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json();
        let tags =
          tagsData.tags && Array.isArray(tagsData.tags) ? tagsData.tags : [];

        // Transform tags to use 'count' instead of 'usageCount' for consistency
        if (tags && Array.isArray(tags)) {
          tags = tags.map((tag) => ({
            ...tag,
            count: tag.usageCount || tag.count || 0,
          }));
        } else {
          tags = [];
        }

        setAllTags(tags);
      } else {
        setAllTags([]);
      }

      // Extract authors from fictions
      const authorsSet = new Set();
      if (fictions && Array.isArray(fictions)) {
        fictions.forEach((fiction) => {
          if (fiction.author) {
            authorsSet.add(fiction.author);
          }
        });
      }

      // Sort authors alphabetically
      const authorsArray = Array.from(authorsSet);
      const sortedAuthors =
        authorsArray && Array.isArray(authorsArray) ? authorsArray.sort() : [];
      setAllAuthors(sortedAuthors);
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

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
          paddingBottom: 16,
        },
      }),
    [currentTheme]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top, bottom"]}>
      {/* Header */}
      <Header onProfilePress={() => navigation.navigate("Profile")} title="Rechercher par" />

      {/* Search Tabs */}
      <View style={styles.tabs}>
        <Tab.Navigator
          initialRouteName="Title"
          screenOptions={{
            swipeEnabled: true,
            lazy: true,
            tabBarIndicatorStyle: { height: 0 },
            tabBarStyle: { backgroundColor: "transparent", elevation: 0 },
          }}
          tabBar={(props) => <TopTabs {...props} />}
        >
          <Tab.Screen
            name="Title"
            options={{ title: "Titre" }}
            children={() => (
              <SearchByTitle fictions={allFictions} navigation={navigation} />
            )}
          />

          <Tab.Screen
            name="Tag"
            options={{ title: "Tag" }}
            children={() => (
              <SearchByTag
                allTags={allTags}
                fictions={allFictions}
                navigation={navigation}
              />
            )}
          />

          <Tab.Screen
            name="Author"
            options={{ title: "Auteur" }}
            children={() => (
              <SearchByAuthor
                allAuthors={allAuthors}
                fictions={allFictions}
                navigation={navigation}
              />
            )}
          />

          <Tab.Screen
            name="Summary"
            options={{ title: "Résumé/notes" }}
            children={() => (
              <SearchBySummary fictions={allFictions} navigation={navigation} />
            )}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}
