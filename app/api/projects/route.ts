import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getSession } from '@/lib/session';

export async function GET() {
    const session = await getSession();

    try {
        const { rows } = await sql`SELECT * FROM projects ORDER BY updated_at DESC`;

        if (!session.is_admin) {
            return NextResponse.json(rows.filter(r => r.published === 1 || r.published === true));
        }
        return NextResponse.json(rows);
    } catch (e) {
        // Table not created yet
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session.is_admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payload = await request.json();
        const title = (payload.title || '').trim();
        const desc = (payload.description || '').trim();

        if (!title || !desc) return NextResponse.json({ error: "Title and description required" }, { status: 400 });

        const tech = (payload.technologies || '').trim();
        const live = (payload.live_url || '').trim();
        const case_study = (payload.case_study_url || '').trim();
        const published = payload.published ? 1 : 0;
        const now = new Date().toISOString();

        const result = await sql`
            INSERT INTO projects (title, description, technologies, live_url, case_study_url, published, created_at, updated_at)
            VALUES (${title}, ${desc}, ${tech}, ${live}, ${case_study}, ${published}, ${now}, ${now})
            RETURNING id
        `;

        return NextResponse.json({ success: true, id: result.rows[0].id }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
