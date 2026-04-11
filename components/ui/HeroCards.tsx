'use client'

import { useEffect, useRef } from 'react'

export default function HeroCards() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.15 }
    )
    const el = ref.current
    if (el) {
      el.querySelectorAll('.scroll-reveal').forEach((el, i) => {
        (el as HTMLElement).style.animationDelay = `${i * 0.12}s`
        observer.observe(el)
      })
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="hidden lg:flex flex-col gap-4 animate-float-in">

      {/* Card ROI principale */}
      <div className="scroll-reveal bg-white rounded-xl2 p-6 shadow-card hover:shadow-card-lg transition-shadow">
        <div className="w-12 h-12 bg-brand rounded-[14px] flex items-center justify-center mb-3.5">
          <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="text-[17px] font-extrabold text-gray-900 mb-1">Analyse ROI V2G</div>
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-blink" />
          SIMULATION OPTIMISÉE
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'Retour sur investissement', val: '18 mois' },
            { key: 'Véhicules actifs', val: '3 412' },
            { key: 'Uptime réseau', val: '99,97 %' },
            { key: 'Énergie réinjectée', val: '1 248 MWh' },
          ].map((m) => (
            <div key={m.key}>
              <div className="text-[11px] text-gray-400 font-semibold">{m.key}</div>
              <div className="text-lg font-extrabold text-gray-900">{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 : Revenue + Energy */}
      <div className="scroll-reveal grid grid-cols-2 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-xl2 p-5 shadow-card hover:shadow-card-lg transition-shadow">
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Revenu annuel projeté</div>
          <div className="text-[26px] font-black text-gray-900 leading-none">18 640 €</div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-[12px] font-bold text-green-600">+28,6 % croissance</span>
            <span className="bg-brand-light text-brand text-[10px] font-extrabold px-2 py-0.5 rounded-full">V2G ACTIF</span>
          </div>
          {/* Mini chart */}
          <div className="mt-3 h-10">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="w-full h-full">
              <polyline
                points="0,38 30,30 60,34 90,22 120,26 160,10 200,6"
                fill="none" stroke="#1a6ff4" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Energy */}
        <div className="bg-white rounded-xl2 p-5 shadow-card hover:shadow-card-lg transition-shadow">
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Énergie redistribuée</div>
          <div className="text-[26px] font-black text-gray-900 leading-none mb-3">842 MWh</div>
          <div className="flex items-end gap-1 h-10">
            {[55, 70, 60, 80, 100].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`w-2 bg-brand rounded-t-sm ${i < 4 ? 'opacity-60' : 'opacity-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sessions card */}
      <div className="scroll-reveal bg-white rounded-xl2 p-5 shadow-card hover:shadow-card-lg transition-shadow">
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Sessions V2G en cours</div>
        {[
          { badge: 'V1', bg: 'bg-brand', name: 'Tesla Model 3 – Paris 15e', loc: 'Réseau EDF OA', gain: '+€ 4,20', positive: true },
          { badge: 'V2', bg: 'bg-red-500', name: 'Renault Zoe – Lyon Sud', loc: 'Réseau Enedis', gain: '−€ 0,80', positive: false },
          { badge: 'V3', bg: 'bg-violet-600', name: 'VW ID.4 – Bordeaux Nord', loc: 'Réseau TotalEnergies', gain: '+€ 2,15', positive: true },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 2 ? 'border-b border-slate-100' : ''}`}>
            <div className={`w-8 h-8 ${s.bg} rounded-full flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0`}>
              {s.badge}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-gray-900 truncate">{s.name}</div>
              <div className="text-[11px] text-gray-400">{s.loc}</div>
            </div>
            <span className={`text-[13px] font-bold ${s.positive ? 'text-green-600' : 'text-red-500'}`}>
              {s.gain}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
