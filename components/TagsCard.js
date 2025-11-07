import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext.js";
import { typography } from "../styles/globalStyles";
import Tags from "./fiction/Tags";

/**
 * TagsCard - Composant pour afficher les tags d'un utilisateur ou d'une fiction
 *
 * Affiche:
 * - Liste des tags avec composant Tags réutilisé
 * - Badge compteur (violet avec nombre)
 * - Bouton "+" intégré dans Tags.js pour ajouter des tags
 * - Chevron ">" pour naviguer vers la page complète (optionnel)
 *
 * @param {Object} props
 * @param {string} props.title - Titre de la carte (ex: "Mes tags")
 * @param {Array} props.tags - Tableau des tags [{_id, name, color}, ...]
 * @param {Function} props.onAddTagPress - Callback pour ouvrir la modal d'ajout
 * @param {Function} [props.onPress] - Callback pour naviguer (ex: vers TagsManager)
 * @param {string} [props.emptyText] - Texte quand aucun tag
 */
export default function TagsCard({
  title = "Tags",
  tags = [],
  onAddTagPress,
  onPress,
  emptyText = "Aucun tag",
}) {
  const [isPressed, setIsPressed] = useState(false);
  const { currentTheme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: currentTheme.background,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: currentTheme.segmentation,
          paddingHorizontal: 16,
          paddingVertical: 14,
          marginVertical: 8,
          minHeight: 60,
          // iOS Shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          // Android Elevation
          elevation: 2,
        },

        cardPressed: {
          backgroundColor: "#f9f9f9",
          opacity: 0.9,
        },

        cardContent: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        },

        leftContent: {
          flex: 1,
          paddingRight: 12,
        },

        titleRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        },

        title: {
          ...typography.h4,
          color: currentTheme.text,
          flex: 1,
        },

        countBadge: {
          backgroundColor: currentTheme.primary,
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

        tagsContainer: {
          marginBottom: 0,
        },

        emptyText: {
          fontSize: 13,
          color: currentTheme.secondaryText,
          fontStyle: "italic",
          marginTop: 4,
        },

        chevron: {
          marginLeft: 8,
          justifyContent: "center",
        },
      }),
    [currentTheme]
  );

  // Debounce la pression pour éviter les doubles clics
  const debouncedPress = useCallback(() => {
    if (!isPressed && onPress) {
      setIsPressed(true);
      onPress();
      setTimeout(() => setIsPressed(false), 300);
    }
  }, [isPressed, onPress]);

  return (
    <Pressable
      onPress={debouncedPress}
      android_ripple={{ color: "rgba(156, 39, 176, 0.1)" }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${tags.length} éléments`}
      style={({ pressed }) => [
        styles.card,
        pressed && Platform.OS === "ios" && styles.cardPressed,
      ]}
    >
      <View style={styles.cardContent}>
        {/* Contenu principal (titre + tags) */}
        <View style={styles.leftContent}>
          {/* Titre + Badge compteur */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {tags.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{tags.length}</Text>
              </View>
            )}
          </View>

          {/* Tags ou message vide */}
          {tags.length === 0 ? (
            <Text style={styles.emptyText}>{emptyText}</Text>
          ) : (
            <View style={styles.tagsContainer}>
              <Tags
                tags={tags}
                withCross={false}
                onAddTagPress={onAddTagPress}
                theme={currentTheme}
              />
            </View>
          )}
        </View>

        {/* Chevron navigation (optionnel) */}
        {onPress && (
          <View style={styles.chevron}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={currentTheme.primary}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}
