```jsx

// ANCHOR[id=1] Suggestions filtrées (tags non sélectionnés qui matchent l'input)
const suggestions = useMemo(() => {
    const inputTrim = input.trim().toLowerCase();
    const selectedIds = new Set(selectedTags.map(tag => tag._id));  // Set est placé car on utilise la méthode .has() dans la ligne suivante. Set est aussi utilisé pour supprimer les doublons automatiquement d'habitude, mais ici c'est juste pour le gain de performance avec .has(). Car les doublons sont déjà évités chez le parent par handleAddTag(tag).
    const notSelected = availableTags.filter(tag => !selectedIds.has(tag._id)); // Set.has() va faire la comparaison tags availables / tags sélectionnés bien plus rapidement que includes().

// On a fetch les tags totaux et placés dans availableTags chez le parent. Et on a fetch les tags sélectionnés (si fiction existante) et on les a mis dans selectedTags chez le parent. Donc les tag._id ci-dessus sont les id des tags provenant du parent ManageFictionScreen.
// C'est bien infiniment plus rapide de faire comme ça plutôt que :
const selectedIds = selectedTags.map(tag => tag._id);
const notSelected = selectedIds.includes(tag._id);

// Et Set n'est pas un tableau donc map et filter ne fonctionnent pas dessus. Mais ici, map est sur le tableau selectedTags et filter sur le tableau availableTags

    if (!inputTrim) {
      // Input vide → tri usageCount desc + alphabétique
      return [...notSelected]
        .sort((a, b) => {
          const diff = b.usageCount - a.usageCount;
          if (diff !== 0) return diff;
          return a.name.localeCompare(b.name, "fr", { sensitivity: "base" }); // Tri par ordre alphabétique.
          // LocaleCompare() est utilisé dans le sort() mais il ne s’applique qu’aux chaînes de caractères, donc pas utilisé sur usageCount mais sur a.name et b.name.
          /* Syntaxe :
          a.name : première chaîne à comparer
          .localeCompare(b.name, ...) : compare avec la deuxième chaîne
          "fr" : utilise les règles françaises (ex: é = e, ç = c)
          { sensitivity: "base" } : ignore les accents et la casse. Ex : école, Ecole, éCole seront tous considérés identiques et triés ensemble. 
          */
        })
        .slice(0, 10);
    }

    // Input non vide → filtrage + tri alphabétique
    return notSelected
      .filter(tag => tag.name.toLowerCase().includes(inputTrim))
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }))
      .slice(0, 10);
  }, [input, availableTags, selectedTags]); // les suggestions se mettent à jour si on change l'input, les tags du user ou les tags sélectionnés