import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";
import Tag from "../fiction/Tag";
import Input from "../ui/Input";
import RoundedButton from "../ui/RoundedButton";

export default function SearchByTag({ allTags, fictions, navigation }) {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  // Get top 10 tags or all tags based on showAllTags
  const displayedTags = useMemo(() => {
    const tagsArray = allTags && Array.isArray(allTags) ? allTags : [];
    const tags = showAllTags ? tagsArray : tagsArray.slice(0, 10);

    if (!searchTerm.trim()) return tags;

    try {
      const regex = new RegExp(searchTerm, "i");
      return tags.filter((tag) => regex.test(tag.name));
    } catch (error) {
      console.error("Invalid regex:", error);
      return tags;
    }
  }, [allTags, searchTerm, showAllTags]);

  const handleSelectTag = (tag) => {
    // Get all fictions with this tag
    const fictionsArray = fictions && Array.isArray(fictions) ? fictions : [];
    const fictionsWithTag = fictionsArray.filter(
      (fiction) => fiction.tags && fiction.tags.some((t) => t._id === tag._id)
    );

    navigation.navigate("Home", {
      screen: "HomeMain",
      params: {
        fictions: fictionsWithTag,
        searchType: "tag",
        searchTerm: tag.name,
      },
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
        tagsContainer: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: 16,
        },
        toggleButton: {
          marginTop: 10,
          marginBottom: 16,
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
        {showAllTags ? "Tous les tags" : "Top 10 tags"}
      </Text>
      <View style={{ marginBottom: 12 }}>
        <Input
          placeholder="Rechercher par tag"
          value={searchTerm}
          onChangeText={setSearchTerm}
          useThemeColors={true}
        />
      </View>
      {displayedTags.length > 0 ? (
        <View style={styles.tagsContainer}>
          {displayedTags.map((tag, index) => (
            <Tag
              key={tag._id}
              label={tag.name}
              colorIndex={tag.color || (index % 9) + 1}
              tag={tag}
              onPress={handleSelectTag}
            />
          ))}
        </View>
      ) : searchTerm.trim() ? (
        <Text style={styles.noResults}>Aucun tag trouvé</Text>
      ) : null}

      {!showAllTags && allTags && allTags.length > 10 && (
        <RoundedButton
          label="Afficher tous les tags"
          active={false}
          onPress={() => setShowAllTags(true)}
          style={styles.toggleButton}
        />
      )}
      {showAllTags && allTags && allTags.length > 10 && (
        <RoundedButton
          label="Masquer les autres tags"
          active={false}
          onPress={() => setShowAllTags(false)}
          style={styles.toggleButton}
        />
      )}
    </ScrollView>
  );
}
