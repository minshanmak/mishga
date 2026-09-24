import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
    const success = await initializeDatabase();
    if (success) {
        return NextResponse.json({ message: "Vercel Postgres database structured successfully" });
    } else {
        return NextResponse.json({ error: "Failed to initialize database tables" }, { status: 500 });
    }
}
