import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { typography } from "../styles/globalStyles";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function TagsManagerScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [userTags, setUserTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Modale de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      // Charger les tags de l'utilisateur
      const userResponse = await fetch(`${API_IP}/tag`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const userData = await userResponse.json();
      if (userData.result) {
        const normalized = (userData.tags || []).map((t) => ({
          ...t,
          id: t._id || t.id,
        }));
        setUserTags(normalized);
      }

      // Charger tous les tags disponibles
      const allResponse = await fetch(`${API_IP}/tag/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const allData = await allResponse.json();
      if (allData.result) {
        const normalized = (allData.tags || []).map((t) => ({
          ...t,
          id: t._id || t.id,
        }));
        setAllTags(normalized);
      }
    } catch (error) {
      console.error("Erreur chargement tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (tag) => {
    if (!userTags.find((t) => t.id === tag.id)) {
      setUserTags([...userTags, tag]);
    }
  };

  // Ouvrir modale après vérifier le nombre d'utilisations
  const handleRemoveTag = async (tag) => {
    try {
      // Récupérer le nombre d'utilisations du tag
      const response = await fetch(`${API_IP}/tag/${tag.id}/usage-count`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (data.result) {
        setUsageCount(data.usageCount);
        setTagToDelete(tag);
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
      // Essayer soft delete d'abord, puis hard delete si utilisé
      const queryParam = usageCount > 0 ? "?detach=true" : "";
      const response = await fetch(
        `${API_IP}/tag/${tagToDelete.id}${queryParam}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await response.json();
      if (data.result) {
        setUserTags(userTags.filter((t) => t.id !== tagToDelete.id));
        setShowDeleteModal(false);
        setTagToDelete(null);
      }
    } catch (error) {
      console.error("Erreur suppression tag:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAvailable = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !userTags.some((t) => t.id === tag.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes tags</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Modale de confirmation */}
      {tagToDelete && (
        <ConfirmDeleteModal
          visible={showDeleteModal}
          itemName={tagToDelete.name}
          itemType="tag"
          usageCount={usageCount}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setTagToDelete(null);
          }}
          isLoading={isDeleting}
        />
      )}

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un tag..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#D1D5DB"
        />
      </View>

      {/* User Tags */}
      <Text style={styles.sectionTitle}>Mes tags ({userTags.length})</Text>
      <FlatList
        data={userTags}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.tagItem}>
            <Text style={styles.tagName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(item)}>
              <Feather name="trash-2" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />

      {/* Available Tags */}
      <Text style={styles.sectionTitle}>Tags disponibles</Text>
      <FlatList
        data={filteredAvailable}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.tagItem}>
            <Text style={styles.tagName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleAddTag(item)}>
              <Feather name="plus" size={18} color="#9C27B0" />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
        ListEmptyMessage={
          <Text style={styles.emptyText}>Aucun tag disponible</Text>
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

  tagItem: {
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

  tagName: {
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
