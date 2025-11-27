import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import ChosenStatus from "../manageFiction/ChosenStatus.js";
import LastChapterRead from "../manageFiction/LastChapterRead";
import Rate from "./Rate.js";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const FictionActionsModal = ({
  isVisible,
  onClose,
  fiction,
  navigation,
  onFictionUpdated,
}) => {
  const { currentTheme } = useTheme();
  const user = useSelector((state) => state.user.value);

  const [selectedReadingStatus, setSelectedReadingStatus] = useState(
    fiction?.readingStatus ?? null
  );
  const [lastChapterRead, setLastChapterRead] = useState(
    fiction?.lastChapterRead ?? 0
  );
  const [rateValue, setRateValue] = useState(fiction?.rate?.value ?? 0);
  const [displayRate, setDisplayRate] = useState(
    fiction?.rate?.display ?? false
  );

  // Display of a "tick" icon to confirm when saved
  const [readingSaved, setReadingSaved] = useState(false);
  const [chapterSaved, setChapterSaved] = useState(false);
  const [rateSaved, setRateSaved] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const changeReadingStatus = (newStatus) => {
    setSelectedReadingStatus(newStatus);
    updateFiction({ readingStatus: newStatus });
  };
  const changeLastChapterRead = (newChapter) => {
    setLastChapterRead(newChapter);
    updateFiction({ lastChapterRead: newChapter });
  };
  const changeRateValue = (newRateValue) => {
    setRateValue(newRateValue);
    updateFiction({ rate: { value: newRateValue } });
  };
  const handleToggleHide = () => {
    const newDisplayValue = !displayRate;
    setDisplayRate(newDisplayValue);
    updateFiction({ rate: { display: newDisplayValue } });
  };

  // Fast update of a fiction (readingStatus, lastChapterRead or rate)
  const updateFiction = async (fieldToUpdate = {}) => {
    try {
      const res = await fetch(`${API_URL}/fiction/${fiction._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldToUpdate),
      });

      const data = await res.json();
      if (data.result) {
        const updatedField = Object.keys(fieldToUpdate)[0];
        console.log("Fiction mise à jour !", updatedField);

        //Remonter l'update au parent de manière immuable
        if (onFictionUpdated) {
          const updatedFiction = {
            ...fiction,
            ...fieldToUpdate,
            // Merge profond pour l'objet rate afin de ne pas perdre les propriétés
            ...(fieldToUpdate.rate && {
              rate: {
                ...fiction.rate,
                ...fieldToUpdate.rate,
              },
            }),
          };
          onFictionUpdated(updatedFiction);
        }

        switch (updatedField) {
          case "readingStatus":
            setReadingSaved(true);
            setTimeout(() => setReadingSaved(false), 1500);
            break;
          case "lastChapterRead":
            setChapterSaved(true);
            setTimeout(() => setChapterSaved(false), 1500);
            break;
          case "rate":
            setRateSaved(true);
            setTimeout(() => setRateSaved(false), 1500);
            break;
          default:
            console.log("updatedField not recognised", updatedField);
        }
      } else {
        Alert.alert("Erreur", data.error || "Mise à jour échouée");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  // Delete a fiction
  const handleDeleteFiction = async () => {
    try {
      const res = await fetch(`${API_URL}/fiction/${fiction._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (data.result) {
        setConfirmDeleteVisible(false);
        onClose();
        navigation.navigate("Home");
      } else {
        Alert.alert("Erreur", data.error || "Suppression impossible");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
        modalContainer: {
          width: "100%",
          backgroundColor: currentTheme.background,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          paddingTop: 10,
          elevation: 10,
        },
        header: {
          paddingHorizontal: 15,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.inputBorder,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        modalTitle: {
          ...typography.h3,
          color: currentTheme.text,
          flex: 1,
          flexShrink: 1,
        },
        mainContent: {
          paddingVertical: 10,
          paddingHorizontal: 15,
          overflow: "hidden",
        },
        quickEditContainer: {
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.inputBorder,
          marginBottom: 10,
        },
        // --- ACTIONS (Lignes) ---
        actionRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 14,
        },
        savedIcon: {
          margin: 0,
          padding: 0,
        },
        actionText: {
          ...typography.body,
          color: currentTheme.text,
          marginLeft: 8,
        },
        editIcon: {
          color: currentTheme.text,
        },
        // --- DELETE CONFIRMATION MODAL ---
        deleteModalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 300,
        },
        deleteModalContainer: {
          width: "80%",
          backgroundColor: currentTheme.background,
          padding: 20,
          borderRadius: 10,
          alignItems: "center",
        },
        deleteModalTitle: {
          ...typography.h3,
          color: currentTheme.text,
          marginBottom: 10,
        },
        deleteModalText: {
          ...typography.body,
          color: currentTheme.secondaryText,
          textAlign: "center",
          marginBottom: 20,
        },
        deleteModalButtonContainer: {
          flexDirection: "row",
          gap: 14,
        },
        cancelButton: {
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 6,
          backgroundColor: currentTheme.inactive,
        },
        cancelButtonText: {
          color: currentTheme.text,
        },
        deleteButton: {
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 6,
          backgroundColor: "red",
        },
        deleteButtonText: {
          color: "white",
        },
        closeIcon: {
          color: currentTheme.text,
          paddingLeft: 6,
        },
      }),
    [currentTheme] // Regenerate styles only when theme changes
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide"
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{fiction?.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-sharp"
                size={23}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.mainContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.quickEditContainer}>
              {/* ACTION 1: Update readingStatus */}
              <View style={[styles.actionRow, { alignItems: "flex-end" }]}>
                <ChosenStatus
                  sectionLabel="Avancement de votre lecture"
                  readingStatus={selectedReadingStatus}
                  onPress={changeReadingStatus}
                />
                {readingSaved && (
                  <Ionicons
                    style={styles.savedIcon}
                    name="checkmark-circle"
                    size={32}
                    color={currentTheme.primaryPlus}
                  />
                )}
              </View>

              {/* ACTION 2: Update lastChapterRead */}
              <View style={[styles.actionRow, { alignItems: "flex-end" }]}>
                <LastChapterRead
                  sectionLabel="Dernier chapitre lu"
                  value={lastChapterRead}
                  onChange={changeLastChapterRead}
                />
                {chapterSaved && (
                  <Ionicons
                    name="checkmark-circle"
                    size={32}
                    color={currentTheme.primaryPlus}
                  />
                )}
              </View>

              {/* ACTION 3: Update rate (0 to 5 icons) */}
              <View style={styles.actionRow}>
                <Rate
                  sectionLabel="Votre note"
                  iconName={user.notationIcon}
                  value={rateValue}
                  onPress={changeRateValue}
                  hideRate={!displayRate}
                  onToggleHide={handleToggleHide}
                  editable={true}
                />
                {rateSaved && (
                  <Ionicons
                    name="checkmark-circle"
                    size={32}
                    color={currentTheme.primaryPlus}
                  />
                )}
              </View>
            </View>

            {/* --- ACTION 4: Modify fanfiction - Navigate to ManageFictionScreen --- */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                navigation.navigate("ManageFiction", { fictionId: fiction._id })
              }
            >
              <MaterialIcons style={styles.editIcon} name="edit" size={22} />
              <Text style={styles.actionText}>Modifier la fanfiction</Text>
            </TouchableOpacity>

            {/* --- ACTION 5: Delete fanfiction --- */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setConfirmDeleteVisible(true)}
            >
              <MaterialIcons name="delete" size={22} color="red" />
              <Text style={[styles.actionText, { color: "red" }]}>
                Supprimer la fanfiction
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>

      {/* Delete confirmation modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>
            <Text style={styles.deleteModalTitle}>
              Supprimer la fanfiction ?
            </Text>

            <Text style={styles.deleteModalText}>
              Cette action est définitive.
            </Text>

            <View style={styles.deleteModalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteFiction}
              >
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};
