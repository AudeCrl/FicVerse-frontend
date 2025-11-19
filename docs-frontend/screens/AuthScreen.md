```jsx

// ANCHOR[id=1] Provient de ProfileScreen avec la fonction handleLogout. Depuis ProfileScreen, un initialForm login est envoyé vers Auth et si cela arrive, alors initialSignUp = false et signUp = false et donc on arrive direct à la connexion


// ANCHOR[id=2] 
  //  Explication de UseMemo en 3 lignes !
  //  On attribue une constante pour appliquer le useMemo. Ex : checkUsername.
  //  Finalité de useMemo : vérifier que le champ username n'est pas vide (donc .trim.length > 0).
  //  useMemo va effectuer cette vérification à chaque fois que la variable entre crochets [ ] va changer.
  //  Donc à chaque fois que username va changer, useMemo effectue la vérif.

    // useMemo vérifie :
  // que le champ de confirmation est égal au champ mdp, donc confirmPassword === passwordSignup
  // qu'il n'est pas vide, donc confirmPassword.trim().length > 0,
  // a chaque fois que confirmPassword ou passwordSignup sont modifiés, la vérification est lancée

  // ANCHOR[id=3]
    // Le back nous a répondu avec la route /signup => { result : true/false, user: { token, email, username } }
    // Si result est true, on l'envoie au reducer via dispatch