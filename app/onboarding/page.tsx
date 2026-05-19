'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
    <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/>
  </svg>
)

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="1"/>
    <path d="M9 22V12h6v10M8 6h.01M12 6h.01M16 6h.01M8 10h.01M16 10h.01"/>
  </svg>
)

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

type InstallType = 'residential' | 'commercial' | null
type Goal = 'explore' | 'quick' | 'maximize' | null

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [installType, setInstallType] = useState<InstallType>(null)
  const [goal, setGoal] = useState<Goal>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleComplete() {
    if (!installType || !goal) return
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: prefError } = await supabase.from('preferences_utilisateur').upsert({
      user_id: user.id,
      install_type: installType,
      goal,
    })

    if (prefError) {
      setError(prefError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profils')
      .update({ onboarding_complete: true })
      .eq('id', user.id)

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const btnBase = 'flex items-center gap-2.5 px-4 py-3 rounded-[10px] border-2 font-semibold text-[14px] transition-all cursor-pointer'
  const btnActive = 'border-brand bg-brand-light text-brand'
  const btnIdle = 'border-gray-200 bg-white text-gray-700 hover:border-brand/50'

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-xl2 shadow-card-lg p-10 w-full max-w-lg">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10 text-brand no-underline">
          <div className="w-9 h-9 bg-brand rounded-[10px] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M3 17h2l1-3h12l1 3h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 14l1.5-4h9L18 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7.5" cy="17.5" r="1.5" fill="white"/>
              <circle cx="16.5" cy="17.5" r="1.5" fill="white"/>
              <path d="M12 4v4M10 6h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block font-black text-[15px] tracking-tight">V2G<span className="text-white bg-brand rounded-[4px] px-1 ml-1 text-[13px]">PRO</span></span>
            <span className="block text-[10px] font-semibold text-gray-400 tracking-[.08em] uppercase mt-1">Profit Tracker</span>
          </div>
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Configurez votre profil</h1>
        <p className="text-sm text-gray-400 mb-8">2 questions pour personnaliser votre expérience V2G.</p>

        {/* Type d'installation */}
        <div className="mb-7">
          <p className="text-[13px] font-bold text-gray-700 mb-3">Type d&apos;installation</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setInstallType('residential')}
              className={`${btnBase} ${installType === 'residential' ? btnActive : btnIdle}`}
            >
              <IconHome />
              Résidentiel
            </button>
            <button
              onClick={() => setInstallType('commercial')}
              className={`${btnBase} ${installType === 'commercial' ? btnActive : btnIdle}`}
            >
              <IconBuilding />
              Professionnel
            </button>
          </div>
        </div>

        {/* Objectif */}
        <div className="mb-8">
          <p className="text-[13px] font-bold text-gray-700 mb-3">Votre objectif principal</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setGoal('explore')}
              className={`${btnBase} flex-col items-start gap-2 ${goal === 'explore' ? btnActive : btnIdle}`}
            >
              <IconSearch />
              Explorer
            </button>
            <button
              onClick={() => setGoal('quick')}
              className={`${btnBase} flex-col items-start gap-2 ${goal === 'quick' ? btnActive : btnIdle}`}
            >
              <IconBolt />
              Démarrage rapide
            </button>
            <button
              onClick={() => setGoal('maximize')}
              className={`${btnBase} flex-col items-start gap-2 ${goal === 'maximize' ? btnActive : btnIdle}`}
            >
              <IconArrow />
              Maximiser
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-[10px] mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={!installType || !goal || loading}
          className="w-full bg-brand hover:bg-brand-dark disabled:opacity-40 text-white py-3 rounded-[10px] text-[15px] font-bold transition-all"
        >
          {loading ? 'Enregistrement...' : 'Accéder au tableau de bord →'}
        </button>
      </div>
    </div>
  )
}
