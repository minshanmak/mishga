"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Admin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetch('/api/session')
            .then(r => r.json())
            .then(d => {
                if (d.authenticated) router.push('/dashboard');
            })
            .catch(() => { });
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Login failed. Check server connection.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--dark)' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--light)', display: 'inline-block', marginBottom: '30px' }}><img src="/assets/mishga-logo.png" alt="MishGa" style={{ height: '40px' }} /></Link>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', marginBottom: '20px' }}>Admin Console</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Access Key</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 15px', backgroundColor: '#0f0f0f', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--light)', fontFamily: 'inherit' }} placeholder="Enter secure key" />
                    </div>
                    {error && <div style={{ color: '#ff4d4d', fontSize: '0.9rem' }}>{error}</div>}
                    <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>Authenticate <i className="fa-solid fa-lock"></i></button>
                </form>
            </div>
        </div>
    );
}
