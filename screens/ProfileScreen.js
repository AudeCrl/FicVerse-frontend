import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const [currentEmail, setCurrentEmail] = useState('mail');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [tempEmail, setTempEmail] = useState('mail');

    const [displayedPassword, setDisplayedPassword] = useState('••••••••');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const handleEditEmail = () => {
        console.log('Edit Email clicked');
    };

    const handleEditPassword = () => {
        console.log('Edit Password clicked');
    };

  return (
    <View style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image style={styles.avatarImage} source={require('../assets/avatar-default.png')}/>
        </View>
        <View></View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#72034473',    
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
    width: '100%',
    height: '100%',
  },
});