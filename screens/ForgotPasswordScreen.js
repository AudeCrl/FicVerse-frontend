import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Titre */}
        <Text style={styles.title}>Mot de passe oublié</Text>

        {/* Input pour l'email de récupération */}
        <TextInput
          style={styles.input}
          placeholder="Adresse e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}/>

        {/* Button envoyer */}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Envoyer</Text>
        </TouchableOpacity>

        {/* Button retour pour revenir à AuthScreen */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Auth')}>
          <Text>Retour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B3E5FC', alignItems: 'center', justifyContent: 'center' },
  card: { width: '85%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  submitBtn: { backgroundColor: '#DEDAFF', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  submitBtnText: { fontWeight: '700' },
  backBtn: { marginTop: 10, alignItems: 'center' },
});