// Logo V2G Tracker — icône connecteur dans carré arrondi bleu
// variant="color" : icône bleue sur fond blanc (navbar, sidebar)
// variant="white" : icône blanche sur fond bleu (auth pages)

export function LogoIcon({ size = 36, variant = 'color' }: { size?: number; variant?: 'color' | 'white' }) {
  const bg    = variant === 'white' ? '#1a6ff4' : '#eef4ff'
  const color = variant === 'white' ? '#ffffff'  : '#1a6ff4'
  const r     = size * 0.28

  return (
    <div style={{
      width: size, height: size,
      background: bg,
      borderRadius: r,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Connecteur électrique V2G — deux fiches reliées */}
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    </div>
  )
}

export function LogoFull({
  size = 36,
  variant = 'color',
  textColor = '#0f172a',
  fontSize = 18,
}: {
  size?: number
  variant?: 'color' | 'white'
  textColor?: string
  fontSize?: number
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
      <LogoIcon size={size} variant={variant} />
      <span style={{ display:'flex', alignItems:'baseline', gap:'3px', letterSpacing:'-0.02em' }}>
        <span style={{ fontSize, fontWeight:800, color: textColor, fontFamily:'Inter, sans-serif' }}>V2G</span>
        <span style={{ fontSize, fontWeight:500, color: textColor, fontFamily:'Inter, sans-serif' }}>Tracker</span>
      </span>
    </div>
  )
}
