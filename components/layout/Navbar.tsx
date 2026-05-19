'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogoFull } from '@/components/ui/Logo'

export default function Navbar() {
  const [connected, setConnected] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setConnected(true)
    })
  }, [])

  return (
    <nav style={{background:'rgba(255,255,255,0.8)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:100, borderBottom:'1px solid #f1f5f9', padding:'0 48px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <Link href="/" style={{textDecoration:'none'}}>
        <LogoFull size={34} fontSize={18} />
      </Link>
      <button
        onClick={() => router.push(connected ? '/dashboard' : '/auth/signup')}
        style={{background:'#1a6ff4', color:'white', padding:'9px 18px', borderRadius:'6px', fontSize:'13px', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit'}}
      >
        {connected ? 'Mon dashboard →' : 'Commencer maintenant'}
      </button>
    </nav>
  )
}
