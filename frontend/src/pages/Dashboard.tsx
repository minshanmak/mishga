import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

interface Enquiry {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    created_at: string;
}

export default function Dashboard() {
    const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const load = async () => {
        try {
            const resp = await fetch('/api/enquiries');
            if (resp.ok) setEnquiries(await resp.json());
        } catch {
            // Handle error
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Delete the enquiry from ${name}?`)) {
            await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
            await load();
        }
    };

    const handleClearAll = async () => {
        if (enquiries.length && confirm('Permanently delete every enquiry?')) {
            await fetch('/api/enquiries', { method: 'DELETE' });
            await load();
        }
    };

    const dateText = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
    const relativeTime = (value: string) => {
        const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
        return minutes < 1 ? 'Now' : minutes < 60 ? `${minutes}m ago` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 1440)}d ago`;
    };

    const today = new Date().toDateString();
    const todayCount = enquiries.filter(item => new Date(item.created_at).toDateString() === today).length;
    const latestTime = enquiries.length ? relativeTime(enquiries[0].created_at) : '—';

    const matches = enquiries.filter(item =>
        `${item.name} ${item.email} ${item.phone} ${item.service} ${item.message}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="console-main" id="enquiries">
            <header className="console-header">
                <div>
                    <p className="eyebrow"><span></span> Inbox</p>
                    <h1>Project enquiries</h1>
                    <p>Everything your next client shared with you, organized in one focused view.</p>
                </div>
                <button aria-label="Toggle navigation" className="mobile-menu" onClick={toggleMenu}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            </header>
            <div className="stat-row">
                <article>
                    <span className="stat-icon gold"><i className="fa-solid fa-inbox"></i></span>
                    <div><small>All enquiries</small><strong>{enquiries.length}</strong></div>
                </article>
                <article>
                    <span className="stat-icon green"><i className="fa-solid fa-sun"></i></span>
                    <div><small>Received today</small><strong>{todayCount}</strong></div>
                </article>
                <article>
                    <span className="stat-icon purple"><i className="fa-solid fa-clock"></i></span>
                    <div><small>Latest message</small><strong>{latestTime}</strong></div>
                </article>
            </div>
            <section className="inbox-card">
                <div className="inbox-tools">
                    <div>
                        <h2>All messages</h2>
                        <span>{enquiries.length} {enquiries.length === 1 ? 'message' : 'messages'}</span>
                    </div>
                    <div className="tool-actions">
                        <label className="search">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email or service" type="search" />
                        </label>
                        <button aria-label="Delete all messages" className="icon-button danger" title="Delete all messages" onClick={handleClearAll}>
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                {matches.length === 0 ? (
                    <div className="empty-state">
                        <div><i className="fa-regular fa-message"></i></div>
                        <h3>Your inbox is clear</h3>
                        <p>New contact form submissions will show up here.</p>
                    </div>
                ) : (
                    <div className="message-list">
                        {matches.map(item => {
                            const expanded = expandedId === item.id;
                            return (
                                <article key={item.id} className={`message-item ${expanded ? 'expanded' : ''}`}>
                                    <button className="message-main" onClick={() => setExpandedId(expanded ? null : item.id)}>
                                        <span className="message-initial">{item.name.charAt(0).toUpperCase()}</span>
                                        <span className="message-summary"><strong>{item.name}</strong><small>{item.email}</small></span>
                                        <span className="message-service">{item.service || 'General enquiry'}</span>
                                        <time>{relativeTime(item.created_at)}</time>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                    <div className="message-detail">
                                        <div className="detail-grid">
                                            <div><small>Email</small><a href={`mailto:${item.email}`}>{item.email}</a></div>
                                            <div><small>Phone</small><a href={item.phone ? `tel:${item.phone}` : '#'}>{item.phone || 'Not provided'}</a></div>
                                            <div><small>Service</small><span>{item.service || 'General enquiry'}</span></div>
                                            <div><small>Received</small><span>{dateText(item.created_at)}</span></div>
                                        </div>
                                        <div className="detail-message">
                                            <small>Project details</small>
                                            <p>{item.message}</p>
                                        </div>
                                        <div className="detail-actions">
                                            <a href={`mailto:${item.email}?subject=${encodeURIComponent('Re: Your enquiry to MishGa')}`} className="btn btn-gold">
                                                <i className="fa-regular fa-paper-plane"></i> Reply by email
                                            </a>
                                            <button className="delete-message" onClick={() => handleDelete(item.id, item.name)}>
                                                <i className="fa-solid fa-trash-can"></i> Delete enquiry
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </section>
    );
}
