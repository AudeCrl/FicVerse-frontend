import axios from "axios";

// Service API pour les suppressions sécurisées: soft delete, hard delete, restore
// Gère aussi les erreurs avec messages spécifiques

const API_BASE = "http://your-api-url"; // A configurer

// ============= TAGS =============

// Soft delete: marquer le tag comme supprimé (deleted_at = now)
export async function softDeleteTag(tagId) {
  try {
    const response = await axios.delete(`${API_BASE}/tag/${tagId}/soft`, {
      data: { soft: true },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

// Hard delete: vraiment supprimer le tag de la DB (irréversible après 10s)
export async function hardDeleteTag(tagId) {
  try {
    const response = await axios.delete(`${API_BASE}/tag/${tagId}/hard`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

// Restore: annuler la suppression, remette deleted_at = null
export async function restoreTag(tagId) {
  try {
    const response = await axios.post(`${API_BASE}/tag/${tagId}/restore`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

// ============= FANDOMS =============

export async function softDeleteFandom(fandomId) {
  try {
    const response = await axios.delete(`${API_BASE}/fandom/${fandomId}/soft`, {
      data: { soft: true },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function hardDeleteFandom(fandomId) {
  try {
    const response = await axios.delete(`${API_BASE}/fandom/${fandomId}/hard`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function restoreFandom(fandomId) {
  try {
    const response = await axios.post(`${API_BASE}/fandom/${fandomId}/restore`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

// ============= ACCOUNT =============

// Supprimer le compte utilisateur (nécessite le mot de passe pour vérification)
export async function deleteUserAccount(password) {
  try {
    const response = await axios.post(`${API_BASE}/user/delete-account`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

// ============= ERROR HANDLING =============

// Centraliser les erreurs API avec messages clairs en français
function handleError(error) {
  if (error.response) {
    const { status, data } = error.response;

    // 409 Conflict: élément utilisé ailleurs, ne peut pas supprimer
    if (status === 409) {
      return new Error(
        data.message ||
          "Cet élément est encore utilisé et ne peut pas être supprimé"
      );
    }

    // 401 Unauthorized: pas connecté
    if (status === 401) {
      return new Error("Vous devez être authentifié");
    }

    // 403 Forbidden: pas le droit de supprimer cet élément
    if (status === 403) {
      return new Error(
        "Vous n'avez pas la permission de supprimer cet élément"
      );
    }

    // 404 Not Found: l'élément n'existe pas
    if (status === 404) {
      return new Error("L'élément n'existe pas");
    }

    // 500+ Server Error: erreur serveur
    if (status >= 500) {
      return new Error("Erreur serveur. Veuillez réessayer plus tard.");
    }

    return new Error(data.message || "Erreur lors de la suppression");
  }

  // Erreur réseau (pas de response)
  return new Error("Erreur réseau. Veuillez vérifier votre connexion.");
}
