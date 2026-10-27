import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

function getDb() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

// Inicializa a tabela caso não exista
async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS festplanner_events (
      id VARCHAR(50) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// GET: Carrega os dados do evento
export async function GET(request) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ success: false, offline: true, message: 'DATABASE_URL não configurada' }, { status: 200 });
    }

    await ensureTable(sql);

    const rows = await sql`
      SELECT data, updated_at FROM festplanner_events WHERE id = 'default_event' LIMIT 1;
    `;

    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows[0].data, updatedAt: rows[0].updated_at });
    }

    return NextResponse.json({ success: true, data: null, message: 'Nenhum dado cadastrado ainda no banco' });
  } catch (error) {
    console.error('Erro ao ler do Postgres:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Salva ou atualiza os dados completos do evento
export async function POST(request) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ success: false, offline: true, message: 'DATABASE_URL não configurada' }, { status: 200 });
    }

    const body = await request.json();
    await ensureTable(sql);

    await sql`
      INSERT INTO festplanner_events (id, data, updated_at)
      VALUES ('default_event', ${JSON.stringify(body)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id)
      DO UPDATE SET data = ${JSON.stringify(body)}, updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Erro ao gravar no Postgres:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
