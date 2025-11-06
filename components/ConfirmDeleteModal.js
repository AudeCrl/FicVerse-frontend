import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../styles/globalStyles";

/**
 * 🎭 COMPOSANT: ConfirmDeleteModal
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Modale de confirmation de suppression SÉCURISÉE
 *
 * 🎯 OBJECTIF:
 * Demander à l'utilisateur de taper le NOM EXACT de l'élément avant suppression
 * Cela prévient les suppressions accidentelles en forçant une double action.
 *
 * 🔐 SÉCURITÉ IMPLÉMENTÉE:
 * 1. Modale overlay qui bloque l'interaction avec le reste de l'app
 * 2. Champ texte qui demande la saisie exacte du nom
 * 3. Bouton "Supprimer" désactivé tant que le texte ne correspond pas
 * 4. Affichage du nombre d'utilisations si applicable
 * 5. Feedback visuel (✓ ou ❌) en temps réel
 *
 * ⚙️ PROPS (paramètres attendus):
 *
 * @param {boolean} visible - Est-ce que la modale est affichée?
 *                            Ex: true → modale visible, false → cachée
 *
 * @param {string} itemName - Nom de l'élément à supprimer
 *                            Ex: "Adventure", "Mon Fandom", "My Tag"
 *                            ⚠️  C'est le texte que l'utilisateur doit taper exactement
 *
 * @param {string} [itemType="élément"] - Type d'élément pour le message (optionnel)
 *                                        Ex: "tag", "fandom", "auteur"
 *                                        Utilisé dans: "Ce tag est utilisé par..."
 *
 * @param {number} [usageCount=0] - Nombre d'utilisations (optionnel, défaut: 0)
 *                                  Si > 0, affiche un avertissement orange
 *                                  Ex: 5 → affiche "utilisé par 5 fanfictions"
 *
 * @param {function} onConfirm - Callback exécuté quand l'utilisateur clique "Supprimer"
 *                               Signature: () => void ou () => Promise
 *                               Utilisé pour: appeler l'API de suppression
 *
 * @param {function} onCancel - Callback exécuté quand l'utilisateur clique "Annuler"
 *                              Signature: () => void
 *                              Utilisé pour: fermer la modale
 *
 * @param {boolean} [isLoading=false] - État de chargement (optionnel, défaut: false)
 *                                      true → boutons désactivés, texte "Suppression..."
 *                                      false → boutons normaux
 *
 * 💡 EXEMPLE D'UTILISATION:
 *
 * const [showModal, setShowModal] = useState(false);
 *
 * <ConfirmDeleteModal
 *   visible={showModal}
 *   itemName="Adventure"
 *   itemType="tag"
 *   usageCount={5}
 *   onConfirm={() => {
 *     // Appeler API de suppression
 *     deleteTag('123');
 *     setShowModal(false);
 *   }}
 *   onCancel={() => setShowModal(false)}
 *   isLoading={deleting}
 * />
 */
export default function ConfirmDeleteModal({
  visible,
  itemName,
  itemType = "élément",
  usageCount = 0,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  //  STATE: Stocker ce que l'utilisateur tape dans l'input
  // confirmText = ce qui est tapé dans le champ
  // setConfirmText = fonction pour mettre à jour
  const [confirmText, setConfirmText] = useState("");

  // VALIDATION: Est-ce que le texte tapé correspond exactement?
  // isConfirmValid = true si confirmText === itemName (case-sensitive)
  // Utilisé pour activer/désactiver le bouton "Supprimer"
  const isConfirmValid = confirmText === itemName;

  return (
    <Modal
      // visible = est-ce que la modale s'affiche?
      visible={visible}
      // transparent = fond semi-transparent (overlay noir 50%)
      transparent
      // animationType = animation d'apparition (fade = fondu)
      animationType="fade"
      // onRequestClose = callback quand utilisateur clique le bouton retour (Android)
      onRequestClose={onCancel}
    >
      {/* 
         OVERLAY: Fond semi-transparent qui recouvre toute l'app
        - Empêche l'interaction avec le reste de l'app
        - Center la modale au milieu de l'écran
      */}
      <View style={styles.overlay}>
        {/*
          MODALE CONTAINER: La boîte blanche avec le contenu
          - Bordure arrondie, ombre, positionnée au centre
        */}
        <View style={styles.modalContainer}>
          {/* 
            HEADER: Titre + icône d'alerte
            - Icône triangle rouge (warning)
            - Texte "Confirmer la suppression"
          */}
          <View style={styles.header}>
            <Feather name="alert-triangle" size={28} color="#DC2626" />
            <Text style={styles.title}>Confirmer la suppression</Text>
          </View>

          {/* 
            📝 CONTENU PRINCIPAL: Description + avertissements
          */}
          <View style={styles.content}>
            {/* 
              1️⃣ DESCRIPTION PRINCIPALE:
              Affiche: "Êtes-vous sûr de vouloir supprimer [itemName] ?"
              itemName en gras pour bien le montrer
            */}
            <Text style={styles.description}>
              Êtes-vous sûr de vouloir supprimer{" "}
              <Text style={styles.bold}>{itemName}</Text> ?
            </Text>

            {/* 
              2️⃣ AVERTISSEMENT D'UTILISATION (conditionnel):
              Ne s'affiche que SI usageCount > 0
              Couleur: orange (#FEF3C7)
              Message: "Ce [itemType] est utilisé par [usageCount] fanfictions"
              
              EXEMPLE:
              Si usageCount = 5 et itemType = "tag":
              → "Ce tag est utilisé par 5 fanfictions"
            */}
            {usageCount > 0 && (
              <View style={styles.usageWarning}>
                <Feather name="info" size={16} color="#F97316" />
                <Text style={styles.usageText}>
                  Cet {itemType} est utilisé par{" "}
                  <Text style={styles.bold}>{usageCount}</Text> fanfiction
                  {/* Ajouter 's' au pluriel: 1 fanfiction, 5 fanfictions */}
                  {usageCount > 1 ? "s" : ""}.
                </Text>
              </View>
            )}

            {/* 
              3️⃣ SECTION DE CONFIRMATION:
              - Label: "Pour confirmer, tapez le nom exact :"
              - TextInput: Champ pour taper le nom
              - Messages feedback: ❌ ou ✓
            */}
            <View style={styles.confirmSection}>
              <Text style={styles.confirmLabel}>
                Pour confirmer, tapez le nom exact :
              </Text>

              {/* 
                📋 CHAMP DE TEXTE:
                - Placeholder: affiche itemName grisé
                - value: ce qui est actuellement tapé
                - onChangeText: callback quand l'utilisateur tape (mise à jour state)
                - editable: désactivé si isLoading = true
                - Style: rouge si le texte ne correspond pas
              */}
              <TextInput
                style={[
                  styles.input,
                  // Ajouter style "inputError" si:
                  // - confirmText est NON vide ET
                  // - le texte ne correspond pas
                  !isConfirmValid && confirmText && styles.inputError,
                ]}
                placeholder={itemName}
                value={confirmText}
                onChangeText={setConfirmText}
                editable={!isLoading}
                placeholderTextColor="#D1D5DB"
              />

              {/* 
                ❌ MESSAGE D'ERREUR (feedback négatif):
                Affiche si: le texte ne correspond PAS ET l'utilisateur a tapé quelque chose
                Aide l'utilisateur à voir qu'il s'est trompé
              */}
              {confirmText && !isConfirmValid && (
                <Text style={styles.errorText}>
                  ❌ Le texte ne correspond pas
                </Text>
              )}

              {/* 
                ✅ MESSAGE DE SUCCÈS (feedback positif):
                Affiche si: le texte correspond exactement
                Confirme que l'utilisateur peut maintenant cliquer "Supprimer"
              */}
              {isConfirmValid && (
                <Text style={styles.successText}>✓ Prêt à supprimer</Text>
              )}
            </View>
          </View>

          {/* 
            🔘 BOUTONS D'ACTION:
            Deux boutons côte à côte: Annuler | Supprimer
          */}
          <View style={styles.buttonContainer}>
            {/* 
              ❌ BOUTON ANNULER:
              - Couleur: gris (fond gris, texte gris)
              - Appelle: onCancel() quand cliqué
              - Désactivé: si isLoading = true
            */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            {/* 
              ✅ BOUTON SUPPRIMER:
              - Couleur: rouge (#DC2626) quand actif, rose pâle quand désactivé
              - Appelle: onConfirm() quand cliqué
              - DÉSACTIVÉ SI:
                a) Le texte ne correspond pas (!isConfirmValid) OR
                b) Une suppression est en cours (isLoading)
              - Affiche:
                * Si isLoading → "Suppression..." (texte)
                * Sinon → icône trash + "Supprimer" (icon + texte)
            */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                // Ajouter style "désactivé" si le bouton ne doit pas être cliquable
                (!isConfirmValid || isLoading) && styles.deleteButtonDisabled,
              ]}
              onPress={onConfirm}
              // Désactiver si texte ne correspond pas OU chargement en cours
              disabled={!isConfirmValid || isLoading}
            >
              {isLoading ? (
                // État de chargement: afficher texte "Suppression..."
                <Text style={styles.deleteButtonText}>Suppression...</Text>
              ) : (
                // État normal: afficher icône + texte
                <>
                  <Feather name="trash-2" size={18} color="white" />
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * 🎨 STYLES: Toutes les définitions de style pour ce composant
 * StyleSheet.create() = créer des styles optimisés pour React Native
 *
 * Organisation:
 * - overlay: fond semi-transparent
 * - modalContainer: boîte blanche principale
 * - header: titre et icône
 * - content: contenu central
 * - buttons: boutons d'action
 */
const styles = StyleSheet.create({
  /*
    🌫️ OVERLAY:
    - flex: 1 → prend toute la place disponible
    - backgroundColor: rgba(0, 0, 0, 0.5) → noir semi-transparent (50%)
    - justifyContent & alignItems → center → centre la modale
  */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  /*
    📦 MODAL CONTAINER (la boîte blanche):
    - backgroundColor: white → fond blanc
    - borderRadius: 12 → coins arrondis
    - width: 85% → occupe 85% de la largeur
    - padding: 20 → espace interne
    - shadow (iOS) & elevation (Android) → ombre sous la boîte
  */
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "85%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  /*
    🎨 HEADER (titre + icône):
    - flexDirection: row → alignement horizontal
    - gap: 12 → espacement entre icône et texte
  */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },

  /*
    📝 TITRE:
    - fontWeight: 700 → gras
    - fontSize: 18 → assez grand
    - color: #1F2937 → gris foncé
  */
  title: {
    ...typography.input,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },

  // Contenu général (marges)
  content: {
    marginBottom: 20,
  },

  // Description principale
  description: {
    ...typography.input,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },

  // Texte en gras (itemName)
  bold: {
    fontWeight: "700",
    color: "#1F2937",
  },

  /*
    ⚠️ AVERTISSEMENT D'UTILISATION:
    - Couleur de fond: #FEF3C7 (jaune très pâle)
    - Bordure: un carré sur les côtés
    - Message: "Ce tag est utilisé par 5 fanfictions"
  */
  usageWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },

  usageText: {
    ...typography.input,
    fontSize: 13,
    color: "#92400E",
    flex: 1,
    lineHeight: 18,
  },

  /*
    ✏️ SECTION DE CONFIRMATION:
    - Fond gris très pâle (#F9FAFB)
    - Bordure légère
    - Contient le label + input + messages
  */
  confirmSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  confirmLabel: {
    ...typography.input,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },

  /*
    📋 CHAMP DE TEXTE (input):
    - Bordure légère grise
    - Fond blanc
    - Padding interne
  */
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 8,
    backgroundColor: "white",
  },

  /*
    ❌ STYLE D'ERREUR (quand texte ne correspond pas):
    - Bordure rouge
    - Fond rouge très pâle
  */
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },

  // Messages de feedback
  errorText: {
    ...typography.input,
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },

  successText: {
    ...typography.input,
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },

  // Container des boutons (côte à côte)
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },

  // Style de base pour les boutons
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  /*
    ❌ BOUTON ANNULER:
    - Fond gris pâle
    - Bordure légère
  */
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cancelButtonText: {
    ...typography.input,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  /*
    ✅ BOUTON SUPPRIMER:
    - Fond rouge (#DC2626)
    - Texte blanc
  */
  deleteButton: {
    backgroundColor: "#DC2626",
  },

  /*
    🚫 BOUTON SUPPRIMER DÉSACTIVÉ:
    - Fond rose pâle (#FECACA)
    - Opacité réduite
  */
  deleteButtonDisabled: {
    backgroundColor: "#FECACA",
    opacity: 0.6,
  },

  deleteButtonText: {
    ...typography.input,
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
