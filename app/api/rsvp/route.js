import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

function getDb() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

// GET: Retorna dados seguros do evento para o convite e lista de convidados
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

    return NextResponse.json({
      success: true,
      event: {
        celebrantName: config?.celebrantName || 'Aniversariante',
        age: config?.age,
        theme: config?.theme || 'Comemoração Especial',
        date: config?.date,
        startTime: config?.startTime,
        endTime: config?.endTime,
        durationHours: config?.durationHours,
        venueName: config?.venueName,
        venueAddress: config?.venueAddress,
        venueMapUrl: config?.venueMapUrl || ''
      },
      guests: (guests || []).map(g => ({
        id: g.id,
        name: g.name,
        group: g.group,
        category: g.category,
        status: g.status,
        drinksAlcohol: g.drinksAlcohol,
        restrictions: g.restrictions || [],
        declineReason: g.declineReason || '',
        messageToCelebrant: g.messageToCelebrant || ''
      }))
    });
  } catch (error) {
    console.error('Erro na API pública de RSVP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Convidado confirma presença ou informa ausência com motivo e recado
export async function POST(request) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ success: false, message: 'Banco indisponível.' }, { status: 500 });
    }

    const body = await request.json();
    const { 
      guestId, 
      status, // 'confirmed' | 'declined'
      drinksAlcohol, 
      restrictions, 
      companions,
      declineReason,
      messageToCelebrant
    } = body;

    const rows = await sql`
      SELECT data FROM festplanner_events WHERE id = 'default_event' LIMIT 1;
    `;

    if (!rows || rows.length === 0 || !rows[0].data) {
      return NextResponse.json({ success: false, message: 'Evento não encontrado' }, { status: 404 });
    }

    const eventData = rows[0].data;
    let guestFound = false;

    // Atualiza convidado na lista
    eventData.guests = (eventData.guests || []).map(g => {
      if (g.id === guestId) {
        guestFound = true;
        return {
          ...g,
          status: status === 'confirmed' ? 'confirmed' : 'declined',
          drinksAlcohol: status === 'confirmed' ? (drinksAlcohol ?? g.drinksAlcohol) : false,
          restrictions: Array.isArray(restrictions) ? restrictions : (restrictions ? [restrictions] : g.restrictions),
          declineReason: status === 'declined' ? (declineReason || 'Não informado') : '',
          messageToCelebrant: messageToCelebrant || g.messageToCelebrant || ''
        };
      }
      return g;
    });

    // Se confirmou e adicionou acompanhantes extras
    if (status === 'confirmed' && Array.isArray(companions) && companions.length > 0) {
      for (const comp of companions) {
        if (comp.name && comp.name.trim()) {
          eventData.guests.push({
            id: 'comp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: comp.name.trim(),
            group: 'Acompanhante',
            category: comp.category || 'adult',
            status: 'confirmed',
            drinksAlcohol: Boolean(comp.drinksAlcohol),
            restrictions: comp.restrictions || ['Sem restrições'],
            declineReason: '',
            messageToCelebrant: ''
          });
        }
      }
    }

    // Se for um novo convidado que respondeu diretamente pelo link público
    if (!guestFound && !guestId && body.name && body.name.trim()) {
      eventData.guests.push({
        id: 'guest-' + Date.now(),
        name: body.name.trim(),
        group: 'RSVP Público',
        category: body.category || 'adult',
        status: status === 'confirmed' ? 'confirmed' : 'declined',
        drinksAlcohol: status === 'confirmed' ? Boolean(drinksAlcohol) : false,
        restrictions: restrictions || ['Sem restrições'],
        declineReason: status === 'declined' ? (declineReason || 'Não informado') : '',
        messageToCelebrant: messageToCelebrant || ''
      });
    }

    // Salva no Postgres da Vercel
    await sql`
      UPDATE festplanner_events
      SET data = ${JSON.stringify(eventData)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = 'default_event';
    `;

    return NextResponse.json({ success: true, message: 'Resposta registrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar RSVP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
