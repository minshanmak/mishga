import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS enquiries (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                service TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                technologies TEXT,
                live_url TEXT,
                case_study_url TEXT,
                published INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        `;
        return true;
    } catch (e) {
        console.error("Failed to initialize database", e);
        return false;
    }
}
