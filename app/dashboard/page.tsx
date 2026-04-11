import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardHeader from '@/components/layout/DashboardHeader'
import DashboardTabs from '@/components/ui/DashboardTabs'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-bg">
      <DashboardHeader email={user.email ?? ''} />

      <main className="max-w-[1200px] mx-auto px-12 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-gray-400 mt-1">Simulez votre rentabilité V2G en 3 étapes et obtenez un verdict financier immédiat.</p>
        </div>

        <DashboardTabs />
      </main>
    </div>
  )
}
