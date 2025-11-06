import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../styles/globalStyles";

const THEMES = [
  { id: "light", label: "Clair", icon: "white-balance-sunny" },
  { id: "dark", label: "Sombre", icon: "moon-waning-crescent" },
  { id: "auto", label: "Automatique", icon: "brightness-auto" },
];

export default function ThemeScreen({ navigation }) {
  const { variant, toggleVariant } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Thème de l'interface</Text>
        <Text style={styles.subtitle}>
          Choisissez votre préférence d'affichage
        </Text>

        <View style={styles.themeList}>
          {THEMES.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
                variant === theme.id && styles.themeCardActive,
              ]}
              onPress={() => {
                if (variant !== theme.id) {
                  toggleVariant();
                }
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={theme.icon}
                size={32}
                color={variant === theme.id ? "#9C27B0" : "#9CA3AF"}
              />
              <Text
                style={[
                  styles.themeLabel,
                  variant === theme.id && styles.themeLabelActive,
                ]}
              >
                {theme.label}
              </Text>
              {variant === theme.id && (
                <View style={styles.checkmark}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#9C27B0"
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fcfff8",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  title: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },

  themeList: {
    gap: 12,
  },

  themeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  themeCardActive: {
    borderColor: "#9C27B0",
    backgroundColor: "#f9f5fe",
  },

  themeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginLeft: 12,
    flex: 1,
  },

  themeLabelActive: {
    color: "#9C27B0",
  },

  checkmark: {
    marginLeft: 12,
  },
});
