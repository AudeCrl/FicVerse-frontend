import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";
import Input from "../ui/Input";

export default function SearchByAuthor({ allAuthors, fictions, navigation }) {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Get top 10 authors or filtered authors sorted alphabetically
  const displayedAuthors = useMemo(() => {
    if (!searchTerm.trim()) {
      return allAuthors.slice(0, 10);
    }

    try {
      const regex = new RegExp(searchTerm, "i");
      return allAuthors
        .filter((author) => regex.test(author))
        .sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error("Invalid regex:", error);
      return [];
    }
  }, [allAuthors, searchTerm]);

  const handleSelectAuthor = (author) => {
    // Get all fictions by this author
    const fictionsByAuthor = fictions.filter(
      (fiction) => fiction.author === author
    );

    navigation.navigate("SearchResults", {
      fictions: fictionsByAuthor,
      searchType: "author",
      searchTerm: author,
    });
  };

  const getReadingStatusLabel = (status) => {
    const statusMap = {
      "to-read": "À lire",
      reading: "En cours à lire",
      finished: "Terminé",
    };
    return statusMap[status] || status;
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 10,
        },
        authorItem: {
          backgroundColor: currentTheme.cardBackground,
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
          borderLeftWidth: 4,
          borderLeftColor: currentTheme.primary,
        },
        authorText: {
          ...typography.body,
          color: currentTheme.text,
          fontWeight: "600",
        },
        noResults: {
          textAlign: "center",
          marginTop: 40,
          ...typography.body,
          color: currentTheme.text,
          opacity: 0.5,
        },
        header: {
          ...typography.body,
          color: currentTheme.text,
          marginBottom: 12,
          fontWeight: "600",
        },
      }),
    [currentTheme]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>
        {searchTerm.trim() ? "Résultats de recherche" : "Top 10 auteurs"}
      </Text>

      <Input
        placeholder="Rechercher par auteur"
        value={searchTerm}
        onChangeText={setSearchTerm}
        useThemeColors={true}
      />

      {displayedAuthors.length > 0 ? (
        displayedAuthors.map((author) => (
          <Pressable
            key={author}
            onPress={() => handleSelectAuthor(author)}
            style={styles.authorItem}
          >
            <Text style={styles.authorText}>{author}</Text>
          </Pressable>
        ))
      ) : searchTerm.trim() ? (
        <Text style={styles.noResults}>Aucun auteur trouvé</Text>
      ) : (
        <Text style={styles.noResults}>Aucun auteur disponible</Text>
      )}
    </ScrollView>
  );
}
