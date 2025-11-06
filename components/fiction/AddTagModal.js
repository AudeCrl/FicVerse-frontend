import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../styles/globalStyles";

/**
 *  COMPOSANT: AddTagModal
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Modale pour ajouter un ou plusieurs tags à une fanfiction
 *
 *  OBJECTIF:
 * Permettre à l'utilisateur de rechercher et ajouter des tags existants
 * à sa fanfiction depuis une liste filtrée.
 *
 * PROPS:
 *
 * @param {boolean} visible - Est-ce que la modale est visible?
 * @param {function} onClose - Callback pour fermer la modale
 * @param {string} fictionId - ID de la fanfiction
 * @param {array} currentTags - Tags actuellement associés [ex: [{_id, name}, ...]]
 * @param {function} onTagsAdded - Callback(newTags) quand tags ajoutés
 *
 * EXEMPLE D'UTILISATION:
 *
 * const [showAddTagModal, setShowAddTagModal] = useState(false);
 *
 * <AddTagModal
 *   visible={showAddTagModal}
 *   onClose={() => setShowAddTagModal(false)}
 *   fictionId={fiction._id}
 *   currentTags={fiction.tags}
 *   onTagsAdded={(newTags) => {
 *     // Ajouter les nouveaux tags à la fanfiction
 *     setFiction({
 *       ...fiction,
 *       tags: [...fiction.tags, ...newTags]
 *     });
 *   }}
 * />
 */
export default function AddTagModal({
  visible,
  onClose,
  fictionId,
  currentTags = [],
  onTagsAdded,
}) {
  const { currentTheme } = useTheme();
  const token = useSelector((state) => state.user.value.token);

  const [allTags, setAllTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, isLoadingTags] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Récupérer les tags disponibles au premier chargement
  useEffect(() => {
    if (visible && allTags.length === 0) {
      fetchAvailableTags();
    }
  }, [visible]);

  const fetchAvailableTags = async () => {
    try {
      isLoadingTags(true);
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tag`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.result && data.tags) {
        setAllTags(data.tags);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tags:", error);
    } finally {
      isLoadingTags(false);
    }
  };

  // Filtrer les tags disponibles (non déjà utilisés + matching search)
  const availableTags = useMemo(() => {
    const currentTagIds = currentTags.map((t) => t._id);
    return allTags
      .filter((tag) => !currentTagIds.includes(tag._id))
      .filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allTags, currentTags, searchQuery]);

  // Ajouter/retirer un tag de la sélection
  const toggleTagSelection = (tag) => {
    const isSelected = selectedTags.some((t) => t._id === tag._id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t._id !== tag._id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Valider et ajouter les tags
  const handleAddTags = async () => {
    if (selectedTags.length === 0) return;

    try {
      setIsAdding(true);

      // Préparer les IDs des tags à ajouter
      const tagIdsToAdd = selectedTags.map((t) => t._id);
      const currentTagIds = currentTags.map((t) => t._id);
      const allTagIds = [...currentTagIds, ...tagIdsToAdd];

      // Mettre à jour la fiction avec les nouveaux tags
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/fiction/${fictionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tagIds: allTagIds,
          }),
        }
      );

      const data = await res.json();
      if (data.result) {
        // Appeler le callback pour informer le parent
        if (onTagsAdded) {
          onTagsAdded(selectedTags);
        }
        // Fermer la modale
        handleClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des tags:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedTags([]);
    onClose();
  };

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
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 16,
          elevation: 10,
          maxHeight: "85%",
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.inputBorder,
        },
        title: {
          ...typography.h3,
          color: currentTheme.text,
        },
        closeButton: {
          padding: 8,
        },
        searchContainer: {
          marginBottom: 16,
        },
        searchInput: {
          backgroundColor: currentTheme.inputBackground,
          borderWidth: 1,
          borderColor: currentTheme.inputBorder,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: currentTheme.text,
          ...typography.body,
        },
        tagsList: {
          marginBottom: 16,
          maxHeight: "50%",
        },
        tagItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 12,
          marginVertical: 6,
          borderRadius: 8,
          backgroundColor: currentTheme.inputBackground,
          borderWidth: 1,
          borderColor: currentTheme.inputBorder,
        },
        tagItemSelected: {
          backgroundColor: currentTheme.primary,
          borderColor: currentTheme.primary,
        },
        tagLabel: {
          flex: 1,
          ...typography.body,
          color: currentTheme.text,
        },
        tagLabelSelected: {
          color: "#fff",
          fontWeight: "600",
        },
        checkbox: {
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: currentTheme.inputBorder,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        },
        checkboxSelected: {
          backgroundColor: currentTheme.primary,
          borderColor: currentTheme.primary,
        },
        checkmark: {
          color: "#fff",
          fontSize: 14,
          fontWeight: "bold",
        },
        emptyText: {
          textAlign: "center",
          color: currentTheme.secondaryText,
          ...typography.body,
          paddingVertical: 24,
        },
        footer: {
          flexDirection: "row",
          justifyContent: "center",
          gap: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: currentTheme.inputBorder,
        },
        button: {
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        },
        cancelButton: {
          backgroundColor: currentTheme.inputBackground,
          borderWidth: 1,
          borderColor: currentTheme.inputBorder,
        },
        cancelButtonText: {
          color: currentTheme.text,
          ...typography.body,
          fontWeight: "600",
        },
        addButton: {
          backgroundColor: currentTheme.primaryPlus,
          opacity: selectedTags.length === 0 ? 0.5 : 1,
        },
        addButtonText: {
          color: "#fff",
          ...typography.body,
          fontWeight: "600",
        },
        selectedCount: {
          backgroundColor: currentTheme.primary,
          color: "#fff",
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 2,
          marginLeft: 8,
          ...typography.small,
          fontWeight: "bold",
        },
        loadingContainer: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
        },
      }),
    [currentTheme]
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={handleClose}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Ajouter des tags</Text>
              {selectedTags.length > 0 && (
                <Text style={styles.selectedCount}>
                  {selectedTags.length} sélectionné
                  {selectedTags.length > 1 ? "s" : ""}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Feather name="x" size={24} color={currentTheme.text} />
            </TouchableOpacity>
          </View>

          {/* SEARCH INPUT */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un tag..."
              placeholderTextColor={currentTheme.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!isAdding}
            />
          </View>

          {/* TAGS LIST */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={currentTheme.primary} />
            </View>
          ) : availableTags.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Aucun tag trouvé"
                : "Tous les tags sont déjà utilisés"}
            </Text>
          ) : (
            <ScrollView
              style={styles.tagsList}
              showsVerticalScrollIndicator={true}
            >
              {availableTags.map((tag) => {
                const isSelected = selectedTags.some((t) => t._id === tag._id);
                return (
                  <TouchableOpacity
                    key={tag._id}
                    style={[
                      styles.tagItem,
                      isSelected && styles.tagItemSelected,
                    ]}
                    onPress={() => toggleTagSelection(tag)}
                    disabled={isAdding}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.tagLabel,
                        isSelected && styles.tagLabelSelected,
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* FOOTER BUTTONS */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isAdding}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.addButton,
                selectedTags.length === 0 && { opacity: 0.5 },
              ]}
              onPress={handleAddTags}
              disabled={selectedTags.length === 0 || isAdding}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>
                  Ajouter ({selectedTags.length})
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
