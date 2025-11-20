import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Header from "../components/Header";
import { typography } from "../styles/globalStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function FandomsManagerScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [userFandoms, setUserFandoms] = useState([]);
  const [allFandoms, setAllFandoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Modale de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fandomToDelete, setFandomToDelete] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadFandoms();
  }, []);

  const loadFandoms = async () => {
    try {
      setIsLoading(true);
      // Charger les fandoms de l'utilisateur
      const userResponse = await fetch(`${API_URL}/fandom`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const userData = await userResponse.json();
      if (userData.result) {
        const normalized = (userData.fandoms || []).map((f) => ({
          ...f,
          id: f._id || f.id,
        }));
        setUserFandoms(normalized);
      }

      // Charger tous les fandoms disponibles
      const allResponse = await fetch(`${API_URL}/fandom`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const allData = await allResponse.json();
      if (allData.result) {
        const normalized = (allData.fandoms || []).map((f) => ({
          ...f,
          id: f._id || f.id,
        }));
        setAllFandoms(normalized);
      }
    } catch (error) {
      console.error("Erreur chargement fandoms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFandom = async (fandom) => {
    if (!userFandoms.find((f) => f.id === fandom.id)) {
      setUserFandoms([...userFandoms, fandom]);
    }
  };

  // Ouvrir modale après vérifier le nombre d'utilisations
  const handleRemoveFandom = async (fandom) => {
    try {
      // Récupérer le nombre d'utilisations du fandom
      const response = await fetch(
        `${API_URL}/fandom/${fandom.id}/usage-count`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await response.json();
      if (data.result) {
        setUsageCount(data.usageCount);
        setFandomToDelete(fandom);
        setShowDeleteModal(true);
      }
    } catch (error) {
      console.error("Erreur récupération usage count:", error);
    }
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      // Essayer suppression avec detach si utilisé
      const queryParam = usageCount > 0 ? "?detach=true" : "";
      const response = await fetch(
        `${API_URL}/fandom/${fandomToDelete.id}${queryParam}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await response.json();
      if (data.result) {
        setUserFandoms(userFandoms.filter((f) => f.id !== fandomToDelete.id));
        setShowDeleteModal(false);
        setFandomToDelete(null);
      }
    } catch (error) {
      console.error("Erreur suppression fandom:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAvailable = allFandoms.filter(
    (fandom) =>
      fandom.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !userFandoms.some((f) => f.id === fandom.id)
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header
        title="Gérer mes fandoms"
        screenName="manage"
        showToggle={false}
        onProfilePress={() => navigation.navigate("Profile")}
      />

      {/* Modale de confirmation */}
      {fandomToDelete && (
        <ConfirmDeleteModal
          visible={showDeleteModal}
          itemName={fandomToDelete.name}
          itemType="fandom"
          usageCount={usageCount}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setFandomToDelete(null);
          }}
          isLoading={isDeleting}
        />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un fandom..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#D1D5DB"
          />
        </View>

        {/* User Fandoms */}
        <Text style={styles.sectionTitle}>
          Mes fandoms ({userFandoms.length})
        </Text>
        <FlatList
          data={userFandoms}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveFandom(item)}>
                <Feather name="trash-2" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
        />

        {/* Available Fandoms */}
        <Text style={styles.sectionTitle}>Fandoms disponibles</Text>
        <FlatList
          data={filteredAvailable}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleAddFandom(item)}>
                <Feather name="plus" size={18} color="#9C27B0" />
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
          ListEmptyMessage={
            <Text style={styles.emptyText}>Aucun fandom disponible</Text>
          }
        />
      </ScrollView>
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
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

  itemRow: {
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

  itemName: {
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
