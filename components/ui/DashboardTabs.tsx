'use client'

import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface FormState {
  battery_kwh:    number
  battery_health: number
  tarif_buy:      number
  tarif_sell:     number
  daily_km:       number
  v2g_hours:      number
  ev_brand:       string
  ev_model:       string
  city:           string
  region:         string
}

// ── Static data ────────────────────────────────────────────────────────────────
const STEPS = ["Vue d'ensemble", 'Localisation', 'Véhicule', 'Simulation', 'Résultats']

const BRANDS = ['Tesla', 'Renault', 'Volkswagen', 'Peugeot', 'BMW', 'Hyundai', 'Kia', 'Audi']

const MODELS: Record<string, string[]> = {
  Tesla:      ['Model 3', 'Model Y', 'Model S', 'Model X'],
  Renault:    ['Zoe', 'Megane E-Tech', 'Scenic E-Tech'],
  Volkswagen: ['ID.3', 'ID.4', 'ID.5', 'ID.7'],
  Peugeot:    ['e-208', 'e-2008', 'e-3008'],
  BMW:        ['iX3', 'i4', 'i5', 'iX'],
  Hyundai:    ['Ioniq 5', 'Ioniq 6', 'Kona Electric'],
  Kia:        ['EV6', 'EV9', 'Niro EV'],
  Audi:       ['Q4 e-tron', 'e-tron GT', 'Q8 e-tron'],
}

const EV_DATA: Record<string, { kwh: number; health: number }> = {
  'Model 3':       { kwh: 75,  health: 95 },
  'Model Y':       { kwh: 75,  health: 95 },
  'Model S':       { kwh: 100, health: 95 },
  'Model X':       { kwh: 100, health: 95 },
  'Zoe':           { kwh: 52,  health: 90 },
  'Megane E-Tech': { kwh: 60,  health: 92 },
  'Scenic E-Tech': { kwh: 60,  health: 92 },
  'ID.3':          { kwh: 58,  health: 92 },
  'ID.4':          { kwh: 77,  health: 93 },
  'ID.5':          { kwh: 77,  health: 93 },
  'ID.7':          { kwh: 77,  health: 93 },
  'e-208':         { kwh: 50,  health: 90 },
  'e-2008':        { kwh: 50,  health: 90 },
  'e-3008':        { kwh: 73,  health: 92 },
  'iX3':           { kwh: 80,  health: 93 },
  'i4':            { kwh: 84,  health: 94 },
  'i5':            { kwh: 84,  health: 94 },
  'iX':            { kwh: 111, health: 94 },
  'Ioniq 5':       { kwh: 77,  health: 94 },
  'Ioniq 6':       { kwh: 77,  health: 94 },
  'Kona Electric': { kwh: 65,  health: 92 },
  'EV6':           { kwh: 77,  health: 94 },
  'EV9':           { kwh: 99,  health: 94 },
  'Niro EV':       { kwh: 65,  health: 92 },
  'Q4 e-tron':     { kwh: 82,  health: 93 },
  'e-tron GT':     { kwh: 93,  health: 94 },
  'Q8 e-tron':     { kwh: 114, health: 94 },
}

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

const REGIONS = Object.keys(REGION_TARIFS)

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputCls     = 'w-full border border-gray-200 rounded-[10px] px-4 py-3 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition'
const labelCls     = 'block text-[13px] font-bold text-gray-700 mb-1.5'
const pillActive   = 'border-2 border-brand bg-brand-light text-brand font-semibold text-[14px] px-4 py-3 rounded-[10px] transition-all text-left'
const pillIdle     = 'border-2 border-gray-200 bg-white text-gray-700 font-semibold text-[14px] px-4 py-3 rounded-[10px] hover:border-brand/40 transition-all text-left'
const regionActive = 'border-2 border-brand bg-brand-light text-brand text-[13px] font-semibold py-3 px-4 rounded-[10px] transition-all text-left'
const regionIdle   = 'border-2 border-gray-200 bg-white text-gray-700 text-[13px] font-semibold py-3 px-4 rounded-[10px] hover:border-brand/40 transition-all text-left'

// ── SVG Icons ──────────────────────────────────────────────────────────────────
function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )
}
function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
      <polyline points="2 18 8 12 13 17 22 6"/>
      <polyline points="16 6 22 6 22 12"/>
    </svg>
  )
}
function IconBattery() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="18" height="10" rx="2"/>
      <path d="M22 11v2"/>
      <path d="M6 11h6"/>
      <path d="M9 8v6"/>
    </svg>
  )
}
function IconCheck() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} width="14" height="14">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function DashboardTabs() {
  const [activeStep,    setActiveStep]    = useState(0)
  const [showAdvanced,  setShowAdvanced]  = useState(false)
  const [form, setForm] = useState<FormState>({
    battery_kwh: 0, battery_health: 0,
    tarif_buy: 0,   tarif_sell: 0,
    daily_km: 0,    v2g_hours: 0,
    ev_brand: '',   ev_model: '',
    city: '',       region: '',
  })

  function num(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))
  }
  function str(key: keyof FormState, val: string) {
    setForm(p => ({ ...p, [key]: val }))
  }
  function selectRegion(region: string) {
    const tarifs = REGION_TARIFS[region]
    setForm(p => ({ ...p, region, tarif_buy: tarifs.buy, tarif_sell: tarifs.sell }))
  }
  function selectModel(model: string) {
    const data = EV_DATA[model]
    if (data) setForm(p => ({ ...p, ev_model: model, battery_kwh: data.kwh, battery_health: data.health }))
    else      setForm(p => ({ ...p, ev_model: model }))
  }

  const next = () => setActiveStep(s => Math.min(s + 1, 4))
  const prev = () => setActiveStep(s => Math.max(s - 1, 0))

  const canContinue =
    activeStep === 1 ? !!form.region :
    activeStep === 2 ? !!form.ev_model :
    true

  // ── Calculations ────────────────────────────────────────────────────────────
  const diff = form.tarif_sell - form.tarif_buy
  const base = diff > 0 && form.v2g_hours > 0 && form.battery_kwh > 0
  const annual_revenue = base
    ? Math.round(diff * form.v2g_hours * 365 * form.battery_kwh * 0.8 * 100) / 100
    : 0
  const roi_months = base
    ? Math.round(form.battery_kwh * 800 / (diff * form.v2g_hours * 365 * form.battery_kwh * 0.8))
    : 0
  const degradation = form.v2g_hours > 0
    ? Math.round(form.v2g_hours * 0.15 * 10) / 10
    : 0

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Stepper ── */}
      <div className="flex items-center mb-2">
        {STEPS.map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 transition-all duration-300 ${
              i < activeStep   ? 'bg-brand text-white' :
              i === activeStep ? 'bg-brand text-white ring-4 ring-brand/20' :
                                 'bg-white border-2 border-gray-200 text-gray-400'
            }`}>
              {i < activeStep ? <IconCheck /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px transition-all duration-500 ${i < activeStep ? 'bg-brand' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex mb-6">
        {STEPS.map((label, i) => (
          <div key={i} className={`flex-1 last:flex-none text-[11px] font-semibold mt-1.5 transition-colors ${
            i <= activeStep ? 'text-brand' : 'text-gray-400'
          } ${i === STEPS.length - 1 ? 'text-right' : i === 0 ? 'text-left' : 'text-center'}`}>
            {label}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-500"
          style={{ width: `${(activeStep / 4) * 100}%` }}
        />
      </div>

      {/* ── Step content ── */}

      {/* Step 0 – Vue d'ensemble */}
      {activeStep === 0 && (
        <div>
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
            <div className="bg-white rounded-xl2 p-6 shadow-card">
              <div className="text-3xl font-black text-brand mb-2">
                {roi_months > 0 ? `${roi_months} mois` : '— mois'}
              </div>
              <div className="w-11 h-11 bg-brand-light text-brand rounded-[12px] flex items-center justify-center mb-4">
                <IconBolt />
              </div>
              <div className="font-bold text-gray-900 mb-1">ROI calculé</div>
              <p className="text-sm text-gray-400">Retour sur investissement en mois</p>
            </div>

            <div className="bg-white rounded-xl2 p-6 shadow-card">
              <div className="text-3xl font-black text-green-600 mb-2">
                {annual_revenue > 0 ? `${annual_revenue} €` : '— €'}
              </div>
              <div className="w-11 h-11 bg-green-50 text-green-600 rounded-[12px] flex items-center justify-center mb-4">
                <IconTrend />
              </div>
              <div className="font-bold text-gray-900 mb-1">Revenu annuel</div>
              <p className="text-sm text-gray-400">Projection sur 12 mois</p>
            </div>

            <div className="bg-white rounded-xl2 p-6 shadow-card">
              <div className="text-3xl font-black text-orange-500 mb-2">
                {degradation > 0 ? `${degradation} %` : '— %'}
              </div>
              <div className="w-11 h-11 bg-orange-50 text-orange-500 rounded-[12px] flex items-center justify-center mb-4">
                <IconBattery />
              </div>
              <div className="font-bold text-gray-900 mb-1">Usure batterie</div>
              <p className="text-sm text-gray-400">Impact réel sur votre véhicule</p>
            </div>
          </div>

          <button
            onClick={next}
            className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-[10px] font-bold text-[15px] transition-all hover:-translate-y-0.5 mt-8"
          >
            Lancer ma simulation →
          </button>
        </div>
      )}

      {/* Step 1 – Localisation */}
      {activeStep === 1 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Où êtes-vous situé ?</h2>
          <p className="text-gray-400 mb-6">Le coût de l&apos;électricité varie selon votre région.</p>

          <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => selectRegion(region)}
                className={form.region === region ? regionActive : regionIdle}
              >
                {region}
              </button>
            ))}
          </div>

          {form.region && (
            <div className="bg-brand-light border border-brand-mid rounded-[12px] p-4 mt-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-brand">Tarif achat : {form.tarif_buy} €/kWh</p>
                  <p className="text-sm text-gray-600 mt-1">Tarif revente estimé : {form.tarif_sell} €/kWh</p>
                </div>
                <span className="bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                  Données officielles EDF OA
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2 – Véhicule */}
      {activeStep === 2 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Votre véhicule électrique</h2>
          <p className="text-gray-400 mb-6">Sélectionnez votre marque puis votre modèle.</p>

          <div className="grid grid-cols-4 gap-2 max-lg:grid-cols-2">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => { str('ev_brand', brand); str('ev_model', '') }}
                className={form.ev_brand === brand ? pillActive : pillIdle}
              >
                {brand}
              </button>
            ))}
          </div>

          {form.ev_brand && (
            <div key={form.ev_brand} className="mt-5 transition-opacity duration-200">
              <p className="text-[13px] font-bold text-gray-700 mb-2">Modèle — {form.ev_brand}</p>
              <div className="flex flex-wrap gap-2">
                {(MODELS[form.ev_brand] ?? []).map((model) => (
                  <button
                    key={model}
                    onClick={() => selectModel(model)}
                    className={form.ev_model === model ? pillActive : pillIdle}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          )}

          {form.ev_model && (
            <div className="bg-brand-light border border-brand-mid rounded-[12px] p-4 mt-4">
              <div className="flex justify-between items-center gap-3">
                <div>
                  <p className="font-bold text-brand">{form.ev_brand} {form.ev_model}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Batterie : {form.battery_kwh} kWh · Santé : {form.battery_health} %
                  </p>
                </div>
                <span className="bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                  Données constructeur
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3 – Simulation */}
      {activeStep === 3 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Paramètres de simulation</h2>
          <p className="text-gray-400 mb-6">Renseignez vos habitudes de conduite et de charge.</p>

          {/* Summary pills */}
          {(form.region || form.ev_model) && (
            <div className="flex gap-3 mb-6 flex-wrap">
              {form.region && (
                <span className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700">
                  {form.region}
                </span>
              )}
              {form.ev_model && (
                <span className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700">
                  {form.ev_brand} {form.ev_model} · {form.battery_kwh} kWh
                </span>
              )}
            </div>
          )}

          {/* Main fields */}
          <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
            <div>
              <label className={labelCls}>Km quotidiens</label>
              <input
                type="number"
                placeholder="ex: 40"
                value={form.daily_km || ''}
                onChange={num('daily_km')}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Heures V2G/jour</label>
              <input
                type="number"
                placeholder="ex: 4"
                value={form.v2g_hours || ''}
                onChange={num('v2g_hours')}
                className={inputCls}
              />
            </div>
          </div>

          {/* Advanced params toggle */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="text-sm text-gray-400 hover:text-brand font-semibold mt-6 transition-colors flex items-center gap-1"
          >
            Modifier les paramètres avancés {showAdvanced ? '↑' : '↓'}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1 mt-4 pt-4 border-t border-gray-100">
              {([
                { label: 'Capacité batterie (kWh)', key: 'battery_kwh',    ph: 'ex: 75'   },
                { label: 'Santé batterie (%)',       key: 'battery_health', ph: 'ex: 95'   },
                { label: 'Tarif achat €/kWh',        key: 'tarif_buy',      ph: 'ex: 0.25' },
                { label: 'Tarif revente €/kWh',      key: 'tarif_sell',     ph: 'ex: 0.13' },
              ] as { label: string; key: keyof FormState; ph: string }[]).map((f) => (
                <div key={f.key}>
                  <label className={labelCls}>
                    {f.label}
                    {(form.region || form.ev_model) && (
                      <span className="ml-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Auto-rempli
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    placeholder={f.ph}
                    value={(form[f.key] as number) || ''}
                    onChange={num(f.key)}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4 – Résultats */}
      {activeStep === 4 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1 text-center">Votre verdict ROI V2G</h2>
          <p className="text-gray-400 mb-8 text-center">Basé sur vos données personnalisées.</p>

          <div className="grid grid-cols-3 gap-6 mb-6 max-lg:grid-cols-1">
            {/* Card 1 – ROI */}
            <div className="bg-white rounded-xl2 p-6 shadow-card">
              <div className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Retour sur investissement
              </div>
              <div className="text-[52px] font-black leading-none text-brand">
                {roi_months > 0 ? roi_months : '—'}
                {roi_months > 0 && <span className="text-[22px] ml-1">mois</span>}
              </div>
              <p className="text-sm text-gray-400 mt-2">pour rentabiliser votre V2G</p>
              <div className="bg-brand-light h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-700"
                  style={{ width: `${roi_months > 0 ? Math.min(100, Math.round(2400 / roi_months)) : 0}%` }}
                />
              </div>
            </div>

            {/* Card 2 – Revenu */}
            <div className="bg-white rounded-xl2 p-6 shadow-card">
              <div className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Revenu annuel estimé
              </div>
              <div className="text-[52px] font-black leading-none text-green-600">
                {annual_revenue > 0 ? annual_revenue : '—'}
                {annual_revenue > 0 && <span className="text-[22px] ml-1">€</span>}
              </div>
              <p className="text-sm text-gray-400 mt-2">de revenus générés par an</p>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mt-3 inline-block">
                +V2G ACTIF
              </span>
            </div>

            {/* Card 3 – Batterie */}
            <div className="bg-white rounded-xl2 p-6 shadow-card">
              <div className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Dégradation batterie
              </div>
              <div className="text-[52px] font-black leading-none text-orange-500">
                {degradation > 0 ? degradation : '—'}
                {degradation > 0 && <span className="text-[22px] ml-1">%/an</span>}
              </div>
              <p className="text-sm text-gray-400 mt-2">d&apos;usure annuelle estimée</p>
              <p className="text-xs text-gray-400 mt-2">Impact modéré sur la durée de vie</p>
            </div>
          </div>

          {/* Verdict card */}
          <div className="bg-brand rounded-xl2 p-6 text-center mb-6">
            <p className="font-black text-white text-xl">
              {roi_months > 0
                ? roi_months < 24 ? 'Excellent potentiel V2G ⚡'
                : roi_months < 36 ? 'Bon potentiel V2G'
                : 'Potentiel modéré — optimisable'
                : 'Complétez la simulation pour voir votre verdict'}
            </p>
            <p className="text-white/70 text-sm mt-1">
              {roi_months > 0
                ? `Rentabilité atteinte en ${roi_months} mois · ${annual_revenue} € de revenus annuels`
                : 'Renseignez vos tarifs et heures V2G pour obtenir votre score'}
            </p>
          </div>

          <button className="w-full bg-white border-2 border-brand hover:bg-brand-light text-brand font-bold px-8 py-3 rounded-[10px] text-[15px] transition-all hover:-translate-y-0.5">
            Enregistrer ma simulation →
          </button>
        </div>
      )}

      {/* ── Bottom navigation ── */}
      <div className={`flex mt-8 ${activeStep > 0 ? 'justify-between' : 'justify-end'}`}>
        {activeStep > 0 && (
          <button
            onClick={prev}
            className="text-gray-400 hover:text-gray-700 font-bold transition-colors"
          >
            ← Retour
          </button>
        )}
        {activeStep > 0 && activeStep < STEPS.length - 1 && (
          <button
            onClick={next}
            className={`bg-brand text-white px-8 py-3 rounded-[10px] font-bold text-[15px] transition-all ${
              canContinue ? 'hover:bg-brand-dark' : 'opacity-40 pointer-events-none'
            }`}
          >
            Continuer →
          </button>
        )}
      </div>
    </div>
  )
}
