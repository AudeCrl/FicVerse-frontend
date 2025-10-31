import React from 'react';
import { View, Text } from 'react-native';

// readingStatus sera l'une des valeurs suivantes : ["reading","to-read","finished"]
export default function ReadingList({ readingStatus }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>

      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
        Onglet actif : {readingStatus}
      </Text>

      {/* TODO: FandomCard listée ici, chacune rendra ses FictionCard */}
      <Text>Affichage des FandomCard & FictionCard {readingStatus} ici !</Text>
    </View>
  );
}