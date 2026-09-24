import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getSession } from '@/lib/session';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session.is_admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const id = parseInt((await context.params).id);
        const payload = await request.json();

        const title = (payload.title || '').trim();
        const desc = (payload.description || '').trim();
        if (!title || !desc) return NextResponse.json({ error: "Title and description required" }, { status: 400 });

        const tech = (payload.technologies || '').trim();
        const live = (payload.live_url || '').trim();
        const case_study = (payload.case_study_url || '').trim();
        const published = payload.published ? 1 : 0;
        const now = new Date().toISOString();

        await sql`
            UPDATE projects 
            SET title=${title}, description=${desc}, technologies=${tech}, live_url=${live}, case_study_url=${case_study}, published=${published}, updated_at=${now}
            WHERE id=${id}
        `;

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session.is_admin) return new NextResponse(null, { status: 401 });

    try {
        const id = parseInt((await context.params).id);
        await sql`DELETE FROM projects WHERE id = ${id}`;
        return new NextResponse(null, { status: 204 });
    } catch {
        return new NextResponse(null, { status: 500 });
    }
}
