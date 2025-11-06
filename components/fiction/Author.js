import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";

/**
 * Composant Author
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Affiche le libellé "par" + nom d'auteur·ice sous forme d'étiquette cliquable.
 *
 * PROPS:
 * @param {string} author - Nom de l'auteur à afficher
 * @param {function} onPress - Callback au clic (ex: navigue par auteur)
 * @param {object} theme - (Optional) Objet de thème; utilise useTheme() si non fourni
 *
 * EXEMPLE:
 * <Author
 *   author="Jane_Blossom"
 *   onPress={() => handleAuthorPress("Jane_Blossom")}
 * />
 */
export default function Author({ author, onPress, theme: themeProp }) {
  const { currentTheme } = useTheme();
  const theme = themeProp || currentTheme;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        authorBy: {
          ...typography.small,
          color: theme.text,
          marginRight: 4,
        },
        authorChip: {
          backgroundColor: theme.tagPalette[3],
          height: 27,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 6,
          borderRadius: 2,
        },
        authorChipText: {
          ...typography.small,
          color: theme.text,
        },
      }),
    [theme]
  );

  if (!author) return null;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.authorBy}>par</Text>
      <View style={styles.authorChip}>
        <Text style={styles.authorChipText}>{author}</Text>
      </View>
    </Pressable>
  );
}
