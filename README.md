Projet réponse pour l'exercice d'entretien Pretto


## Démarrer le projet

Utiliser node 20.
Editer 'example.env.local' en '.env.local'
Lancer le serveur de developpement

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Choix du framework

Le projet est en Next.js avec App Router pour plusieurs raisons.
- Continuité technologique : Le framework repose sur React, comme le projet Gatsby initial. Les équipes ont déjà les connaissances, et les composants du projet gatsby pourront être repris. Facilite la migration.
- Maturité et écosystème : Next.js est un framework stable, maintenu et largement documenté. Face à une solution custom, offre une communauté active, une base de bonnes pratiques, et un time to market plus court.
- ISR Natif : on pourra avoir donc un build partiel et donc plus rapide. Ici on a choisit 60 pour le revalidate. Il pourrait être intéressant de modifier selon la structure.
- React Server Component (RSC) : moins de JS envoyé au client, idéal pour le contenu et SEO
- Choix de App Router : pour suivre l'architecture moderne et pérenne, et c'est recommandé pour un nouveau projet. De plus, simplifie la gestion du SEO, du data-fetching et de la structuration des layouts.
