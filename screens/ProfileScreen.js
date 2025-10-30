import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { typography } from '../styles/globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';

const API_IP = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen({ navigation }) {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.value); //Résoudre le probleme : si on se deconnecte et reconnecte avec un autre compte, les informations de l'ancien utilisateur son affiché à l'écran
    console.log(user);
    

    const [username, setUsername] = useState(user.username);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [tempUsername, setTempUsername] = useState('');

    const [currentEmail, setCurrentEmail] = useState(user.email);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [tempEmail, setTempEmail] = useState('mail');

    const [displayedPassword, setDisplayedPassword] = useState('••••••••');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');


    const handleEditAvatar = () => {
        console.log('Edit Avatar clicked'); 
    };

    const handleEditUsername = () => {
        console.log('Edit Username clicked');        
    };

    const handleEditEmail = () => {
        console.log('Edit Email clicked');
    };

    const handleEditPassword = () => {
        console.log('Edit Password clicked');
        /*
        Fetch route patch user password
        */
    };

    const handleLogout = () => {
        dispatch(logout());
        navigation.navigate('Auth', { initialForm: 'login'});
    };

    const handleRemoveAccount = () => {
        console.log('Remove Account clicked');
        const userToken = user.token;

        if (!userToken) {
            console.error('Erreur: Token utilisateur manquant.');
            return;
        }
        // console.log('Remove Account clicked. Deleting user with token:', userToken);

        // fetch(`${API_IP}/user/remove`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ token: userToken }),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.result) {
        //         console.log('Compte supprimé avec succès.');
        //         dispatch(logout());
        //         navigation.navigate('Auth');
        //     } else {
        //         console.error('Échec de la suppression du compte:', data.error);
        //         alert(`Erreur de suppression: ${data.error}`);
        //     }
        // })
        // .catch(error => {
        //     console.error('Erreur réseau lors de la suppression:', error);
        //     alert('Erreur de connexion au serveur. Veuillez vérifier votre réseau.');
        // });
    };

  return (
    <View style={styles.container}>
        <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
                <Image style={styles.avatarImage} source={require('../assets/avatar-default.png')}/>
                <TouchableOpacity onPress={handleEditAvatar}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.usernameContainer}>
                <TextInput
                    style={styles.inputUsername}
                    value={username}
                    onChangeText={setTempUsername}
                    editable={isEditingUsername}            
                />
                <TouchableOpacity onPress={handleEditUsername}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View>
            </View>  
            <View style={styles.emailContainer}>
                <Text>Votre mail :</Text>
                <TextInput
                    style={styles.inputEmail}
                    value={currentEmail}
                    onChangeText={setTempEmail}
                    editable={isEditingEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                <TouchableOpacity onPress={handleEditEmail}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
                {isEditingEmail && (
                    <TouchableOpacity onPress={handleCancelEmail}>
                        <Ionicons name="close-circle-outline" size={24} color="grey" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.passwordContainer}>
                <Text>Mot de passe :</Text>
                <TextInput
                    style={styles.inputPassword}
                    value={displayedPassword}
                    onChangeText={setNewPassword}
                    editable={isEditingPassword}
                    secureTextEntry={!isEditingPassword || true}
                />
                <TouchableOpacity onPress={handleEditPassword}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
                {isEditingEmail && (
                    <TouchableOpacity onPress={handleCancelEmail}>
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
    backgroundColor: '#f4fcfff8',    
    // 2. Prendre toute la hauteur et largeur de l'écran
    flex: 1,    
    // 3. Centrer le contenu horizontalement
    alignItems: 'center',    
    // 4. Centrer le contenu verticalement
    justifyContent: 'center', 
  },
  avatarContainer: {
    width: 90,
    height: 90,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '50%',
    height: '50%',
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
    backgroundColor: '#9c9c9c1c',
    width: '90%',
    height: '11%',
    alignItems: 'center',
    justifyContent:'space-around',
  },
  logout: {
    ...typography.button,
    backgroundColor: '#ffffff01',
    borderColor: '#7474743d',
    borderWidth: 2,
    borderRadius: 10,
    width: 250,
    height: 35,
    textAlign: 'center',
    lineHeight: 30,
    color: '#333333ff',
  },
  removeAccount: {
    ...typography.button,
    backgroundColor: '#d64d48f6',
    borderColor: '#7474743d',
    borderWidth: 2,
    borderRadius: 10,
    width: 250,
    height: 35,
    textAlign: 'center',
    lineHeight: 30,
    color: 'white',
  },
});