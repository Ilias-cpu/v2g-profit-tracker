import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(160deg, #dce8ff 0%, #eef4ff 60%, #e8f0ff 100%)', fontFamily:'Plus Jakarta Sans, sans-serif'}}>
      <Navbar />

      <main style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'60px 24px 0'}}>

        <div style={{background:'#eef2ff', color:'#1a6ff4', fontSize:'12px', fontWeight:700, padding:'6px 16px', borderRadius:'100px', marginBottom:'32px', letterSpacing:'0.02em', border:'1px solid #c7d7fe', display:'inline-block', animation:'fadeDown 0.5s ease both'}}>
          Simulateur V2G gratuit
        </div>

        <h1 style={{fontSize:'36px', fontWeight:900, lineHeight:1.15, margin:'0 0 16px', maxWidth:'680px', fontFamily:'var(--font-inter), sans-serif', letterSpacing:'-0.5px', whiteSpace:'nowrap', animation:'fadeUp 0.5s ease 0.1s both'}}>
          <span style={{color:'#111827'}}>Votre véhicule électrique </span><span style={{color:'#1a6ff4'}}>sera-t-il rentable ?</span>
        </h1>

        <p style={{fontSize:'15px', maxWidth:'420px', textAlign:'center', lineHeight:1.6, color:'#6b7280', margin:'0 auto 32px', animation:'fadeUp 0.5s ease 0.2s both'}} dangerouslySetInnerHTML={{__html: "Exploitez les données de milliers d'utilisateurs pour identifier<br/>votre potentiel retour sur investissement V2G en 30 secondes."}} />

        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px', animation:'fadeUp 0.5s ease 0.3s both'}}>
          <input
            type="email"
            placeholder="nom@gmail.com"
            style={{
              width:'280px',
              padding:'8px 16px',
              border:'1.5px solid #e5e7eb',
              borderRadius:'8px',
              fontSize:'14px',
              outline:'none',
              fontFamily:'inherit'
            }}
          />
          <button style={{
            background:'#1a6ff4',
            color:'white',
            padding:'0 40px',
            borderRadius:'8px',
            fontSize:'14px',
            fontWeight:700,
            border:'none',
            cursor:'pointer',
            whiteSpace:'nowrap',
            fontFamily:'inherit',
            height:'36px'
          }}>
            Lancer ma simulation
          </button>
        </div>

        <p style={{fontSize:'12px', color:'#9ca3af', whiteSpace:'nowrap', animation:'fadeUp 0.5s ease 0.35s both'}}>
          Inscrivez-vous pour accéder aux meilleures offres V2G correspondant à votre profil.
        </p>

        <div style={{marginTop:'48px', marginLeft:'auto', marginRight:'auto', width:'calc(100% - 80px)', maxWidth:'860px', background:'white', borderRadius:'16px', boxShadow:'0 4px 40px rgba(0,0,0,0.08)', overflow:'hidden', border:'1px solid #f0f0f0', animation:'scaleUp 0.7s ease 0.4s both'}}>
          <div style={{height:'36px', background:'#f9fafb', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', padding:'0 16px', gap:'6px'}}>
            <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ff5f57'}}/>
            <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#febc2e'}}/>
            <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#28c840'}}/>
          </div>
          <img
            src="/Prototype-exemple-V2G.png"
            alt="Dashboard V2G Tracker"
            style={{width:'100%', display:'block'}}
          />
        </div>

      </main>

      <footer style={{
        borderTop:'1px solid #e5e7eb',
        marginTop:'80px',
        padding:'24px 48px',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        fontSize:'13px',
        color:'#9ca3af'
      }}>
        <div style={{display:'flex', gap:'32px'}}>
          <a href="/mentions-legales" style={{color:'#9ca3af', textDecoration:'none'}}>Mentions légales</a>
          <a href="/confidentialite" style={{color:'#9ca3af', textDecoration:'none'}}>Politique de confidentialité</a>
        </div>
        <span>Copyright ©V2G Tracker 2026</span>
      </footer>
    </div>
  )
}
