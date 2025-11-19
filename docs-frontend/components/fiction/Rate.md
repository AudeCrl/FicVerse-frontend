```jsx

// index vaut respectivement [1, 2, 3, 4 ,5] selon le coeur sélectionné parmi les 5 coeurs créés.

/* Si on appuie sur le 3ème coeur :
1. Les itérations du map auront déjà été faites et index vaudra 3 pour ce 3ème coeur.
2. onPress(3) est appelé
3. Dans le parent, onPress={setRateValue} donc setRateValue(3)
4. rateValue devient 3
5. Re-render → value={rateValue} passe 3 au composant Rate
6. La comparaison value >= index colore les 3 premiers cœurs

Le index du cœur cliqué devient la nouvelle value.
*/
