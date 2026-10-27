import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

function getDb() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

// GET: Retorna dados essenciais do evento e a lista de convidados para pesquisa
export async function GET(request) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ success: false, message: 'DATABASE_URL não configurada' }, { status: 200 });
    }

    const rows = await sql`
      SELECT data FROM festplanner_events WHERE id = 'default_event' LIMIT 1;
    `;

    if (!rows || rows.length === 0 || !rows[0].data) {
      return NextResponse.json({ success: false, message: 'Evento não configurado ainda.' });
    }

    const { config, guests } = rows[0].data;

    // Retorna apenas dados públicos seguros (sem valores financeiros)
    return NextResponse.json({
      success: true,
      event: {
        celebrantName: config?.celebrantName || 'Aniversariante',
        age: config?.age,
        date: config?.date,
        startTime: config?.startTime,
        endTime: config?.endTime,
        venueName: config?.venueName,
        venueAddress: config?.venueAddress
      },
      guests: (guests || []).map(g => ({
        id: g.id,
        name: g.name,
        group: g.group,
        category: g.category,
        status: g.status,
        drinksAlcohol: g.drinksAlcohol,
        restrictions: g.restrictions || []
      }))
    });
  } catch (error) {
    console.error('Erro na API pública de RSVP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Convidado confirma presença ou recusa
export async function POST(request) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ success: false, message: 'Banco indisponível.' }, { status: 500 });
    }

    const body = await request.json();
    const { guestId, status, drinksAlcohol, restrictions, companions } = body;

    const rows = await sql`
      SELECT data FROM festplanner_events WHERE id = 'default_event' LIMIT 1;
    `;

    if (!rows || rows.length === 0 || !rows[0].data) {
      return NextResponse.json({ success: false, message: 'Evento não encontrado' }, { status: 404 });
    }

    const eventData = rows[0].data;
    let guestFound = false;

    // Atualiza o convidado existente
    eventData.guests = (eventData.guests || []).map(g => {
      if (g.id === guestId) {
        guestFound = true;
        return {
          ...g,
          status,
          drinksAlcohol: drinksAlcohol ?? g.drinksAlcohol,
          restrictions: Array.isArray(restrictions) ? restrictions : (restrictions ? [restrictions] : g.restrictions)
        };
      }
      return g;
    });

    // Se o convidado adicionou acompanhantes extras
    if (Array.isArray(companions) && companions.length > 0) {
      for (const comp of companions) {
        if (comp.name && comp.name.trim()) {
          eventData.guests.push({
            id: 'comp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: comp.name.trim(),
            group: 'Acompanhante',
            category: comp.category || 'adult',
            status: status === 'confirmed' ? 'confirmed' : 'declined',
            drinksAlcohol: Boolean(comp.drinksAlcohol),
            restrictions: comp.restrictions || ['Sem restrições']
          });
        }
      }
    }

    if (!guestFound && !guestId) {
      // Caso seja um convidado novo que não estava na lista original
      if (body.name && body.name.trim()) {
        eventData.guests.push({
          id: 'guest-' + Date.now(),
          name: body.name.trim(),
          group: 'RSVP Público',
          category: body.category || 'adult',
          status: status || 'confirmed',
          drinksAlcohol: Boolean(drinksAlcohol),
          restrictions: restrictions || ['Sem restrições']
        });
      }
    }

    // Salva no Postgres
    await sql`
      UPDATE festplanner_events
      SET data = ${JSON.stringify(eventData)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = 'default_event';
    `;

    return NextResponse.json({ success: true, message: 'Presença atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar RSVP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
