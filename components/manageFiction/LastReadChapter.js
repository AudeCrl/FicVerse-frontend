import React from "react";
import { View, Text } from "react-native";
import RoundedButton from "../ui/RoundedButton";
import Input from "../ui/Input";

export default function LastReadChapter({ value = 0, onChange, min = 0 }) {
  const sanitize = (inputValue) => {
    const clean = String(inputValue).replace(/[^0-9]/g, "");  // on autorise uniquement les chiffres
    return clean === "" ? "0" : clean;  // Si inputValue est vide alors on affiche "0", sinon on affiche la valeur de inputValue
  };

  const decrement = () => onChange(Math.max(min, Number(value) - 1));   // Math.max est une méthode qui sort la grande valeur parmi les valeurs entre parenthèses. En mettant min = 0 en props, on dit que les chapitres ne descendront jamais en dessous de 0, peu importe à quel point la 2nd valeur décrémente.
  const increment = () => onChange(Number(value) + 1);

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: "600" }}>Dernier chapitre lu</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>

        <RoundedButton label="−" onPress={decrement} />

        <View style={{ flex: 1 }}>
          <Input
            value={String(value)}                // La valeur de l'input est transformée en String car textInput n'accepte que du string
            onChangeText={(value) => onChange(Number(sanitize(value)))}        // On met à jour au fur et à mesure l'inputValue mais il faut que ce soit des chiffres uniquement
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <RoundedButton label="＋" onPress={increment} />

      </View>
    </View>
  );
}
