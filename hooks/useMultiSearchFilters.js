import { useCallback, useState } from "react";

/**
 * 🎯 Hook: useMultiSearchFilters
 * ════════════════════════════════════════════════════════════════════════════
 * Permet de gérer plusieurs critères de recherche (tag + auteur) simultanément
 * et de rafraîchir les résultats quand les critères changent.
 *
 * @param {Array} allFictions - Toutes les fictions disponibles
 * @returns {Object} { activeFilters, addFilter, removeFilter, clearFilters, filteredFictions }
 */
export function useMultiSearchFilters(allFictions = []) {
  const [activeFilters, setActiveFilters] = useState({
    tags: [],
    authors: [],
  });

  // Ajouter un filtre (tag ou auteur)
  const addFilter = useCallback((filterType, filterValue) => {
    setActiveFilters((prev) => {
      const currentList = prev[filterType] || [];
      if (!currentList.includes(filterValue)) {
        return {
          ...prev,
          [filterType]: [...currentList, filterValue],
        };
      }
      return prev;
    });
  }, []);

  // Retirer un filtre
  const removeFilter = useCallback((filterType, filterValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: (prev[filterType] || []).filter((f) => f !== filterValue),
    }));
  }, []);

  // Effacer tous les filtres
  const clearFilters = useCallback(() => {
    setActiveFilters({
      tags: [],
      authors: [],
    });
  }, []);

  // Filtrer les fictions selon les critères actifs
  const filteredFictions = allFictions.filter((fiction) => {
    const hasTagFilter = activeFilters.tags && activeFilters.tags.length > 0;
    const hasAuthorFilter =
      activeFilters.authors && activeFilters.authors.length > 0;

    // Si un tag est sélectionné, la fiction doit contenir ce tag
    if (hasTagFilter) {
      const fictionTagNames = (fiction.tags || []).map((t) => t.name);
      const matchesTag = activeFilters.tags.every((tag) =>
        fictionTagNames.includes(tag)
      );
      if (!matchesTag) return false;
    }

    // Si un auteur est sélectionné, la fiction doit avoir cet auteur
    if (hasAuthorFilter) {
      const matchesAuthor = activeFilters.authors.includes(fiction.author);
      if (!matchesAuthor) return false;
    }

    return true;
  });

  return {
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    filteredFictions,
    hasActiveFilters:
      (activeFilters.tags && activeFilters.tags.length > 0) ||
      (activeFilters.authors && activeFilters.authors.length > 0),
  };
}
