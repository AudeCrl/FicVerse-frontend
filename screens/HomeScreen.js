import React from 'react';
import { Image, Pressable, Text, StyleSheet, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text>Mes histoires</Text>
        </View>

        {/* Button profile */}
        <Pressable style={styles.headerRight} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/avatar-default.png')}
            style={styles.avatar}
            resizeMode="cover"/>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B2FF9E' },

  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { top: 50 },

  headerRight: { top: 34 },

  avatar: { width: 40, height: 40, borderRadius: 50, backgroundColor: '#FFF' },
});
