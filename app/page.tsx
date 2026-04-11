import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import HeroCards from '@/components/ui/HeroCards'

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconBattery = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="18" height="10" rx="2"/>
    <path d="M22 11v2"/>
    <path d="M6 11h6"/>
    <path d="M9 8v6"/>
  </svg>
)

export default function HomePage() {
  return (
    <main>
      <Navbar />

      <section className="max-w-[900px] mx-auto px-12 pt-20 pb-16 flex flex-col items-center text-center max-lg:px-6">

        <div className="inline-flex items-center gap-1.5 bg-white border border-brand-mid text-brand text-[11px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6 mx-auto">
          <span className="w-1.5 h-1.5 bg-brand rounded-full" />
          OCPP 2.0.1 &amp; ISO 15118 SUPPORTÉS
        </div>

        <h1
          className="text-[64px] font-black leading-[1.08] text-gray-900 max-lg:text-4xl"
          style={{ animation: 'fade-up 0.6s ease both' }}
        >
          Simulateur V2G.<br />
          <span className="text-brand">Calculez, Décidez,<br />Rentabilisez.</span>
        </h1>

        <div
          className="mt-9 flex gap-3.5 items-center justify-center"
          style={{ animation: 'fade-up 0.6s ease 0.2s both' }}
        >
          <Link
            href="/auth/signup"
            className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-[10px] text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,111,244,.35)]"
          >
            Lancer la simulation →
          </Link>
          <Link
            href="#demo"
            className="text-brand border-2 border-brand px-6 py-3 rounded-[10px] text-[15px] font-bold transition-all hover:bg-brand-light"
          >
            Voir une démo
          </Link>
        </div>

        <div
          className="mt-8 flex items-center gap-3.5 justify-center"
          style={{ animation: 'fade-up 0.6s ease 0.35s both' }}
        >
          <div className="flex">
            {['1','5','12'].map((i, idx) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/34?img=${i}`}
                alt="avatar"
                className={`w-8 h-8 rounded-full border-2 border-white object-cover ${idx !== 0 ? '-ml-2' : ''}`}
              />
            ))}
          </div>
          <div className="text-[13px] font-semibold text-gray-500 leading-snug">
            <strong className="text-gray-900 block">+120 opérateurs réseau</strong>
            font confiance à V2G Profit Tracker
          </div>
        </div>

        <div className="mt-7 flex gap-7 justify-center">
          {[
            '5 simulations offertes',
            'Sans carte bancaire',
            'Compatible tous véhicules EV',
          ].map((p) => (
            <div key={p} className="flex items-center gap-2 text-[13.5px] font-semibold text-gray-700">
              <svg className="text-brand flex-shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {p}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-12 pb-16 max-lg:px-6">
        <HeroCards />
      </section>

      <section className="max-w-[1300px] mx-auto px-12 pb-20 grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:px-6">
        {[
          {
            icon: <IconBolt />,
            bg: 'bg-brand-light',
            iconColor: 'text-brand',
            title: 'Simulation ultra-rapide',
            desc: 'Entrez les specs de votre batterie, votre zone tarifaire et obtenez un verdict ROI complet en moins de 30 secondes. Zéro tableur, zéro prise de tête.',
          },
          {
            icon: <IconPin />,
            bg: 'bg-green-100',
            iconColor: 'text-green-600',
            title: 'Optimisation par localisation',
            desc: "Notre moteur analyse les tarifs d'électricité en temps réel par région et identifie les créneaux V2G les plus rentables pour votre zone géographique.",
          },
          {
            icon: <IconBattery />,
            bg: 'bg-orange-50',
            iconColor: 'text-orange-500',
            title: 'Santé batterie préservée',
            desc: "Algorithme de dégradation intégré : nous calculons le revenu net en tenant compte de l'usure réelle de votre batterie. Pas de mauvaise surprise.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl2 p-8 shadow-card hover:shadow-card-lg transition-shadow animate-float-in">
            <div className={`w-12 h-12 ${f.bg} rounded-[14px] flex items-center justify-center mb-5 ${f.iconColor}`}>
              {f.icon}
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
