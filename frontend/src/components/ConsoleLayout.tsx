import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ConsoleLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check auth on layout load and when path changes
        fetch('/api/session').then(r => r.json()).then(res => {
            if (!res.authenticated) navigate('/admin');
        }).catch(() => navigate('/admin'));
    }, [navigate, location.pathname]);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        navigate('/admin');
    };

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <div className={`console-body ${isOpen ? 'sidebar-open' : ''}`}>
            <main className="console">
                <aside className={`console-sidebar ${isOpen ? 'open' : ''}`}>
                    <Link className="brand" to="/">
                        <img src="/assets/mishga-logo.png" alt="MishGa" />
                        <span>Mish<span>Ga</span></span>
                    </Link>
                    <p className="console-label">Workspace</p>
                    <nav>
                        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'selected' : ''}>
                            <i className="fa-solid fa-inbox"></i>
                            <span>Enquiries</span>
                        </Link>
                        <Link to="/projects" className={location.pathname === '/projects' ? 'selected' : ''}>
                            <i className="fa-solid fa-layer-group"></i>
                            <span>Projects</span>
                        </Link>
                        <Link to="/">
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            <span>View website</span>
                        </Link>
                    </nav>
                    <div className="sidebar-user">
                        <span className="user-avatar">MG</span>
                        <span><strong>MishGa Admin</strong><small>Administrator</small></span>
                        <button aria-label="Log out" title="Log out" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </button>
                    </div>
                </aside>

                {/* Child pages render here. The mobile toggle logic handles opening the sidebar. */}
                <Outlet context={{ toggleMenu: () => setIsOpen(!isOpen) }} />
            </main>
        </div>
    );
}
