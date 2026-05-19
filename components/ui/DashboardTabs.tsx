'use client'

import { useState } from 'react'
import { predictROI, type SimulationResult } from '@/lib/api'

const REGION_TARIFS: Record<string, { buy: number; sell: number }> = {
  "Île-de-France":              { buy: 0.2516, sell: 0.1300 },
  "Auvergne-Rhône-Alpes":       { buy: 0.2516, sell: 0.1200 },
  "Provence-Alpes-Côte d'Azur": { buy: 0.2516, sell: 0.1250 },
  "Occitanie":                  { buy: 0.2516, sell: 0.1150 },
  "Nouvelle-Aquitaine":         { buy: 0.2516, sell: 0.1180 },
  "Bretagne":                   { buy: 0.2516, sell: 0.1100 },
  "Normandie":                  { buy: 0.2516, sell: 0.1120 },
  "Hauts-de-France":            { buy: 0.2516, sell: 0.1090 },
  "Grand Est":                  { buy: 0.2516, sell: 0.1150 },
  "Pays de la Loire":           { buy: 0.2516, sell: 0.1130 },
  "Bourgogne-Franche-Comté":    { buy: 0.2516, sell: 0.1100 },
  "Centre-Val de Loire":        { buy: 0.2516, sell: 0.1120 },
}

const EV_OPTIONS: { label: string; kwh: number; health: number }[] = [
  { label: 'Tesla Model 3',         kwh: 75,  health: 95 },
  { label: 'Tesla Model Y',         kwh: 75,  health: 95 },
  { label: 'Tesla Model S',         kwh: 100, health: 95 },
  { label: 'Renault Zoe',           kwh: 52,  health: 90 },
  { label: 'Renault Megane E-Tech', kwh: 60,  health: 92 },
  { label: 'VW ID.3',               kwh: 58,  health: 92 },
  { label: 'VW ID.4',               kwh: 77,  health: 93 },
  { label: 'Peugeot e-208',         kwh: 50,  health: 90 },
  { label: 'BMW i4',                kwh: 84,  health: 94 },
  { label: 'BMW iX3',               kwh: 80,  health: 93 },
  { label: 'Hyundai Ioniq 5',       kwh: 77,  health: 94 },
  { label: 'Hyundai Ioniq 6',       kwh: 77,  health: 94 },
  { label: 'Kia EV6',               kwh: 77,  health: 94 },
  { label: 'Audi Q4 e-tron',        kwh: 82,  health: 93 },
]

const fieldSt: React.CSSProperties = { display:'flex', flexDirection:'column', gap:'5px' }
const labelSt: React.CSSProperties = { fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em' }
const inputSt: React.CSSProperties = {
  height:'38px', border:'1px solid #e5e7eb', borderRadius:'8px',
  padding:'0 12px', fontSize:'14px', color:'#0f172a', outline:'none',
  fontFamily:'Inter, sans-serif', background:'white', width:'100%', boxSizing:'border-box',
}
const badgeAuto: React.CSSProperties = {
  background:'#dcfce7', color:'#16a34a', fontSize:'10px',
  fontWeight:700, borderRadius:'100px', padding:'1px 7px', marginLeft:'5px',
}

function GaugeRing({ value, max, color, size = 72 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = Math.min(value / max, 1) * circ
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f2f5" strokeWidth="8"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
    </svg>
  )
}

export default function DashboardTabs({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [region,       setRegion]       = useState('')
  const [evKey,        setEvKey]        = useState('')
  const [battKwh,      setBattKwh]      = useState('')
  const [battHealth,   setBattHealth]   = useState('')
  const [dailyKm,      setDailyKm]      = useState('')
  const [v2gHours,     setV2gHours]     = useState('4')
  const [tarifBuy,     setTarifBuy]     = useState('')
  const [tarifSell,    setTarifSell]    = useState('')
  const [chargeHome,   setChargeHome]   = useState(true)
  const [chargeKw,     setChargeKw]     = useState(7)
  const [maxDischarge, setMaxDischarge] = useState(80)
  const [result,       setResult]       = useState<SimulationResult | null>(null)
  const [loading,      setLoading]      = useState(false)
  const [errorAPI,     setErrorAPI]     = useState<string | null>(null)

  function handleRegion(r: string) {
    setRegion(r)
    const t = REGION_TARIFS[r]
    if (t) { setTarifBuy(String(t.buy)); setTarifSell(String(t.sell)) }
  }
  function handleEV(label: string) {
    setEvKey(label)
    const ev = EV_OPTIONS.find(e => e.label === label)
    if (ev) { setBattKwh(String(ev.kwh)); setBattHealth(String(ev.health)) }
  }

  async function handleCalculate() {
    setLoading(true); setErrorAPI(null)
    try {
      const res = await predictROI({
        region,
        capacite_kwh:     parseFloat(battKwh)   || 0,
        sante_pct:        parseFloat(battHealth) || 0,
        tarif_achat:      parseFloat(tarifBuy)   || 0,
        tarif_revente:    parseFloat(tarifSell)  || 0,
        km_quotidiens:    parseFloat(dailyKm)    || 0,
        heures_v2g:       parseFloat(v2gHours)   || 4,
        recharge_domicile: chargeHome ? 1 : 0,
        type_logement:    'maison',
        v2g_compatible:   0,
      })
      setResult(res)
    } catch {
      setErrorAPI("Erreur de connexion à l'API")
    } finally {
      setLoading(false)
    }
  }

  const mwh = result?.energie_v2g_kwh ? (result.energie_v2g_kwh / 1000).toFixed(1) : null

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', fontFamily:'Inter, sans-serif' }}>

      {/* ── Section 1 : Configuration ── */}
      <div style={{ background:'white', borderRadius:'16px', padding:'20px 24px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'14px' }}>
          Configuration de la simulation
        </div>

        {/* Ligne 1 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'12px', marginBottom:'12px' }}>
          <div style={fieldSt}>
            <label style={labelSt}>Région</label>
            <select value={region} onChange={e => handleRegion(e.target.value)} style={{ ...inputSt, cursor:'pointer' }}>
              <option value="">Sélectionner…</option>
              {Object.keys(REGION_TARIFS).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={fieldSt}>
            <label style={labelSt}>Modèle EV</label>
            <select value={evKey} onChange={e => handleEV(e.target.value)} style={{ ...inputSt, cursor:'pointer' }}>
              <option value="">Sélectionner…</option>
              {EV_OPTIONS.map(e => <option key={e.label} value={e.label}>{e.label}</option>)}
            </select>
          </div>
          <div style={fieldSt}>
            <label style={labelSt}>Prix électricité (€/kWh){region && <span style={badgeAuto}>Auto</span>}</label>
            <input type="number" step="0.0001" placeholder="0.2516" value={tarifBuy} onChange={e => setTarifBuy(e.target.value)} style={inputSt}/>
          </div>
          <div style={fieldSt}>
            <label style={labelSt}>Prix revente (€/kWh){region && <span style={badgeAuto}>Auto</span>}</label>
            <input type="number" step="0.0001" placeholder="0.13" value={tarifSell} onChange={e => setTarifSell(e.target.value)} style={inputSt}/>
          </div>
        </div>

        {/* Ligne 2 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'12px', marginBottom:'14px' }}>
          <div style={fieldSt}>
            <label style={labelSt}>Km quotidiens</label>
            <input type="number" placeholder="ex: 45" value={dailyKm} onChange={e => setDailyKm(e.target.value)} style={inputSt}/>
          </div>
          <div style={fieldSt}>
            <label style={labelSt}>Capacité batterie (kWh){evKey && <span style={badgeAuto}>Auto</span>}</label>
            <input type="number" placeholder="ex: 75" value={battKwh} onChange={e => setBattKwh(e.target.value)} style={inputSt}/>
          </div>
          <div style={fieldSt}>
            <label style={labelSt}>Santé batterie (%){evKey && <span style={badgeAuto}>Auto</span>}</label>
            <input type="number" placeholder="ex: 95" value={battHealth} onChange={e => setBattHealth(e.target.value)} style={inputSt}/>
          </div>
          <div style={fieldSt}>
            <label style={labelSt}>Heures V2G / jour</label>
            <input type="number" placeholder="ex: 4" value={v2gHours} onChange={e => setV2gHours(e.target.value)} style={inputSt}/>
          </div>
        </div>

        {/* Ligne 3 : sliders + checkbox + bouton */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'12px', alignItems:'end' }}>
          <div style={fieldSt}>
            <label style={{ ...labelSt, marginBottom:'10px' }}>
              Puissance de charge (kW) — <span style={{ color:'#1a6ff4', fontWeight:800 }}>{chargeKw}</span>
            </label>
            <input type="range" min={3} max={22} step={1} value={chargeKw} onChange={e => setChargeKw(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#1a6ff4', cursor:'pointer' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#9ca3af', marginTop:'2px' }}>
              <span>3 kW</span><span>22 kW</span>
            </div>
          </div>
          <div style={fieldSt}>
            <label style={{ ...labelSt, marginBottom:'10px' }}>
              Niveau de décharge max (%) — <span style={{ color:'#1a6ff4', fontWeight:800 }}>{maxDischarge}</span>
            </label>
            <input type="range" min={20} max={100} step={5} value={maxDischarge} onChange={e => setMaxDischarge(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#1a6ff4', cursor:'pointer' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#9ca3af', marginTop:'2px' }}>
              <span>20%</span><span>100%</span>
            </div>
          </div>
          <div style={fieldSt}>
            <label style={{ ...labelSt, marginBottom:'10px' }}>Options</label>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', height:'38px' }}>
              <input type="checkbox" id="domicile" checked={chargeHome} onChange={e => setChargeHome(e.target.checked)}
                style={{ accentColor:'#1a6ff4', width:'16px', height:'16px', cursor:'pointer' }}/>
              <label htmlFor="domicile" style={{ fontSize:'13px', fontWeight:600, color:'#374151', cursor:'pointer', whiteSpace:'nowrap' }}>
                Recharge domicile
              </label>
            </div>
          </div>
          <button onClick={handleCalculate} disabled={loading}
            style={{ height:'40px', background:'#1a6ff4', color:'white', borderRadius:'10px', fontWeight:700, fontSize:'14px', border:'none', cursor:'pointer', fontFamily:'Inter, sans-serif', padding:'0 36px', whiteSpace:'nowrap', opacity: loading ? 0.7 : 1, alignSelf:'end' }}>
            {loading ? 'Calcul…' : 'Calculer mes gains →'}
          </button>
        </div>

        {errorAPI && (
          <div style={{ background:'#fef2f2', color:'#dc2626', fontSize:'13px', padding:'10px 14px', borderRadius:'8px', marginTop:'12px' }}>
            {errorAPI}
          </div>
        )}
      </div>

      {/* ── Section 2 : Résultats ── */}
      <div style={{ background:'white', borderRadius:'16px', padding:'20px 24px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em' }}>
            Résultats de la simulation
          </div>
          {result && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', background:'#dcfce7', color:'#16a34a', fontSize:'12px', fontWeight:700, padding:'5px 12px', borderRadius:'100px' }}>
              <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {result.label === 'rentable' ? 'Profil hautement compatible'
                : result.label === 'moyen'  ? 'Profil compatible'
                : 'Profil peu compatible'}
            </div>
          )}
        </div>

        {/* KPIs — 4 colonnes uniformes */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'0' }}>
          {[
            {
              label: 'Amortissement',
              sub: result?.confiance ? `Confiance : ${result.confiance}%` : 'Lancez une simulation',
              value: result?.roi_mois ? `${result.roi_mois}` : '—',
              unit: result?.roi_mois ? 'mois' : '',
              color: '#1a6ff4',
              gaugeVal: result?.roi_mois ? Math.max(10, 100 - result.roi_mois * 2) : 0,
              border: true,
            },
            {
              label: 'Économie annuelle',
              sub: 'revenus nets V2G',
              value: result?.revenu_net_an ? result.revenu_net_an.toLocaleString('fr-FR') : '—',
              unit: result?.revenu_net_an ? '€/an' : '',
              color: '#16a34a',
              gaugeVal: result?.revenu_net_an ? Math.min(result.revenu_net_an / 50, 100) : 0,
              border: true,
            },
            {
              label: 'Énergie V2G',
              sub: 'réinjectée dans le réseau',
              value: mwh ?? '—',
              unit: mwh ? 'MWh/an' : '',
              color: '#1a6ff4',
              gaugeVal: mwh ? Math.min(parseFloat(mwh) * 3, 100) : 0,
              border: true,
            },
            {
              label: 'Dégradation batterie',
              sub: 'usure estimée',
              value: result?.degradation_pct ? `${result.degradation_pct}` : '—',
              unit: result?.degradation_pct ? '%/an' : '',
              color: '#f97316',
              gaugeVal: result?.degradation_pct ? Math.min(result.degradation_pct * 20, 100) : 0,
              border: false,
            },
          ].map((kpi, i) => (
            <div key={i} style={{
              padding: i === 0 ? '0 24px 0 0' : i === 3 ? '0 0 0 24px' : '0 24px',
              borderRight: kpi.border ? '1px solid #f0f2f5' : 'none',
              display:'flex', flexDirection:'column', gap:'12px',
            }}>
              {/* Label */}
              <div style={{ fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {kpi.label}
              </div>

              {/* Jauge + valeur alignés */}
              <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <GaugeRing value={kpi.gaugeVal} max={100} color={kpi.color} size={80}/>
                  {/* Pourcentage centré dans la jauge */}
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'11px', fontWeight:700, color:kpi.color }}>
                      {kpi.gaugeVal > 0 ? `${Math.round(kpi.gaugeVal)}%` : ''}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'4px', lineHeight:1 }}>
                    <span style={{ fontSize:'28px', fontWeight:900, color:kpi.color, fontFamily:'Inter, sans-serif' }}>
                      {kpi.value}
                    </span>
                    {kpi.unit && (
                      <span style={{ fontSize:'14px', fontWeight:600, color:'#9ca3af' }}>{kpi.unit}</span>
                    )}
                  </div>
                  <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'4px' }}>{kpi.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton analyse détaillée — pleine largeur en bas */}
        <div style={{ marginTop:'16px', borderTop:'1px solid #f0f2f5', paddingTop:'14px' }}>
          <button
            onClick={() => onNavigate?.('rentabilite')}
            style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
              background:'#f8faff', border:'1px solid #e5e7eb', borderRadius:'12px',
              padding:'16px 24px', cursor:'pointer', transition:'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#eef4ff')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f8faff')}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'40px', height:'40px', background:'#eef4ff', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="#1a6ff4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontSize:'14px', fontWeight:700, color:'#1a6ff4' }}>Voir l&apos;analyse détaillée</div>
                <div style={{ fontSize:'12px', color:'#9ca3af', marginTop:'2px' }}>
                  Graphiques, comparaison de scénarios et plan d&apos;amortissement.
                </div>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}
