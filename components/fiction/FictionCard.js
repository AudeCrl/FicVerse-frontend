import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import AddTagModal from "./AddTagModal";
import Author from "./Author";
import { FictionActionsModal } from "./FictionActionsModal";
import Rate from "./Rate.js";
import Tags from "./Tags";

export default function FictionCard({
  fiction,
  collapsingState,
  showReadingStatus,
  navigation,
  allFictions,
}) {
  const { currentTheme } = useTheme();
  const [isFictionActionsModalVisible, setIsFictionActionsModalVisible] =
    useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [fictionData, setFictionData] = useState(fiction);
  const user = useSelector((state) => state.user.value);
  // console.log('user =>', user);

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
          alignItems: "flex-start",
          marginBottom: 8,
        },
        title: {
          ...typography.h3,
          color: currentTheme.text,
          flex: 1,
          flexShrink: 1,
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
        rateContainer: {
          flexDirection: "row",
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
          opacity: 0.9,
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
  };

  const handleAuthorPress = () => {
    if (navigation && allFictions) {
      const fictionsByAuthor = allFictions.filter(
        (f) => f.author === fiction.author
      );

      navigation.setParams({
        fictions: fictionsByAuthor,
        searchType: "author",
        searchTerm: fiction.author,
      });
    }
  };

  const metadata =
    fiction.lang ||
    fiction.storyStatus ||
    fiction.numberOfChapters ||
    fiction.numberOfWords ? (
      <View style={styles.metadataContainer}>
        <View style={styles.metadataLeftCol}>
          {!!fiction.lang && (
            <Text style={styles.metadata}>{fiction.lang}</Text>
          )}
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

  return (
    <View style={styles.fictionCard}>
      {/* --- ReadingStatus (only in "searchResults" mode) */}
      {showReadingStatus && (
        <Text style={styles.readingStatus}>
          {readingStatusLabels[fiction.readingStatus]}
        </Text>
      )}

      {/* --- Title (with link if it exists) + "..." Icon (More) */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} onPress={handleNavigate}>
          {fiction.title}
        </Text>
        <TouchableOpacity onPress={() => setIsFictionActionsModalVisible(true)}>
          <MaterialIcons name="more-horiz" size={24} style={styles.moreIcon} />
        </TouchableOpacity>
      </View>

      {/* --- Author + Rate */}
      {(!!fiction.author || !!fiction.rate?.display) && (
        <View style={styles.authorRateContainer}>
          {/* Author */}
          {!!fiction.author && (
            <Author
              author={fiction.author}
              onPress={handleAuthorPress}
              theme={currentTheme}
            />
          )}

          {/* Rate */}
          {!!fiction.rate?.display && (
            <Rate
              iconName={user.notationIcon}
              value={fiction?.rate?.value ?? 0}
            />
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
      {/* Tags section - Always show if component can add tags */}
      <View style={{ marginBottom: 8 }}>
        {fictionData.tags &&
        Array.isArray(fictionData.tags) &&
        fictionData.tags.length > 0 ? (
          <Tags
            tags={fictionData.tags}
            withCross={false}
            navigation={navigation}
            allFictions={allFictions}
            onAddTagPress={() => setShowAddTagModal(true)}
            theme={currentTheme}
          />
        ) : (
          /* Afficher le bouton "+" même s'il n'y a pas de tags */
          <Tags
            tags={[]}
            withCross={false}
            onAddTagPress={() => setShowAddTagModal(true)}
            theme={currentTheme}
          />
        )}
      </View>
      <FictionActionsModal
        isVisible={isFictionActionsModalVisible}
        onClose={() => setIsFictionActionsModalVisible(false)}
        fiction={fictionData}
        navigation={navigation}
      />
      <AddTagModal
        visible={showAddTagModal}
        onClose={() => setShowAddTagModal(false)}
        fictionId={fictionData._id}
        currentTags={fictionData.tags || []}
        onTagsAdded={(newTags) => {
          setFictionData({
            ...fictionData,
            tags: [...(fictionData.tags || []), ...newTags],
          });
          setShowAddTagModal(false);
        }}
      />
    </View>
  );
}
