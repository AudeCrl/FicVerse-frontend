import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../styles/globalStyles";

// Modale de confirmation: demande à l'utilisateur de taper le nom exact
export default function ConfirmDeleteModal({
  visible,
  itemName,
  itemType = "élément",
  usageCount = 0,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  // Texte tapé par l'utilisateur dans le champ de confirmation
  const [confirmText, setConfirmText] = useState("");
  // Vérifier que le texte correspond exactement au nom
  const isConfirmValid = confirmText === itemName;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header avec icône d'alerte */}
          <View style={styles.header}>
            <Feather name="alert-triangle" size={28} color="#DC2626" />
            <Text style={styles.title}>Confirmer la suppression</Text>
          </View>

          <View style={styles.content}>
            {/* Message de confirmation */}
            <Text style={styles.description}>
              Êtes-vous sûr de vouloir supprimer{" "}
              <Text style={styles.bold}>{itemName}</Text> ?
            </Text>

            {/* Avertissement si l'élément est utilisé */}
            {usageCount > 0 && (
              <View style={styles.usageWarning}>
                <Feather name="info" size={16} color="#F97316" />
                <Text style={styles.usageText}>
                  Cet {itemType} est utilisé par{" "}
                  <Text style={styles.bold}>{usageCount}</Text> fanfiction
                  {usageCount > 1 ? "s" : ""}.
                </Text>
              </View>
            )}

            {/* Section de confirmation par texte */}
            <View style={styles.confirmSection}>
              <Text style={styles.confirmLabel}>
                Pour confirmer, tapez le nom exact :
              </Text>
              <TextInput
                style={[
                  styles.input,
                  !isConfirmValid && confirmText && styles.inputError,
                ]}
                placeholder={itemName}
                value={confirmText}
                onChangeText={setConfirmText}
                editable={!isLoading}
                placeholderTextColor="#D1D5DB"
              />
              {/* Feedback texte */}
              {confirmText && !isConfirmValid && (
                <Text style={styles.errorText}>Le texte ne correspond pas</Text>
              )}
              {isConfirmValid && (
                <Text style={styles.successText}>Prêt à supprimer</Text>
              )}
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                (!isConfirmValid || isLoading) && styles.deleteButtonDisabled,
              ]}
              onPress={onConfirm}
              disabled={!isConfirmValid || isLoading}
            >
              {isLoading ? (
                <Text style={styles.deleteButtonText}>Suppression...</Text>
              ) : (
                <>
                  <Feather name="trash-2" size={18} color="white" />
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Overlay semi-transparent
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Boîte modale principale
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "85%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Header avec titre et icône
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },

  title: {
    ...typography.input,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },

  content: {
    marginBottom: 20,
  },

  description: {
    ...typography.input,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },

  bold: {
    fontWeight: "700",
    color: "#1F2937",
  },

  // Avertissement d'utilisation (jaune)
  usageWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },

  usageText: {
    ...typography.input,
    fontSize: 13,
    color: "#92400E",
    flex: 1,
    lineHeight: 18,
  },

  // Zone de confirmation par texte
  confirmSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  confirmLabel: {
    ...typography.input,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 8,
    backgroundColor: "white",
  },

  // Style d'erreur (rouge) si texte ne correspond pas
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },

  errorText: {
    ...typography.input,
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },

  successText: {
    ...typography.input,
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },

  // Boutons
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cancelButtonText: {
    ...typography.input,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  deleteButton: {
    backgroundColor: "#DC2626",
  },

  // Bouton désactivé (rose pâle)
  deleteButtonDisabled: {
    backgroundColor: "#FECACA",
    opacity: 0.6,
  },

  deleteButtonText: {
    ...typography.input,
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
