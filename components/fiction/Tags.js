import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Tag from "./Tag";

const TAG_BUTTON_SIZE = 32;
const TAG_BUTTON_ICON_SIZE = 20;
const SPACING_SM = 4;
const TAG_HEIGHT = 27;
const TAG_MARGIN_BOTTOM = 14;
const VERTICAL_ALIGN_OFFSET = 2; // Remonte le bouton pour l'aligner avec les tags

export default function Tags({
  tags,
  withCross,
  navigation,
  allFictions,
  pressTag,
  onAddTagPress,
  theme: themeProp,
}) {
  const { currentTheme } = useTheme();
  const theme = themeProp || currentTheme;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        },
        addButton: {
          width: TAG_BUTTON_SIZE,
          height: TAG_BUTTON_SIZE,
          borderRadius: TAG_BUTTON_SIZE / 2,
          backgroundColor: theme.primaryPlus,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: TAG_MARGIN_BOTTOM,
          marginTop: -VERTICAL_ALIGN_OFFSET,
        },
      }),
    [theme]
  );

  const handleTagPress = (tag) => {
    if (pressTag) {
      return pressTag(tag);
    }

    if (navigation && allFictions) {
      const fictionsWithTag = allFictions.filter(
        (fiction) => fiction.tags && fiction.tags.some((t) => t._id === tag._id)
      );

      navigation.setParams({
        fictions: fictionsWithTag,
        searchType: "tag",
        searchTerm: tag.name,
      });
    }
  };

  return (
    <View style={styles.container}>
      {tags &&
        Array.isArray(tags) &&
        tags.map((tag, index) => (
          <Tag
            key={index}
            label={tag.name}
            colorIndex={tag.color}
            withCross={withCross}
            tag={tag}
            onPress={handleTagPress}
          />
        ))}

      {/* Bouton "+" pour ajouter des tags */}
      {onAddTagPress && (
        <TouchableOpacity onPress={onAddTagPress} style={styles.addButton}>
          <Ionicons name="add" size={TAG_BUTTON_ICON_SIZE} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
