# Planète Auto

Site vitrine et outils de vente/reprise pour Planète Auto, concessionnaire de véhicules d'occasion et garage (mécanique, carrosserie, pneumatique, pièces de rechange) à Saint-Jean-de-Védas. Construit avec [Next.js](https://nextjs.org) et [Supabase](https://supabase.com).

## Développement

```bash
pnpm install
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat. L'application se recharge automatiquement lors des modifications de fichiers.

## Configuration (Supabase)

Les véhicules et les demandes reçues (messages, devis, offres, essais, reprises) sont stockés dans une base Supabase (Postgres). Pour faire fonctionner le site en local :

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécuter dans l'ordre `supabase/schema.sql` puis chaque migration ajoutée depuis (toutes dans `supabase/`) :
   - `add_archived_column.sql`
   - `add_leads_table.sql`
   - `add_leads_photos_column.sql`
   - `add_carrosserie_column.sql`
   - `add_updated_at_column.sql`
   - `enable_realtime_vehicles.sql` (rafraîchit les pages ouvertes quand un véhicule change)
   - `enable_realtime_leads.sql` (rafraîchit l'admin quand une nouvelle demande arrive)
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

> **Plan gratuit Supabase :** un projet inactif pendant environ une semaine est mis en pause, et le site ne peut plus charger les véhicules tant qu'il n'est pas relancé depuis le tableau de bord Supabase. Pour l'éviter, la GitHub Action `.github/workflows/keep-supabase-awake.yml` fait une petite requête de lecture le lundi et le jeudi (voir « Déploiement » pour ses secrets).

## Configuration (e-mails)

Chaque formulaire du site (contact, devis atelier, offre, essai, reprise) envoie un e-mail en plus d'enregistrer la demande dans l'admin. Variables à ajouter dans `.env.local` (et dans Vercel pour la production) :

- `SMTP_HOST`, `SMTP_PORT` (587 par défaut), `SMTP_SECURE` (`true` pour le port 465)
- `SMTP_USER`, `SMTP_PASSWORD`
- `SMTP_FROM` — adresse d'expédition (par défaut `SMTP_USER`)
- `CONTACT_RECIPIENT` — adresse qui reçoit les demandes. **À définir en production** : sans elle, les e-mails partent vers l'adresse de secours codée dans les routes API.

Autre variable :

- `NEXT_PUBLIC_SITE_URL` — URL publique du site (ex. `https://www.mondomaine.fr`), utilisée par `sitemap.xml` et `robots.txt`. Par défaut : `https://www.planeteauto34.fr`.

## Tests

```bash
pnpm test        # tests unitaires (Vitest), en mode surveillance
pnpm test:e2e    # tests de bout en bout (Playwright)
```

- **Tests unitaires** (`lib/*.test.ts`, Vitest) : fonctions sans base de données — URLs des véhicules (`vehicleSlug`, `parseVehicleIdParam`), catégories de statut, regroupement des caractéristiques, gabarit des e-mails (dont l'échappement du HTML saisi par les visiteurs).
- **Tests E2E** (`e2e/`, Playwright) : un vrai navigateur parcourt le site (ouvrir une fiche véhicule depuis l'accueil, page 404, bouton « Demander un devis », formulaire de devis…). Playwright démarre `pnpm dev` tout seul si le serveur ne tourne pas.
  - Première fois : installer le navigateur avec `pnpm exec playwright install chromium`.
  - `pnpm test:e2e --ui` ouvre une interface pour voir chaque étape.
  - **Le site local utilise la vraie base Supabase.** Les tests ne doivent jamais envoyer un vrai formulaire : intercepter l'appel à l'API avec `page.route('**/api/...')` (voir le test du formulaire de devis), sinon de vraies demandes et de vrais e-mails partent chez le client.

## Déploiement

Le déploiement sur Vercel se fait via une GitHub Action (`.github/workflows/deploy.yml`), à chaque push sur `main` :

1. **`test`** — installe les dépendances et lance les tests unitaires (`pnpm vitest run`).
2. **`deploy`** — ne démarre que si les tests passent. Si un test échoue, le site en ligne n'est pas modifié.

Les tests E2E ne tournent pas encore dans GitHub Actions (à lancer en local).

Secrets requis dans **Settings > Secrets and variables > Actions** du dépôt GitHub :
- `VERCEL_TOKEN` — jeton d'API généré sur le compte Vercel officiel (Account Settings > Tokens). **Régénéré le 21/09/2026, à renouveler avant le 21/09/2027** (mettre à jour le secret GitHub après régénération).
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SUPABASE_URL` et `SUPABASE_ANON_KEY` — mêmes valeurs que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`, utilisées par `keep-supabase-awake.yml`

## Pages du site

- `/` — accueil (recherche, bande « atelier », types de véhicules, nouveaux arrivages, bouton flottant « Demander un devis »)
- `/vehicules` et `/vehicules/[id]` — stock et fiche véhicule (offre, demande d'essai, simulateur de financement)
- `/reprise` — vente ou reprise de véhicule
- `/devis` — demande de devis atelier (mécanique, carrosserie, pneumatique, pièces de rechange)
- `/a-propos`, `/contact`, `/mentions-legales`

Les photos de la bande « atelier » sont dans `public/atelier/`. Seule `mecanique.jpg` est une vraie photo du garage ; les autres sont des photos d'illustration (Unsplash) à remplacer par de vraies photos en gardant le même nom de fichier.

## Administration

`/admin/login` permet de se connecter avec un compte Supabase Auth. Une fois connecté, l'espace d'administration (protégé côté serveur — accès refusé sans session valide) donne accès à :

- **Dashboard** (`/admin`) — vue d'ensemble (stock, nouveaux messages/reprises, véhicules récents)
- **Véhicules** (`/admin/vehicules`) — gestion du stock (ajout, modification, duplication, archivage, filtres par statut)
- **Reprises** (`/admin/reprises`) — demandes reçues via le formulaire de vente/reprise
- **Messages** (`/admin/messages`) — messages de contact, demandes de devis, offres et demandes d'essai

Sur **Reprises** et **Messages** : recherche (nom, téléphone, e-mail, véhicule, message), filtres par type et par statut, et suivi de chaque demande (Nouveau → En cours → Traité). Les dates sont affichées à l'heure de Paris.

## Structure

- `app/` — pages et routes de l'application (App Router)
- `app/api/` — routes API (contact, devis, vente/reprise, offre sur un véhicule, demande d'essai, admin)
- `app/admin/` — espace d'administration protégé (véhicules, reprises, messages)
- `components/` — composants partagés (header, footer, formulaires, pages avec logique interactive)
- `components/admin/` — composants de l'espace d'administration
- `lib/` — accès aux données (Supabase) et utilitaires liés aux véhicules et aux demandes (leads)
- `lib/*.test.ts` — tests unitaires
- `e2e/` — tests Playwright
- `supabase/` — `schema.sql` (table `vehicles` et règles d'accès) et les migrations ajoutées depuis
- `scripts/seed-vehicles.mjs` — migration ponctuelle de `data/vehicles.json` vers Supabase
