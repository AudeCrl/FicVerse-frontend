import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FictionCard from "../components/fiction/FictionCard";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../styles/globalStyles";

export default function SearchResultsScreen({ route, navigation }) {
  const { currentTheme } = useTheme();
  const {
    fictions = [],
    searchType = "",
    searchTerm = "",
  } = route.params || {};

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: currentTheme.background,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.text,
          opacity: 1,
        },
        backButton: {
          marginRight: 12,
        },
        headerContent: {
          flex: 1,
        },
        headerTitle: {
          ...typography.body,
          color: currentTheme.text,
          fontWeight: "600",
        },
        headerSubtitle: {
          ...typography.caption,
          color: currentTheme.text,
          opacity: 0.7,
          marginTop: 4,
        },
        clearButton: {
          padding: 8,
        },
        contentContainer: {
          paddingHorizontal: 14,
          paddingTop: 10,
        },
        resultCount: {
          ...typography.caption,
          color: currentTheme.text,
          opacity: 0.7,
          marginBottom: 12,
        },
        noResults: {
          textAlign: "center",
          marginTop: 40,
          ...typography.body,
          color: currentTheme.text,
          opacity: 0.5,
        },
        fictionItem: {
          marginBottom: 16,
        },
      }),
    [currentTheme]
  );

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "title":
        return "Résultats pour le titre";
      case "tag":
        return "Résultats pour le tag";
      case "author":
        return "Résultats pour l'auteur";
      case "summary":
        return "Résultats pour résumé/notes";
      default:
        return "Résultats de recherche";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{getSearchTypeLabel()}</Text>
          <Text style={styles.headerSubtitle}>{searchTerm}</Text>
        </View>
        <Pressable
          style={styles.clearButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={currentTheme.text} />
        </Pressable>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultCount}>
          {fictions.length} résultat{fictions.length > 1 ? "s" : ""}
        </Text>

        {fictions.length > 0 ? (
          fictions.map((fiction) => (
            <View key={fiction._id} style={styles.fictionItem}>
              <FictionCard fiction={fiction} />
            </View>
          ))
        ) : (
          <Text style={styles.noResults}>Aucun résultat trouvé</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
