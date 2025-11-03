import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function Tag({ label, colorIndex, withCross }) {
  const { currentTheme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 27,
        paddingHorizontal: 6,
        marginRight: 14,
        marginBottom: 14,
        backgroundColor:
          currentTheme.tagPalette[colorIndex - 1] || currentTheme.tagPalette[0],
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
  );
}
