import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmAccountDelete from "../components/ConfirmAccountDelete";
import PersonalizationCard from "../components/PersonalizationCard";
import RoundedButton from "../components/ui/RoundedButton";
import { useTheme } from "../context/ThemeContext.js";
import {
  logout,
  updateAvatar,
} from "../reducers/user";
import { typography } from "../styles/globalStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

  const user = useSelector((state) => state.user.value);

  const formattedDate = formatDate(user.createdAt);

  const [avatarUri, setAvatarUri] = useState(
    user.avatar || require("../assets/avatar-default.png")
  );

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingTop: 85,
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // ----------------------------------------------------
    // --- CONTENU PRINCIPAL ---
    mainContainer: {
      width: "100%",
      paddingTop: 20,
      paddingHorizontal: 24,
    },

    // --- AVATAR (scrollable) ---
    avatarContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: currentTheme.background,
      alignSelf: "center",
      zIndex: 10,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
    editAvatarButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 12,
      padding: 4,
    },

    // --- STYLE GÉNÉRIQUE POUR TOUTES LES CARDS ---
    card: {
      backgroundColor: currentTheme.background,
      alignItems: 'center',
      borderRadius: 15,
      paddingHorizontal: 24,
      paddingVertical: 20,
      marginBottom: 30,
      borderWidth: 0,
    },

    // Card userInfo (lecture seule)
    userInfoCard: {
      paddingTop: 50,
      marginTop: -40,
    },
    userInfoTextContainer: {
      marginBottom: 7,
    },
    usernameText: {
      ...typography.h2,
      color: currentTheme.text,
    },
    emailText: {
      ...typography.body,
      fontSize: 18,
      color: currentTheme.text,
      textAlign: "center",
    },
    memberSinceText: {
      ...typography.small,
      fontSize: 12,
      color: currentTheme.secondaryText,
      textAlign: "center",
      marginVertical: 5,
    },
    editButtonContainer: {
      alignItems: "center",
    },
    editInfoButton: {
      width: 250,
    },

    // Card 3 : Boutons de gestion
    manageButton: {
      width: 250,
      marginBottom: 14,
    },
    lastManageButton: {
      width: 250,
    },

    // Card 4 : Gestion du compte
    manageAccountContainer: {
      alignItems: "center",
      gap: 14,
      marginBottom: 70,
    },
    logout: {
      width: 250,
    },
    removeAccount: {
      width: 250,
      backgroundColor: "#df2727",
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

    fetch(`${API_URL}/user/upload`, {
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
    setIsDeleteModalVisible(true);
  };

  // Appelé par ConfirmAccountDelete après validation du mot de passe
  const confirmDeletion = async (password) => {
    try {
      setIsDeletingAccount(true);

      const response = await fetch(`${API_URL}/user/delete-account`, {
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
        setIsDeleteModalVisible(false);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression:", error);
      alert("Erreur de connexion au serveur. Veuillez vérifier votre réseau.");
      setIsDeleteModalVisible(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ImageBackground
        source={currentTheme.profileBackground}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Modale suppression compte */}
        <ConfirmAccountDelete
          visible={isDeleteModalVisible}
          userEmail={user.email}
          onConfirm={confirmDeletion}
          onCancel={() => setIsDeleteModalVisible(false)}
          isLoading={isDeletingAccount}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.mainContainer}>
          {/* Avatar */}
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

          <View style={[styles.card, styles.userInfoCard]}>
            {/* Username */}
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.usernameText}>{user.username}</Text>
            </View>

            {/* Email */}
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>

            {/* Membre depuis */}
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.memberSinceText}>
                Membre FicVerse depuis le {formattedDate}
              </Text>
            </View>

            {/* Bouton Modifier les informations */}
            <View style={styles.editButtonContainer}>
              <RoundedButton
                label="Modifier les informations"
                onPress={() => navigation.navigate("EditProfile")}
                style={styles.editInfoButton}
                active={true}
              />
            </View>
          </View>

          {/* Card 2 : Personnalisation */}
          <PersonalizationCard />

          {/* Card 3 : Navigation vers les écrans de gestion */}
          <View style={styles.card}>
            <RoundedButton
              label='Gérer mes fandoms'
              onPress={() => navigation.navigate("FandomsManager")}
              style={styles.manageButton}
              active={true}
            />
            <RoundedButton
              label='Gérer mes auteurs et autrices'
              onPress={() => navigation.navigate("AuthorsManager")}
              style={styles.manageButton}
              active={true}
            />
            <RoundedButton
              label='Gérer mes tags'
              onPress={() => navigation.navigate("TagsManager")}
              style={styles.manageButton}
              active={true}
            />
            <RoundedButton
              label='Gérer mes langues'
              onPress={() => navigation.navigate("LanguagesManager")}
              style={styles.lastManageButton}
              active={true}
            />
          </View>

          {/* Card 4 : Déconnexion et suppression */}
          <View style={[styles.card, styles.manageAccountContainer]}>
            <RoundedButton
              label='Se déconnecter'
              onPress={handleLogout}
              style={styles.logout}
              active={true}
            />
            <RoundedButton
              label='Supprimer le compte'
              onPress={handleRemoveAccount}
              style={styles.removeAccount}
              active={true}
              textColor='white'
            />
          </View>
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
