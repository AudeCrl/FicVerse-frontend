```jsx

/* ANCHOR[id=1] Ce sont les useState qui stockent les valeurs des champs du formulaire "création/modification" de fiction que l'utilisateur remplit ou modifie.
Ces useState stockent ces valeurs et les envoient au back. */


// ANCHOR[id=2] Promise.all() est une méthode native de JS. Elle permet d'exécuter plusieurs Promises en parallèle.

// Sans Promise.all (séquentiel = lent)
const fandoms = await fetch('/fandom');      // 100ms
const tags = await fetch('/tag');            // 100ms
const authors = await fetch('/fiction/author'); // 100ms
// Total : 300ms

// Avec Promise.all (parallèle = rapide) => Toutes en même temps
const [fandoms, tags, authors] = await Promise.all([
  fetch('/fandom'),      // 100ms
  fetch('/tag'),         // 100ms
  fetch('/fiction/author') // 100ms
]);
// Total : ~100ms
// Important : C'est pour ça que le refactoring passe de ~1500ms à ~400ms.


// ANCHOR[id=3] Promise.all() est une méthode native de JS. Elle permet d'exécuter plusieurs Promises en parallèle.
        if (fandomsData.result) setFandoms(fandomsData.fandoms);          // fandoms contient tous les fandoms du user triés par position asc
        if (tagsData.result) setTags(tagsData.tags);                      // tags contient tous les tags du user
        if (languagesData.result) setLanguages(languagesData.languages);  // languages contient toutes les langues du user
        if (authorsData.result) setAuthors(authorsData.authors);          // author contient tous les auteurs du user


// ANCHOR[id=4] 
 const handleAddTag = (tag) => {  // on passe le tag entier en paramètre car on va ajouter l'objet en entier dans les selectedTa  gs
    setSelectedTags(prev => {   // prev = la valeur actuelle du tableau selectedTags
      if (prev.some(t => t._id === tag._id)) return prev; // si aucun tag de selectedTags (cad t => t._id ici) ne correspond à tag._id alors on ajoute tag via [...prev, tag]. En revanche, s'il existe déjà alors on garde prev inchangé via "return prev"
      return [...prev, tag];
    });
  };

  const handleRemoveTag = (tagId) => {  // on passe juste l'id du tag en paramètre car on veut juste un critère de comparaison pour delete le tag
    setSelectedTags(prev => prev.filter(tag => tag._id !== tagId));  // on filtre pour que le tableau de tags "prev" ne garde que les tags qui ne correspondent pas au tag qu'on veut delete (tagId)
  };
  

// ANCHOR[id=5]
// On fait un "?" après current ici car au moment où le composant se monte ou dans certaines situations, scrollRef.current peut être null ou undefined (la référence au ScrollView n'est pas encore assignée).
// L'animation est activée (animated: true) pour un défilement fluide. Sans animated: true : Le défilement est instantané.
// scrollRef.current?.scrollToEnd scroll en bas
<TagSelector
              availableTags={tags}
              selectedTags={selectedTags}
              onAdd={handleAddTag}
              onRemove={handleRemoveTag}
              onCreate={handleCreateTag}
              onInputFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              onInputChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            />
