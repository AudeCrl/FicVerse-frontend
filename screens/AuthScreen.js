import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import Input from "../components/ui/Input.js";
import RoundedButton from "../components/ui/RoundedButton.js";
import { login } from "../reducers/user";
import { typography } from "../styles/globalStyles.js";

const API_IP = process.env.EXPO_PUBLIC_API_URL;
console.log(API_IP);

export default function AuthScreen({ navigation, route }) {
  // provient de ProfileScreen avec la fonction handleLogout. Depuis ProfileScreen, un initialForm login est envoyé vers Auth et si cela arrive, alors initialSignUp = false et signUp = false et donc on arrive direct à la connexion
  const initialSignUp = route.params?.initialForm === "login" ? false : true;

  // true = affichage du formulaire Inscription et false = formulaire Connexion
  const [signUp, setSignUp] = useState(initialSignUp);

  // Inscription : il faut un useState PAR champ. 4 champs donc 4 useState.
  const [username, setUsername] = useState("");
  const [emailSignup, setEmailSignup] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const [submittedSignup, setSubmittedSignup] = useState(false); // champ servant à transformer l'input en rouge

  // Connexion
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [submittedLogin, setSubmittedLogin] = useState(false);

  // useState pour stocker le message d'erreur
  const [invalid, setInvalid] = useState("");

  // États pour afficher/masquer les mots de passe
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  const dispatch = useDispatch();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Cette regex est une méthode de vérification pour s'assurer que le champ email contient des emails

  //  Explication de UseMemo en 3 lignes !
  //  On attribue une constante pour appliquer le useMemo. Ex : checkUsername.
  //  Finalité de useMemo : vérifier que le champ username n'est pas vide (donc .trim.length > 0).
  //  useMemo va effectuer cette vérification à chaque fois que la variable entre crochets [ ] va changer.
  //  Donc à chaque fois que username va changer, useMemo effectue la vérif.

  // Inscription
  const checkUsername = useMemo(() => username.trim().length > 0, [username]);

  const checkEmailSignup = useMemo(
    () => emailRegex.test(emailSignup.trim()), // grâce à la regex au-dessus, on vérifie si le champ contient bien un email
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
    () =>
      confirmPassword === passwordSignup && confirmPassword.trim().length > 0,
    [confirmPassword, passwordSignup]
  );

  const validSignup =
    checkUsername &&
    checkEmailSignup &&
    checkPasswordSignup &&
    checkConfirmPassword;
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
    navigation.navigate("ForgotPassword"); // on utilise navigate car on veut pouvoir revenir en arrière de mdp oublié à AuthScreen
  };

  const goToTabNavigator = () => {
    navigation.replace("TabNavigator"); // on utilise replace car on veut bloquer le retour en arrière revenir en arrière de HomeScreen à AuthScreen
  };

  // Lorsqu'on appuiera sur le boutton S'inscrire, on déclenche cette fonction
  const submitSignup = async () => {
    setInvalid("");
    setSubmittedSignup(true);
    if (!validSignup) return; // si l'un des champs est mal rempli, on ne lance même pas la route

    try {
      const res = await fetch(`${API_IP}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: emailSignup.trim(),
          password: passwordSignup,
        }),
      }); // on envoie le username, l'email et le password au back

      const data = await res.json();

      // Le back nous a répondu avec la route /signup => { result : true/false, user: { token, email, username } }
      // Si result est true, on l'envoie au reducer via dispatch

      if (data.result && data.user) {
        dispatch(
          login({
            token: data.user.token,
            email: data.user.email,
            username: data.user.username,
            createdAt: data.user.createdAt,
            avatarURL: data.user.avatarURL,
            notationIcon: data.user.notationIcon,
          })
        );
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
    setInvalid("");
    setSubmittedLogin(true);
    if (!validLogin) return;

    try {
      const res = await fetch(`${API_IP}/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailLogin.trim(),
          password: passwordLogin,
        }),
      });

      const data = await res.json();

      if (data.result) {
        dispatch(
          login({
            token: data.token,
            email: data.email,
            username: data.username,
            createdAt: data.createdAt,
            avatarURL: data.avatarURL,
            notationIcon: data.notationIcon,
          })
        );
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
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        enabled={true}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={require('../assets/logoFicVerse200.png')} width={140} height={140} />
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Bienvenue sur FicVerse !</Text>
              <Text style={styles.welcomeSubtitle}>L'app qui vous aide à organiser vos lectures</Text>
            </View>

            {/* Switch entre les 2 formulaires */}
            <View style={styles.switchRow}>
              {/* Quand on appuie sur S'inscrire, signUp devient true et on applie les styles switchBtn et switchBtnActive */}
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  signUp ? styles.switchBtnActive : styles.switchBtnInactive,
                ]}
                onPress={() => {
                  setInvalid("");
                  setSignUp(true);
                  setSubmittedSignup(false); // quand on switch, il faut que l'input ne soit plus rouge
                }}
              >
                <Text style={styles.switchText}>Inscription</Text>
              </TouchableOpacity>

              {/* Quand on appuie sur Se Connecter, signUp devient false et on applie les styles switchBtn et switchBtnActive */}
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  !signUp ? styles.switchBtnActive : styles.switchBtnInactive,
                ]}
                onPress={() => {
                  setInvalid("");
                  setSignUp(false);
                  setSubmittedLogin(false); // quand on switch, il faut que l'input ne soit plus rouge
                }}
              >
                <Text style={styles.switchText}>Connexion</Text>
              </TouchableOpacity>
            </View>

            {/* FORMULAIRE INSCRIPTION */}
            {signUp && ( // signUp = true => affichage du formulaire Inscription
              <View style={styles.signUpContainer}>
                <Input
                  inputLabel="Identifiant"
                  placeholder="LunaLvgd"
                  value={username}
                  onChangeText={setUsername}
                  isInvalid={submittedSignup && !checkUsername}
                />

                {/* Si l'user commence à taper donc length > 0 ET que le champ username est faux alors on affiche le Text d'erreur */}
                {!checkUsername && username.length > 0 && (
                  <Text style={styles.error}>Identifiant requis</Text>
                )}

                <Input
                  inputLabel="Adresse mail"
                  placeholder="lunalvgd@hogwarts.school"
                  keyboardType="email-address" // propriété native qui facilite la saisie d'adresse mail
                  autoCapitalize="none" // pas de majuscule sur la 1ère lettre
                  value={emailSignup}
                  onChangeText={setEmailSignup}
                  isInvalid={submittedSignup && !checkEmailSignup}
                />

                {/* Si l'user commence à taper donc length > 0 ET que checkEmailSignup est faux alors on affiche le Text d'erreur */}
                {!checkEmailSignup && emailSignup.length > 0 && (
                  <Text style={styles.error}>Adresse e-mail invalide</Text>
                )}

                {/* Mot de passe avec icône œil */}
                <View style={styles.passwordContainer}>
                  <Input
                    inputLabel="Mot de passe"
                    placeholder="6d-A83!r#7erVk5_"
                    secureTextEntry={!showPasswordSignup}
                    autoCapitalize="none"
                    value={passwordSignup}
                    onChangeText={setPasswordSignup}
                    isInvalid={submittedSignup && !checkPasswordSignup}
                    numberOfLines={1}
                    multiline={false}
                    style={{ paddingRight: 40 }}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPasswordSignup(!showPasswordSignup)}
                  >
                    <Feather
                      name={showPasswordSignup ? "eye" : "eye-off"}
                      size={20}
                      color="#717171"
                    />
                  </TouchableOpacity>
                </View>

                {!checkPasswordSignup && passwordSignup.length > 0 && (
                  <Text style={styles.error}>Mot de passe requis</Text>
                )}

                {/* Confirmer le mot de passe avec icône œil */}
                <View style={styles.passwordContainer}>
                  <Input
                    inputLabel="Confirmer le mot de passe"
                    placeholder="6d-A83!r#7erVk5_"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    value={confirmPassword}
                    onChangeText={setconfirmPassword}
                    isInvalid={submittedSignup && !checkConfirmPassword}
                    numberOfLines={1}
                    multiline={false}
                    style={{ paddingRight: 40 }}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#717171"
                    />
                  </TouchableOpacity>
                </View>

                {!checkConfirmPassword && confirmPassword.length > 0 && (
                  <Text style={styles.error}>
                    Les mots de passe ne correspondent pas
                  </Text>
                )}

                {/* Après avoir appuyé sur S'inscrire ci-dessous, si la réponse du back est false : alors elle est stockée dans invalid. Ex : user already exist */}
                {invalid && <Text style={styles.errorCenter}>{invalid}</Text>}

                <RoundedButton
                  label="S'inscrire"
                  onPress={submitSignup}
                  active={validSignup}
                />
              </View>
            )}

            {/* FORMULAIRE CONNEXION */}
            {!signUp && ( // signUp = false => affichage du formulaire Connexion
              <View style={styles.signInContainer}>
                <Input
                  inputLabel="Adresse mail"
                  placeholder="lunalvgd@hogwarts.school"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailLogin}
                  onChangeText={setEmailLogin}
                  isInvalid={submittedLogin && !checkEmailLogin}
                />

                {!checkEmailLogin && emailLogin.length > 0 && (
                  <Text style={styles.error}>Adresse e-mail invalide</Text>
                )}

                {/* Mot de passe avec icône œil */}
                <View style={styles.passwordContainer}>
                  <Input
                    inputLabel="Mot de passe"
                    placeholder="6d-A83!r#7erVk5_"
                    secureTextEntry={!showPasswordLogin}
                    autoCapitalize="none"
                    value={passwordLogin}
                    onChangeText={setPasswordLogin}
                    isInvalid={submittedLogin && !checkPasswordLogin}
                    numberOfLines={1}
                    multiline={false}
                    style={{ paddingRight: 40 }}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPasswordLogin(!showPasswordLogin)}
                  >
                    <Feather
                      name={showPasswordLogin ? "eye" : "eye-off"}
                      size={20}
                      color="#717171"
                    />
                  </TouchableOpacity>
                </View>

                {!checkPasswordLogin && passwordLogin.length > 0 && (
                  <Text style={styles.error}>Mot de passe requis</Text>
                )}

                {invalid && <Text style={styles.errorCenter}>{invalid}</Text>}

                <RoundedButton
                  label="Se connecter"
                  onPress={submitLogin}
                  active={validLogin}
                />

                <View style={styles.linksRow}>
                  <TouchableOpacity onPress={goToForgotPassword}>
                    <Text>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    marginTop: 180,
  },

  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -90,    
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    ...typography.h3,
    fontSize: 18,
  },
  welcomeSubtitle: {
    ...typography.body,
    fontSize: 14,
    textAlign: 'center',
  },

  switchRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  switchBtnActive: { backgroundColor: "#DEDAFF" },
  switchBtnInactive: { backgroundColor: "#E6E6E6" },
  switchText: { fontWeight: "600" },

  signUpContainer: {

  },
  signInContainer: {

  },

  label: { ...typography.label, fontWeight: "600", marginBottom: 4 },

  error: { marginBottom: 6 },
  errorCenter: { textAlign: "center", marginVertical: 6 },

  linksRow: { marginTop: 10 },

  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
