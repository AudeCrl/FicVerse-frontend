import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";
import Input from "../ui/Input";

// Composant pour afficher le texte avec le regex surlighté
function HighlightedText({ text, searchTerm, highlightColor }) {
  if (!text || !searchTerm) return <Text>{text}</Text>;

  try {
    // Create a regex pattern that matches the search term (case-insensitive)
    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <Text>
        {parts.map((part, index) => {
          // Even indices are non-matching parts, odd indices are matches
          if (index % 2 === 1) {
            return (
              <Text
                key={index}
                style={{ backgroundColor: highlightColor, fontWeight: "600" }}
              >
                {part}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  } catch (error) {
    console.error("Highlight error:", error);
    return <Text>{text}</Text>;
  }
}

export default function SearchBySummary({ fictions, navigation }) {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter fictions by summary or personalNotes
  const filteredFictions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    try {
      const regex = new RegExp(searchTerm, "i");
      return fictions
        .filter((fiction) => {
          const summary = fiction.summary || "";
          const notes = fiction.personalNotes || "";
          return regex.test(summary) || regex.test(notes);
        })
        .sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error("Invalid regex:", error);
      return [];
    }
  }, [searchTerm, fictions]);

  const handleSelectFiction = (fiction) => {
    // Get all fictions that have this summary or notes content
    const fictionsWithMatch = filteredFictions;

    navigation.navigate("SearchResults", {
      fictions: fictionsWithMatch,
      searchType: "summary",
      searchTerm: searchTerm,
    });
  };

  const handleSelectAuthor = (author, fictions) => {
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
          marginBottom: 8,
        },
        resultMeta: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
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
        excerpt: {
          ...typography.caption,
          color: currentTheme.text,
          lineHeight: 18,
        },
        highlightColor: {
          backgroundColor: "#FFC107",
        },
        noResults: {
          textAlign: "center",
          marginTop: 40,
          ...typography.body,
          color: currentTheme.text,
          opacity: 0.5,
        },
        authorText: {
          ...typography.caption,
          color: currentTheme.primary,
          fontWeight: "600",
        },
      }),
    [currentTheme]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Input
        placeholder="Rechercher dans résumé/notes"
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

            {/* Display author if available */}
            {fiction.author && (
              <Pressable
                onPress={() =>
                  handleSelectAuthor(fiction.author, filteredFictions)
                }
              >
                <Text style={styles.authorText}>par {fiction.author}</Text>
              </Pressable>
            )}

            {/* Display summary with highlight if it matches */}
            {fiction.summary &&
              searchTerm &&
              new RegExp(searchTerm, "i").test(fiction.summary) && (
                <View>
                  <HighlightedText
                    text={fiction.summary}
                    searchTerm={searchTerm}
                    highlightColor="#FFC107"
                  />
                </View>
              )}

            {/* Display personal notes with highlight if it matches */}
            {fiction.personalNotes &&
              searchTerm &&
              new RegExp(searchTerm, "i").test(fiction.personalNotes) && (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ ...styles.excerpt, fontStyle: "italic" }}>
                    Notes:{" "}
                    <HighlightedText
                      text={fiction.personalNotes}
                      searchTerm={searchTerm}
                      highlightColor="#FFC107"
                    />
                  </Text>
                </View>
              )}
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
