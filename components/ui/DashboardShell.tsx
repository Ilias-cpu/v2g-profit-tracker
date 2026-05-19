'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LogoFull } from '@/components/ui/Logo'
import DashboardTabs from '@/components/ui/DashboardTabs'

type NavItem = 'simulation' | 'vehicule' | 'rentabilite' | 'energie' | 'historique'

const NAV: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  {
    id: 'simulation',
    label: 'Simulation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    id: 'vehicule',
    label: 'Mon véhicule',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    id: 'rentabilite',
    label: 'Rentabilité',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2 18 8 12 13 17 22 6"/>
        <polyline points="16 6 22 6 22 12"/>
      </svg>
    ),
  },
  {
    id: 'energie',
    label: 'Énergie',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="18" height="10" rx="2"/>
        <path d="M22 11v2"/>
        <path d="M6 11h6M9 8v6"/>
      </svg>
    ),
  },
  {
    id: 'historique',
    label: 'Historique',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
]

const PAGE_TITLES: Record<NavItem, string> = {
  simulation:  'Simulation',
  vehicule:    'Mon véhicule',
  rentabilite: 'Rentabilité',
  energie:     'Énergie',
  historique:  'Historique',
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

function RentabilitePanel() {
  const scenarios = [
    {
      label: 'Scénario Prudent',
      revenu: 920,
      roi: 32,
      riskLabel: 'Très sûr',
      riskColor: '#16a34a',
      riskIcon: (
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      ),
      hours: 2,
      discharge: 10,
      active: false,
    },
    {
      label: 'Scénario Standard',
      revenu: 1840,
      roi: 18,
      riskLabel: 'Équilibré',
      riskColor: '#1a6ff4',
      riskIcon: (
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <path d="M3 6l9 6 9-6"/>
          <path d="M3 18l9-6 9 6"/>
        </svg>
      ),
      hours: 4,
      discharge: 25,
      active: true,
    },
    {
      label: 'Scénario Optimisé',
      revenu: 2650,
      roi: 11,
      riskLabel: 'Agressif',
      riskColor: '#f97316',
      riskIcon: (
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      hours: 8,
      discharge: 40,
      active: false,
    },
  ]

  return (
    <div style={{ fontFamily:'Inter, sans-serif' }}>
      <div style={{ background:'white', borderRadius:'16px', padding:'28px 28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'20px' }}>
          Comparaison de scénarios
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
          {scenarios.map(s => (
            <div key={s.label} style={{
              border: s.active ? '2px solid #1a6ff4' : '1.5px solid #e5e7eb',
              borderRadius:'14px',
              padding:'24px',
              position:'relative',
              background: 'white',
            }}>
              {s.active && (
                <div style={{
                  position:'absolute', top:'-11px', left:'50%', transform:'translateX(-50%)',
                  background:'#1a6ff4', color:'white', fontSize:'10px', fontWeight:800,
                  padding:'3px 14px', borderRadius:'100px', whiteSpace:'nowrap', letterSpacing:'0.08em',
                }}>
                  RECOMMANDÉ
                </div>
              )}

              {/* Titre */}
              <div style={{ fontSize:'11px', fontWeight:700, color: s.active ? '#1a6ff4' : '#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'16px' }}>
                {s.label}
              </div>

              {/* Revenu */}
              <div style={{ display:'flex', alignItems:'baseline', gap:'5px', marginBottom:'10px' }}>
                <span style={{ fontSize:'32px', fontWeight:900, color:'#0f172a', fontFamily:'Inter, sans-serif', lineHeight:1 }}>
                  {s.revenu.toLocaleString('fr-FR')} €
                </span>
                <span style={{ fontSize:'13px', fontWeight:600, color:'#9ca3af' }}>/ an</span>
              </div>

              {/* ROI + badge risque */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                <span style={{ fontSize:'13px', color:'#9ca3af' }}>ROI : <strong style={{ color:'#0f172a', fontWeight:700 }}>{s.roi} mois</strong></span>
                <span style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:700, color:s.riskColor }}>
                  {s.riskIcon}
                  {s.riskLabel}
                </span>
              </div>

              {/* Séparateur */}
              <div style={{ height:'1px', background:'#f0f2f5', marginBottom:'14px' }}/>

              {/* Détails */}
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'11px', color:'#9ca3af' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={s.active ? '#1a6ff4' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Branchement {s.hours}h/jour
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'11px', color:'#9ca3af' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={s.active ? '#1a6ff4' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/>
                  </svg>
                  Décharge max {s.discharge}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Ligne 2 : Détail gains + Impact batterie ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginTop:'16px' }}>

        {/* Détail des gains */}
        <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:'1.5px solid #e5e7eb' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span style={{ fontSize:'13px', fontWeight:700, color:'#0f172a' }}>Détail des gains (Standard)</span>
          </div>

          {/* Barre de répartition */}
          <div style={{ display:'flex', borderRadius:'100px', overflow:'hidden', height:'8px', marginBottom:'16px' }}>
            <div style={{ flex: 1250, background:'#16a34a' }}/>
            <div style={{ flex: 590,  background:'#1a6ff4' }}/>
          </div>

          {/* Ligne 1 */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f8faff', borderRadius:'10px', padding:'12px 14px', marginBottom:'8px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#16a34a', flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:'13px', fontWeight:700, color:'#0f172a' }}>Revente aux heures de pointe</div>
                <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'2px' }}>Décharge réseau entre 18h et 21h</div>
              </div>
            </div>
            <span style={{ fontSize:'14px', fontWeight:800, color:'#0f172a', whiteSpace:'nowrap', marginLeft:'16px' }}>1 250 €</span>
          </div>

          {/* Ligne 2 */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f8faff', borderRadius:'10px', padding:'12px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#1a6ff4', flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:'13px', fontWeight:700, color:'#0f172a' }}>Charge intelligente (Heures creuses)</div>
                <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'2px' }}>Recharge optimisée la nuit</div>
              </div>
            </div>
            <span style={{ fontSize:'14px', fontWeight:800, color:'#0f172a', whiteSpace:'nowrap', marginLeft:'16px' }}>590 €</span>
          </div>
        </div>

        {/* Impact batterie */}
        <div style={{ background:'white', borderRadius:'14px', padding:'24px', border:'1.5px solid #e5e7eb' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#fff7ed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span style={{ fontSize:'13px', fontWeight:700, color:'#0f172a' }}>Impact réel sur la batterie</span>
          </div>

          <p style={{ fontSize:'11px', color:'#9ca3af', lineHeight:'1.6', marginBottom:'16px', margin:'0 0 16px 0' }}>
            L&apos;usage V2G sollicite davantage la batterie. Voici le calcul de rentabilité en tenant compte de la perte de valeur (usure) du véhicule.
          </p>

          {/* Usure côte à côte */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0', marginBottom:'16px', border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderRight:'1px solid #e5e7eb' }}>
              <div style={{ fontSize:'10px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'8px' }}>Usure standard (sans V2G)</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:'5px' }}>
                <span style={{ fontSize:'26px', fontWeight:800, color:'#0f172a', lineHeight:1, fontFamily:'Inter, sans-serif' }}>1.2%</span>
                <span style={{ fontSize:'13px', fontWeight:500, color:'#9ca3af' }}>/ an</span>
              </div>
            </div>
            <div style={{ padding:'16px 20px' }}>
              <div style={{ fontSize:'10px', fontWeight:700, color:'#f97316', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'8px' }}>Usure avec V2G</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
                <span style={{ fontSize:'26px', fontWeight:800, color:'#f97316', lineHeight:1, fontFamily:'Inter, sans-serif' }}>2.1%</span>
                <span style={{ fontSize:'13px', fontWeight:500, color:'#f97316' }}>/ an</span>
              </div>
            </div>
          </div>

          {/* Bilan dark */}
          <div style={{ background:'#0f172a', borderRadius:'12px', padding:'16px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#94a3b8', marginBottom:'8px' }}>
              <span>Gains V2G bruts</span>
              <span style={{ color:'white', fontWeight:700 }}>+ 1 840 €</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#94a3b8', marginBottom:'10px' }}>
              <span>Coût estimé usure supp. (0.9%)</span>
              <span style={{ color:'#f87171', fontWeight:700 }}>- 215 €</span>
            </div>
            <div style={{ height:'1px', background:'rgba(255,255,255,0.1)', marginBottom:'10px' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <span style={{ fontSize:'13px', fontWeight:700, color:'white' }}>Bénéfice Net Réel</span>
              <span style={{ fontSize:'18px', fontWeight:900, color:'#4ade80' }}>+ 1 625 € <span style={{ fontSize:'11px', fontWeight:600, color:'#94a3b8' }}>/ an</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Section capacités V2G ── */}
      <div style={{ background:'white', borderRadius:'14px', padding:'20px 24px', border:'1.5px solid #e5e7eb', marginTop:'16px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span style={{ fontSize:'13px', fontWeight:700, color:'#0f172a' }}>Capacités V2G — Tesla Model Y</span>
          </div>
          <span style={{ fontSize:'11px', fontWeight:700, color:'#16a34a', border:'1.5px solid #16a34a', borderRadius:'100px', padding:'3px 12px' }}>
            Compatible Bidirectionnel
          </span>
        </div>

        {/* 4 colonnes */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr' }}>
          {[
            {
              label: 'Puissance de décharge (V2G)',
              value: '11 kW AC',
              sub: 'Maximum autorisé par le chargeur embarqué.',
            },
            {
              label: 'Énergie mobilisable / cycle',
              value: '20.5 kWh',
              sub: "Soit ~25% de la batterie, préservant l'autonomie.",
            },
            {
              label: 'Seuil de sécurité (Conduite)',
              value: 'Garanti 60%',
              sub: 'La batterie ne descendra jamais en dessous.',
            },
            {
              label: 'Compatibilité Borne',
              value: 'Wallbox V2G requise',
              sub: 'Nécessite un équipement spécifique à domicile.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              padding: i === 0 ? '0 24px 0 0' : i === 3 ? '0 0 0 24px' : '0 24px',
              borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none',
            }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>{item.label}</div>
              <div style={{ fontSize:'14px', fontWeight:800, color:'#0f172a', marginBottom:'4px', fontFamily:'Inter, sans-serif' }}>{item.value}</div>
              <div style={{ fontSize:'11px', color:'#9ca3af', lineHeight:'1.5' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default function DashboardShell({ email }: { email: string }) {
  const [active, setActive] = useState<NavItem>('simulation')
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = email ? email.slice(0, 2).toUpperCase() : 'U'

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#dce8ff', fontFamily:'Inter, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width:'220px', flexShrink:0, background:'white', borderRight:'1px solid #e5e7eb', display:'flex', flexDirection:'column', justifyContent:'space-between', paddingTop:'24px', paddingBottom:'24px', height:'100%' }}>

        <div>
          {/* Logo */}
          <Link href="/" style={{ textDecoration:'none', display:'block', padding:'0 16px', marginBottom:'32px' }}>
            <LogoFull size={32} fontSize={16} />
          </Link>

          {/* Nav */}
          <nav style={{ display:'flex', flexDirection:'column', gap:'2px', padding:'0 8px' }}>
            {NAV.map(item => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:'12px',
                    padding:'0 12px', height:'40px', borderRadius:'8px',
                    fontSize:'14px', fontWeight:600, cursor:'pointer', border:'none',
                    width:'100%', textAlign:'left',
                    background: isActive ? '#eef4ff' : 'transparent',
                    color: isActive ? '#1a6ff4' : '#6b7280',
                    borderLeft: isActive ? '3px solid #1a6ff4' : '3px solid transparent',
                    transition:'all .15s',
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div style={{ height:'1px', background:'#e5e7eb', margin:'16px 16px 0' }} />
        </div>

        {/* Bottom */}
        <div style={{ padding:'0 16px' }}>
          <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {email}
          </div>
          <button
            onClick={handleSignOut}
            style={{ fontSize:'12px', fontWeight:600, color:'#ef4444', background:'none', border:'none', cursor:'pointer', padding:0 }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ height:'56px', background:'white', borderBottom:'1px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', flexShrink:0 }}>
          <div style={{ fontSize:'14px', color:'#6b7280' }}>
            Dashboard <span style={{ margin:'0 4px' }}>/</span>
            <span style={{ color:'#0f172a', fontWeight:600 }}>{PAGE_TITLES[active]}</span>
          </div>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#1a6ff4', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700 }}>
            {initials}
          </div>
        </header>

        {/* Scrollable content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
          <div>


            {active === 'simulation' && <DashboardTabs onNavigate={(tab) => setActive(tab as NavItem)} />}            {active === 'rentabilite' && <RentabilitePanel />}
            {active !== 'simulation' && active !== 'rentabilite' && (
              <div style={{ background:'white', borderRadius:'16px', padding:'32px', border:'1px solid #e5e7eb', color:'#9ca3af', fontSize:'14px' }}>
                {PAGE_TITLES[active]} — bientôt disponible
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
