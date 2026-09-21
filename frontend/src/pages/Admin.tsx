import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/session').then(r => r.json()).then(res => {
            if (res.authenticated) navigate('/dashboard');
        }).catch(() => { });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (!response.ok) throw new Error('Auth failed');
            navigate('/dashboard');
        } catch {
            setError('Incorrect password. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="console-body">
            <main className="access-screen">
                <section className="access-card">
                    <a className="brand" href="/">
                        <img alt="MishGa" src="/assets/mishga-logo.png" />
                        <span>Mish<span>Ga</span></span>
                    </a>
                    <div className="access-icon"><i className="fa-solid fa-lock"></i></div>
                    <p className="eyebrow"><span></span> Private workspace</p>
                    <h1>Sign in to your<br /><em>workspace.</em></h1>
                    <p className="access-copy">Manage and respond to your incoming project enquiries in one place.</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="adminPassword">Administrator password</label>
                        <div className="password-field">
                            <input
                                id="adminPassword"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                aria-label="Show password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        <button className="btn btn-gold" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Continue'} <i className="fa-solid fa-arrow-right"></i>
                        </button>
                        <p aria-live="polite" className="login-error">{error}</p>
                    </form>
                </section>
            </main>
        </div>
    );
}
