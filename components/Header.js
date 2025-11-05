import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext.js';
import { typography } from '../styles/globalStyles';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header({ 
  title='Mes histoires',
  avatarSource=require('../assets/avatar-default.png'),
  onProfilePress,
}) {
  const username = useSelector((state) => state.user.value.username); // on récupère le username du store reducers
  const avatar = {uri: useSelector((state) => state.user.value.avatar)}; // on récupère l'avatar du store reducers
  const { currentTheme, variant, toggleVariant } = useTheme();
  

  // Memorize styles so they only update when the theme changes
  const styles = useMemo(() =>
    StyleSheet.create({
      background: {
        paddingHorizontal: 16,
        margin: 0,
      },
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 10,
      },
      left: {
        height: 80,
        justifyContent: 'space-between',
      },
      toggleIcon: {
        color: currentTheme.text,
      },
      title: {
        ...typography.h1,
        color: currentTheme.text,
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
        width: 65,
        height: 65,
        marginBottom: 2,
        borderRadius: 50,
        // backgroundColor: '#FFFFFF',
      },
    }),
    [currentTheme] // Regenerate styles only when theme or variant changes
  );
  
  return (
    <ImageBackground
        source={currentTheme.headerBackground}
        resizeMode='cover'
        style={styles.background}>

        <SafeAreaView edges={['top']}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <Ionicons name="toggle-outline" size={24} style={styles.toggleIcon} onPress={toggleVariant} />
                    <Text style={styles.title}>{title}</Text>
                </View>
                
                <Pressable style={styles.right} onPress={onProfilePress}>
                    <View style={styles.profileInfos}>
                        <Image source={avatar ? avatar : avatarSource} style={styles.avatar} resizeMode="cover" />
                        <Text style={styles.username}>{username}</Text>
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    </ImageBackground>
  );
}

/*
La view profileInfos pourrait ne pas exister et on met le text et image dans Pressable directement.
Mais parfois Pressable reçoit du style par défaut d'Android par exemple et cela peut casser notre rendu.
Par sécurité, on met notre layout dans une View à l'intérieur pour que notre rendu reste intact.
*/