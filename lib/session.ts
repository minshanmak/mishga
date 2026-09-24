import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

type SessionData = {
    is_admin?: boolean;
};

const sessionOptions = {
    password: process.env.MISHGA_SECRET_KEY || 'fallback_complex_password_at_least_32_chars_long_!',
    cookieName: 'mishga_admin_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
