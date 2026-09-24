"use client";
import { useEffect, useState } from 'react';

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
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEnquiries = async () => {
        try {
            const res = await fetch('/api/enquiries');
            if (res.ok) setEnquiries(await res.json());
        } catch { } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchEnquiries(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
        fetchEnquiries();
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '8px' }}>Enquiries</h1>
                    <p style={{ color: 'var(--muted)' }}>Manage your inbound contacts.</p>
                </div>
            </header>

            {isLoading ? <div style={{ color: 'var(--muted)' }}>Loading enquiries...</div> :
                enquiries.length === 0 ? (
                    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '15px' }}></i>
                        <h3>No Enquiries Yet</h3>
                        <p style={{ color: 'var(--muted)' }}>When clients fill out the contact form, they will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {enquiries.map(enq => (
                            <div key={enq.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', padding: '20px', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{enq.name}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--gold)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>{enq.service || 'General Inquiry'}</span>
                                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{formatDate(enq.created_at)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                                        <a href={`mailto:${enq.email}`} style={{ color: 'var(--light)', textDecoration: 'none' }}><i className="fa-regular fa-envelope"></i> {enq.email}</a>
                                        {enq.phone && <a href={`tel:${enq.phone}`} style={{ color: 'var(--light)', textDecoration: 'none' }}><i className="fa-solid fa-phone"></i> {enq.phone}</a>}
                                    </div>
                                    <p style={{ color: 'var(--light)', lineHeight: 1.6, margin: 0, padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{enq.message}</p>
                                </div>
                                <button onClick={() => handleDelete(enq.id)} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '10px', borderRadius: '50%', transition: 'all 0.3s' }} title="Delete Enquiry"><i className="fa-solid fa-trash-can"></i></button>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}
