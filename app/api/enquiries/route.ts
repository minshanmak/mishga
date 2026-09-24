import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import nodemailer from 'nodemailer';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        const name = (payload.name || '').trim();
        const email = (payload.email || '').trim();
        const message = (payload.message || '').trim();
        const phone = (payload.phone || '').trim();
        const service = (payload.service || '').trim();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const created_at = new Date().toISOString();

        // 1. Save to Database
        await sql`
            INSERT INTO enquiries (name, email, phone, service, message, created_at)
            VALUES (${name}, ${email}, ${phone}, ${service}, ${message}, ${created_at})
        `;

        // 2. Send Notification Email
        const transporter = nodemailer.createTransport({
            host: process.env.MISHGA_SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.MISHGA_SMTP_PORT || '465'),
            secure: true,
            auth: {
                user: process.env.MISHGA_SMTP_USER || '',
                pass: process.env.MISHGA_SMTP_PASSWORD || ''
            }
        });

        if (process.env.MISHGA_SMTP_USER && process.env.MISHGA_SMTP_PASSWORD) {
            await transporter.sendMail({
                from: process.env.MISHGA_SMTP_USER,
                to: process.env.MISHGA_NOTIFICATION_EMAIL || 'mishgaonline@gmail.com',
                replyTo: email,
                subject: `New MishGa enquiry from ${name}`,
                text: `A new enquiry was submitted on the MishGa website.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nService: ${service || 'General enquiry'}\nReceived: ${created_at}\n\nMessage:\n${message}\n`
            }).catch(console.error);
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
    }
}

export async function GET() {
    const session = await getSession();
    if (!session.is_admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { rows } = await sql`SELECT * FROM enquiries ORDER BY id DESC`;
        return NextResponse.json(rows);
    } catch (e) {
        // If table doesn't exist, return empty array
        return NextResponse.json([]);
    }
}

export async function DELETE() {
    const session = await getSession();
    if (!session.is_admin) return new NextResponse(null, { status: 401 });

    try {
        await sql`DELETE FROM enquiries`;
        return new NextResponse(null, { status: 204 });
    } catch {
        return new NextResponse(null, { status: 500 });
    }
}
