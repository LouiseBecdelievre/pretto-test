# Analyse critique

> **Contexte :** Identifier 3 points critiques du `gatsby-node.js` et leurs impacts à l'échelle (300+ pages, 500k visiteurs/mois)

---
## 1. Rebuild complet /absence d'incrémentalité

**Problèmes**
- Absence de cache Gatsby : refetch de toutes les données à chaque build
    - Rebuild de tous les articles de createPages
    - Appel de trustPilot et rates à chaque build
- Schéma inféré (absence de `createTypes`) : Gatsby devine les types à chaque build
- Ids fragile (`Rate-${date}`) : collision possible (même date)
- Absence de stratégie incrémentale (cache, diffs, DSG/ISR-like)

**Impacts**
- Inférence : lenteur du build et erreur imprévisibles si la structure des données évolue
- Collisions d'ID : données manquantes 
- Reconstruction totale à chaque build : temps de build long, pipeline CI/CD lent, perte de productivité

---
## 2. Appels API fragile

**Problèmes**
- Appel Trustpilot inutile : pas de création de node
- Absence de vérification des appels API : pas de try/catch, de reponse.ok
- Risque de boucle infini sur la pagination `while (hasMore)` si API ne renvoie plus hasNextPage

**Impacts**
- Si API ne répond pas (timeout, 401), le build plante. Perte de temps d'avoir lancé un déploiement qui n'aboutit pas. 
- Le temps de build inutilement allongé : déploiement plus rare, moins de réactivité, baisse de la productivité


---
## 3. `createPages` inefficace

**Problèmes**
- `page-data` surchargés : `context`inclut des objets complets (page vs id/slug pour previous/next), et tous les rates 
- Appels à chaque construction de page : `rates.slice(0,10)`à ne faire qu'une fois
- Requete GraphQL non optimisé : champ `content` inutile et intégrer les rates dejà limité
- Limite fixe sur `allWpPost(limit:1000)`

**Impacts**
- Over-fetch : temps de build plus important, page plus lourde à servir
- Contexte inutilement large: performances client dégradées
- Limite de 1000 nodes : on risque une couverture incompléte et donc SEO et cohérence éditoriale impactés


---
## Synthèse
Ces différents points mettent en évidence plusieurs goulots d’étranglement qui ralentissent les déploiements et fragilisent le process de build.  
En l’état, certaines données peuvent être incomplètes ou dépendre de services externes non disponibles, rendant le site moins fiable en production.  
En appliquant quelques correctifs ciblés, on réduirait nettement le temps de build et on améliorerait la productivité et la réactivité des équipes.