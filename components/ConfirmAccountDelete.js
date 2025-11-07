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

// Double confirmation modal for account deletion
// Props: visible, userEmail, onConfirm(password), onCancel, isLoading
export default function ConfirmAccountDelete({
  visible,
  userEmail,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  // Form state
  const [understandsConfirm, setUnderstandsConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // Enable delete button if checkbox + password filled
  const isFormValid = understandsConfirm && password.length > 0;

  // Validate password before deletion
  const handleConfirm = async () => {
    if (!password) {
      setPasswordError("Mot de passe requis");
      return;
    }
    await onConfirm(password);
  };

  // Reset form and close modal
  const handleCancel = () => {
    setUnderstandsConfirm(false);
    setPassword("");
    setPasswordError(null);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Feather name="alert-circle" size={32} color="#DC2626" />
            <Text style={styles.title}>❗ Supprimer votre compte</Text>
            <Text style={styles.subtitle}>
              Cette action est définitive et ne peut pas être annulée
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.warningSection}>
            <View style={styles.warningItem}>
              <Feather name="x-circle" size={18} color="#DC2626" />
              <Text style={styles.warningText}>
                ❌ Tous vos profils et fanfictions seront supprimés
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Feather name="x-circle" size={18} color="#DC2626" />
              <Text style={styles.warningText}>
                ❌ Vos données ne pourront pas être récupérées
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Feather name="x-circle" size={18} color="#DC2626" />
              <Text style={styles.warningText}>
                ❌ Cette action est irréversible
              </Text>
            </View>
          </View>

          {/* Confirmation checkbox - must be checked */}
          <View style={styles.confirmCheckbox}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                understandsConfirm && styles.checkboxChecked,
              ]}
              onPress={() => setUnderstandsConfirm(!understandsConfirm)}
              disabled={isLoading}
            >
              {understandsConfirm && (
                <Feather name="check" size={14} color="white" />
              )}
            </TouchableOpacity>
            <Text
              style={styles.checkboxLabel}
              onPress={() => setUnderstandsConfirm(!understandsConfirm)}
            >
              Je comprends que cette action est définitive
            </Text>
          </View>

          {/* Password confirmation - only show if checkbox checked */}
          {understandsConfirm && (
            <View style={styles.passwordSection}>
              <Text style={styles.passwordLabel}>
                Confirmez avec votre mot de passe :
              </Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordError && styles.passwordInputError,
                  ]}
                  placeholder="Votre mot de passe"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(null);
                  }}
                  editable={!isLoading}
                  placeholderTextColor="#D1D5DB"
                />
                {/* Show/hide password toggle */}
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                (!isFormValid || isLoading) && styles.deleteButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <Text style={styles.deleteButtonText}>
                Suppression en cours...
                </Text>
              ) : (
                <>
                  <Feather name="trash-2" size={18} color="white" />
                  <Text style={styles.deleteButtonText}>
                  Supprimer mon compte
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Account info footer */}
          <View style={styles.infoFooter}>
            <Feather name="info" size={14} color="#6B7280" />
            <Text style={styles.infoText}>
              Compte à supprimer : <Text style={styles.bold}>{userEmail}</Text>
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
    minHeight: "70%",
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    ...typography.input,
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 4,
  },

  subtitle: {
    ...typography.input,
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },

  warningSection: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },

  warningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  warningText: {
    ...typography.input,
    fontSize: 13,
    color: "#7F1D1D",
    flex: 1,
    lineHeight: 18,
  },

  confirmCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  checkboxLabel: {
    ...typography.input,
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },

  passwordSection: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  passwordLabel: {
    ...typography.input,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 10,
  },

  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    backgroundColor: "white",
    marginBottom: 8,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
  },

  passwordInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },

  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  errorText: {
    ...typography.input,
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
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

  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    gap: 8,
  },

  infoText: {
    ...typography.input,
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },

  bold: {
    fontWeight: "700",
    color: "#1F2937",
  },
});
