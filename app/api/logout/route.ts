import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST() {
    try {
        const session = await getSession();
        session.destroy();
        return new NextResponse('', { status: 204 });
    } catch (error) {
        return new NextResponse('', { status: 500 });
    }
}
