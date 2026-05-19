const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://v2g-api.onrender.com'

export interface SimulationInput {
  region: string
  capacite_kwh: number
  sante_pct: number
  tarif_achat: number
  tarif_revente: number
  km_quotidiens: number
  heures_v2g: number
  recharge_domicile: number
  type_logement: string
  v2g_compatible: number
}

export interface SimulationResult {
  label: 'rentable' | 'moyen' | 'non_rentable'
  verdict: string
  confiance: number
  revenu_net_an: number
  roi_mois: number
  degradation_pct: number
  energie_v2g_kwh: number
  v2g_natif: boolean
}

export async function predictROI(data: SimulationInput): Promise<SimulationResult> {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur API')
  return res.json()
}
