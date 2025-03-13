# Organisation du développement de la page de match

Ce dossier contient les composants liés à la page de match du jeu Pong.

## Structure des fichiers

- `MatchPage.tsx` : Composant principal de la page de match (production)
- `MatchPageDev.tsx` : Version de développement de la page de match
- `MatchInfo.tsx` : Affiche les informations du match (scores, joueurs)
- `PlayerScore.tsx` : Affiche le score d'un joueur
- `ScoreButtons.tsx` : Boutons pour incrémenter les scores
- `WinPopup.tsx` : Popup affiché en cas de victoire
- `LosePopup.tsx` : Popup affiché en cas de défaite

## Processus de développement

1. **Mode développement** :
   - Activez `DEV_MODE = true` dans `src/app/games/page.tsx`
   - Travaillez dans le composant `MatchPageDev.tsx`
   - Testez toutes les fonctionnalités dans cet environnement isolé

2. **Développement** :
   - Modifiez l'interface et ajoutez des fonctionnalités dans `MatchPageDev.tsx`
   - Testez différents scénarios (victoire, défaite, forfait)
   - Les données de test sont déjà configurées (mockMatch, mockCurrentUser, mockOpponent)

3. **Mise en production** :
   - Une fois le développement terminé, copiez les modifications vers `MatchPage.tsx`
   - Désactivez le mode développement (`DEV_MODE = false` dans `src/app/games/page.tsx`)
   - Testez en conditions réelles

## Zone de développement

Une zone dédiée au développement est disponible dans `MatchPageDev.tsx` pour ajouter facilement de nouvelles fonctionnalités. Utilisez cette zone pour implémenter et tester vos nouvelles fonctionnalités avant de les transférer vers le composant de production. 