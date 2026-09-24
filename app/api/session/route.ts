import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json({ authenticated: !!session.is_admin });
    } catch (error) {
        return NextResponse.json({ authenticated: false });
    }
}
