import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import ChosenStatus from "../manageFiction/ChosenStatus.js";
import LastChapterRead from "../manageFiction/LastChapterRead";
import Rate from "./Rate.js";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export const FictionActionsModal = ({
  isVisible,
  onClose,
  fiction,
  navigation,
}) => {
  const { currentTheme } = useTheme();
  const user = useSelector((state) => state.user.value);

  const [selectedReadingStatus, setSelectedReadingStatus] = useState(fiction?.readingStatus ?? null);
  const [lastChapterRead, setLastChapterRead] = useState(fiction?.lastChapterRead ?? 0);
  const [rateValue, setRateValue] = useState(fiction?.rate?.value ?? 0);
  const [displayRate, setDisplayRate] = useState(fiction?.rate?.display ?? false);

  // Display of a "tick" icon ton confirm when saved
  const [readingSaved, setReadingSaved] = useState(false);
  const [chapterSaved, setChapterSaved] = useState(false);
  const [rateSaved, setRateSaved] = useState(false);
  
  const changeReadingStatus = (newStatus) => {
    setSelectedReadingStatus(newStatus);
    updateFiction({ readingStatus: newStatus });
  }
  const changeLastChapterRead = (newChapter) => {
    setLastChapterRead(newChapter);
    updateFiction({ lastChapterRead: newChapter });
  }
  const changeRateValue = (newRateValue) => {
    setRateValue(newRateValue);
    updateFiction({ rate: { value: newRateValue } });
  }
  const handleToggleHide = () => {
    setDisplayRate(displayRate === true ? false : true);
    updateFiction({ rate: { display: displayRate } });
  };
  
  // Fast update of a fiction (readingStatus, lastChapterRead or rate)
  const updateFiction = async (fieldToUpdate = {}) => {
    try {
      const res = await fetch(`${API_IP}/fiction/${fiction._id}`, {
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
        console.log('Fiction mise à jour !', updatedField);

        switch(updatedField) {
          case 'readingStatus':
            setReadingSaved(true);
            setTimeout(() => setReadingSaved(false), 1500);
            break;
          case 'lastChapterRead':
            setChapterSaved(true);
            setTimeout(() => setChapterSaved(false), 1500);
            break;
          case 'rate':
            setRateSaved(true);
            setTimeout(() => setRateSaved(false), 1500);
            break;
          default:
            console.log('updatedField not recognised', updatedField);
        }
      } else {
        Alert.alert("Erreur", data.error || "Mise à jour échouée");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème de connexion");
    }
  };

  const styles = StyleSheet.create({
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalTitle: {
      ...typography.h3,
      color: currentTheme.text,
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
  });

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
          onStartShouldSetResponder={() => true}>

          <View style={styles.header}>
            <Text style={styles.modalTitle}>{fiction?.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-sharp"
                size={23}
                style={{
                  color: currentTheme.text,
                  paddingLeft: 6,
                }}
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
              <View style={[styles.actionRow, { alignItems: 'flex-end' }]}>
                <ChosenStatus
                  sectionLabel="Avancement de votre lecture"
                  readingStatus={selectedReadingStatus}
                  onPress={changeReadingStatus}
                />
                {readingSaved && (
                  <Ionicons style={styles.savedIcon} name="checkmark-circle" size={32} color={currentTheme.primaryPlus} />
                )}
              </View>

              {/* ACTION 2: Update lastChapterRead */}
              <View style={[styles.actionRow, { alignItems: 'flex-end' }]}>
                <LastChapterRead
                  sectionLabel="Dernier chapitre lu"
                  value={lastChapterRead}
                  onChange={changeLastChapterRead}
                />
                {chapterSaved && (
                  <Ionicons name="checkmark-circle" size={32} color={currentTheme.primaryPlus} />
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
                {rateSaved  && (
                  <Ionicons name="checkmark-circle" size={32} color={currentTheme.primaryPlus} />
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
              <MaterialIcons name="edit" size={22} />
              <Text style={styles.actionText}>Modifier la fanfiction</Text>
            </TouchableOpacity>

            {/* --- ACTION 5: Duplicate fanfiction
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => console.log("TODO duplicate")}
            >
              <Ionicons name="copy" size={22} />
              <Text style={styles.actionText}>Dupliquer la fanfiction</Text>
            </TouchableOpacity>
             --- */}

            {/* --- ACTION 6: Delete fanfiction --- */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => console.log("TODO delete")}
            >
              <MaterialIcons name="delete" size={22} color="red" />
              <Text style={[styles.actionText, { color: "red" }]}>
                Supprimer la fanfiction
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// {/* --- ACTION 4 : Modifier infos fanfiction --- */}
// <Pressable style={styles.actionRow} onPress={() => console.log("TODO modify info")}>
//     <MaterialIcons name="edit" size={22} />
//     <Text style={styles.actionText}>Modifier les informations</Text>
// </Pressable>

// {/* --- ACTION 5 : Dupliquer la fiction --- */}
// <Pressable style={styles.actionRow} onPress={() => console.log("TODO duplicate")}>
//     <Ionicons name="copy" size={22} />
//     <Text style={styles.actionText}>Dupliquer la fanfiction</Text>
// </Pressable>

// {/* --- ACTION 6 : Supprimer la fiction --- */}
// <Pressable style={styles.actionRow} onPress={() => console.log("TODO delete")}>
//     <MaterialIcons name="delete" size={22} color="red" />
//     <Text style={[styles.actionText, { color: "red" }]}>Supprimer la fanfiction</Text>
// </Pressable>
