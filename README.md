# Planète Auto

Site vitrine et outils de vente/reprise pour Planète Auto, concessionnaire de véhicules d'occasion à Saint-Jean-de-Védas. Construit avec [Next.js](https://nextjs.org) et [Supabase](https://supabase.com).

## Développement

```bash
pnpm install
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat. L'application se recharge automatiquement lors des modifications de fichiers.

## Configuration (Supabase)

Les véhicules sont stockés dans une base Supabase (Postgres) plutôt que dans un fichier statique. Pour faire fonctionner le site en local :

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécuter le contenu de `supabase/schema.sql` (crée la table `vehicles` et ses règles d'accès).
3. Dans **Storage**, créer un bucket nommé exactement `vehicles`, avec l'option **Public bucket** activée (sert à héberger les photos ajoutées depuis la page admin).
4. Copier les variables d'environnement dans `.env.local` (voir `Project Settings > API` dans Supabase) :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (clé secrète — ne jamais l'exposer côté client)
5. Créer un utilisateur admin dans **Authentication > Users** sur Supabase (email + mot de passe) — c'est ce compte qui sert à se connecter sur `/admin/login`.
6. (Optionnel, une seule fois) migrer les véhicules d'exemple de `data/vehicles.json` vers Supabase :
   ```bash
   node scripts/seed-vehicles.mjs
   ```



## Déploiement

Le déploiement sur Vercel se fait via une GitHub Action (`.github/workflows/deploy.yml`).

Secrets requis dans **Settings > Secrets and variables > Actions** du dépôt GitHub :
- `VERCEL_TOKEN` — jeton d'API généré sur le compte Vercel officiel (Account Settings > Tokens). **Régénéré le 21/09/2026, à renouveler avant le 21/09/2027** (mettre à jour le secret GitHub après régénération).
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Administration

`/admin/login` permet de se connecter avec un compte Supabase Auth. Une fois connecté, `/admin` donne accès à l'espace d'administration (protégé côté proxy et côté serveur — accès refusé sans session valide).

## Structure

- `app/` — pages et routes de l'application (App Router)
- `app/api/` — routes API (contact, vente/reprise, offre sur un véhicule, ajout admin)
- `app/admin/` — page d'ajout de véhicule protégée par code d'accès
- `components/` — composants partagés (header, footer, formulaires, pages avec logique interactive)
- `lib/` — accès aux données (Supabase) et utilitaires liés aux véhicules
- `supabase/schema.sql` — définition de la table `vehicles` et des règles d'accès (RLS)
- `scripts/seed-vehicles.mjs` — migration ponctuelle de `data/vehicles.json` vers Supabase
