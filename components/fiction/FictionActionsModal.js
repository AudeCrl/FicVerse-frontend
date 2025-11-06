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
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import ChosenStatus from "../manageFiction/ChosenStatus.js";
import LastChapterRead from "../manageFiction/LastChapterRead";
import Rate from "./Rate.js";

export const FictionActionsModal = ({
  isVisible,
  onClose,
  fiction,
  navigation,
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

  const handleToggleHide = () => {
    setDisplayRate(displayRate === true ? false : true);
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
      paddingVertical: 10,
      elevation: 10,
      maxHeight: "80%",
    },
    header: {
      paddingHorizontal: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.inputBorder,
    },
    modalTitle: {
      ...typography.h3,
      color: currentTheme.text,
    },
    mainContent: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      maxHeight: "70%",
      overflow: "hidden",
    },
    // --- ACTIONS (Lignes) ---
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    actionText: {
      ...typography.body,
      color: currentTheme.text,
      marginLeft: 8,
    },

    // --- FOOTER ---
    footerContainer: {
      flexDirection: "row",
      justifyContent: "center", // Centrer les boutons
      paddingVertical: 10,
      marginVertical: 10,
      borderTopWidth: 1,
      borderTopColor: currentTheme.inputBorder,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.inputBorder,
    },
    footerButton: {
      marginLeft: 30,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    applyButton: {
      backgroundColor: currentTheme.primary,
      borderRadius: 5,
    },
    buttonText: {
      color: currentTheme.text,
      fontSize: 16,
    },
    applyButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{fiction?.title}</Text>
          </View>

          <ScrollView
            style={styles.mainContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {/* ACTION 1: Update readingStatus */}
            <View style={styles.actionRow}>
              <ChosenStatus
                sectionLabel="Avancement de votre lecture"
                readingStatus={selectedReadingStatus}
                onPress={setSelectedReadingStatus}
              />
            </View>

            {/* ACTION 2: Update lastChapterRead */}
            <View style={styles.actionRow}>
              <LastChapterRead
                sectionLabel="Dernier chapitre lu"
                value={lastChapterRead}
                onChange={setLastChapterRead}
              />
            </View>

            {/* ACTION 3: Update rate (0 to 5 icons) */}
            <View style={styles.actionRow}>
              <Rate
                sectionLabel="Votre note"
                iconName={user.notationIcon}
                value={rateValue}
                onPress={setRateValue}
                hideRate={!displayRate}
                onToggleHide={handleToggleHide}
                editable={true}
              />
            </View>
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.footerButton} onPress={onClose}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.applyButton]}
              >
                <Text style={styles.buttonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>

            {/* --- ACTION 4 : Modifier infos fanfiction --- */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                navigation.navigate("ManageFiction", { fictionId: fiction._id })
              }
            >
              <MaterialIcons name="edit" size={22} />
              <Text style={styles.actionText}>Modifier la fanfiction</Text>
            </TouchableOpacity>

            {/* --- ACTION 5 : Dupliquer la fiction --- */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => console.log("TODO duplicate")}
            >
              <Ionicons name="copy" size={22} />
              <Text style={styles.actionText}>Dupliquer la fanfiction</Text>
            </TouchableOpacity>

            {/* --- ACTION 6 : Supprimer la fiction --- */}
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
      </View>
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
