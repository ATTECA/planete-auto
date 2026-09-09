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
5. Définir un `ADMIN_PASSCODE` dans `.env.local` (code requis pour ajouter un véhicule depuis `/admin/vehicules/new`).
6. (Optionnel, une seule fois) migrer les véhicules d'exemple de `data/vehicles.json` vers Supabase :
   ```bash
   node scripts/seed-vehicles.mjs
   ```



## Administration

`/admin/vehicules/new` permet d'ajouter un véhicule (fiche technique, équipements, photos) directement dans Supabase, protégé par le code défini dans `ADMIN_PASSCODE`. Il ne s'agit pas d'une authentification complète — la page reste accessible à qui connaît l'URL, mais l'enregistrement est bloqué sans le bon code.

## Structure

- `app/` — pages et routes de l'application (App Router)
- `app/api/` — routes API (contact, vente/reprise, offre sur un véhicule, ajout admin)
- `app/admin/` — page d'ajout de véhicule protégée par code d'accès
- `components/` — composants partagés (header, footer, formulaires, pages avec logique interactive)
- `lib/` — accès aux données (Supabase) et utilitaires liés aux véhicules
- `supabase/schema.sql` — définition de la table `vehicles` et des règles d'accès (RLS)
- `scripts/seed-vehicles.mjs` — migration ponctuelle de `data/vehicles.json` vers Supabase
