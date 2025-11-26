import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext.js";
import { typography } from "../styles/globalStyles";
import { updateNotationIcon, updateTheme } from "../reducers/user";
import Ionicons from "@expo/vector-icons/Ionicons";
import Rate from "./fiction/Rate.js";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Card de personnalisation pour ProfileScreen
 * Permet de choisir l'icône de notation et le thème de l'interface
 */
export default function PersonalizationCard() {
  const dispatch = useDispatch();
  const { currentTheme, themeName, setThemeName: setTheme } = useTheme();
  const user = useSelector((state) => state.user.value);

  // Icônes de notation disponibles
  const [selectedRatingIcon, setSelectedRatingIcon] = useState(
    user.notationIcon || "heart"
  );

  // Synchroniser l'icône sélectionnée avec le store Redux
  useEffect(() => {
    if (user.notationIcon && user.notationIcon !== selectedRatingIcon) {
      setSelectedRatingIcon(user.notationIcon);
    }
  }, [user.notationIcon]);

  const ratingIcons = [
    { id: "heart", name: "heart", label: "Cœur" },
    { id: "flame", name: "flame", label: "Flamme" },
    { id: "star", name: "star", label: "Étoile" },
    { id: "diamond", name: "diamond", label: "Diamant" },
  ];

  // Thèmes disponibles (watercolor/ashgreen)
  const themes = [
    {
      id: "watercolor",
      label: "Watercolor",
      preview: require("../assets/watercolor.png"),
    },
    {
      id: "ashgreen",
      label: "Ash Green",
      preview: require("../assets/ashgreen.png"),
    },
  ];

  const styles = StyleSheet.create({
    card: {
      backgroundColor: currentTheme.background,
      alignItems: 'center',
      borderRadius: 15,
      paddingHorizontal: 24,
      paddingVertical: 20,
      marginBottom: 30,
      borderWidth: 0,
    },

    // --- Icônes de notation ---
    ratingSection: {
      marginBottom: 24,
    },
    ratingSectionTitle: {
      ...typography.body,
      color: currentTheme.text,
      marginBottom: 14,
    },
    ratingIconsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 14,
      marginBottom: 14,
    },
    ratingIconContainer: {
    },
    ratingIconActive: {
    },
    ratingIconInactive: {
    },
    ratingPreviewContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
    },
    ratingPreviewText: {
      ...typography.body,
      color: currentTheme.secondaryText,
    },
    ratingPreview: {
      marginLeft: 7,
    },

    // --- Thèmes ---
    themeSection: {
      alignItems: 'center',
    },
    themeSubtitle: {
      ...typography.body,
      color: currentTheme.text,
      marginBottom: 20,
    },
    themesCol: {
      gap: 16,
    },
    themeContainer: {
    },
    themeActive: {
      borderColor: currentTheme.primary,
    },
    themePreview: {
      width: 294,
      height: 85,
    },
  });

  // Met à jour l'icône de notation (BDD + store)
  const handleRatingIconPress = async (iconId) => {
    setSelectedRatingIcon(iconId);

    try {
      const res = await fetch(`${API_URL}/user/notation-icon`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notationIcon: iconId }),
      });

      const data = await res.json();
      if (data.result) {
        dispatch(updateNotationIcon(iconId));
        console.log("Icône de notation mise à jour:", iconId);
      } else {
        Alert.alert("Erreur", data.error || "Mise à jour échouée");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'icône:", error);
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  // Change le thème (watercolor/ashgreen) en gardant le variant actuel (light/dark)
  const handleThemePress = async (themeId) => {
    if (themeId === themeName) return;

    try {
      const res = await fetch(`${API_URL}/user/theme`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: themeId }),
      });

      const data = await res.json();
      if (data.result) {
        // Mise à jour du store user
        dispatch(updateTheme(themeId));
        // Mise à jour du contexte thème
        setTheme(themeId);
        console.log("Thème changé:", themeId);
      } else {
        Alert.alert("Erreur", data.error || "Mise à jour échouée");
      }
    } catch (error) {
      console.error("Erreur lors du changement de thème:", error);
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  return (
    <View style={styles.card}>
      {/* Section Icônes de notation */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingSectionTitle}>
          Icône utilisée pour les notes
        </Text>
        <View style={styles.ratingIconsRow}>
          {ratingIcons.map((icon) => (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.ratingIconContainer,
                selectedRatingIcon === icon.id
                  ? styles.ratingIconActive
                  : styles.ratingIconInactive,
              ]}
              onPress={() => handleRatingIconPress(icon.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={icon.name}
                size={35}
                color={
                  selectedRatingIcon === icon.id
                    ? currentTheme.primaryPlus
                    : currentTheme.inactivePlus
                }
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.ratingPreviewContainer}>
          <Text style={styles.ratingPreviewText}>Aperçu</Text>
          <View style={styles.ratingPreview}>
            <Rate iconName={selectedRatingIcon} value={4} />
          </View>
        </View>
      </View>

      {/* Section Thèmes */}
      <View style={styles.themeSection}>
        <Text style={styles.themeSubtitle}>Thème</Text>
        <View style={styles.themesCol}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeContainer,
                themeName === theme.id && styles.themeActive,
              ]}
              onPress={() => handleThemePress(theme.id)}
            >
              <Image
                source={theme.preview}
                style={styles.themePreview}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
