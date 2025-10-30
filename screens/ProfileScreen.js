import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { typography } from '../styles/globalStyles';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/user';

export default function ProfileScreen({ navigation }) {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('username');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [tempUsername, setTempUsername] = useState('');

    const [currentEmail, setCurrentEmail] = useState('mail');
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
        /*
        Fetch route remove account
        Si result true :
        Renvoi sur l'ecran de creation de compte
        */
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