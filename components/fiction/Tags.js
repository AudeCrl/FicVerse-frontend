import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";
import Tag from "./Tag";

const TAG_HEIGHT = 27;
const TAG_MARGIN_BOTTOM = 14;
const TAG_MARGIN_RIGHT = 14;
const TAG_PADDING_HORIZONTAL = 6;

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
        // Styles pour le bouton "+" : copie exacte du style des tags
        addButton: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: TAG_HEIGHT,
          width: TAG_HEIGHT, // Carré (width = height)
          paddingHorizontal: TAG_PADDING_HORIZONTAL,
          marginRight: TAG_MARGIN_RIGHT,
          marginBottom: TAG_MARGIN_BOTTOM,
          backgroundColor: theme.tagPalette[0],
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

      {/* Bouton "+" pour ajouter des tags - styles identiques aux tags */}
      {onAddTagPress && (
        <Pressable
          onPress={onAddTagPress}
          style={({ pressed }) => [
            styles.addButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text
            style={{
              ...typography.body,
              color: theme.primary,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            +
          </Text>
        </Pressable>
      )}
    </View>
  );
}
