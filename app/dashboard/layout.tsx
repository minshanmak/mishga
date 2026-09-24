"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/session')
            .then(r => r.json())
            .then(data => {
                if (!data.authenticated) {
                    router.push('/admin');
                } else {
                    setAuth(true);
                }
            })
            .catch(() => router.push('/admin'));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/admin');
    };

    if (auth === null) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }}>Authenticating...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 20%) 1fr', minHeight: '100vh', backgroundColor: 'var(--dark)' }}>
            <aside style={{ backgroundColor: '#0f0f0f', borderRight: '1px solid var(--border)', padding: '30px' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--serif)', color: 'var(--light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
                    <i className="fa-solid fa-gem" style={{ color: 'var(--gold)' }}></i> MishGa Console
                </Link>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/dashboard" style={{ padding: '12px 15px', color: pathname === '/dashboard' ? 'var(--gold)' : 'var(--muted)', backgroundColor: pathname === '/dashboard' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: pathname === '/dashboard' ? 600 : 400 }}>
                        <i className="fa-solid fa-inbox"></i> Enquiries
                    </Link>
                    <Link href="/dashboard/projects" style={{ padding: '12px 15px', color: pathname === '/dashboard/projects' ? 'var(--gold)' : 'var(--muted)', backgroundColor: pathname === '/dashboard/projects' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: pathname === '/dashboard/projects' ? 600 : 400 }}>
                        <i className="fa-solid fa-briefcase"></i> Projects
                    </Link>
                    <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '15px 0' }}></div>
                    <button onClick={handleLogout} style={{ padding: '12px 15px', color: '#ff4d4d', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontFamily: 'inherit' }}>
                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </nav>
            </aside>
            <main style={{ padding: '40px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
