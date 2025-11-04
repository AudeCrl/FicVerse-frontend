import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  isInvalid = false, // bordure rouge contrôlée par AuthScreen ou ManageFictionScreen
  useThemeColors = false, // utilise les couleurs du thème si true
  multiline = false,
  numberOfLines = 1,
  style,
  ...rest
}) {
  const { currentTheme } = useTheme();

  // Créer les styles dynamiques si useThemeColors est true
  const dynamicStyle = useThemeColors
    ? {
        backgroundColor: currentTheme.cardBackground,
        borderColor: currentTheme.primary,
        color: currentTheme.text,
      }
    : {};

  return (
    <TextInput
      style={[
        styles.input,
        isInvalid && styles.inputInvalid, // inputInvalid va mettre en rouge si isInvalid est true
        useThemeColors && dynamicStyle,
        style, // style côté parent si on veut ajouter d'autres modifs
      ]}
      {...rest} // Pour pouvoir ajouter d'autres props côté parent si on le souhaite, en dehors de celles mises dans le composant
      placeholder={placeholder}
      placeholderTextColor={useThemeColors ? currentTheme.primary : "#999"}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.input,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  inputInvalid: {
    borderColor: "#E03131",
  },
});
