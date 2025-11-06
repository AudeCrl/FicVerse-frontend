import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { typography } from "../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '../context/ThemeContext.js';
import { logout, updateAvatar, updateUsername, updateEmail } from "../reducers/user";
import Input from "../components/ui/Input"
import * as ImagePicker from 'expo-image-picker'

const API_IP = process.env.EXPO_PUBLIC_API_URL;

const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { currentTheme, variant, toggleVariant } = useTheme();

  const user = useSelector((state) => state.user.value); //Résoudre le probleme : si on se deconnecte et reconnecte avec un autre compte, les informations de l'ancien utilisateur son affiché à l'écran
  // console.log(user);

  const formattedDate = formatDate(user.createdAt);

  const [avatarUri, setAvatarUri] = useState(user.avatar || require('../assets/avatar-default.png'));

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

  useEffect(() => {
    if (user.username) {
        setAvatarUri(user.avatar || require ('../assets/avatar-default.png'));
        setUsername(user.username);
        setCurrentEmail(user.email);
        setIsEditingUsername(false); 
        setIsEditingEmail(false);
        setIsEditingPassword(false);
    } else {
        setUsername('');
        setCurrentEmail('');
        setAvatarUri(require("../assets/avatar-default.png"));
    }
    setDisplayedPassword('••••••••');
    setNewPassword('');
  }, [user]);

  const handleEditAvatar = async () => {
    console.log("Edit Avatar clicked");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin des autorisations de la galerie pour cela !');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
      return console.log('Invalid or missing user token');      
    };

    const formData = new FormData();

    formData.append('avatarFromFront', {
      uri: uri,
      name: fileName || 'avatar.jpg',
      type: mimeType || 'image/jpeg',
    });

    fetch(`${API_IP}/user/upload`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userToken}`,
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
        console.error('Upload failed:', data.error);
        alert(`Echec de l'upload: ${data.error}`);        
      }      
    })
    .catch((error) => {
      console.error('Network error during upload', error);
      alert('Erreur réseau lors de l\'envoi de l\'avatar.');      
    });
  };

  const handleEditUsername = () => {
    console.log("Edit Username clicked");    

    const token = user.token

    if (!isEditingUsername) {
      setIsEditingUsername(true);
    } else if (isEditingUsername) {
      if (!user.token) {
        console.error('Erreur: Token utilisateur manquant.');
        alert('Erreur: Token manquant.');
        return;        
    }
    setTempUsername(tempUsername.trim())

    if (tempUsername === '' || tempUsername === username) {
      setIsEditingUsername(false);
      setTempUsername('');
      return;
    }

    fetch(`${API_IP}/user/username`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: tempUsername})
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) {
        setUsername(data.username);
        dispatch(updateUsername(data.username));
        setIsEditingUsername(false);
        setTempUsername('');
        alert('Nom d\'utilisateur mis à jour');
      } else {
        alert (`Echec de la mise à jour: ${data.error}`);
        setIsEditingUsername(false);
      }
    })
    .catch(error => {
      console.error('Erreur réseau lors de la mise à jour du username:', error);
      alert('Erreur réseau lors de la mise à jour.');
      setIsEditingUsername(false);      
    })
    }
  };

  const handleEditEmail = () => {
    console.log("Edit Email clicked");

    const token = user.token

    if (!isEditingEmail) {
      setIsEditingEmail(true);
    } else if (isEditingEmail) {
      if (!user.token) {
        console.error('Erreur: Token utilisateur manquant.');
        alert('Erreur: Token manquant.');
        return;        
    }
    setTempEmail(tempEmail.trim())

    if (tempEmail === '' || tempEmail === currentEmail) {
      setIsEditingEmail(false);
      setTempEmail('');
      return;
    }

    fetch(`${API_IP}/user/email`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email: tempEmail})
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) {
        setCurrentEmail(data.email);
        dispatch(updateEmail(data.email));
        setIsEditingEmail(false);
        setTempEmail('');
        alert('Email mis à jour');
      } else {
        alert (`Echec de la mise à jour: ${data.error}`);
        setIsEditingEmail(false);
      }
    })
    .catch(error => {
      console.error('Erreur réseau lors de la mise à jour de l\'adresse email:', error);
      alert('Erreur réseau lors de la mise à jour.');
      setIsEditingEmail(false);      
    })
    }
  };

  const handleEditPassword = () => {
    console.log("Edit Password clicked");
    
    const token = user.token;

    if (!isEditingPassword) {
      setIsEditingPassword(true)
    } else if (isEditingPassword) {      
      if (newPassword === '') {
        setIsEditingPassword(false);
        setNewPassword('');
        return;
      }

      setIsModalPasswordVisible(true);
    }
  };

  const fetchNewPassword = () => {

    const token = user.token;

    if (!user.token) {
        console.error('Erreur: Token utilisateur manquant.');
        alert('Erreur: Token manquant.');
        return;        
      }

    fetch(`${API_IP}/user/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword})
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) {
        setIsEditingPassword(false);
        setNewPassword('');
        alert('Changement du mot de passe effectué')
      } else {
        alert(`Echec de la mise à jour du mot de passe: ${data.error}`);
        setIsEditingPassword(false);
      }
    })
    .catch(error => {
      console.error('Erreur réseau lors de la mise à jour du mot de passe :', error);
      alert('Erreur réseau lors de la mise à jour.');
      setIsEditingPassword(false);
    })
  }

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Auth", { initialForm: "login" });
  };

  const handleRemoveAccount = () => {
    if (!user.token) {
        console.error('Erreur: Token utilisateur manquant.');
        alert('Erreur: Token manquant.');
        return;        
    }
    setIsModalVisible(true);
  };

  const confirmDeletion = () => {
    if (!passwordConfirmation) {
      alert("Mot de passe requis pour la confirmation.");
      return;
    }

    const userToken = user.token;

    setIsModalVisible(false);

    // fetch(`${API_IP}/user/remove`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     token: userToken,
    //     password: passwordConfirmation,
    //   }),
    // })
    //   .then(response => response.json())
    //   .then((data) => {
    //     if (data.result) {
    //       alert("Compte supprimé avec succès.");
    //       console.log("Compte supprimé avec succès.");
    //       dispatch(logout());
    //       navigation.navigate("Auth");
    //     } else {
    //       console.error("Échec de la suppression du compte:", data.error);
    //       alert(`Erreur de suppression: ${data.error}`);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Erreur réseau lors de la suppression:", error);
    //     alert( "Erreur de connexion au serveur. Veuillez vérifier votre réseau." );
    //   })
    //   .finally(() => {
    //     setPasswordConfirmation('');
    //   });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
            <ImageBackground 
                source={currentTheme.headerBackground}
                style={styles.backgroundImage}
            />
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatarImage}
                    source={typeof avatarUri === 'string' ? { uri: avatarUri} : avatarUri}
                />
                <TouchableOpacity onPress={handleEditAvatar} style={styles.editAvatarButton}>
                    <Feather name='edit' size={24} color="white" /> 
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.mainContainer}>
            <View style={styles.usernameEmailWrapper}>
                <View style={styles.usernameContainer}>
                    <Input
                        style={styles.inputUsername}
                        value={isEditingUsername ? tempUsername : username}
                        onChangeText={setTempUsername}
                        editable={isEditingUsername}
                        placeholder={isEditingUsername ? username : null}
                    />
                    <TouchableOpacity onPress={handleEditUsername}>
                        <Feather name={isEditingUsername ? 'check' : 'edit'} size={24} color="black" />
                    </TouchableOpacity>
                    {isEditingUsername && (
                        <TouchableOpacity onPress={() => setIsEditingUsername(false)}>
                            <Ionicons name= 'close-circle-outline' size={24} color='grey' />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.memberSinceContainer}>
                    <Text style={styles.memberSinceText}>Membre FicVerse depuis le {formattedDate}</Text>
                </View>

                <View style={styles.sectionSeparator} /> 

                <View style={styles.emailContainer}>
                    <Input
                        style={styles.inputEmail}
                        value={isEditingEmail ? tempEmail : currentEmail}
                        onChangeText={setTempEmail}
                        editable={isEditingEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder={isEditingEmail ? currentEmail : null}
                        inputLabel='Votre mail :'
                    />
                    <TouchableOpacity onPress={handleEditEmail}>
                        <Feather name={isEditingEmail ? 'check' : 'edit'} size={24} color="black" />
                    </TouchableOpacity>
                    {isEditingEmail && (
                        <TouchableOpacity onPress={() => setIsEditingEmail(false)}>
                            <Ionicons name="close-circle-outline" size={24} color="grey" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.sectionSeparator} /> 

                <View style={styles.passwordContainer}>
                    <Input
                        style={styles.inputPassword}
                        value={displayedPassword}
                        onChangeText={setNewPassword}
                        editable={isEditingPassword}
                        secureTextEntry={isEditingPassword}
                        inputLabel='Mot de passe :'
                    />
                    <TouchableOpacity onPress={handleEditPassword}>
                        <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    {isEditingPassword && (
                        <TouchableOpacity onPress={() => setIsEditingPassword(false)}>
                            <Ionicons name="close-circle-outline" size={24} color="grey" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            
            <View style={styles.settingsSection}>
                <View style={styles.themeContainer}>
                    <Text>Thème de l'interface</Text>
                </View>
                <View style={styles.ttagsContainer}>
                    <Text>Gestion des tags</Text>
                </View>
                <View style={styles.languageContainer}>
                    <Text>Gestion des langue</Text>
                </View>
                <View style={styles.likeContainer}>
                    <Text>Gestion de l'icone de like</Text>
                </View>
            </View>
        </View>

        <View style={styles.manageAccountContainer}>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logout}>Se déconnecter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveAccount}>
                <Text style={styles.removeAccount}>Supprimer le compte</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: 750,
        backgroundColor: "#f4fcfff8",
    },
    scrollView: {
      // flex: 1,
      // paddingVertical: 20,
      // backgroundColor: 'red',
    },
    // ----------------------------------------------------
    // --- 1. EN-TÊTE (Background 30%) ---
    profileHeader: {
        // flex: 0.3, // 30% de la hauteur de l'écran
        // width: '100%',
        height: 170,
        alignItems: 'center',
        justifyContent: 'flex-end', // Aligne l'avatar en bas du conteneur
        position: 'relative', // Point de référence pour l'avatar positionné en absolu
        zIndex: 1, 
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // --- AVATAR (Chevauchement) ---
    avatarContainer: {
        width: 120, // Taille de l'avatar (ajustée)
        height: 120, 
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'white', // Contour blanc pour l'effet de chevauchement
        position: 'absolute', // Positionnement absolu dans profileHeader
        bottom: -60, // Déplace l'avatar de la moitié de sa hauteur (120/2) vers le bas
        zIndex: 10,
        // Enlevez 'overflow: hidden' pour le conteneur, sinon l'Image pourrait être coupée 
        // L'Image elle-même doit avoir le borderRadius
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60, // Doit correspondre à la moitié de la largeur/hauteur de avatarContainer
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', // Fond semi-transparent pour le bouton d'édition
        borderRadius: 12,
        padding: 4,
    },
    
    // ----------------------------------------------------
    // --- 2. CONTENU PRINCIPAL (70% du bas) ---
    mainContainer: {
        // flex: 0.6, // Le reste de l'espace (70%)
        width: '100%',
        paddingTop: 70, // Espace pour l'avatar qui chevauche (un peu plus que 60)
        paddingHorizontal: 20,
        backgroundColor: '#f4fcfff8', // Couleur de fond
    },
    
    // Conteneur pour grouper username/email/password
    usernameEmailWrapper: {
        // Optionnel : ajouter un fond blanc et une ombre pour le grouper visuellement
        // backgroundColor: '#fff',
        // borderRadius: 10,
        paddingHorizontal: 5,
        marginBottom: 20,
    },
    
    // Styles pour les éléments internes
    usernameContainer: {
        flexDirection: 'row',
        justifyContent: 'center',        
        // alignItems: 'center', // Centre le nom d'utilisateur
        
    },
    memberSinceContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    memberSinceText: {
        marginTop: 5,
        fontSize: 12,
        color: 'grey',
    },
    
    // Ligne de séparation entre les sections
    sectionSeparator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    
    // Conteneurs des champs d'édition (mis à jour pour être alignés)
    emailContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between',
        // paddingVertical: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingVertical: 5,
    },

    // Styles d'inputs (assurez-vous d'ajouter `flex: 1` pour qu'ils prennent l'espace)
    inputUsername: { 
        ...typography.input, 
        textAlign: 'center',
        borderWidth: 0, // Enlever la bordure si vous voulez juste afficher le nom
        // paddingHorizontal: 0,
        minWidth: 130,
        marginRight: 10,
    }, 
    inputEmail: { 
      ...typography.input, 
      // flex: 1, 
      // textAlign: 'center',
      // marginRight: 10,
      width: 250,
    },      
    inputPassword: {
       ...typography.input,
      //  flex: 1,
       marginRight: 10,
       width: 250,
      },
    
    // Conteneurs des autres paramètres
    settingsSection: {
        // Ajoutez des styles ici pour vos autres sections si nécessaire
        paddingHorizontal: 5,
        // marginBottom: 20,
    },

    // ----------------------------------------------------
    // --- 3. FOOTER ---
    manageAccountContainer: {
        // Supprime l'alignement centré sur l'écran et utilise un padding pour le remonter
        // width: "100%",
        paddingVertical: 30, // Plus de padding pour remonter le bloc
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: '#f4fcfff8', // S'assurer que le fond est le même que la page
    },
    logout: {
        // Styles d'origine :
        ...typography.button,
        backgroundColor: "#ffffff01",
        borderColor: "#7474743d",
        borderWidth: 2,
        borderRadius: 10,
        width: 250,
        height: 35,
        textAlign: "center",
        lineHeight: 30,
        color: "#333333ff",
        marginBottom: 10, // Ajouter un petit espacement entre les deux boutons
    },
    removeAccount: {
        // Styles d'origine :
        ...typography.button,
        backgroundColor: "#d64d48f6",
        borderColor: "#7474743d",
        borderWidth: 2,
        borderRadius: 10,
        width: 250,
        height: 35,
        textAlign: "center",
        lineHeight: 30,
        color: "white",
    },

    // Ajoutez ici les styles pour vos Modals (isModalVisible et isModalPasswordVisible)
});
