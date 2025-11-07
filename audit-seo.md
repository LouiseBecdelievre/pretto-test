# Audit SEO & Migration

> **Contexte :**  Identifier 3 problèmes SEO critiques dans le code Gatsby fourni.
---
## 1. Structured data absents (JSON-LD / Schema.org)

Le code ne génère aucun JSON-LD pour les articles.

Impact : perte des “rich results” (amélioration CTR), et Google et les IAs comprennent moins bien le type de contenu, les dates, l’auteur, etc.

---

## 2. Open Graph / Meta incomplets ou non systématiques

Les pages sont construites via createPages mais aucun balisage OG/Twitter n’est assuré (titre/description/image/url/type).

Impact : partage social dégradé, aperçu pauvre, CTR plus faible.

---

## 3. Canonical & risques de duplicate

- Le champ seo.canonical existe côté WP, mais dans Gatsby il n’y a aucune garantie d’émettre un `<link rel="canonical">` cohérent.

- De plus, la génération d’URL (sitemap manuel) + passage d’objets complets previousPost/nextPost peut conduire à des variantes d’URL (ex: trailing slash, sous-chemins) non alignées.

Impact : risque de contenu dupliqué, dilution du PageRank, fluctuations SEO.

## Point d'attention supplémentaire : migration sans perte
- Conserver les URLs (idéalement) ou fournir redirects 301 exhaustifs. (next.config.js, redirects())
- Sitemap prêt dès le déploiement, soumis à Search Console.
- Canonical stable et absolu.
- Monitoring (Search Console, 404, temps d’exploration).
- Préprod bloquée (robots noindex) pour éviter d’indexer un environnement de test.