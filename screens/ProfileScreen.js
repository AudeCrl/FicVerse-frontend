import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { typography } from "../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
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

  const user = useSelector((state) => state.user.value); //Résoudre le probleme : si on se deconnecte et reconnecte avec un autre compte, les informations de l'ancien utilisateur son affiché à l'écran
  console.log(user);

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
  const [newPassword, setNewPassword] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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
    /*
        Fetch route patch user password
        */
  };

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
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarImage}
            source={typeof avatarUri === 'string' ? { uri: avatarUri} : avatarUri}
          />
          <TouchableOpacity onPress={handleEditAvatar}>
            <Feather name='edit' size={24} color="black" />
          </TouchableOpacity>
        </View>
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
          <Text>Membre FicVerse depuis le {formattedDate}</Text>
        </View>
        <View></View>
        <View style={styles.emailContainer}>
          <Text>Votre mail :</Text>
          <Input
            style={styles.inputEmail}
            value={isEditingEmail ? tempEmail : currentEmail}
            onChangeText={setTempEmail}
            editable={isEditingEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={isEditingEmail ? currentEmail : null}
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
        <View style={styles.passwordContainer}>
          <Text>Mot de passe :</Text>
          <Input
            style={styles.inputPassword}
            value={displayedPassword}
            onChangeText={setNewPassword}
            editable={isEditingPassword}
            secureTextEntry={isEditingPassword}
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
      <View style={styles.manageAccountContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Se déconnecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRemoveAccount}>
          <Text style={styles.removeAccount}>Supprimer le compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4fcfff8",
    // 2. Prendre toute la hauteur et largeur de l'écran
    flex: 1,
    // 3. Centrer le contenu horizontalement
    alignItems: "center",
    // 4. Centrer le contenu verticalement
    justifyContent: "center",
  },
  avatarContainer: {
    width: 90,
    height: 90,
    overflow: "hidden",
  },
  avatarImage: {
    width: "50%",
    height: "50%",
    borderRadius: 45,
  },
  inputUsername: {
    ...typography.input,
  },
  inputEmail: {
    ...typography.input,
  },
  inputPassword: {
    ...typography.input,
  },
  manageAccountContainer: {
    backgroundColor: "#9c9c9c1c",
    width: "90%",
    height: "11%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  logout: {
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
  },
  removeAccount: {
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
});
