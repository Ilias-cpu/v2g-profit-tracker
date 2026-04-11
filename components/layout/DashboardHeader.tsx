'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardHeader({ email }: { email: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-brand-mid/30 px-12 h-[72px] flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 text-brand no-underline">
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

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 font-medium">{email}</span>
        <button
          onClick={handleSignOut}
          className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}
