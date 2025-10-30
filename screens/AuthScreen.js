import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import { typography } from '../styles/globalStyles.js';

const API_IP = process.env.EXPO_PUBLIC_API_URL;
console.log(API_IP);

export default function AuthScreen({ navigation, route }) {

  const initialSignUp = route.params?.initialForm === 'login' ? false : true;

  // true = affichage du formulaire Inscription et false = formulaire Connexion
  const [signUp, setSignUp] = useState(initialSignUp);
  
  // Inscription : il faut un useState PAR champ. 4 champs donc 4 useState.
  const [username, setUsername] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  // Connexion
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  // useState pour stocker le message d'erreur
  const [invalid, setInvalid] = useState('');

  const dispatch = useDispatch();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   
  // Cette regex est une méthode de vérification pour s'assurer que le champ email contient des emails


//  Explication de UseMemo en 3 lignes !
//  On attribue une constante pour appliquer le useMemo. Ex : checkUsername.
//  Finalité de useMemo : vérifier que le champ username n'est pas vide (donc .trim.length > 0).
//  useMemo va effectuer cette vérification à chaque fois que la variable entre crochets [ ] va changer.
//  Donc à chaque fois que username va changer, useMemo effectue la vérif.

  // Inscription
  const checkUsername = useMemo(
    () => username.trim().length > 0,
    [username]
  );

  const checkEmailSignup = useMemo(
    () => emailRegex.test(emailSignup.trim()),   // grâce à la regex au-dessus, on vérifie si le champ contient bien un email
    [emailSignup]
  );

  const checkPasswordSignup = useMemo(
    () => passwordSignup.trim().length > 0,
    [passwordSignup]
  );

  // useMemo vérifie :
  // que le champ de confirmation est égal au champ mdp, donc confirmPassword === passwordSignup
  // qu'il n'est pas vide, donc confirmPassword.trim().length > 0,
  // a chaque fois que confirmPassword ou passwordSignup sont modifiés, la vérification est lancée
  const checkConfirmPassword = useMemo(
    () => confirmPassword === passwordSignup && confirmPassword.trim().length > 0,
    [confirmPassword, passwordSignup]
  );

  const validSignup = checkUsername && checkEmailSignup && checkPasswordSignup && checkConfirmPassword;
// validSignup est égale au fait que chacun des champs est bien rempli.


  // Connexion
  const checkEmailLogin = useMemo(
    () => emailRegex.test(emailLogin.trim()),
    [emailLogin]
  );

  const checkPasswordLogin = useMemo(
    () => passwordLogin.trim().length > 0,
    [passwordLogin]
  );

  const validLogin = checkEmailLogin && checkPasswordLogin;


  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword'); // on utilise navigate car on veut pouvoir revenir en arrière de mdp oublié à AuthScreen
  };

  const goToTabNavigator = () => {
    navigation.replace('TabNavigator'); // on utilise replace car on veut bloquer le retour en arrière revenir en arrière de HomeScreen à AuthScreen
  };

// Lorsqu'on appuiera sur le boutton S'inscrire, on déclenche cette fonction
  const submitSignup = async () => {
    setInvalid('');
    if (!validSignup) return; // si l'un des champs est mal rempli, on ne lance même pas la route

    try {
      const res = await fetch(`${API_IP}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), email: emailSignup.trim(), password: passwordSignup }),
      }); // on envoie le username, l'email et le password au back

      const data = await res.json();

      // Le back nous a répondu avec la route /signup => { result : true/false, user: { token, email, username } }
      // Si result est true, on l'envoie au reducer via dispatch

      if (data.result && data.user) {
        dispatch(login({
            token: data.user.token,
            email: data.user.email,
            username: data.user.username,
          }));
        goToTabNavigator(); // go vers HomeScreen result: true
      } else {
        setInvalid(data.error); // dans le return en dessous, on affichera le message d'erreur à l'utilisateur
      }
    } catch (error) {
      console.error("Erreur réseau :", error); // Pour nous
      setInvalid("Erreur réseau. Veuillez réessayer."); // Pour l'utilisateur
    }
  };


// Lorsqu'on appuiera sur le boutton Se connecter, on déclenche cette fonction
  const submitLogin = async () => {
    setInvalid('');
    if (!validLogin) return;

    try {
      const res = await fetch(`${API_IP}/user/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin.trim(), password: passwordLogin }),
      });

      const data = await res.json();

      if (data.result) {
        dispatch(login({
            token: data.token,
            email: data.email,
            username: data.username,
          }));
        goToTabNavigator();
      } else {
         setInvalid(data.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setInvalid("Erreur réseau. Veuillez réessayer.");
    }
  };


  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logo}>LOGO</Text>

          {/* Switch entre les 2 formulaires */}
          <View style={styles.switchRow}>
          
          {/* Quand on appuie sur S'inscrire, signUp devient true et on applie les styles switchBtn et switchBtnActive */}
            <TouchableOpacity
              style={[styles.switchBtn, signUp ? styles.switchBtnActive : styles.switchBtnInactive]}
              onPress={() => { setInvalid(''); setSignUp(true); }}>
              <Text style={styles.switchText}>Inscription</Text>
            </TouchableOpacity>

          {/* Quand on appuie sur Se Connecter, signUp devient false et on applie les styles switchBtn et switchBtnActive */}
            <TouchableOpacity
              style={[styles.switchBtn, !signUp ? styles.switchBtnActive : styles.switchBtnInactive]}
              onPress={() => { setInvalid(''); setSignUp(false); }}>
              <Text style={styles.switchText}>Connexion</Text>
            </TouchableOpacity>
          </View>


          {/* FORMULAIRE INSCRIPTION */}
          {signUp && (     // signUp = true => affichage du formulaire Inscription
            <View>
              <Text style={styles.label}>Identifiant</Text>
              <TextInput
                style={styles.input}
                placeholder="LunaLvgd"
                value={username}
                onChangeText={setUsername}/>

              {/* Si l'user commence à taper donc length > 0 ET que le champ username est faux alors on affiche le Text d'erreur */}
              {!checkUsername && username.length > 0 && (<Text style={styles.error}>Identifiant requis</Text>)}
              
              <Text style={styles.label}>Adresse mail</Text>
              <TextInput
                style={styles.input}
                placeholder="lunalvgd@hogwarts.school"
                keyboardType="email-address"   // propriété native qui facilite la saisie d'adresse mail
                autoCapitalize="none"   // pas de majuscule sur la 1ère lettre
                value={emailSignup}
                onChangeText={setEmailSignup}/>

              {/* Si l'user commence à taper donc length > 0 ET que checkEmailSignup est faux alors on affiche le Text d'erreur */}
              {!checkEmailSignup && emailSignup.length > 0 && (<Text style={styles.error}>Adresse e-mail invalide</Text>)}

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="6d-A83!r#7erVk5_"
                secureTextEntry            // pour masquer les caractères tapés
                value={passwordSignup}
                onChangeText={setPasswordSignup}/>

              {!checkPasswordSignup && passwordSignup.length > 0 && (<Text style={styles.error}>Mot de passe requis</Text>)}

              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="6d-A83!r#7erVk5_"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setconfirmPassword}/>

              {!checkConfirmPassword && confirmPassword.length > 0 
              && (<Text style={styles.error}>Les mots de passe ne correspondent pas</Text>)}

              {/* Après avoir appuyé sur S'inscrire ci-dessous, si la réponse du back est false : alors elle est stockée dans invalid. Ex : user already exist */}
              {invalid && <Text style={styles.errorCenter}>{invalid}</Text>}

              <TouchableOpacity
                style={[styles.submitButton, !validSignup && styles.submitButtonDisabled]}  // Si l'un des champs est mal rempli alors !validSignup (revoir useMemo) et donc button disabled
                onPress={submitSignup}
                disabled={!validSignup}>
                <Text style={styles.submitButtonText}>S’inscrire</Text>
              </TouchableOpacity>
            </View>
          )}


          {/* FORMULAIRE CONNEXION */}
          {!signUp && (     // signUp = false => affichage du formulaire Connexion
            <View>
              <Text style={styles.label}>Adresse mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Adresse e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailLogin}
                onChangeText={setEmailLogin}/>

              {!checkEmailLogin && emailLogin.length > 0 && (<Text style={styles.error}>Adresse e-mail invalide</Text>)}

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={passwordLogin}
                onChangeText={setPasswordLogin}/>

              {!checkPasswordLogin && passwordLogin.length > 0 && (<Text style={styles.error}>Mot de passe requis</Text>)}

              {invalid && <Text style={styles.errorCenter}>{invalid}</Text>}

              <TouchableOpacity
                style={[styles.submitButton, !validLogin && styles.submitButtonDisabled]}
                onPress={submitLogin}
                disabled={!validLogin}>
                <Text style={styles.submitButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <View style={styles.linksRow}>
                <TouchableOpacity onPress={goToForgotPassword}>
                  <Text>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1,},

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 200,
  },

  card: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
  },

  logo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },

  switchRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  switchBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  switchBtnActive: { backgroundColor: '#DEDAFF' },
  switchBtnInactive: { backgroundColor: '#E6E6E6' },
  switchText: { fontWeight: '600' },

  label: { ...typography.label, fontWeight: '600', marginBottom: 4 },

  input: {
    ...typography.input,    
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  error: { marginBottom: 6 },
  errorCenter: { textAlign: 'center', marginVertical: 6 },

  submitButton: {
    backgroundColor: '#DEDAFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontWeight: '700' },

  linksRow: { marginTop: 10 },
});
