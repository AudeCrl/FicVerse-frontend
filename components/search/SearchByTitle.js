import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";
import Input from "../ui/Input";

export default function SearchByTitle({ fictions, navigation }) {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort fictions by title
  const filteredFictions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    try {
      const regex = new RegExp(searchTerm, "i"); // case-insensitive
      return fictions
        .filter((fiction) => regex.test(fiction.title))
        .sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error("Invalid regex:", error);
      return [];
    }
  }, [searchTerm, fictions]);

  const getReadingStatusLabel = (status) => {
    const statusMap = {
      "to-read": "À lire",
      reading: "En cours à lire",
      finished: "Terminé",
    };
    return statusMap[status] || status;
  };

  const handleSelectFiction = (fiction) => {
    // Navigate to ResultsScreen with filtered fictions
    navigation.navigate("SearchResults", {
      fictions: [fiction],
      searchType: "title",
      searchTerm: fiction.title,
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 10,
        },
        resultItem: {
          backgroundColor: currentTheme.cardBackground,
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
          borderLeftWidth: 4,
          borderLeftColor: currentTheme.primary,
        },
        resultTitle: {
          ...typography.body,
          color: currentTheme.text,
          fontWeight: "600",
          marginBottom: 4,
        },
        resultMeta: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        },
        metaText: {
          ...typography.caption,
          color: currentTheme.text,
          opacity: 0.7,
        },
        rateContainer: {
          backgroundColor: currentTheme.primary,
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 2,
        },
        rateText: {
          ...typography.caption,
          color: currentTheme.background,
          fontWeight: "600",
        },
        noResults: {
          textAlign: "center",
          marginTop: 40,
          ...typography.body,
          color: currentTheme.text,
          opacity: 0.5,
        },
      }),
    [currentTheme]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Input
        placeholder="Rechercher par titre"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {filteredFictions.length > 0 ? (
        filteredFictions.map((fiction) => (
          <Pressable
            key={fiction._id}
            onPress={() => handleSelectFiction(fiction)}
            style={styles.resultItem}
          >
            <Text style={styles.resultTitle}>{fiction.title}</Text>
            <View style={styles.resultMeta}>
              <Text style={styles.metaText}>
                {getReadingStatusLabel(fiction.readingStatus)}
              </Text>
            </View>
          </Pressable>
        ))
      ) : searchTerm.trim() ? (
        <Text style={styles.noResults}>Aucun résultat trouvé</Text>
      ) : (
        <Text style={styles.noResults}>Commencez à taper pour rechercher</Text>
      )}
    </ScrollView>
  );
}
