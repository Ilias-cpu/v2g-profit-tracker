# ⚡ V2G Profit Tracker

Simulateur de ROI Vehicle-to-Grid – Next.js 14 + Supabase + Tailwind CSS

---

## 🗂 Structure du projet

```
v2g-profit-tracker/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── globals.css             # Tailwind + animations custom
│   ├── page.tsx                # Landing page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (protégé, Server Component)
│   └── auth/
│       ├── login/page.tsx      # Page connexion
│       ├── signup/page.tsx     # Page inscription
│       └── signout/route.ts    # Route handler déconnexion
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx          # Navigation sticky
│   └── ui/
│       └── HeroCards.tsx       # Cards flottantes hero section
│
├── lib/
│   └── supabase/
│       ├── client.ts           # Client navigateur
│       └── server.ts           # Client serveur (SSR)
│
├── types/
│   └── index.ts                # Types TypeScript (Simulation, etc.)
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql     # Schéma BDD + RLS policies
│
├── middleware.ts               # Protection routes + refresh session
├── tailwind.config.ts
├── .env.local.example          # Template variables d'environnement
└── package.json
```

---

## 🚀 Installation pas à pas

### 1. Ouvrir dans VS Code

```bash
cd v2g-profit-tracker
code .
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

#### a) Créer un projet Supabase
1. Va sur [https://app.supabase.com](https://app.supabase.com)
2. Clique **"New project"**
3. Note ton **Project URL** et ta clé **anon key** (Settings → API)

#### b) Créer les variables d'environnement
```bash
cp .env.local.example .env.local
```
Puis édite `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

#### c) Exécuter la migration SQL
1. Dans Supabase Dashboard → **SQL Editor**
2. Colle le contenu de `supabase/migrations/001_initial.sql`
3. Clique **Run** ✅

### 4. Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔐 Authentification

Le flux auth est géré par **Supabase Auth + @supabase/ssr** :

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public | Landing page |
| `/auth/signup` | Public | Inscription (redirige si connecté) |
| `/auth/login` | Public | Connexion (redirige si connecté) |
| `/dashboard` | **Protégé** | Redirige vers `/auth/login` si non connecté |

Le `middleware.ts` gère automatiquement la protection des routes.

---

## 🗃 Base de données

### Table `simulations`
Stocke les simulations ROI de chaque utilisateur avec **Row Level Security (RLS)** activé :
- Chaque utilisateur ne peut voir/modifier **que ses propres simulations**
- Policies CRUD complètes configurées

### Colonnes principales
| Colonne | Type | Description |
|---------|------|-------------|
| `vehicle_model` | text | Ex: "Tesla Model 3" |
| `battery_capacity_kwh` | numeric | Capacité batterie en kWh |
| `tarif_kwh_buy/sell` | numeric | Tarifs €/kWh |
| `roi_months` | numeric | ROI calculé en mois |
| `annual_revenue_eur` | numeric | Revenu annuel projeté |

---

## 🧱 Stack technique

| Techno | Version | Usage |
|--------|---------|-------|
| Next.js | 14.2 | App Router, Server Components |
| React | 18 | UI |
| Supabase | 2.44 | Auth + PostgreSQL |
| @supabase/ssr | 0.4 | Auth SSR avec cookies |
| Tailwind CSS | 3.4 | Styling |
| TypeScript | 5 | Typage |

---

## 📦 Scripts disponibles

```bash
npm run dev      # Développement (http://localhost:3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # ESLint
```

---

## 🔜 Prochaines étapes

- [ ] Formulaire simulateur complet avec calcul ROI
- [ ] Intégration API tarifs électricité par région
- [ ] Export PDF des rapports ROI
- [ ] Tableau de bord analytics avancé
- [ ] Mode comparaison multi-véhicules
