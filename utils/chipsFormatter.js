/**
 * 📁 UTILITAIRE: chipsFormatter.js
 * ═════════════════════════════════════════════════════════════════
 *
 * Ce fichier contient des fonctions pour formater les données
 * en chips (petites étiquettes) pour affichage dans les SettingsCard
 *
 * UTILISATION:
 * - chipsPreview() → Extrait un aperçu (max 3 éléments) pour afficher
 * - formatCount() → Formate un compteur avec singulier/pluriel
 * - getItemName() → Extrait le nom d'un objet (flexible)
 *
 * EXEMPLE:
 * const tags = [{ name: 'Adventure' }, { name: 'Fantasy' }, { name: 'Romance' }];
 * const preview = chipsPreview(tags, 3, 'name');
 * // Résultat: ['Adventure', 'Fantasy', 'Romance']
 */

/**  FONCTION: chipsPreview()

 * ─────────────────────────────────────────────────────────────────
 * Extrait les n premiers éléments d'un tableau pour les afficher comme chips
 *
 * Cas d'usage: Afficher un aperçu des tags/fandoms/etc dans SettingsCard
 *
 * PARAMÈTRES:
 * @param {Array} list - Tableau d'objets ou de strings à formater
 *                       Ex: [{ name: 'Tag1' }, { name: 'Tag2' }]
 * @param {number} [n=3] - Nombre maximum de chips à retourner (défaut: 3)
 *                         Ex: chipsPreview(tags, 5) → retourne max 5 éléments
 * @param {string} [nameKey] - Clé personnalisée pour extraire le nom
 *                             Ex: chipsPreview(items, 3, 'label')
 *
 * RETOUR:
 * @returns {string[]} Tableau des n premiers éléments formatés en strings
 *                     Ex: ['Adventure', 'Fantasy', 'Romance']
 *
 * LOGIQUE:
 * 1. Vérifier que list est bien un tableau
 * 2. Prendre seulement les n premiers éléments avec slice(0, n)
 * 3. Pour chaque élément:
 *    a. Si nameKey fourni ET élément a cette clé → retourner item[nameKey]
 *    b. Sinon si élément a propriété "name" → retourner item.name
 *    c. Sinon si élément a propriété "label" → retourner item.label
 *    d. Sinon → retourner l'élément converti en string
 *
 * EXEMPLES D'UTILISATION:
 *
 * // Cas 1: Tableau d'objets avec "name"
 * const tags = [{ name: 'Adventure' }, { name: 'Fantasy' }];
 * chipsPreview(tags) // ['Adventure', 'Fantasy'] (max 3)
 *
 * // Cas 2: Tableau de strings
 * const langs = ['English', 'French', 'Spanish'];
 * chipsPreview(langs, 2) // ['English', 'French']
 *
 * // Cas 3: Objet avec clé personnalisée
 * const authors = [{ fullName: 'John Doe' }];
 * chipsPreview(authors, 3, 'fullName') // ['John Doe']
 */
export function chipsPreview(list, n = 3, nameKey = null) {
  // SÉCURITÉ: Vérifier que list est bien un tableau
  // Si ce n'est pas un array, retourner [] vide pour éviter erreurs
  if (!Array.isArray(list)) return [];

  // LOGIQUE PRINCIPALE:
  // 1. slice(0, n) → prendre seulement les n premiers éléments
  // 2. map() → transformer chaque élément en string
  return list.slice(0, n).map((item) => {
    // CAS 1: Clé personnalisée fournie ET élément a cette clé
    // Ex: chipsPreview(authors, 3, 'fullName') avec { fullName: 'John' }
    if (typeof item === "object" && nameKey && item[nameKey]) {
      return item[nameKey];
    }

    // CAS 2: Élément est un objet avec propriété "name" (standard)
    // C'est le cas le plus courant pour tags, fandoms, etc.
    // Ex: { _id: '123', name: 'Adventure', description: '...' }
    if (typeof item === "object" && item.name) {
      return item.name;
    }

    // CAS 3: Élément est un objet avec propriété "label" (alternatif)
    // Certains objets utilisent "label" au lieu de "name"
    // Ex: { value: 'en', label: 'English' }
    if (typeof item === "object" && item.label) {
      return item.label;
    }

    // CAS 4: Élément est un string ou autre
    // Conversion automatique en string (fallback)
    // Ex: 'Adventure' → 'Adventure' (pas de changement)
    return String(item);
  });
}

/**
 *  FONCTION: formatCount()
 * ─────────────────────────────────────────────────────────────────
 * Formate un compteur avec gestion singulier/pluriel
 *
 * Cas d'usage: Afficher "1 tag" ou "5 tags" ou "0 tags" correctement
 *
 * PARAMÈTRES:
 * @param {number} count - Nombre à formater (défaut: 0)
 *                         Ex: 5, 1, 0
 * @param {string} [singular="élément"] - Forme singulière (défaut: "élément")
 *                                        Ex: "tag", "fandom", "auteur"
 * @param {string} [plural="éléments"] - Forme plurielle (défaut: "éléments")
 *                                       Ex: "tags", "fandoms", "auteurs"
 *
 * RETOUR:
 * @returns {string} Texte formaté avec le bon singulier/pluriel
 *                   Ex: "0 tags", "1 tag", "5 tags"
 *
 * LOGIQUE:
 * 1. Si count === 0 → retourner "0 {plural}" (toujours pluriel pour zéro)
 * 2. Si count === 1 → retourner "{count} {singular}"
 * 3. Si count > 1 → retourner "{count} {plural}"
 *
 * EXEMPLES D'UTILISATION:
 *
 * // Cas 1: Zéro élément
 * formatCount(0) // "0 éléments"
 * formatCount(0, 'tag', 'tags') // "0 tags"
 *
 * // Cas 2: Un élément
 * formatCount(1, 'tag', 'tags') // "1 tag"
 * formatCount(1, 'auteur', 'auteurs') // "1 auteur"
 *
 * // Cas 3: Plusieurs éléments
 * formatCount(5, 'tag', 'tags') // "5 tags"
 * formatCount(10, 'fandom', 'fandoms') // "10 fandoms"
 *
 * // Cas 4: Défaut (sans paramètres singulier/pluriel)
 * formatCount(3) // "3 éléments"
 */
export function formatCount(
  count = 0,
  singular = "élément",
  plural = "éléments"
) {
  //  LOGIQUE: Choisir le format en fonction du count

  // Si zéro, toujours utiliser le pluriel (convention française)
  if (count === 0) return `0 ${plural}`;

  // Ternaire: si count === 1 → singulier, sinon → pluriel
  // `${count}` interpolation du nombre dans le texte
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 *  FONCTION: getItemName()
 * ─────────────────────────────────────────────────────────────────
 * Extrait le nom d'un objet en cherchant les propriétés courantes
 *
 * Cas d'usage: Obtenir le nom d'un item peu importe sa structure
 * Flexible et robuste: essaie plusieurs propriétés courantes
 *
 * PARAMÈTRES:
 * @param {Object|string} item - Objet ou string dont extraire le nom
 *                               Ex: { name: 'Adventure' } ou 'Adventure'
 *
 * RETOUR:
 * @returns {string} Le nom extrait ou "" si aucun nom trouvé
 *                   Ex: 'Adventure', 'John Doe', ''
 *
 * LOGIQUE - ORDRE DE PRIORITÉ:
 * 1. Si item est un string → retourner directement (déjà un nom)
 * 2. Si item est null/undefined → retourner ""
 * 3. Si item.name existe → retourner item.name (plus courant)
 * 4. Si item.label existe → retourner item.label (altern atif)
 * 5. Si item.title existe → retourner item.title (pour articles, fanfics)
 * 6. Si item.username existe → retourner item.username (pour utilisateurs)
 * 7. Si item.firstName existe → retourner item.firstName (pour personnes)
 * 8. Sinon → retourner String(item) (dernière chance)
 *
 * EXEMPLES D'UTILISATION:
 *
 * // Cas 1: String (pas un objet)
 * getItemName('Adventure') // 'Adventure'
 *
 * // Cas 2: Objet avec "name"
 * getItemName({ name: 'Fantasy' }) // 'Fantasy'
 *
 * // Cas 3: Objet avec "label"
 * getItemName({ value: 'en', label: 'English' }) // 'English'
 *
 * // Cas 4: Objet avec "title"
 * getItemName({ _id: '1', title: 'My Fanfic' }) // 'My Fanfic'
 *
 * // Cas 5: Objet avec "username" (utilisateur)
 * getItemName({ id: 1, username: 'john_doe' }) // 'john_doe'
 *
 * // Cas 6: Objet avec "firstName"
 * getItemName({ firstName: 'John', lastName: 'Doe' }) // 'John'
 *
 * // Cas 7: Null ou undefined
 * getItemName(null) // ''
 * getItemName(undefined) // ''
 *
 * // Cas 8: Objet sans aucune de ces propriétés
 * getItemName({ id: 123 }) // '[object Object]' (String conversion)
 */
export function getItemName(item) {
  // ✋ CAS 1: Si c'est un string, c'est déjà un nom → retourner tel quel
  if (typeof item === "string") return item;

  // ✋ CAS 2: Si null ou undefined → retourner string vide (sécurité)
  if (!item) return "";

  // 📌 CAS 3-8: Chercher le nom dans l'objet en ordre de priorité
  // Utiliser || (or opérateur) pour essayer plusieurs propriétés
  // La première non-nulle sera retournée
  return (
    item.name || // Cas 3: Propriété "name" (plus courant)
    item.label || // Cas 4: Propriété "label" (altern atif UI)
    item.title || // Cas 5: Propriété "title" (fanfics, articles)
    item.username || // Cas 6: Propriété "username" (utilisateurs)
    item.firstName || // Cas 7: Propriété "firstName" (personnes)
    String(item) // Cas 8: Dernière chance (conversion)
  );
}
