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

const API_IP = process.env.EXPO_PUBLIC_API_URL;
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
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all fictions from all reading statuses
      const statuses = ["to-read", "reading", "finished"];
      let fictions = [];

      for (const status of statuses) {
        const url = `${API_IP}/fiction/${status}`;
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

      // Extract unique tags and authors
      const tagsMap = {};
      const authorsSet = new Set();

      fictions.forEach((fiction) => {
        if (fiction.author) {
          authorsSet.add(fiction.author);
        }
        if (fiction.tags && Array.isArray(fiction.tags)) {
          fiction.tags.forEach((tag) => {
            if (!tagsMap[tag._id]) {
              tagsMap[tag._id] = {
                ...tag,
                usageCount: tag.usageCount || 0,
              };
            }
          });
        }
      });

      // Sort tags by usage count descending
      const sortedTags = Object.values(tagsMap).sort(
        (a, b) => b.usageCount - a.usageCount
      );
      setAllTags(sortedTags);

      // Sort authors alphabetically
      const sortedAuthors = Array.from(authorsSet).sort();
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
          paddingVertical: 10,
        },
        searchHeader: {
          paddingHorizontal: 16,
          paddingBottom: 16,
        },
      }),
    [currentTheme]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header onProfilePress={() => navigation.navigate("Profile")} />

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
