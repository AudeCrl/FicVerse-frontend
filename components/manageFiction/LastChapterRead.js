import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RoundedButton from "../ui/RoundedButton";
import Input from "../ui/Input";
import { typography } from "../../styles/globalStyles.js";
import { useTheme } from "../../context/ThemeContext.js";

export default function LastChapterRead({ value = 0, onChange, min = 0, sectionLabel = null }) {
  const { currentTheme } = useTheme();    

  const sanitize = (inputValue) => {
    const clean = String(inputValue).replace(/[^0-9]/g, "");  // on autorise uniquement les chiffres
    return clean === "" ? "0" : clean;  // Si inputValue est vide alors on affiche "0", sinon on affiche la valeur de inputValue
  };

  const decrement = () => onChange(Math.max(min, Number(value) - 1));   // Math.max est une méthode qui sort la plus grande valeur parmi les valeurs entre parenthèses. En mettant min = 0 en props, on dit que les chapitres ne descendront jamais en dessous de 0, peu importe à quel point la 2nd valeur décrémente.
  const increment = () => onChange(Number(value) + 1);

  const styles = StyleSheet.create({
    sectionLabel: {
      ...typography.body,
      color: currentTheme.text,
      marginBottom: 8,
    },
    chapterContainer: {
      flexDirection: "row", 
      justifyContent: 'flex-start', 
      alignItems: "center", 
    }
  });

  return (
    <View style={styles.chapterSectionContainer}>

      {!!sectionLabel && 
        <Text style={styles.sectionLabel}>{sectionLabel}</Text>
      }

      <View style={styles.chapterContainer}>

        <RoundedButton label="−" onPress={decrement} style={{ width: 38}} />

        <Input
          value={String(value)}                // La valeur de l'input est transformée en String car textInput n'accepte que du string
          onChangeText={(value) => onChange(Number(sanitize(value)))}        // On met à jour au fur et à mesure l'inputValue mais il faut que ce soit des chiffres uniquement
          keyboardType="numeric"
          placeholder="0"
          style = {{ width: 100, marginBottom: 0, marginHorizontal: 14, textAlign: 'center', }}
        />

        <RoundedButton label="＋" onPress={increment} style={{ width: 38, marginRight: 14}} />

      </View>
    </View>
  );
}
