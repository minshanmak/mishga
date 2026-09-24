import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getSession } from '@/lib/session';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session.is_admin) return new NextResponse(null, { status: 401 });

    try {
        const id = parseInt((await context.params).id);
        await sql`DELETE FROM enquiries WHERE id = ${id}`;
        return new NextResponse(null, { status: 204 });
    } catch {
        return new NextResponse(null, { status: 500 });
    }
}
