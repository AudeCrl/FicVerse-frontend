import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Header from "../components/Header";
import { typography } from "../styles/globalStyles";

const AVAILABLE_LANGUAGES = [
  { id: "lang-1", name: "Français" },
  { id: "lang-2", name: "Anglais" },
  { id: "lang-3", name: "Espagnol" },
  { id: "lang-4", name: "Allemand" },
  { id: "lang-5", name: "Italien" },
  { id: "lang-6", name: "Portugais" },
  { id: "lang-7", name: "Russe" },
  { id: "lang-8", name: "Japonais" },
  { id: "lang-9", name: "Chinois" },
  { id: "lang-10", name: "Coréen" },
];

export default function LanguagesManagerScreen({ navigation }) {
  const [userLanguages, setUserLanguages] = useState([
    { id: "lang-1", name: "Français" },
  ]);
  // Modale de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState(null);

  const handleAddLanguage = (language) => {
    if (!userLanguages.find((l) => l.id === language.id)) {
      setUserLanguages([...userLanguages, language]);
    }
  };

  // Ouvrir modale de confirmation avant suppression locale
  const handleRemoveLanguage = (language) => {
    setLanguageToDelete(language);
    setShowDeleteModal(true);
  };

  // Confirmer la suppression après modale
  const handleConfirmDelete = () => {
    setUserLanguages(userLanguages.filter((l) => l.id !== languageToDelete.id));
    setShowDeleteModal(false);
    setLanguageToDelete(null);
  };

  const filteredAvailable = AVAILABLE_LANGUAGES.filter(
    (lang) => !userLanguages.some((l) => l.id === lang.id)
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header
        title="Gérer mes langues"
        screenName="manage"
        showToggle={false}
        onProfilePress={() => navigation.navigate("Profile")}
      />

      {/* Modale de confirmation */}
      {languageToDelete && (
        <ConfirmDeleteModal
          visible={showDeleteModal}
          itemName={languageToDelete.name}
          itemType="langue"
          usageCount={0}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setLanguageToDelete(null);
          }}
          isLoading={false}
        />
      )}

      {/* User Languages */}
      <Text style={styles.sectionTitle}>
        Mes langues ({userLanguages.length})
      </Text>
      <FlatList
        data={userLanguages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.languageItem}>
            <Text style={styles.languageName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveLanguage(item)}>
              <Feather name="trash-2" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />

      {/* Available Languages */}
      <Text style={styles.sectionTitle}>Langues suggérées</Text>
      <FlatList
        data={filteredAvailable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.languageItem}>
            <Text style={styles.languageName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleAddLanguage(item)}>
              <Feather name="plus" size={18} color="#9C27B0" />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
        ListEmptyMessage={
          <Text style={styles.emptyText}>Aucune langue suggérée</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fcfff8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  title: {
    ...typography.input,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },

  sectionTitle: {
    ...typography.input,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  languageName: {
    ...typography.input,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },

  emptyText: {
    ...typography.input,
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginVertical: 16,
  },
});
