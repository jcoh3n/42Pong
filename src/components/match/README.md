# Organisation du développement de la page de match

Ce dossier contient les composants liés à la page de match du jeu Pong.

## Structure des fichiers

- `MatchPage.tsx` : Composant principal de la page de match (production)
- `QuickMatchPage.tsx` : Version simplifiée pour des matchs rapides avec sélection du nombre de sets
- `PongField.tsx` : Composant principal du terrain de jeu Pong
- `SetScoreDisplay.tsx` : Affichage du tableau des scores des sets
- `AddSetButton.tsx` : Bouton pour ajouter un set
- `PlayerDisplay.tsx` : Affichage d'un joueur avec son avatar
- `WinPopup.tsx` : Popup affiché en cas de victoire
- `LosePopup.tsx` : Popup affiché en cas de défaite

## Modes de jeu

1. **Quick Match** :
   - Permet de choisir le nombre de sets (1, 2 ou 3 sets gagnants)
   - Utilise le composant `QuickMatchPage.tsx` pour la sélection
   - Redirige vers `MatchPage.tsx` avec le nombre de sets choisi

2. **Ranked Match** :
   - Nombre de sets fixé à 5 (3 sets gagnants)
   - Redirige directement vers `MatchPage.tsx`
   - Mode compétitif avec impact sur le classement

3. **Challenge Friend** :
   - Permet d'inviter un ami pour un match
   - Utilise le système d'invitation
   - Redirige vers `MatchPage.tsx` après acceptation de l'invitation

## Composants

- **MatchPage** : Composant principal qui gère le déroulement d'un match
  - Prend en paramètre `matchId`, `onLeave` et `maxSets`
  - Affiche le terrain de jeu et gère la logique du match

- **QuickMatchPage** : Composant pour les matchs rapides
  - Permet de sélectionner le nombre de sets
  - Prend en paramètre `onSetsSelected` pour notifier le nombre de sets choisi

- **PongField** : Affiche le terrain de jeu avec les scores et les avatars des joueurs
  - Interface commune pour tous les modes de jeu
  - Gère l'affichage des scores et des sets

- **SetScoreDisplay** : Affiche le tableau des scores des sets
  - Adapte le nombre de colonnes en fonction du nombre de sets
  - Affiche les sets gagnés en vert

- **AddSetButton** : Bouton pour ajouter un set
  - Peut être affiché en position flottante ou en bas de l'écran
  - Affiche un texte explicite pour améliorer l'expérience utilisateur

- **PlayerDisplay** : Affiche un joueur avec son avatar
  - Gère l'affichage du trophée pour le joueur en tête
  - Positionne le joueur en haut ou en bas de l'écran

- **WinPopup** : Affiche une popup animée en cas de victoire
  - Redirige vers la page d'accueil après fermeture

- **LosePopup** : Affiche une popup animée en cas de défaite
  - Redirige vers la page d'accueil après fermeture