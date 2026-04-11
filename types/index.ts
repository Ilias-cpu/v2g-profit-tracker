// ── Simulation V2G ────────────────────────────────────────
export interface Simulation {
  id: string
  user_id: string

  // Véhicule
  vehicle_model: string
  battery_capacity_kwh: number
  battery_health_pct: number

  // Localisation & tarifs
  location_city: string
  region_code?: string
  tarif_kwh_buy: number
  tarif_kwh_sell: number

  // Utilisation
  daily_km: number
  v2g_hours_per_day: number

  // Résultats
  roi_months?: number
  annual_revenue_eur?: number
  annual_energy_kwh?: number
  battery_degradation_pct?: number
  net_profit_year1?: number

  created_at: string
  updated_at: string
}

// Formulaire de simulation (sans les champs auto)
export type SimulationForm = Omit<
  Simulation,
  'id' | 'user_id' | 'created_at' | 'updated_at' |
  'roi_months' | 'annual_revenue_eur' | 'annual_energy_kwh' |
  'battery_degradation_pct' | 'net_profit_year1'
>

// Résultats calculés
export interface SimulationResult {
  roi_months: number
  annual_revenue_eur: number
  annual_energy_kwh: number
  battery_degradation_pct: number
  net_profit_year1: number
  verdict: 'excellent' | 'bon' | 'moyen' | 'faible'
}

// ── Auth ──────────────────────────────────────────────────
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}
