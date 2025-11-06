import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../styles/globalStyles";

/**
 * 🔔 COMPOSANT: UndoNotification
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Notification d'ANNULATION de suppression avec COMPTE À REBOURS
 *
 * 🎯 OBJECTIF:
 * Afficher une notification animée en bas de l'écran après une suppression.
 * L'utilisateur a X secondes pour cliquer "Annuler" pour restaurer l'élément.
 * Utile pour le "soft delete" (suppression non permanente).
 *
 * ✨ FONCTIONNALITÉS:
 * 1. Animation slide-up/slide-down (notification apparaît par le bas)
 * 2. Compte à rebours visible: "Annulation possible dans 10s"
 * 3. Bouton "Annuler" avec icône de rotation (↻)
 * 4. Fermeture automatique quand compte à rebours atteint 0
 * 5. Bouton "X" pour fermer manuellement
 * 6. État "Annulation..." quand l'utilisateur clique Annuler (loading)
 *
 * ⚙️ PROPS (paramètres attendus):
 *
 * @param {boolean} visible - Est-ce que la notification s'affiche?
 *                            Ex: true → notification visible au bas
 *                            false → notification cachée
 *
 * @param {string} itemName - Nom de l'élément supprimé
 *                            Ex: "Adventure", "My Fandom", "Romance Tag"
 *                            S'affiche en gras: "[itemName] a été supprimé"
 *
 * @param {string} [itemType="élément"] - Type d'élément (optionnel, défaut: "élément")
 *                                        Actuellement pas utilisé, mais disponible
 *                                        Ex: "tag", "fandom", "fiction"
 *
 * @param {function} onUndo - Callback exécuté quand utilisateur clique "Annuler"
 *                            Signature: async () => void ou () => Promise
 *                            Utilisé pour: appeler API pour restaurer l'élément
 *                            ⚠️  Doit être async pour afficher "Annulation..."
 *
 * @param {function} onDismiss - Callback exécuté quand notification ferme
 *                               Signature: () => void
 *                               Appelé quand: timer atteint 0 OU utilisateur clique X
 *
 * @param {number} [autoHideDelay=10000] - Délai avant fermeture auto (en ms)
 *                                         Défaut: 10000ms = 10 secondes
 *                                         Ex: 5000 = 5 secondes
 *
 * 💡 EXEMPLE D'UTILISATION:
 *
 * const [showUndo, setShowUndo] = useState(false);
 *
 * <UndoNotification
 *   visible={showUndo}
 *   itemName="Adventure"
 *   itemType="tag"
 *   onUndo={async () => {
 *     // Restaurer l'élément (soft delete reverse)
 *     await restoreTag('123');
 *   }}
 *   onDismiss={() => setShowUndo(false)}
 *   autoHideDelay={8000}  // 8 secondes
 * />
 *
 * // Après une suppression:
 * await deleteTag('123');  // Soft delete côté backend
 * setShowUndo(true);       // Afficher la notification
 */
export default function UndoNotification({
  visible,
  itemName,
  itemType = "élément",
  onUndo,
  onDismiss,
  autoHideDelay = 10000, // 10 secondes
}) {
  /*
    📊 STATE MANAGEMENT:
    
    @state timeLeft - Secondes restantes avant fermeture automatique
                      Calculé à partir de autoHideDelay
                      Ex: autoHideDelay=10000 → timeLeft=10
                      Utilisé pour afficher "Annulation possible dans 10s"
    
    @state isUndoPressed - Booléen: utilisateur a-t-il cliqué "Annuler"?
                           true → affiche "Annulation..." et désactive les boutons
                           false → boutons normaux et visibles
    
    @ref slideAnim - Animated.Value pour animation slide verticale
                     Valeur 0 = notification visible
                     Valeur 200 = notification hors écran (bas)
                     Crée l'effet de glissement vers le haut
  */
  const [timeLeft, setTimeLeft] = useState(Math.ceil(autoHideDelay / 1000));
  const [isUndoPressed, setIsUndoPressed] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(200)).current;

  /*
    🎬 EFFET #1: Animation d'apparition/disparition
    ═════════════════════════════════════════════════════════════════════════
    
    Déclenché quand: visible passe de true à false (ou inverse)
    
    SI visible = true (notification doit s'afficher):
      1. Réinitialiser isUndoPressed = false (effacer l'ancien état)
      2. Réinitialiser timeLeft au délai par défaut
      3. Animer slideAnim de 200 → 0 (animation de 300ms)
         → Notification glisse vers le haut et devient visible
    
    SI visible = false (notification doit disparaître):
      1. Animer slideAnim de 0 → 200 (animation de 300ms)
         → Notification glisse vers le bas et sort de l'écran
    
    Le transform: [{ translateY: slideAnim }] utilise cette valeur
    pour positionner la notification verticalement.
  */
  useEffect(() => {
    if (visible) {
      // Notification doit apparaître
      setIsUndoPressed(false);
      setTimeLeft(Math.ceil(autoHideDelay / 1000));
      Animated.timing(slideAnim, {
        toValue: 0, // Notification visible = translateY: 0
        duration: 300, // Animation de 300 millisecondes
        useNativeDriver: true, // Optimisation performance
      }).start();
    } else {
      // Notification doit disparaître
      Animated.timing(slideAnim, {
        toValue: 200, // Notification cachée = translateY: 200 (vers le bas)
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  /*
    ⏱️ EFFET #2: Compte à rebours automatique
    ═════════════════════════════════════════════════════════════════════════
    
    Déclenché quand: visible ou isUndoPressed change
    
    LOGIQUE:
      1. Si NOT visible → Ne pas démarrer le timer (return)
      2. Si isUndoPressed = true → Ne pas compter (return)
         (L'utilisateur a cliqué Annuler, timer arrêté)
      3. Créer un interval qui s'exécute toutes les 1000ms (1 seconde)
      4. À chaque interval:
         - Décrémenter timeLeft de 1
         - Si timeLeft ≤ 1:
           • Arrêter le timer (clearInterval)
           • Appeler onDismiss() (fermer la notification)
           • Retourner 0
         - Sinon: continuer le compte
      5. Cleanup: clearing l'interval quand le composant unmount
    
    EXEMPLE VISUEL DU COMPTE À REBOURS:
      10s → affiche "Annulation possible dans 10s"
       9s → affiche "Annulation possible dans 9s"
       8s → affiche "Annulation possible dans 8s"
       ...
       1s → affiche "Annulation possible dans 1s"
       0s → appelle onDismiss() et la notification ferme
  */
  useEffect(() => {
    // Conditions pour ne PAS démarrer le timer
    if (!visible || isUndoPressed) return;

    // Créer un interval qui décrémente le temps chaque seconde
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // Quand le compte à rebours atteint 0
        if (prev <= 1) {
          clearInterval(interval); // Arrêter le timer
          onDismiss?.(); // Fermer la notification
          return 0;
        }
        // Décrémenter de 1 seconde
        return prev - 1;
      });
    }, 1000); // Chaque 1000ms = 1 seconde

    // Cleanup: arrêter le timer si le composant unmount ou si les deps changent
    return () => clearInterval(interval);
  }, [visible, isUndoPressed]);

  /*
    🔄 GESTIONNAIRE: Bouton "Annuler"
    ═════════════════════════════════════════════════════════════════════════
    
    Appelé quand: utilisateur clique le bouton "Annuler" (↻)
    
    ÉTAPES:
      1. setIsUndoPressed(true)
         → Affiche "Annulation..." au lieu de "Annuler"
         → Désactive tous les boutons
         → Arrête le compte à rebours
      
      2. await onUndo?.()
         → Appelle la fonction de restauration (async)
         → Attend que la restauration soit complète
         → Gère les erreurs en backend (409, 401, etc)
      
      3. onDismiss?.()
         → Ferme la notification
         → Déclenche le callback parent pour cleanup
    
    ⚠️ NOTER: onUndo doit être async pour afficher "Annulation..."
              Si onUndo est rapide (< 100ms), l'utilisateur peut ne pas voir le changement
  */
  const handleUndo = async () => {
    setIsUndoPressed(true); // Afficher "Annulation..." et désactiver boutons
    await onUndo?.(); // Attendre la restauration
    onDismiss?.(); // Fermer la notification après
  };

  // Si visible = false, ne pas afficher rien (return null)
  // Cela évite de rendre la notification quand elle est cachée
  if (!visible) return null;

  return (
    /*
      🎨 CONTENEUR PRINCIPAL ANIMÉ:
      - Animated.View = composant spécial qui peut être animé avec Animated API
      - style={{ transform: [{ translateY: slideAnim }] }} = applique l'animation
      - slideAnim varie de 200 (caché) à 0 (visible)
      - Crée l'effet de glissement depuis le bas vers le haut
      
      EXEMPLE DE MOUVEMENT:
        slideAnim = 200 → notification hors écran (20pixels vers le bas)
        slideAnim = 150 → notification partiellement visible
        slideAnim = 100 → notification plus visible
        slideAnim = 0   → notification complètement visible
    */
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      {/* 
        📦 CONTENU: Composé de 3 parties
        1. TextContainer (gauche): message + timer
        2. UndoButton (centre): bouton "Annuler" avec icône
        3. CloseButton (droite): bouton "X" pour fermer
      */}
      <View style={styles.content}>
        {/* 
          📝 PART #1: TEXT CONTAINER (message et timer)
          ═════════════════════════════════════════════════════════════════
        */}
        <View style={styles.textContainer}>
          {/* ✓ Icône check-circle verte (symbole de succès) */}
          <Feather name="check-circle" size={20} color="#10B981" />

          {/* Conteneur pour le message + timer */}
          <View style={styles.messageWrapper}>
            {/* 
              MESSAGE PRINCIPAL:
              Affiche: "[itemName] a été supprimé"
              itemName s'affiche en gras et couleur foncée pour ressortir
              
              EXEMPLE:
              Si itemName = "Adventure":
              → "Adventure a été supprimé" (avec "Adventure" en gras)
            */}
            <Text style={styles.message}>
              <Text style={styles.bold}>{itemName}</Text> a été supprimé
            </Text>

            {/* 
              TEXTE DU COMPTE À REBOURS:
              Affiche: "Annulation possible dans [timeLeft]s"
              Exemple: "Annulation possible dans 10s"
              
              Le nombre [timeLeft]s est affiché en gras et couleur foncée
              pour attirer l'attention sur l'urgence
            */}
            <Text style={styles.timer}>
              Annulation possible dans{" "}
              <Text style={styles.timerBold}>{timeLeft}s</Text>
            </Text>
          </View>
        </View>

        {/* 
          🔘 PART #2: BOUTON "ANNULER" (↻ avec texte)
          ═════════════════════════════════════════════════════════════════
        */}
        <TouchableOpacity
          style={[
            styles.undoButton,
            // Ajouter style "disabled" si utilisateur a déjà cliqué
            isUndoPressed && styles.undoButtonDisabled,
          ]}
          onPress={handleUndo}
          disabled={isUndoPressed} // Désactiver si déjà en cours d'annulation
        >
          {/* 
            Icône de rotation (↻) - couleur change selon l'état
            Si isUndoPressed = true → gris (#9CA3AF)
            Si isUndoPressed = false → bleu (#3B82F6)
          */}
          <Feather
            name="rotate-ccw"
            size={16}
            color={isUndoPressed ? "#9CA3AF" : "#3B82F6"}
          />

          {/* 
            TEXTE DU BOUTON:
            Si isUndoPressed = true → "Annulation..." (en gris)
            Si isUndoPressed = false → "Annuler" (en bleu)
          */}
          <Text
            style={[
              styles.undoButtonText,
              isUndoPressed && styles.undoButtonTextDisabled,
            ]}
          >
            {isUndoPressed ? "Annulation..." : "Annuler"}
          </Text>
        </TouchableOpacity>

        {/* 
          ❌ PART #3: BOUTON FERMER (X)
          ═════════════════════════════════════════════════════════════════
          Petit bouton "X" pour fermer la notification manuellement
          Utile si l'utilisateur ne veut pas annuler
          Couleur: gris (#6B7280)
        */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss} // Fermer la notification
          disabled={isUndoPressed} // Désactiver si déjà en cours d'annulation
        >
          <Feather name="x" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

/**
 * 🎨 STYLES: Définitions de style pour UndoNotification
 * ════════════════════════════════════════════════════════════════════════════
 *
 * StyleSheet.create() = Optimiser les styles pour React Native
 * Structure organisée par composant (container, content, message, buttons, etc)
 */
const styles = StyleSheet.create({
  /*
    📍 CONTAINER (conteneur principal):
    - position: absolute → Positionner en bas de l'écran par-dessus tout
    - bottom: 20 → 20 pixels du bas
    - left/right: 16 → 16 pixels de marge horizontale
    - zIndex: 999 → Apparaître par-dessus tout le reste
    
    ⚠️  ATTENTION: zIndex n'existe pas dans React Native
        On utilise plutôt l'ordre des composants dans le JSX
        Le composant qui apparaît dernier est par-dessus
  */
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 999,
  },

  /*
    📦 CONTENT (la boîte verte de notification):
    - backgroundColor: #ECFDF5 → vert TRÈS pâle (succès/info)
    - borderLeftWidth: 4 → barre verte épaisse à gauche (accent)
    - borderLeftColor: #10B981 → vert foncé pour la barre
    - flexDirection: row → alignement horizontal (texte à gauche, boutons à droite)
    - gap: 12 → espacement de 12 entre les éléments
    - padding: 12 → espace interne
    - elevation: 5 (Android) & shadow (iOS) → ombre pour relief 3D
  */
  content: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 12,
  },

  /*
    📝 TEXT CONTAINER (partie gauche avec icon + texte):
    - flex: 1 → prend tout l'espace disponible à gauche
    - flexDirection: row → alignement horizontal
    - gap: 10 → espacement entre icône et texte
    - Contient: [checkmark icon] [message + timer]
  */
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Wrapper autour du message + timer (pour flex layout)
  messageWrapper: {
    flex: 1,
  },

  /*
    💬 MESSAGE PRINCIPAL:
    "Adventure a été supprimé"
    - color: #065F46 → vert foncé
    - fontWeight: 500 → semi-gras (lisible)
    - fontSize: 13 → petit, compact
    - lineHeight: 18 → espacement vertical entre lignes
  */
  message: {
    ...typography.input,
    fontSize: 13,
    fontWeight: "500",
    color: "#065F46",
    lineHeight: 18,
  },

  /*
    🔤 TEXTE EN GRAS (itemName):
    - fontWeight: 700 → très gras
    - color: #059669 → vert plus clair que le reste du message
    - Utilisé pour highlighter le nom de l'élément supprimé
    
    EXEMPLE:
    "Adventure a été supprimé"
     ↑↑↑↑↑↑↑↑ en gras et vert clair
  */
  bold: {
    fontWeight: "700",
    color: "#059669",
  },

  /*
    ⏱️ TIMER TEXT:
    "Annulation possible dans 10s"
    - fontSize: 11 → très petit (info secondaire)
    - color: #10B981 → vert moyen
    - marginTop: 2 → petit espace entre le message et le timer
  */
  timer: {
    ...typography.input,
    fontSize: 11,
    color: "#10B981",
    lineHeight: 16,
    marginTop: 2,
  },

  /*
    🔢 TIMER BOLD:
    Le nombre "10s" dans le timer
    - fontWeight: 700 → gras pour ressortir
    - color: #059669 → vert clair comme bold()
  */
  timerBold: {
    fontWeight: "700",
    color: "#059669",
  },

  /*
    🔘 BOUTON "ANNULER" (↻ Annuler):
    Bouton actif/normal (avant de cliquer)
    - backgroundColor: #DBEAFE → bleu TRÈS pâle
    - flexDirection: row → [icône] [texte] horizontalement
    - padding: 10x8 → espace interne
    - gap: 6 → espacement entre icône et texte
  */
  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },

  /*
    🚫 BOUTON "ANNULER" DÉSACTIVÉ:
    Après que l'utilisateur clique "Annuler"
    - backgroundColor: #F3F4F6 → gris pâle
    - opacity: 0.6 → 60% de transparence (effet estompé)
  */
  undoButtonDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },

  /*
    📝 TEXTE DU BOUTON (normal):
    "Annuler"
    - color: #3B82F6 → bleu
    - fontWeight: 600 → gras
    - fontSize: 12 → petit
  */
  undoButtonText: {
    ...typography.input,
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },

  /*
    📝 TEXTE DU BOUTON (désactivé):
    "Annulation..."
    - color: #9CA3AF → gris (moins visible quand désactivé)
  */
  undoButtonTextDisabled: {
    color: "#9CA3AF",
  },

  /*
    ❌ BOUTON FERMER (X):
    Petit bouton pour fermer manuellement la notification
    - padding: 8x4 → petit espace interne
    - Couleur icône: #6B7280 → gris
  */
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
