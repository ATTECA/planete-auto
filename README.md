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
2. Dans l'éditeur SQL du projet, exécuter dans l'ordre `supabase/schema.sql` puis chaque migration ajoutée depuis (toutes dans `supabase/`) :
   - `add_archived_column.sql`
   - `add_leads_table.sql`
   - `add_leads_photos_column.sql`
   - `add_carrosserie_column.sql`
3. Dans **Storage**, créer un bucket nommé exactement `vehicles`, avec l'option **Public bucket** activée (sert à héberger les photos ajoutées depuis la page admin, ainsi que les photos jointes aux demandes de reprise).
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

`/admin/login` permet de se connecter avec un compte Supabase Auth. Une fois connecté, l'espace d'administration (protégé côté serveur — accès refusé sans session valide) donne accès à :

- **Dashboard** (`/admin`) — vue d'ensemble (stock, nouveaux messages/reprises, véhicules récents)
- **Véhicules** (`/admin/vehicules`) — gestion du stock (ajout, modification, duplication, archivage, filtres par statut)
- **Reprises** (`/admin/reprises`) — demandes reçues via le formulaire de vente/reprise
- **Messages** (`/admin/messages`) — messages de contact, offres et demandes d'essai reçus sur les véhicules

## Structure

- `app/` — pages et routes de l'application (App Router)
- `app/api/` — routes API (contact, vente/reprise, offre sur un véhicule, demande d'essai)
- `app/admin/` — espace d'administration protégé (véhicules, reprises, messages)
- `components/` — composants partagés (header, footer, formulaires, pages avec logique interactive)
- `components/admin/` — composants de l'espace d'administration
- `lib/` — accès aux données (Supabase) et utilitaires liés aux véhicules et aux demandes (leads)
- `supabase/` — `schema.sql` (table `vehicles` et règles d'accès) et les migrations ajoutées depuis
- `scripts/seed-vehicles.mjs` — migration ponctuelle de `data/vehicles.json` vers Supabase
