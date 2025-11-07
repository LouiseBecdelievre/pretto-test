# Pretto - Test technique

## Instruction d'installation
### Prérequis
- Node.js v20 (`nvm use`)
- PNPM, Yarn ou npm
- Environnement `.env.local` configuré à partir de `.example.env.local`

### Etapes

```bash
# 1. Installer les dépendances
pnpm install
# 2. Créer votre fichier d'environnement
cp .example.env.local .env.local
# 3. Lancer le serveur de dévelopement
pnpm dev
```
Le projet est ensuite acessible sur http://localhost:3000


## Choix du framework

Le projet est en Next.js avec App Router pour plusieurs raisons.
- Continuité technologique : Le framework repose sur React, comme le projet Gatsby initial. Les équipes ont déjà les connaissances, et les composants du projet gatsby pourront être repris. Facilite la migration.
- Maturité et écosystème : Next.js est un framework stable, maintenu et largement documenté. Face à une solution custom, offre une communauté active, une base de bonnes pratiques, et un time to market plus court.
- ISR Natif : on pourra avoir donc un build partiel et donc plus rapide. Ici on a choisit 60 pour le revalidate. Il pourrait être intéressant de modifier selon la structure.
- React Server Component (RSC) : moins de JS envoyé au client, idéal pour le contenu et SEO
- Choix de App Router : pour suivre l'architecture moderne et pérenne, et c'est recommandé pour un nouveau projet. De plus, simplifie la gestion du SEO, du data-fetching et de la structuration des layouts.

## Stratégie de rendu et de cache
- SSG/ISR : Pages d'articles et home
- Static : Sitemaps / robots

Les pages d'articles sont générées statiquement et régénérées toutes les 60s si elles ont changées (`revalidate` et `revalidateTag`).

Il serait possible d'avoir des Webhooks Wordpress afin de déclencher la regénération à la création d'une page wordpress.

La mise en cache CDN permettrait une distribution rapide.

## SEO Implementation

L’implémentation SEO couvre les points essentiels :

- Structured Data (JSON-LD) : type Article, Organization, BreadcrumbList, etc.
- Open Graph / Twitter Cards : métadonnées dynamiques (title, description, image, url)
- Canonical URLs : générées automatiquement à partir du SITE_URL
- Dates ISO : publication et mise à jour (datePublished, dateModified)
- Balises sémantiques : `<article>`, `<header>`, `<time>`, `<footer>`
- Robots / Sitemap : routes app/robots.ts et app/sitemap.ts programmatiques
- Meta robots : indexé mais serait à désindexer selon les enviroment (staging)