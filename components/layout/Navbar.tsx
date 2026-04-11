'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{background:'rgba(255,255,255,0.8)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:100, borderBottom:'1px solid #f1f5f9', padding:'0 48px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <Link href="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px'}}>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1a6ff4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7l6 5-6 5"/>
          <path d="M20 7l-6 5 6 5"/>
        </svg>
        <span style={{display:'flex', alignItems:'baseline', gap:'4px', letterSpacing:'-0.03em'}}>
          <span style={{fontSize:'20px', fontWeight:800, color:'#0f172a', fontFamily:'Inter, sans-serif'}}>V2G</span>
          <span style={{fontSize:'20px', fontWeight:600, color:'#0f172a', fontFamily:'Inter, sans-serif'}}>Tracker</span>
        </span>
      </Link>
      <Link href="/auth/signup" style={{background:'#1a6ff4', color:'white', padding:'9px 18px', borderRadius:'6px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}>
        Commencer maintenant
      </Link>
    </nav>
  )
}
