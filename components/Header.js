import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Header({ 
    title='Mes histoires',
    avatarSource=require('../assets/avatar-default.png'),
    onProfilePress,
})

{
    const username = useSelector((state) => state.user.value.username); // on récupère le username du store reducers

    return (
        <ImageBackground
            source={require('../assets/background.jpg')}
            resizeMode='cover'
            style={styles.background}>

            <SafeAreaView style={{ flex: 1 }}>

                <View style={styles.container}>
                    <View style={styles.left}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                
                    <Pressable style={styles.right} onPress={onProfilePress}>
                        <View style={styles.profileInfos}>
                            <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
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

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  left: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfos: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6, 
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 140,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#FFF',
  },
});