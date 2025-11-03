import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import FictionCard from "./FictionCard";

export default function FandomCard({
  fandomName,
  fictions,
  navigation,
  allFictions,
}) {
  const { currentTheme } = useTheme();

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(
    () =>
      StyleSheet.create({
        fandomCard: {
          paddingBottom: 10,
        },
        fandomTitleContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderStyle: "dashed",
          borderColor: currentTheme.segmentation,
        },
        fandomTitle: {
          ...typography.h2,
          color: currentTheme.text,
          marginBottom: 10,
        },
        iconsContainer: {
          flexDirection: "row",
        },
        collapseIcon: {
          color: currentTheme.text,
          paddingLeft: 10,
        },
        sortIcon: {
          color: currentTheme.text,
          paddingLeft: 10,
        },
      }),
    [currentTheme] // Regenerate styles only when theme or variant changes
  );

  return (
    <View style={styles.fandomCard}>
      <View style={styles.fandomTitleContainer}>
        <Text style={styles.fandomTitle}>{fandomName}</Text>
        <View style={styles.iconsContainer}>
          <Ionicons
            name="chevron-collapse-sharp"
            size={24}
            style={styles.collapseIcon}
          />
          <MaterialIcons name="sort" size={24} style={styles.sortIcon} />
        </View>
      </View>
      <FlatList
        data={fictions} // données à afficher
        renderItem={(
          { item } // fonction pour chaque élément
        ) => (
          <FictionCard
            fiction={item}
            collapsingState={1}
            showReadingStatus={true}
            navigation={navigation}
            allFictions={allFictions || fictions}
          />
        )}
        keyExtractor={(fiction) => fiction._id} // clé unique (obligatoire)
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
    </View>
  );
}
