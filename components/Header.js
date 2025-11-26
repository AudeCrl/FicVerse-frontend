import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext.js';
import { updateAppearanceMode } from '../reducers/user';
import { typography } from '../styles/globalStyles';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Header({
  title='Mes histoires',
  avatarSource=require('../assets/avatar-default.png'),
  onProfilePress,
  screenName = 'default', // 'default' pour les pages existantes, et 'manage' pour ManageFictionScreen uniquement
  showToggle = true,      // masque/affiche le bouton de bascule dark/light
}) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const username = useSelector((state) => state.user.value.username);
  const avatar = {uri: useSelector((state) => state.user.value.avatar)};
  const { currentTheme, variant } = useTheme();

  const handleToggleVariant = async () => {
    const newVariant = variant === 'light' ? 'dark' : 'light';

    // Optimistic update - UI réactive immédiate
    dispatch(updateAppearanceMode(newVariant));

    // Sauvegarde en BDD
    try {
      const response = await fetch(`${API_URL}/user/appearance-mode`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appearanceMode: newVariant }),
      });
      const data = await response.json();

      if (!data.result) {
        // Rollback si erreur
        dispatch(updateAppearanceMode(variant));
      }
    } catch (error) {
      console.error('Error updating appearance mode:', error);
      dispatch(updateAppearanceMode(variant));
    }
  };
  

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(() =>
    StyleSheet.create({
      background: {
        paddingHorizontal: 16,
        margin: 0,
        // paddingBottom: screenName === 'manage' ? 6 : 0, // légère marge pour le header de ManageFictionScreen
      },
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'flex-end',
        paddingBottom: 10,
        paddingTop: 10,
        height: screenName === 'manage' ? 68 : 'auto',
      },
      left: {
        height: screenName === 'manage' ? '100%' : 80, // on ajuste la hauteur sans impacter les autres pages
        justifyContent: screenName === 'manage' ? 'center' : 'space-between',
      },
      toggleIcon: {
        color: currentTheme.text,
        width: 34,
      },
      title: {
        ...typography.h1,
        color: currentTheme.text,
        // marginTop: 15,
      },
      right: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'lightgreen',
      },
      profileInfos: {
        flexDirection: 'column',
        alignItems: 'center',
      },
      username: {
        ...typography.small,
        color: currentTheme.text,
        maxWidth: 140,
      },
      avatar: {
        width: screenName === 'manage' ? 45 : 65,
        height: screenName === 'manage' ? 45 : 65, 
        marginBottom: screenName === 'manage' ? 0 : 2,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
      },
    }),
    [currentTheme, variant] // Regenerate styles only when theme or variant changes
  );
  
  return (
    <SafeAreaView edges={['top']}>
      <ImageBackground
        source={currentTheme.headerBackground}
        resizeMode='cover'
        style={styles.background}
        >
          <View style={styles.container}>
            <View style={styles.left}>
                 {showToggle && (
              <Ionicons name="toggle-outline" size={24} style={styles.toggleIcon} onPress={handleToggleVariant} />
            )}
                <Text style={styles.title}>{title}</Text>
            </View>
            
            <Pressable style={styles.right} onPress={onProfilePress}>
                <View style={styles.profileInfos}>
                    <Image source={avatar.uri ? avatar : avatarSource} style={styles.avatar} resizeMode="cover" />
                    {(screenName !== 'manage') && <Text style={styles.username}>{username}</Text>}
                </View>
            </Pressable>
          </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

/*
La view profileInfos pourrait ne pas exister et on met le text et image dans Pressable directement.
Mais parfois Pressable reçoit du style par défaut d'Android par exemple et cela peut casser notre rendu.
Par sécurité, on met notre layout dans une View à l'intérieur pour que notre rendu reste intact.
*/