import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * SettingsCard - Composant réutilisable pour afficher une carte de paramètre
 *
 * @param {Object} props
 * @param {string} props.title - Titre de la carte
 * @param {number} [props.count] - Nombre d'éléments (optionnel, affiche un badge)
 * @param {string[]} [props.chips] - Tableau de chips à afficher (max 3)
 * @param {Function} props.onPress - Callback au appui
 * @param {string} [props.testID] - ID pour testing
 * @param {string} [props.icon] - Nom de l'icône MaterialCommunityIcons
 * @param {boolean} [props.isEmpty] - Force l'état "vide"
 * @param {string} [props.emptyText] - Texte personnalisé quand vide (défaut: "Aucun élément")
 */
export default function SettingsCard({
  title,
  count,
  chips = [],
  onPress,
  testID = "settings-card",
  icon = "chevron-right",
  isEmpty = false,
  emptyText = "Aucun élément",
}) {
  const [isPressed, setIsPressed] = useState(false);

  // Debounce la pression pour éviter les doubles clics
  const debouncedPress = useCallback(() => {
    if (!isPressed) {
      setIsPressed(true);
      onPress?.();
      setTimeout(() => setIsPressed(false), 300);
    }
  }, [isPressed, onPress]);

  // Utilitaire pour formater les chips
  const chipsPreview = chips.slice(0, 3);
  const hasChips = chipsPreview.length > 0;
  const shouldShowEmpty = isEmpty || (count === 0 && !hasChips);

  return (
    <Pressable
      onPress={debouncedPress}
      android_ripple={{ color: "rgba(156, 39, 176, 0.1)" }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count ? count + " éléments" : ""}`}
      testID={testID}
      style={({ pressed }) => [
        styles.card,
        pressed && Platform.OS === "ios" && styles.cardPressed,
      ]}
    >
      {/* Contenu principal */}
      <View style={styles.cardContent}>
        {/* Titre et compteur */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {typeof count === "number" && count > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          )}
        </View>

        {/* Chips ou message vide */}
        {shouldShowEmpty ? (
          <Text style={styles.emptyText}>{emptyText}</Text>
        ) : (
          <View style={styles.chipsContainer}>
            {chipsPreview.map((chip, index) => (
              <View key={`${chip}-${index}`} style={styles.chip}>
                <Text style={styles.chipText} numberOfLines={1}>
                  {chip}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Icône chevron */}
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color="#9C27B0"
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    minHeight: 60,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    // Android Elevation (remplace shadow)
    elevation: 2,
  },

  cardPressed: {
    backgroundColor: "#f9f9f9",
    opacity: 0.9,
  },

  cardContent: {
    flex: 1,
    paddingRight: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },

  countBadge: {
    backgroundColor: "#9C27B0",
    borderRadius: 12,
    minWidth: 28,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  countText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 2,
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },

  chip: {
    backgroundColor: "#F0E7F8",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: "#E9D5FF",
  },

  chipText: {
    fontSize: 12,
    color: "#7C3AED",
    fontWeight: "500",
    maxWidth: 100,
  },

  chevron: {
    marginLeft: 8,
  },
});
