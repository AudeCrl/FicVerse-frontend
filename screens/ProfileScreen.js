import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ConfirmAccountDelete from "../components/ConfirmAccountDelete";
import AddTagModal from "../components/fiction/AddTagModal";
import SettingsCard from "../components/SettingsCard";
import TagsCard from "../components/TagsCard";
import Input from "../components/ui/Input";
import { useTheme } from "../context/ThemeContext.js";
import {
  logout,
  updateAvatar,
  updateEmail,
  updateUsername,
} from "../reducers/user";
import { typography } from "../styles/globalStyles";
import { chipsPreview } from "../utils/chipsFormatter";
import RoundedButton from "../components/ui/RoundedButton"

const API_IP = process.env.EXPO_PUBLIC_API_URL;

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { currentTheme } = useTheme();

  const user = useSelector((state) => state.user.value); //Résoudre le probleme : si on se deconnecte et reconnecte avec un autre compte, les informations de l'ancien utilisateur son affiché à l'écran
  // console.log(user);

  const formattedDate = formatDate(user.createdAt);

  const [avatarUri, setAvatarUri] = useState(
    user.avatar || require("../assets/avatar-default.png")
  );

  const [username, setUsername] = useState(user.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  const [displayedPassword, setDisplayedPassword] = useState("••••••••");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isModalPasswordVisible, setIsModalPasswordVisible] = useState(false);

  // Tags, Fandoms, Languages
  const [userTags, setUserTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [userFandoms, setUserFandoms] = useState([]);
  const [allFandoms, setAllFandoms] = useState([]);
  const [userLanguages, setUserLanguages] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [userAuthors, setUserAuthors] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isLoadingFandoms, setIsLoadingFandoms] = useState(false);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);

  useEffect(() => {
    if (user.username) {
      setAvatarUri(user.avatar || require("../assets/avatar-default.png"));
      setUsername(user.username);
      setCurrentEmail(user.email);
      setIsEditingUsername(false);
      setIsEditingEmail(false);
      setIsEditingPassword(false);

      // Charger les items
      loadUserTags();
      loadAllTags();
      loadUserFandoms();
      loadAllFandoms();
      loadAllLanguages();
      loadUserAuthors();
    } else {
      setUsername("");
      setCurrentEmail("");
      setAvatarUri(require("../assets/avatar-default.png"));
    }
    setDisplayedPassword("••••••••");
    setNewPassword("");
  }, [user]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      // paddingBottom: 20,
    },

    // ----------------------------------------------------
    // --- 1. EN-TÊTE (Background 30%) ---
    profileHeader: {
      width: "100%",
      height: 200, // Hauteur fixe pour le header
      alignItems: "center",
      justifyContent: "flex-end", // Aligne l'avatar en bas du conteneur
      position: "relative", // Point de référence pour l'avatar positionné en absolu
      zIndex: 1,
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },

    // --- AVATAR (Chevauchement) ---
    avatarContainer: {
      width: 120, // Taille de l'avatar (ajustée)
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: currentTheme.background, // Contour blanc pour l'effet de chevauchement
      position: "absolute", // Positionnement absolu dans profileHeader
      bottom: -60, // Déplace l'avatar de la moitié de sa hauteur (120/2) vers le bas
      zIndex: 10,
      // Enlevez 'overflow: hidden' pour le conteneur, sinon l'Image pourrait être coupée
      // L'Image elle-même doit avoir le borderRadius
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 60, // Doit correspondre à la moitié de la largeur/hauteur de avatarContainer
    },
    editAvatarButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.5)", // Fond semi-transparent pour le bouton d'édition
      borderRadius: 12,
      padding: 4,
    },

    // ----------------------------------------------------
    // --- 2. CONTENU PRINCIPAL (70% du bas) ---
    mainContainer: {
      width: "100%",
      paddingTop: 60,
      paddingHorizontal: 16,
      backgroundColor: currentTheme.background,
    },

    // Conteneur pour grouper username/email/password
    usernameEmailWrapper: {
      backgroundColor: currentTheme.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: currentTheme.segmentation,
    },

    // Styles pour les éléments internes
    usernameContainer: {
      // alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
      flexDirection: "row",
      gap: 8,
      flex: 1,
      // backgroundColor: 'red',
    },
    inputUsernameCont: {
      // flex: 1,
      justifyContent: "center",
      // alignItems: 'center',
      alignContent: "center",
      minWidth: 150,
      marginLeft: 24,      
    },
    editButtonUsername: {
      justifyContent: "center",
      bottom: 3,
      // alignContent: 'flex-end',
      // alignItems: 'flex-end',
      // right: 5,
    },
    memberSince: {},
    memberSinceText: {
      // ...typography.small,
      marginTop: 8,
      // fontSize: 12,
      color: currentTheme.secondaryText,
      textAlign: "center",
      fontStyle: "italic",
    },

    // Ligne de séparation entre les sections
    sectionSeparator: {
      height: 1,
      backgroundColor: currentTheme.segmentation,
      marginVertical: 12,
    },

    // Conteneurs des champs d'édition (mis à jour pour être alignés)
    emailContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingVertical: 8,
      gap: 8,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingVertical: 8,
      gap: 8,
    },

    // Styles d'inputs (assurez-vous d'ajouter `flex: 1` pour qu'ils prennent l'espace)
    inputUsername: {
      ...typography.input,
      textAlign: "center",
      fontSize: 18,
      color: currentTheme.primaryPlus,
      backgroundColor: currentTheme.background,
      borderColor: currentTheme.inputBorder,
    },
    inputEmail: {
      ...typography.input,
      color: currentTheme.primaryPlus,
      backgroundColor: currentTheme.background,
      borderColor: currentTheme.inputBorder,
      flex: 1,
      marginRight: 8,
      fontSize: 14,
    },
    inputPassword: {
      ...typography.input,
      color: currentTheme.primaryPlus,
      backgroundColor: currentTheme.background,
      borderColor: currentTheme.inputBorder,
      flex: 1,
      marginRight: 8,
      fontSize: 14,
    },
    editButton: {
      bottom: 10,
    },

    // Conteneurs des autres paramètres
    settingsSection: {
      // paddingHorizontal: 0,
      marginBottom: 20,
      marginTop: 20,
    },
    // ----------------------------------------------------
    // --- 3. FOOTER ---
    manageAccountContainer: {
      width: "100%",
      paddingVertical: 16,
      // paddingHorizontal: 30,
      marginBottom: 40,
      alignItems: "center",
      backgroundColor: currentTheme.background,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      gap: 10,
      flex: 1,
    },
    logout: {
      ...typography.button,
      width: 250,
      // backgroundColor: "#FFFFFF",
      // borderColor: "#E5E7EB",
      // borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      // paddingHorizontal: 2,
    },
    removeAccount: {
      ...typography.button,
      width: 250,
      backgroundColor: "#df2727ff",
      // borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },

    // --- FANDOMS CARD ---
    fandomsCard: {
      backgroundColor: currentTheme.background,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: currentTheme.segmentation,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginVertical: 8,
    },
    fandomsTitle: {
      ...typography.h4,
      color: currentTheme.text,
      marginBottom: 8,
    },
    fandomsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 8,
    },
    fandomChip: {
      backgroundColor: "#E0E0E0",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    fandomText: {
      ...typography.body,
      color: "#2E2E2E",
      fontWeight: "500",
    },
    emptyFandomsText: {
      ...typography.body,
      color: currentTheme.secondaryText,
      fontStyle: "italic",
    },
    fandomsNavButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      gap: 8,
    },
    fandomsNavText: {
      ...typography.body,
      color: currentTheme.primary,
      fontWeight: "600",
    },
  });

  const handleEditAvatar = async () => {
    console.log("Edit Avatar clicked");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Désolé, nous avons besoin des autorisations de la galerie pour cela !"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri, mimeType, fileName } = result.assets[0];
      handleUploadAvatar(uri, mimeType, fileName);
    }
  };

  const handleUploadAvatar = (uri, mimeType, fileName) => {
    const userToken = user.token;
    if (!userToken) {
      return console.log("Invalid or missing user token");
    }

    const formData = new FormData();

    formData.append("avatarFromFront", {
      uri: uri,
      name: fileName || "avatar.jpg",
      type: mimeType || "image/jpeg",
    });

    fetch(`${API_IP}/user/upload`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${userToken}`,
        //Pas de 'Content-Type': 'application/json' avec un 'formData'
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setAvatarUri(data.avatarUrl);
          dispatch(updateAvatar(data.avatarUrl));
        } else {
          console.error("Upload failed:", data.error);
          alert(`Echec de l'upload: ${data.error}`);
        }
      })
      .catch((error) => {
        console.error("Network error during upload", error);
        alert("Erreur réseau lors de l'envoi de l'avatar.");
      });
  };

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

      fetch(`${API_IP}/user/username`, {
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

      fetch(`${API_IP}/user/email`, {
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
      if (newPassword === "") {
        setIsEditingPassword(false);
        setNewPassword("");
        return;
      }

      setIsModalPasswordVisible(true);
    }
  };

  const fetchNewPassword = () => {
    const token = user.token;

    if (!user.token) {
      console.error("Erreur: Token utilisateur manquant.");
      alert("Erreur: Token manquant.");
      return;
    }

    fetch(`${API_IP}/user/password`, {
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
  };

  // ====== TAGS ======
  const loadUserTags = async () => {
    try {
      const response = await fetch(`${API_IP}/tag`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (data.result) {
        const normalizedTags = (data.tags || []).map((tag) => ({
          ...tag,
          id: tag._id || tag.id,
        }));
        setUserTags(normalizedTags);
      }
    } catch (error) {
      console.error("Erreur chargement tags:", error);
    }
  };

  const loadAllTags = async () => {
    try {
      const response = await fetch(`${API_IP}/tag/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (data.result) {
        const normalizedTags = (data.tags || []).map((tag) => ({
          ...tag,
          id: tag._id || tag.id,
        }));
        setAllTags(normalizedTags);
      }
    } catch (error) {
      console.error("Erreur chargement tous les tags:", error);
    }
  };

  const handleAddTag = async (tag) => {
    setIsLoadingTags(true);
    try {
      if (!userTags.find((t) => t.id === tag.id)) {
        setUserTags([...userTags, tag]);
      }
    } catch (error) {
      console.error("Erreur ajout tag:", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleRemoveTag = async (tag, action = "delete") => {
    setIsLoadingTags(true);
    try {
      const deleteEndpoint = `${API_IP}/tag/${tag.id}${
        action === "detach" ? "?detach=true" : "?force=true"
      }`;

      const response = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await response.json();

      if (data.result) {
        setUserTags(userTags.filter((t) => t.id !== tag.id));
        alert(
          action === "detach"
            ? `Tag retiré de ${data.detachedFromCount} fanfiction(s) et supprimé`
            : "Tag supprimé avec succès"
        );
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error("Erreur suppression tag:", error);
      alert("Erreur lors de la suppression du tag");
    } finally {
      setIsLoadingTags(false);
    }
  };

  const getTagUsageCount = async (tagId) => {
    try {
      const response = await fetch(`${API_IP}/tag/${tagId}/usage-count`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      return data.usageCount || 0;
    } catch (error) {
      console.error("Erreur récupération usage count:", error);
      return 0;
    }
  };

  // ====== FANDOMS ======
  const loadUserFandoms = async () => {
    try {
      const response = await fetch(`${API_IP}/fandom/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (data.result) {
        const normalizedFandoms = (data.fandoms || []).map((fandom) => ({
          ...fandom,
          id: fandom._id || fandom.id,
        }));
        setUserFandoms(normalizedFandoms);
      }
    } catch (error) {
      console.error("Erreur chargement fandoms:", error);
    }
  };

  const loadAllFandoms = async () => {
    try {
      const response = await fetch(`${API_IP}/fandom`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (data.result) {
        const normalizedFandoms = (data.fandoms || []).map((fandom) => ({
          ...fandom,
          id: fandom._id || fandom.id,
        }));
        setAllFandoms(normalizedFandoms);
      }
    } catch (error) {
      console.error("Erreur chargement tous les fandoms:", error);
    }
  };

  const handleAddFandom = async (fandom) => {
    setIsLoadingFandoms(true);
    try {
      if (!userFandoms.find((f) => f.id === fandom.id)) {
        setUserFandoms([...userFandoms, fandom]);
      }
    } catch (error) {
      console.error("Erreur ajout fandom:", error);
    } finally {
      setIsLoadingFandoms(false);
    }
  };

  const handleRemoveFandom = async (fandom, action = "delete") => {
    setIsLoadingFandoms(true);
    try {
      const deleteEndpoint = `${API_IP}/fandom/${fandom.id}${
        action === "detach" ? "?detach=true" : "?force=true"
      }`;

      const response = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await response.json();

      if (data.result) {
        setUserFandoms(userFandoms.filter((f) => f.id !== fandom.id));
        alert(
          action === "detach"
            ? `Fandom retiré de ${data.detachedFromCount} fanfiction(s) et supprimé`
            : "Fandom supprimé avec succès"
        );
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error("Erreur suppression fandom:", error);
      alert("Erreur lors de la suppression du fandom");
    } finally {
      setIsLoadingFandoms(false);
    }
  };

  const getFandomUsageCount = async (fandomId) => {
    try {
      const response = await fetch(`${API_IP}/fandom/${fandomId}/usage-count`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      return data.usageCount || 0;
    } catch (error) {
      console.error("Erreur récupération usage count:", error);
      return 0;
    }
  };

  // ====== LANGUAGES ======
  const loadAllLanguages = async () => {
    try {
      setAllLanguages([
        { id: "lang-1", name: "Français" },
        { id: "lang-2", name: "Anglais" },
        { id: "lang-3", name: "Espagnol" },
        { id: "lang-4", name: "Allemand" },
        { id: "lang-5", name: "Italien" },
      ]);
    } catch (error) {
      console.error("Erreur chargement langues:", error);
    }
  };

  const handleAddLanguage = async (language) => {
    setIsLoadingLanguages(true);
    try {
      if (!userLanguages.find((l) => l.id === language.id)) {
        setUserLanguages([...userLanguages, language]);
      }
    } catch (error) {
      console.error("Erreur ajout langue:", error);
    } finally {
      setIsLoadingLanguages(false);
    }
  };

  const handleRemoveLanguage = async (language) => {
    setIsLoadingLanguages(true);
    try {
      setUserLanguages(userLanguages.filter((l) => l.id !== language.id));
      alert("Langue supprimée");
    } catch (error) {
      console.error("Erreur suppression langue:", error);
    } finally {
      setIsLoadingLanguages(false);
    }
  };

  const getLanguageUsageCount = async () => {
    return 0;
  };

  // ====== AUTHORS ======
  const loadUserAuthors = async () => {
    try {
      setIsLoadingAuthors(true);
      // TODO: Remplacer par l'appel API réel quand disponible
      // const response = await fetch(`${API_IP}/author`, {
      //   headers: { Authorization: `Bearer ${user.token}` },
      // });
      // const data = await response.json();
      // if (data.result) {
      //   setUserAuthors(data.authors || []);
      // }

      // Pour maintenant, on simule avec des données vides
      setUserAuthors([]);
    } catch (error) {
      console.error("Erreur chargement auteurs:", error);
    } finally {
      setIsLoadingAuthors(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Auth", { initialForm: "login" });
  };

  // Ouvrir modale double confirmation pour suppression de compte
  const handleRemoveAccount = () => {
    if (!user.token) {
      console.error("Erreur: Token utilisateur manquant.");
      alert("Erreur: Token manquant.");
      return;
    }
    setIsModalVisible(true);
  };

  // Appelé par ConfirmAccountDelete après validation du mot de passe
  const confirmDeletion = async (password) => {
    try {
      setIsModalPasswordVisible(true);

      const response = await fetch(`${API_IP}/user/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.result) {
        alert("Compte supprimé avec succès.");
        console.log("Compte supprimé avec succès.");
        dispatch(logout());
        navigation.navigate("Auth");
      } else {
        console.error("Échec de la suppression du compte:", data.error);
        alert(`Erreur de suppression: ${data.error}`);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression:", error);
      alert("Erreur de connexion au serveur. Veuillez vérifier votre réseau.");
      setIsModalVisible(false);
    } finally {
      setIsModalPasswordVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modale suppression compte */}
      <ConfirmAccountDelete
        visible={isModalVisible}
        userEmail={user.email}
        onConfirm={confirmDeletion}
        onCancel={() => setIsModalVisible(false)}
        isLoading={isModalPasswordVisible}
      />
      <View style={styles.profileHeader}>
        <ImageBackground
          source={currentTheme.headerBackground}
          style={styles.backgroundImage}
        />
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarImage}
            source={
              typeof avatarUri === "string" ? { uri: avatarUri } : avatarUri
            }
          />
          <TouchableOpacity
            onPress={handleEditAvatar}
            style={styles.editAvatarButton}
          >
            <Feather name="edit" size={24} color={currentTheme.primaryPlus} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.usernameEmailWrapper}>
            <View style={styles.usernameContainer}>
              <View style={styles.inputUsernameCont}>
                <Input
                  style={styles.inputUsername}
                  value={isEditingUsername ? tempUsername : username}
                  onChangeText={setTempUsername}
                  editable={isEditingUsername}
                  placeholder={isEditingUsername ? username : null}
                />
              </View>
              <View style={styles.editButtonUsername}>
                <TouchableOpacity onPress={handleEditUsername}>
                  <Feather
                    name={isEditingUsername ? "check" : "edit"}
                    size={24}
                    color={currentTheme.primaryPlus}
                  />
                </TouchableOpacity>
                {isEditingUsername && (
                  <TouchableOpacity onPress={() => setIsEditingUsername(false)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.memberSince}>
              <Text style={styles.memberSinceText}>
                Membre FicVerse depuis le {formattedDate}
              </Text>
            </View>

            <View style={styles.sectionSeparator} />

            <View style={styles.emailContainer}>
              <View style={{ flex: 1 }}>
                <Input
                  style={styles.inputEmail}
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
                  <TouchableOpacity onPress={() => setIsEditingEmail(false)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.sectionSeparator} />

            <View style={styles.passwordContainer}>
              <View style={{ flex: 1 }}>
                <Input
                  style={styles.inputPassword}
                  value={displayedPassword}
                  onChangeText={setNewPassword}
                  editable={isEditingPassword}
                  secureTextEntry={isEditingPassword}
                  inputLabel="Mot de passe :"
                />
              </View>
              <View style={styles.editButton}>
                <TouchableOpacity onPress={handleEditPassword}>
                  <Feather name="edit" size={24} color={currentTheme.primaryPlus} />
                </TouchableOpacity>
                {isEditingPassword && (
                  <TouchableOpacity onPress={() => setIsEditingPassword(false)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.settingsSection}>
            {/* Thème */}
            {/* <SettingsCard
              title="Thème de l'interface"
              icon="palette-outline"
              onPress={() => navigation.navigate("Theme")}
              testID="settings-theme"
              isEmpty
            /> */}

            {/* Tags */}
            <TagsCard
              title="Mes tags"
              tags={userTags}
              onAddTagPress={() => setShowAddTagModal(true)}
              onPress={() => navigation.navigate("TagsManager")}
              emptyText="Aucun tag ajouté"
            />

            {/* Fandoms - En lecture seule avec chips gris */}
            <View style={styles.fandomsCard}>
              <Text style={styles.fandomsTitle}>Mes fandoms</Text>
              {userFandoms.length > 0 ? (
                <View style={styles.fandomsRow}>
                  {userFandoms.map((fandom) => (
                    <View
                      key={fandom._id || fandom.id}
                      style={styles.fandomChip}
                    >
                      <Text style={styles.fandomText}>{fandom.name}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyFandomsText}>Aucun fandom ajouté</Text>
              )}
              {userFandoms.length > 0 && (
                <TouchableOpacity
                  style={styles.fandomsNavButton}
                  onPress={() => navigation.navigate("FandomsManager")}
                >
                  <Text style={styles.fandomsNavText}>Gérer les fandoms</Text>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={currentTheme.primary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Langues */}
            <SettingsCard
              title="Mes langues"
              count={userLanguages.length}
              chips={chipsPreview(
                userLanguages.map((l) => l.name),
                3
              )}
              onPress={() => navigation.navigate("LanguagesManager")}
              testID="settings-languages"
              isEmpty={userLanguages.length === 0}
            />

            {/* Auteurs */}
            <SettingsCard
              title="Mes auteurs"
              count={userAuthors.length}
              chips={chipsPreview(
                userAuthors.map((a) => a.name || a.username),
                3
              )}
              onPress={() => navigation.navigate("AuthorsManager")}
              testID="settings-authors"
              isEmpty={userAuthors.length === 0}
            />
          </View>
        </View>
        <View style={styles.manageAccountContainer}>
          {/* <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Se déconnecter</Text>
          </TouchableOpacity> */}
          <RoundedButton
            label='Se déconnecter'
            onPress={handleLogout}
            style={styles.logout}
            active={true}
          />
          {/* <TouchableOpacity onPress={handleRemoveAccount}>
            <Text style={styles.removeAccount}>Supprimer le compte</Text>
          </TouchableOpacity> */}
          <RoundedButton
            label='Supprimer le compte'
            onPress={handleRemoveAccount}
            style={styles.removeAccount}
            active={true}
            textColor='white'
          />
        </View>
      </ScrollView>
      {/* Modal pour ajouter des tags au profil */}
      <AddTagModal
        visible={showAddTagModal}
        onClose={() => setShowAddTagModal(false)}
        fictionId={null}
        currentTags={userTags}
        onTagsAdded={(newTags) => {
          // Ajouter les nouveaux tags à la liste
          setUserTags([...userTags, ...newTags]);
          setShowAddTagModal(false);
        }}
      />
    </View>
  );
}
