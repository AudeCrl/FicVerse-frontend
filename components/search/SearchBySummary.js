import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";
import Author from "../fiction/Author";
import Rate from "../fiction/Rate";
import Input from "../ui/Input";

// Composant pour afficher le texte avec le regex surlighté
function HighlightedText({ text, searchTerm, highlightColor, textColor }) {
  if (!text || !searchTerm)
    return <Text style={{ color: textColor }}>{text}</Text>;

  try {
    // Create a regex pattern that matches the search term (case-insensitive)
    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <Text style={{ color: textColor }}>
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
    return <Text style={{ color: textColor }}>{text}</Text>;
  }
}

export default function SearchBySummary({ fictions, navigation }) {
  const { currentTheme } = useTheme();
  const user = useSelector((state) => state.user.value);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimer = useRef(null);

  // Debounce search term (300ms)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  // Filter fictions by summary or personalNotes
  const filteredFictions = useMemo(() => {
    const fictionsArray = fictions && Array.isArray(fictions) ? fictions : [];

    if (!debouncedSearchTerm.trim() || !fictionsArray.length) return [];

    try {
      const regex = new RegExp(debouncedSearchTerm, "i");
      const filtered = fictionsArray.filter((fiction) => {
        const summary = fiction.summary || "";
        const notes = fiction.personalNotes || "";
        return regex.test(summary) || regex.test(notes);
      });

      return filtered && Array.isArray(filtered)
        ? filtered.sort((a, b) => a.title.localeCompare(b.title))
        : [];
    } catch (error) {
      console.error("Invalid regex:", error);
      return [];
    }
  }, [debouncedSearchTerm, fictions]);

  const handleSelectFiction = (fiction) => {
    // Get all fictions that have this summary or notes content
    const fictionsWithMatch = filteredFictions;

    navigation.navigate("Home", {
      screen: "HomeMain",
      params: {
        fictions: fictionsWithMatch,
        searchType: "summary",
        searchTerm: searchTerm,
      },
    });
  };

  const handleSelectAuthor = (author, fictions) => {
    // Get all fictions by this author
    const fictionsArray = fictions && Array.isArray(fictions) ? fictions : [];
    const fictionsByAuthor = fictionsArray.filter(
      (fiction) => fiction.author === author
    );

    navigation.navigate("Home", {
      screen: "HomeMain",
      params: {
        fictions: fictionsByAuthor,
        searchType: "author",
        searchTerm: author,
      },
    });
  };

  const getReadingStatusLabel = (status) => {
    const statusMap = {
      "to-read": "À lire",
      reading: "En cours",
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
          opacity: 0.95,
          fontSize: 14,
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
        placeholder="Mot-clé dans le résumé ou les notes"
        value={searchTerm}
        onChangeText={setSearchTerm}
        useThemeColors={true}
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
              <View style={{ marginTop: 8, marginBottom: 8 }}>
                <Author
                  author={fiction.author}
                  onPress={() =>
                    handleSelectAuthor(fiction.author, filteredFictions)
                  }
                  theme={currentTheme}
                />
              </View>
            )}

            {/* Display summary */}
            {fiction.summary && (
              <View style={{ marginTop: 8 }}>
                {debouncedSearchTerm &&
                new RegExp(debouncedSearchTerm, "i").test(fiction.summary) ? (
                  <HighlightedText
                    text={fiction.summary}
                    searchTerm={debouncedSearchTerm}
                    highlightColor={currentTheme.selectedText}
                    textColor={currentTheme.text}
                  />
                ) : (
                  <Text style={{ color: currentTheme.text }}>
                    {fiction.summary}
                  </Text>
                )}
              </View>
            )}

            {/* Display personal notes */}
            {fiction.personalNotes && (
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    color: currentTheme.text,
                    fontStyle: "italic",
                    ...typography.small,
                  }}
                >
                  Notes:{" "}
                  {debouncedSearchTerm &&
                  new RegExp(debouncedSearchTerm, "i").test(
                    fiction.personalNotes
                  ) ? (
                    <HighlightedText
                      text={fiction.personalNotes}
                      searchTerm={debouncedSearchTerm}
                      highlightColor={currentTheme.selectedText}
                      textColor={currentTheme.text}
                    />
                  ) : (
                    fiction.personalNotes
                  )}
                </Text>
              </View>
            )}

            {/* Display personal rating (hearts) */}
            {!!fiction.rate?.display && (
              <View style={{ marginTop: 8 }}>
                <Rate
                  iconName={user.notationIcon}
                  value={fiction?.rate?.value ?? 0}
                />
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
