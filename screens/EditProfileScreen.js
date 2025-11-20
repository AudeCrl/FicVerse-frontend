import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Input from "../components/ui/Input";
import RoundedButton from "../components/ui/RoundedButton";
import { useTheme } from "../context/ThemeContext.js";
import {
  updateEmail,
  updateUsername,
} from "../reducers/user";
import { typography } from "../styles/globalStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { currentTheme } = useTheme();

  const user = useSelector((state) => state.user.value); //Résoudre le probleme : si on se deconnecte et reconnecte avec un autre compte, les informations de l'ancien utilisateur son affiché à l'écran

  // États pour l'édition du username
  const [username, setUsername] = useState(user.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  // États pour l'édition de l'email
  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  // États pour l'édition du mot de passe
  const [displayedPassword, setDisplayedPassword] = useState("••••••••");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user.username) {
      setUsername(user.username);
      setCurrentEmail(user.email);
      setIsEditingUsername(false);
      setIsEditingEmail(false);
      setIsEditingPassword(false);
    } else {
      setUsername("");
      setCurrentEmail("");
    }
    setDisplayedPassword("••••••••");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
  }, [user]);

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: currentTheme.background,
        },
        scrollContent: {
          paddingVertical: 28,
          rowGap: 12,
        },
        
        // ----------------------------------------------------
        // --- SECTION INFORMATIONS ---
        section: {
          marginBottom: 24,
          paddingHorizontal: 16,
        },
        sectionTitle: {
          ...typography.h3,
          color: currentTheme.text,
          marginBottom: 16,
          paddingHorizontal: 4,
        },

        // Conteneur pour chaque champ éditable
        fieldContainer: {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingVertical: 8,
          gap: 8,
        },
        inputWrapper: {
          flex: 1,
          marginRight: 8,
        },
        input: {
          ...typography.input,
          color: currentTheme.text,
          backgroundColor: currentTheme.background,
          borderColor: currentTheme.inputBorder,
          fontSize: 14,
        },
        editButton: {
          bottom: 10,
          width: 24,
        },

        // Conteneur des champs password supplémentaires (en mode édition)
        passwordFieldsContainer: {
          marginTop: 8,
        },

        // ----------------------------------------------------
        // --- BOUTONS ---
        buttonContainer: {
          marginTop: 8,
          gap: 12,
        },
        cancelButton: {
          ...typography.button,
          borderRadius: 10,
          paddingVertical: 12,
          marginHorizontal: 16,
        },
      }),
    [currentTheme]
  );

  // --- Fonctions copiées de ProfileScreen ---

  const handleEditUsername = () => {
    console.log("Edit Username clicked");

    const token = user.token;

    if (!isEditingUsername) {
      setIsEditingUsername(true);
    } else if (isEditingUsername) {
      if (!user.token) {
        console.error("Erreur: Token utilisateur manquant.");
        alert("Erreur: Token manquant.");
        return;
      }
      setTempUsername(tempUsername.trim());

      if (tempUsername === "" || tempUsername === username) {
        setIsEditingUsername(false);
        setTempUsername("");
        return;
      }

      fetch(`${API_URL}/user/username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: tempUsername }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setUsername(data.username);
            dispatch(updateUsername(data.username));
            setIsEditingUsername(false);
            setTempUsername("");
            alert("Nom d'utilisateur mis à jour");
          } else {
            alert(`Echec de la mise à jour: ${data.error}`);
            setIsEditingUsername(false);
          }
        })
        .catch((error) => {
          console.error(
            "Erreur réseau lors de la mise à jour du username:",
            error
          );
          alert("Erreur réseau lors de la mise à jour.");
          setIsEditingUsername(false);
        });
    }
  };

  const handleEditEmail = () => {
    console.log("Edit Email clicked");

    const token = user.token;

    if (!isEditingEmail) {
      setIsEditingEmail(true);
    } else if (isEditingEmail) {
      if (!user.token) {
        console.error("Erreur: Token utilisateur manquant.");
        alert("Erreur: Token manquant.");
        return;
      }
      setTempEmail(tempEmail.trim());

      if (tempEmail === "" || tempEmail === currentEmail) {
        setIsEditingEmail(false);
        setTempEmail("");
        return;
      }

      fetch(`${API_URL}/user/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: tempEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setCurrentEmail(data.email);
            dispatch(updateEmail(data.email));
            setIsEditingEmail(false);
            setTempEmail("");
            alert("Email mis à jour");
          } else {
            alert(`Echec de la mise à jour: ${data.error}`);
            setIsEditingEmail(false);
          }
        })
        .catch((error) => {
          console.error(
            "Erreur réseau lors de la mise à jour de l'adresse email:",
            error
          );
          alert("Erreur réseau lors de la mise à jour.");
          setIsEditingEmail(false);
        });
    }
  };

  const handleEditPassword = () => {
    console.log("Edit Password clicked");

    const token = user.token;

    if (!isEditingPassword) {
      setIsEditingPassword(true);
    } else if (isEditingPassword) {
      // Validations
      if (!newPassword || !confirmPassword || !currentPassword) {
        alert("Veuillez remplir tous les champs");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }

      if (newPassword.length < 6) {
        alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
        return;
      }

      if (!user.token) {
        console.error("Erreur: Token utilisateur manquant.");
        alert("Erreur: Token manquant.");
        return;
      }

      // Fusion de la logique de fetchNewPassword ici
      fetch(`${API_URL}/user/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setIsEditingPassword(false);
            setNewPassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            alert("Changement du mot de passe effectué");
          } else {
            alert(`Echec de la mise à jour du mot de passe: ${data.error}`);
            setIsEditingPassword(false);
          }
        })
        .catch((error) => {
          console.error(
            "Erreur réseau lors de la mise à jour du mot de passe :",
            error
          );
          alert("Erreur réseau lors de la mise à jour.");
          setIsEditingPassword(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title="Editer mes informations"
          screenName="manage"
          showToggle={false}
          onProfilePress={() => navigation.navigate("Profile")}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Section informations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

            {/* Username */}
            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Input
                  style={styles.input}
                  value={isEditingUsername ? tempUsername : username}
                  onChangeText={setTempUsername}
                  editable={isEditingUsername}
                  placeholder={isEditingUsername ? username : null}
                  inputLabel="Nom d'utilisateur :"
                />
              </View>
              <View style={styles.editButton}>
                <TouchableOpacity onPress={handleEditUsername}>
                  <Feather
                    name={isEditingUsername ? "check" : "edit"}
                    size={24}
                    color={currentTheme.primaryPlus}
                  />
                </TouchableOpacity>
                {isEditingUsername && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingUsername(false);
                      setTempUsername("");
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Input
                  style={styles.input}
                  value={isEditingEmail ? tempEmail : currentEmail}
                  onChangeText={setTempEmail}
                  editable={isEditingEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder={isEditingEmail ? currentEmail : null}
                  inputLabel="Votre mail :"
                />
              </View>
              <View style={styles.editButton}>
                <TouchableOpacity onPress={handleEditEmail}>
                  <Feather
                    name={isEditingEmail ? "check" : "edit"}
                    size={24}
                    color={currentTheme.primaryPlus}
                  />
                </TouchableOpacity>
                {isEditingEmail && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingEmail(false);
                      setTempEmail("");
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password - CORRECTION DU BUG: Afficher newPassword quand on édite */}
            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Input
                  style={styles.input}
                  value={isEditingPassword ? newPassword : displayedPassword}
                  onChangeText={setNewPassword}
                  editable={isEditingPassword}
                  secureTextEntry={isEditingPassword}
                  inputLabel="Nouveau mot de passe :"
                />
              </View>
              <View style={styles.editButton}>
                <TouchableOpacity
                  onPress={() => {
                    if (isEditingPassword) {
                      setIsEditingPassword(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setCurrentPassword("");
                    } else {
                      setIsEditingPassword(true);
                    }
                  }}
                >
                  <Feather
                    name="edit"
                    size={24}
                    color={currentTheme.primaryPlus}
                  />
                </TouchableOpacity>
                {isEditingPassword && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingPassword(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setCurrentPassword("");
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Champs supplémentaires pour le mot de passe (apparaissent en mode édition) */}
            {isEditingPassword && (
              <View style={styles.passwordFieldsContainer}>
                <View style={styles.fieldContainer}>
                  <View style={styles.inputWrapper}>
                    <Input
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      editable={true}
                      secureTextEntry={true}
                      inputLabel="Confirmer le nouveau mot de passe :"
                      placeholder="Retapez le nouveau mot de passe"
                    />
                  </View>
                  <View style={styles.editButton} />
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.inputWrapper}>
                    <Input
                      style={styles.input}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      editable={true}
                      secureTextEntry={true}
                      inputLabel="Mot de passe actuel :"
                      placeholder="Pour confirmer les changements"
                    />
                  </View>
                  <View style={styles.editButton}>
                    <TouchableOpacity onPress={handleEditPassword}>
                      <Feather
                        name="check"
                        size={24}
                        color={currentTheme.primaryPlus}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Bouton Retour */}
          <View style={styles.buttonContainer}>
            <RoundedButton
              label="Retour au profil"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              active={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
