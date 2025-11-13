import React from "react";
import { ImageBackground, StyleSheet, Text, View, ScrollView } from "react-native";
import { typography } from "../styles/globalStyles.js";

export default function RGPD() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      imageStyle={styles.bgImage}
    >
      <View style={styles.container}>
        <View style={styles.card}>

          {/* Titre principal */}
          <Text style={[typography.h1, styles.title]}>
            Politique de confidentialité (RGPD)
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Intro */}
            <Text style={[typography.body, styles.paragraph]}>
              Nous sommes un groupe de développeurs réalisant le projet [Nom de l’application] dans le cadre d’un projet pédagogique.{"\n\n"}
              Nous nous engageons à respecter la confidentialité des données personnelles de nos utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679).
            </Text>

            {/* Section 1 */}
            <Text style={[typography.h3, styles.sectionTitle]}>1. Responsable du traitement</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Les données sont traitées par l’équipe de développement du projet [Nom de l’application], composée de 4 étudiants/développeurs.{"\n\n"}
              Pour toute question ou demande concernant vos données, vous pouvez nous contacter à :{"\n"}
              [adresse e-mail de contact du groupe ou du référent]
            </Text>

            {/* Section 2 */}
            <Text style={[typography.h3, styles.sectionTitle]}>2. Données personnelles collectées</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Nous collectons uniquement les données strictement nécessaires au fonctionnement de l’application :
            </Text>
            <View style={styles.list}>
              <Text style={[typography.body, styles.listItem]}>
                • Adresse e-mail: utilisée pour la création et la gestion du compte utilisateur.
              </Text>
              <Text style={[typography.body, styles.listItem]}>
                • Photo de profil: utilisée uniquement pour la personnalisation de votre compte (affichage de l’avatar).
              </Text>
            </View>
            <Text style={[typography.body, styles.paragraph]}>
              Aucune autre donnée personnelle n’est collectée ni demandée.
            </Text>

            {/* Section 3 */}
            <Text style={[typography.h3, styles.sectionTitle]}>3. Finalités du traitement</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Vos données sont collectées et utilisées uniquement pour :
            </Text>
            <View style={styles.list}>
              <Text style={[typography.body, styles.listItem]}>
                • permettre la création et l’accès à votre compte;
              </Text>
              <Text style={[typography.body, styles.listItem]}>
                • afficher votre photo de profil dans l’application ;
              </Text>
              <Text style={[typography.body, styles.listItem]}>
                • assurer un service utilisateur basique (authentification, affichage du profil).
              </Text>
            </View>
            <Text style={[typography.body, styles.paragraph]}>
              Aucune donnée n’est utilisée à des fins commerciales ou publicitaires.
            </Text>

            {/* Section 4 */}
            <Text style={[typography.h3, styles.sectionTitle]}>4. Base légale du traitement</Text>
            <View style={styles.list}>
              <Text style={[typography.body, styles.listItem]}>
                • Votre consentement (lors de l’inscription ou de la soumission des données);
              </Text>
              <Text style={[typography.body, styles.listItem]}>
                • Nécessité du service pour vous permettre d’utiliser l’application.
              </Text>
            </View>

            {/* Section 5 */}
            <Text style={[typography.h3, styles.sectionTitle]}>5. Durée de conservation des données</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Vos données sont conservées tant que votre compte est actif.{"\n"}
              Vous pouvez demander leur suppression à tout moment en contactant l’équipe du projet.{"\n\n"}
              Une fois le compte supprimé :
            </Text>
            <View style={styles.list}>
              <Text style={[typography.body, styles.listItem]}>• votre e-mail est effacé définitivement ;</Text>
              <Text style={[typography.body, styles.listItem]}>• votre photo de profil est supprimée des serveurs.</Text>
            </View>

            {/* Section 6 */}
            <Text style={[typography.h3, styles.sectionTitle]}>6. Partage et transfert des données</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Nous ne partageons ni ne vendons aucune donnée à des tiers.{"\n"}
              Les données sont hébergées uniquement en Europe et ne sont jamais transférées hors de l’Union européenne.
            </Text>

            {/* Section 7 */}
            <Text style={[typography.h3, styles.sectionTitle]}>7. Droits des utilisateurs</Text>
            <View style={styles.list}>
              <Text style={[typography.body, styles.listItem]}>• Droit d’accès à vos données ;</Text>
              <Text style={[typography.body, styles.listItem]}>• Droit de rectification ;</Text>
              <Text style={[typography.body, styles.listItem]}>• Droit à l’effacement (“droit à l’oubli”) ;</Text>
              <Text style={[typography.body, styles.listItem]}>• Droit d’opposition ;</Text>
              <Text style={[typography.body, styles.listItem]}>• Droit à la portabilité des données.</Text>
            </View>

            {/* Section 8 */}
            <Text style={[typography.h3, styles.sectionTitle]}>8. Sécurité des données</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre tout accès, modification ou suppression non autorisés.
            </Text>

            {/* Section 9 */}
            <Text style={[typography.h3, styles.sectionTitle]}>9. Modifications de la politique</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Nous pouvons mettre à jour cette politique en cas d’évolution du projet. Toute modification importante sera signalée dans l’application ou via e-mail.
            </Text>

            {/* Section 10 */}
            <Text style={[typography.h3, styles.sectionTitle]}>10. Contact</Text>
            <Text style={[typography.body, styles.paragraph]}>
              Pour toute question relative à la confidentialité de vos données :{"\n"}
              [Nom du contact principal]– Équipe du projet
              [Nom de l’application]{"\n"}
              [adresse e-mail du groupe]
            </Text>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  bgImage: { opacity: 0.3 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  card: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 14,
    color: "#000000",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: "#000000",
  },
  paragraph: {
    lineHeight: 22,
    color: "#000000",
    marginBottom: 8,
  },
  list: { marginBottom: 8, paddingLeft: 6 },
  listItem: {
    lineHeight: 22,
    color: "#000000",
    marginBottom: 4,
  },
  scroll: {
    maxHeight: 460,
    marginTop: 6,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});
