'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'Simulateur', href: '/dashboard' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: "Cas d'usage", href: '#use-cases' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-brand-mid/30 px-12 h-[72px] flex items-center justify-between sticky top-0 z-50 max-lg:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 text-brand no-underline">
        <div className="w-[38px] h-[38px] bg-brand rounded-[10px] flex items-center justify-center flex-shrink-0">
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

      {/* Links desktop */}
      <ul className="hidden lg:flex gap-9 list-none">
        {navLinks.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-gray-700 text-[15px] font-medium hover:text-brand transition-colors no-underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/auth/signup"
        className="hidden lg:inline-block bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-[10px] text-[15px] font-bold no-underline transition-all duration-200 hover:scale-105 hover:bg-blue-400"
      >
        Essai gratuit
      </Link>

      {/* Mobile burger */}
      <button
        className="lg:hidden p-2"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
        <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
        <div className="w-5 h-0.5 bg-gray-700" />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-t border-gray-100 p-6 flex flex-col gap-4 lg:hidden shadow-lg">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="text-gray-700 font-semibold no-underline" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/auth/signup" className="bg-brand text-white text-center px-6 py-3 rounded-[10px] font-bold no-underline mt-2">
            Essai gratuit
          </Link>
        </div>
      )}
    </nav>
  )
}
