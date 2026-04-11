-- ============================================================
-- V2G Profit Tracker – Migration initiale
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- Table des simulations ROI V2G
create table if not exists public.simulations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,

  -- Données véhicule
  vehicle_model text not null,
  battery_capacity_kwh numeric(6,2) not null,    -- ex: 75.00 kWh
  battery_health_pct   numeric(5,2) default 100, -- % santé batterie

  -- Données localisation & tarif
  location_city   text not null,
  region_code     text,                           -- ex: 'IDF', 'PACA'
  tarif_kwh_buy   numeric(6,4) not null,          -- Prix achat €/kWh
  tarif_kwh_sell  numeric(6,4) not null,          -- Prix revente €/kWh

  -- Paramètres utilisation
  daily_km         numeric(6,1) default 40,       -- km/jour
  v2g_hours_per_day numeric(4,1) default 4,       -- heures V2G/jour

  -- Résultats calculés
  roi_months          numeric(5,1),               -- Retour invest. en mois
  annual_revenue_eur  numeric(10,2),              -- Revenu annuel €
  annual_energy_kwh   numeric(10,2),              -- Énergie réinjectée kWh
  battery_degradation_pct numeric(5,3),           -- Dégradation annuelle %
  net_profit_year1    numeric(10,2),              -- Profit net an 1

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row Level Security : chaque user ne voit que ses simulations
alter table public.simulations enable row level security;

create policy "Users can view own simulations"
  on public.simulations for select
  using (auth.uid() = user_id);

create policy "Users can insert own simulations"
  on public.simulations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own simulations"
  on public.simulations for update
  using (auth.uid() = user_id);

create policy "Users can delete own simulations"
  on public.simulations for delete
  using (auth.uid() = user_id);

-- Index pour accélérer les requêtes par user
create index simulations_user_id_idx on public.simulations(user_id);
create index simulations_created_at_idx on public.simulations(created_at desc);

-- Trigger pour mettre à jour updated_at automatiquement
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger simulations_updated_at
  before update on public.simulations
  for each row execute function update_updated_at();
