import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { vehicle_model, battery_capacity_kwh, location_city, electricity_price, v2g_sessions_per_week } = body

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system:
        'Tu es un expert en Vehicle-to-Grid (V2G) et en rentabilité des véhicules électriques. ' +
        'Analyse les données de simulation fournies et donne des conseils concis et chiffrés en français. ' +
        'Sois direct, précis, et mets en avant les points clés : revenus estimés, ROI, risques et opportunités.',
      messages: [
        {
          role: 'user',
          content:
            `Analyse cette simulation V2G :\n` +
            `- Véhicule : ${vehicle_model}\n` +
            `- Capacité batterie : ${battery_capacity_kwh} kWh\n` +
            `- Ville : ${location_city}\n` +
            `- Prix électricité : ${electricity_price} €/kWh\n` +
            `- Sessions V2G/semaine : ${v2g_sessions_per_week}\n\n` +
            `Donne-moi : (1) estimation du revenu annuel, (2) délai de ROI, (3) 2 conseils pour maximiser les gains.`,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ advice: text })
  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json({ error: 'Erreur lors de la génération du conseil IA.' }, { status: 500 })
  }
}
