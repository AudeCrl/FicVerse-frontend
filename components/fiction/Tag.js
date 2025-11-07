import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function Tag({ label, colorIndex, withCross, onPress, tag }) {
  const { currentTheme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(tag);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 27,
          paddingHorizontal: 6,
          marginRight: 14,
          marginBottom: 14,
          backgroundColor: currentTheme.tagPalette[colorIndex - 1] || currentTheme.tagPalette[0],
          alignSelf: "flex-start", // empêche de prendre toute la largeur dans un conteneur en colonne
        }}
      >
        <Text style={{ ...typography.body, color: currentTheme.text }}>
          {label || ""}
        </Text>
        {withCross === true && (
          <Ionicons
            name="close-sharp"
            size={23}
            style={{
              color: currentTheme.text,
              paddingLeft: 6,
            }}
          />
        )}
      </View>
    </Pressable>
  );
}
