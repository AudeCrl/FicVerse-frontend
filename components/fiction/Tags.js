import { View } from "react-native";
import Tag from "./Tag";

export default function Tags({ tags, withCross, navigation, allFictions }) {
  const handleTagPress = (tag) => {
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
        alignItems: "top",
        flexWrap: "wrap",
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
    </View>
  );
}
