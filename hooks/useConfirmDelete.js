import { useState } from "react";


export function useConfirmDelete() {
  /*
    
    @state showConfirmModal - Booléen: est-ce que la modale de confirmation s'affiche?
                              true → utilisateur confirme la suppression
                              false → modale cachée
    
    @state showUndoNotif - Booléen: est-ce que la notification d'annulation s'affiche?
                           true → utilisateur peut encore annuler (10s countdown)
                           false → notification cachée
    
    @state itemToDelete - Objet ou null: l'élément que l'utilisateur veut supprimer
                          Structure: { id, name, itemType, ...otherFields }
                          Exemple: { id: 123, name: "Adventure", itemType: "tag" }
                          null quand pas de suppression en cours
    
    @state isLoading - Booléen: une requête est-elle en cours?
                       true → "Suppression..." s'affiche
                       false → boutons normaux
    
    @state error - String ou null: message d'erreur si quelque chose s'est mal passé
                   Exemples: "Erreur lors de la suppression"
                             null si pas d'erreur
  */
  const [deleteState, setDeleteState] = useState({
    showConfirmModal: false,
    showUndoNotif: false,
    itemToDelete: null,
    isLoading: false,
    error: null,
  });

  const [deletedItem, setDeletedItem] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // Ouvre la modale de confirmation avec l'élément à supprimer
  const openConfirmModal = (item, itemType = "élément") => {
    setDeleteState((prev) => ({
      ...prev,
      showConfirmModal: true,
      itemToDelete: {
        ...item,
        itemType,
      },
      error: null,
    }));
  };

  // Ferme la modale de confirmation
  const closeConfirmModal = () => {
    setDeleteState((prev) => ({
      ...prev,
      showConfirmModal: false,
      itemToDelete: null,
    }));
  };

  // Exécute le soft delete, affiche notification d'annulation, puis hard delete après 10s
  const executeDelete = async (softDeleteFn, hardDeleteFn) => {
    try {
      setDeleteState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Soft delete: appeler la fonction du backend
      const result = await softDeleteFn();

      // Sauvegarder l'élément supprimé (pour possibilité d'annulation)
      setDeletedItem(result);

      // Afficher la notification d'annulation (10s countdown)
      setDeleteState((prev) => ({
        ...prev,
        showConfirmModal: false,
        showUndoNotif: true,
        isLoading: false,
      }));

      // Configurer le timeout pour hard delete après 10 secondes
      const timeout = setTimeout(async () => {
        try {
          // Hard delete: vraiment supprimer après expiration
          await hardDeleteFn(result.id);
          setDeletedItem(null);
        } catch (err) {
          console.error("Erreur lors du hard delete:", err);
        }
      }, 10000);

      setUndoTimeout(timeout);
    } catch (err) {
      setDeleteState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Erreur lors de la suppression",
      }));
      console.error("Erreur lors de la suppression:", err);
    }
  };

  // Annule la suppression et restaure l'élément
  const handleUndo = async (undoFn) => {
    try {
      // Annuler le timeout de hard delete (10s)
      if (undoTimeout) {
        clearTimeout(undoTimeout);
        setUndoTimeout(null);
      }

      // Appeler la fonction de restauration
      await undoFn(deletedItem.id);

      // Masquer la notification d'annulation
      setDeleteState((prev) => ({
        ...prev,
        showUndoNotif: false,
      }));

      setDeletedItem(null);
    } catch (err) {
      setDeleteState((prev) => ({
        ...prev,
        error: err.message || "Erreur lors de l'annulation",
      }));
      console.error("Erreur lors de l'annulation:", err);
    }
  };

  // Ferme la notification d'annulation
  const closeUndoNotif = () => {
    setDeleteState((prev) => ({
      ...prev,
      showUndoNotif: false,
    }));
    setDeletedItem(null);
  };

  // Réinitialise le message d'erreur
  const clearError = () => {
    setDeleteState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  // Nettoie les ressources: annuler les timeouts en cours
  const cleanup = () => {
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }
  };

  return {
    // État
    showConfirmModal: deleteState.showConfirmModal,
    showUndoNotif: deleteState.showUndoNotif,
    itemToDelete: deleteState.itemToDelete,
    isLoading: deleteState.isLoading,
    error: deleteState.error,
    deletedItem,

    // Actions
    openConfirmModal,
    closeConfirmModal,
    executeDelete,
    handleUndo,
    closeUndoNotif,
    clearError,
    cleanup,
  };
}
