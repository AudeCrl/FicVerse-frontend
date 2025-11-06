import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../styles/globalStyles";

export default function ItemManager({
  title,
  items = [],
  allAvailable = [],
  onAdd,
  onRemove,
  getUsageCount,
  itemType = "tag",
  containerStyle,
}) {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableToAdd = allAvailable.filter(
    (item) => !items.find((selected) => selected.id === item.id)
  );

  const filteredAvailable = availableToAdd.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddItem = (item) => {
    if (onAdd) {
      onAdd(item);
    }
    setSearchText("");
    setIsAddModalVisible(false);
  };

  const handleOpenDeleteConfirm = async (item) => {
    setItemToDelete(item);
    setSelectedAction(null);
    setIsLoading(true);

    // Récupérer le nombre d'utilisations
    if (getUsageCount) {
      try {
        const count = await getUsageCount(item.id);
        setUsageCount(count || 0);
      } catch (error) {
        console.error("Erreur récupération usage count:", error);
        setUsageCount(0);
      }
    }

    setIsLoading(false);
    setIsDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (onRemove && itemToDelete) {
      await onRemove(itemToDelete, selectedAction);
    }
    setIsDeleteConfirmVisible(false);
    setItemToDelete(null);
    setSelectedAction(null);
  };

  const itemLabel =
    {
      tag: "tag",
      fandom: "fandom",
      language: "langue",
    }[itemType] || "élément";

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => setIsAddModalVisible(true)}
          disabled={isLoading}
        >
          <Ionicons name="add-circle-outline" size={24} color="#9c27b0" />
        </TouchableOpacity>
      </View>

      {/* Liste des items */}
      <View style={styles.itemsList}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Aucun {itemLabel}</Text>
        ) : (
          items.map((item) => (
            <View key={String(item.id)} style={styles.itemTag}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => handleOpenDeleteConfirm(item)}
                disabled={isLoading}
              >
                <Ionicons name="close-circle" size={18} color="#E03131" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Modal Ajouter */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Ajouter {title.toLowerCase()}
              </Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder={`Rechercher ${title.toLowerCase()}...`}
              value={searchText}
              onChangeText={setSearchText}
              editable={!isLoading}
            />

            <FlatList
              data={filteredAvailable}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.availableItem}
                  onPress={() => handleAddItem(item)}
                  disabled={isLoading}
                >
                  <Text style={styles.availableItemName}>{item.name}</Text>
                  <Ionicons name="add-circle" size={20} color="#9c27b0" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>Aucun résultat</Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal
        visible={isDeleteConfirmVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsDeleteConfirmVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContent}>
            <Ionicons name="warning" size={48} color="#E03131" />

            <Text style={styles.confirmTitle}>Confirmer la suppression</Text>

            {usageCount > 0 && (
              <View style={styles.usageContainer}>
                <Text style={styles.usageText}>
                  Ce {itemLabel} est utilisé par{" "}
                  <Text style={styles.usageCount}>
                    {usageCount} fanfiction{usageCount > 1 ? "s" : ""}
                  </Text>
                  .
                </Text>
              </View>
            )}

            <View style={styles.actionButtons}>
              {/* Bouton Cancel */}
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsDeleteConfirmVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              {/* Bouton Supprimer */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.deleteButton,
                  selectedAction === "delete" && styles.selectedAction,
                ]}
                onPress={() =>
                  setSelectedAction(
                    selectedAction === "delete" ? null : "delete"
                  )
                }
                disabled={isLoading}
              >
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>

              {/* Bouton Détacher (seulement si utilisé) */}
              {usageCount > 0 && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.detachButton,
                    selectedAction === "detach" && styles.selectedAction,
                  ]}
                  onPress={() =>
                    setSelectedAction(
                      selectedAction === "detach" ? null : "detach"
                    )
                  }
                  disabled={isLoading}
                >
                  <Text style={styles.detachButtonText}>Retirer</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Bouton Confirmer (après sélection) */}
            {selectedAction && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmDelete}
                disabled={isLoading}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    ...typography.label,
    fontWeight: "600",
    fontSize: 14,
  },
  itemsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    minHeight: 30,
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    fontSize: 12,
  },
  itemTag: {
    backgroundColor: "#E1BEE7",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemName: {
    fontWeight: "500",
    color: "#333",
    fontSize: 12,
  },

  // Modal Ajouter
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    ...typography.label,
    fontWeight: "600",
    fontSize: 16,
  },
  searchInput: {
    ...typography.input,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    fontSize: 12,
  },
  availableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  availableItemName: {
    fontSize: 13,
    color: "#333",
  },
  noResultsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 16,
    fontSize: 12,
  },

  // Modal Confirmation
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  confirmContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  confirmTitle: {
    ...typography.label,
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  usageContainer: {
    backgroundColor: "#FFF5F5",
    borderLeftWidth: 3,
    borderLeftColor: "#E03131",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    width: "100%",
  },
  usageText: {
    fontSize: 12,
    color: "#666",
  },
  usageCount: {
    fontWeight: "700",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  actionButton: {
    flex: 1,
    minWidth: "48%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#E6E6E6",
  },
  cancelButtonText: {
    fontWeight: "600",
    color: "#333",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#E03131",
  },
  detachButton: {
    backgroundColor: "#FF922B",
  },
  deleteButtonText: {
    fontWeight: "600",
    color: "white",
    fontSize: 12,
  },
  detachButtonText: {
    fontWeight: "600",
    color: "white",
    fontSize: 12,
  },
  selectedAction: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: "#333",
  },
  confirmButton: {
    backgroundColor: "#9c27b0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  confirmButtonText: {
    fontWeight: "600",
    color: "white",
    fontSize: 14,
  },
});
