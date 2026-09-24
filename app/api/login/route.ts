import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // In Node.js, we authenticate simply against a stored environment variable.
        // If they were using Werkzeug crypts, they can just change to raw MISHGA_ADMIN_PASSWORD in Vercel.
        const validPassword = process.env.MISHGA_ADMIN_PASSWORD || 'mishga2026';

        if (password !== validPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const session = await getSession();
        session.is_admin = true;
        await session.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
