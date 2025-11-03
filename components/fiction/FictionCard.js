import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import Tags from "./Tags";

export default function FictionCard({
  fiction,
  collapsingState,
  showReadingStatus,
  navigation,
  allFictions,
}) {
  const { currentTheme } = useTheme();

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(
    () =>
      StyleSheet.create({
        fictionCard: {
          ...typography.body,
          paddingTop: 10,
          borderBottomWidth: 1,
          borderStyle: "dashed",
          borderColor: currentTheme.segmentation,
        },
        readingStatus: {
          color: currentTheme.text,
        },
        titleContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        },
        title: {
          ...typography.h3,
          color: currentTheme.text,
        },
        moreIcon: {
          color: currentTheme.text,
        },
        authorRateContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        },
        authorContainer: {
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          borderRadius: 2,
        },
        authorBy: {
          color: currentTheme.text,
        },
        authorChip: {
          backgroundColor: currentTheme.tagPalette[3],
          height: 27,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 6,
        },
        authorChipText: {
          color: currentTheme.text,
        },
        rate: {
          height: 27,
          justifyContent: "center",
        },
        metadataContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        },
        metadataLeftCol: {
          alignItems: "flex-start",
        },
        metadataRightCol: {
          alignItems: "flex-end",
        },
        metadata: {
          color: currentTheme.secondaryText,
        },
        summary: {
          ...typography.body,
          color: currentTheme.text,
          marginBottom: 8,
        },
        personalNotes: {
          ...typography.bodyItalic,
          color: currentTheme.text,
          marginBottom: 8,
        },
        lastChapterRead: {
          ...typography.body,
          color: currentTheme.text,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        },
      }),
    [currentTheme] // Regenerate styles only when theme or variant changes
  );

  const readingStatusLabels = {
    "to-read": "A lire",
    reading: "En cours",
    finished: "Terminée",
  };

  const storyStatusLabels = {
    "in-progress": "En cours de publication",
    completed: "Publication terminée",
    "one-shot": "One-shot",
    abandoned: "Publication abandonée",
  };

  const handleNavigate = () => {
    fiction.link && Linking.openURL(fiction.link);
    console.log("LIEN =>", fiction.link);
  };

  const handleAuthorPress = () => {
    if (navigation && allFictions) {
      const fictionsByAuthor = allFictions.filter(
        (f) => f.author === fiction.author
      );

      navigation.navigate("SearchResults", {
        fictions: fictionsByAuthor,
        searchType: "author",
        searchTerm: fiction.author,
      });
    }
  };

  const metadata = !!(
    fiction.lang ||
    fiction.storyStatus ||
    fiction.numberOfChapters ||
    fiction.numberOfWords
  ) ? (
    <View style={styles.metadataContainer}>
      <View style={styles.metadataLeftCol}>
        {!!fiction.lang && <Text style={styles.metadata}>{fiction.lang}</Text>}
        {!!fiction.storyStatus && (
          <Text style={styles.metadata}>
            {storyStatusLabels[fiction.storyStatus]}
          </Text>
        )}
      </View>
      <View style={styles.metadataRightCol}>
        {fiction.numberOfChapters > 0 && (
          <Text style={styles.metadata}>
            {fiction.numberOfChapters} chapitres
          </Text>
        )}
        {fiction.numberOfWords > 0 && (
          <Text style={styles.metadata}>{fiction.numberOfWords} mots</Text>
        )}
      </View>
    </View>
  ) : null;
  console.log("TAGS", fiction.title, "=>", fiction.tags);
  return (
    <View style={styles.fictionCard}>
      {showReadingStatus && (
        <Text style={styles.readingStatus}>
          {readingStatusLabels[fiction.readingStatus]}
        </Text>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title} onPress={handleNavigate}>
          {fiction.title}
        </Text>
        <MaterialIcons name="more-horiz" size={24} style={styles.moreIcon} />
      </View>
      {(!!fiction.author || !!fiction.rate?.display) && (
        <View style={styles.authorRateContainer}>
          {!!fiction.author && (
            <Pressable
              style={styles.authorContainer}
              onPress={handleAuthorPress}
            >
              <Text style={styles.authorBy}>par </Text>
              <View style={styles.authorChip}>
                <Text style={styles.authorChipText}>{fiction.author}</Text>
              </View>
            </Pressable>
          )}
          {!!fiction.rate?.display && (
            <View style={styles.rate}>
              <Ionicons name="heart" size={24} color="black" />
            </View>
          )}
        </View>
      )}
      {metadata}
      {!!fiction.summary && (
        <Text style={styles.summary}>{fiction.summary}</Text>
      )}
      {!!fiction.personalNotes && (
        <Text style={styles.personalNotes}>{fiction.personalNotes}</Text>
      )}
      {!!fiction.lastChapterRead && (
        <Text style={styles.lastChapterRead}>
          Dernier chapitre lu : {fiction.lastChapterRead}
        </Text>
      )}
      {fiction.tags.length > 0 && (
        <Tags
          tags={fiction.tags}
          withCross={false}
          navigation={navigation}
          allFictions={allFictions}
        />
      )}
    </View>
  );
}
