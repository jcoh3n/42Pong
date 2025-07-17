# Système ELO de 42Pong

## Vue d'ensemble

Le système ELO de 42Pong implémente un système de classement équitable qui prend en compte la différence entre les ELO des joueurs pour calculer les gains et pertes de points lors des matchs **classés uniquement**.

## Caractéristiques principales

### 1. Calcul équitable basé sur la différence d'ELO
- Plus votre adversaire a un ELO élevé par rapport au vôtre, plus vous gagnez de points en cas de victoire
- Inversement, vous perdez moins de points en cas de défaite contre un adversaire plus fort
- Le système encourage les joueurs à affronter des adversaires de niveau similaire ou supérieur

### 2. K-Factor adaptatif
- Les nouveaux joueurs (ELO < 1000) ont un K-factor augmenté de 50% pour progresser plus rapidement
- Les joueurs débutants (ELO < 1200) ont un K-factor augmenté de 20%
- Les maîtres (ELO > 2000) ont un K-factor réduit de 20% pour une progression plus stable

### 3. Application uniquement aux matchs classés
- **Matchs classés** : ELO affecté selon le système de calcul
- **Matchs normaux** : Aucun impact sur l'ELO
- **Matchs amicaux** : Aucun impact sur l'ELO

### 4. Système de tiers
- **Bronze** : < 800 ELO
- **Argent** : 800-999 ELO
- **Or** : 1000-1199 ELO
- **Platine** : 1200-1499 ELO
- **Diamant** : 1500-1799 ELO
- **Maître** : 1800-2099 ELO
- **Grand Maître** : 2100+ ELO

## Formule de calcul

Le système utilise la formule ELO standard :

```
Nouveau ELO = ELO actuel + K-factor × (Résultat - Score attendu)
```

### Score attendu
```
Score attendu = 1 / (1 + 10^((ELO adversaire - ELO joueur) / 400))
```

### Exemples de calcul

**Exemple 1 : Victoire contre un adversaire plus fort**
- Joueur A : 1000 ELO
- Joueur B : 1200 ELO
- Match classé
- K-factor : 32 (pour le joueur A)

Score attendu pour A : 1 / (1 + 10^((1200-1000)/400)) = 0.24
Gain ELO pour A : 32 × (1 - 0.24) = +24 ELO

**Exemple 2 : Défaite contre un adversaire plus faible**
- Joueur A : 1200 ELO
- Joueur B : 1000 ELO
- Match classé
- K-factor : 32 (pour le joueur A)

Score attendu pour A : 1 / (1 + 10^((1000-1200)/400)) = 0.76
Perte ELO pour A : 32 × (0 - 0.76) = -24 ELO

## Implémentation technique

### 1. Calcul automatique
Les ELO sont automatiquement mis à jour quand :
- Un match **classé** est marqué comme terminé avec un gagnant
- Un joueur abandonne un match **classé**
- Un score est incrémenté et atteint la limite pour gagner dans un match **classé**

### 2. Architecture

```
src/utils/eloCalculator.ts     # Logique de calcul
src/services/eloService.ts     # Service de gestion des ELO
src/hooks/useElo.ts           # Hook React pour l'UI
```

### 3. Intégration dans le flux de match

```typescript
// Automatiquement déclenché lors de la mise à jour d'un match
async updateMatch(id: string, updates: MatchUpdate): Promise<Match> {
  const currentMatch = await this.getMatchById(id);
  const updatedMatch = await this.updateMatchInDB(id, updates);
  
  // Déclenche la mise à jour ELO seulement pour les matchs classés
  if (wasCompleted && hasWinner && updatedMatch.type === 'ranked') {
    eloService.updateEloAfterMatch(updatedMatch);
  }
  
  return updatedMatch;
}
```

## Utilisation

### 1. Affichage des changements ELO dans l'UI

```typescript
import { useEloChange } from '@/hooks/useElo';

const { eloChange, formattedEloChange } = useEloChange(match, userId);
// Retourne 0 pour les matchs non-classés
```

### 2. Calcul pour plusieurs matchs

```typescript
import { useMultipleEloChanges } from '@/hooks/useElo';

const { eloChanges, getFormattedEloChange } = useMultipleEloChanges(matches, userId);
// Retourne 0 pour les matchs non-classés
```

## Considérations

### 1. Performance
- Les calculs ELO sont effectués de manière asynchrone pour ne pas bloquer l'UI
- Les changements sont calculés à la volée pour l'affichage historique

### 2. Équité
- Le système favorise l'équilibre en pénalisant moins les défaites contre des adversaires plus forts
- Les nouveaux joueurs progressent plus rapidement grâce au K-factor adaptatif
- Seuls les matchs classés affectent l'ELO, préservant l'intégrité du système

### 3. Simplicité
- Le système est simple : seuls les matchs classés comptent
- L'affichage indique clairement quand l'ELO n'est pas affecté 