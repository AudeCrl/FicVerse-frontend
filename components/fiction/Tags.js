import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity, View } from "react-native";
import Tag from "./Tag";

export default function Tags({
  tags,
  withCross,
  navigation,
  allFictions,
  pressTag,
  onAddTagPress,
  theme,
}) {
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
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
      {withCross && onAddTagPress && (
        <TouchableOpacity
          onPress={onAddTagPress}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme?.primary || "#7C5CFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
