"use client";
import { useEffect, useState } from 'react';

interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string;
    live_url: string;
    case_study_url: string;
    published: boolean;
    updated_at: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', technologies: '', live_url: '', case_study_url: '', published: true });

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) setProjects(await res.json());
        } catch { } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const openFormNew = () => { setFormData({ title: '', description: '', technologies: '', live_url: '', case_study_url: '', published: true }); setEditingId(null); setIsFormOpen(true); };
    const openFormEdit = (p: Project) => { setFormData({ title: p.title, description: p.description, technologies: p.technologies, live_url: p.live_url, case_study_url: p.case_study_url, published: p.published }); setEditingId(p.id); setIsFormOpen(true); };
    const closeForm = () => { setIsFormOpen(false); };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
        const method = editingId ? 'PUT' : 'POST';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        closeForm(); fetchProjects();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        fetchProjects();
    };

    const togglePublish = async (p: Project) => {
        await fetch(`/api/projects/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, published: !p.published }) });
        fetchProjects();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '8px' }}>Portfolio Projects</h1>
                    <p style={{ color: 'var(--muted)' }}>Manage the items displayed on your public portfolio page.</p>
                </div>
                <button onClick={openFormNew} className="btn btn-gold"><i className="fa-solid fa-plus"></i> Add Project</button>
            </header>

            {isFormOpen && (
                <div style={{ padding: '30px', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '30px', position: 'relative' }}>
                    <button onClick={closeForm} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fa-solid fa-xmark"></i></button>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>{editingId ? 'Edit Project' : 'New Project'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Project Title*
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '12px', backgroundColor: 'var(--dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--light)', fontFamily: 'inherit' }} />
                            </label>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Technologies (comma separated)
                                <input type="text" value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })} placeholder="e.g. Next.js, Framer Motion" style={{ padding: '12px', backgroundColor: 'var(--dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--light)', fontFamily: 'inherit' }} />
                            </label>
                        </div>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Short Description*
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} style={{ padding: '12px', backgroundColor: 'var(--dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--light)', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Live URL
                                <input type="url" value={formData.live_url} onChange={e => setFormData({ ...formData, live_url: e.target.value })} placeholder="https://..." style={{ padding: '12px', backgroundColor: 'var(--dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--light)', fontFamily: 'inherit' }} />
                            </label>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Case Study URL
                                <input type="url" value={formData.case_study_url} onChange={e => setFormData({ ...formData, case_study_url: e.target.value })} placeholder="https://..." style={{ padding: '12px', backgroundColor: 'var(--dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--light)', fontFamily: 'inherit' }} />
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                Publish immediately
                            </label>
                            <button type="submit" className="btn btn-gold">{editingId ? 'Update Project' : 'Save Project'}</button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? <div style={{ color: 'var(--muted)' }}>Loading projects...</div> :
                projects.length === 0 ? (
                    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <i className="fa-solid fa-briefcase" style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '15px' }}></i>
                        <h3>No Projects Configured</h3>
                        <p style={{ color: 'var(--muted)' }}>Click 'Add Project' to showcase your first piece of work.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f0f0f', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <thead><tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}><th style={{ padding: '15px 20px', color: 'var(--muted)', fontWeight: 500 }}>Project</th><th style={{ padding: '15px 20px', color: 'var(--muted)', fontWeight: 500 }}>Status</th><th style={{ padding: '15px 20px', color: 'var(--muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th></tr></thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '20px' }}><div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '5px' }}>{p.title}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{p.technologies || 'No tags'}</div></td>
                                    <td style={{ padding: '20px', cursor: 'pointer' }} onClick={() => togglePublish(p)}>
                                        {p.published ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '0.85rem', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '4px 10px', borderRadius: '20px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div> Published</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--muted)' }}></div> Draft</span>}
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openFormEdit(p)} style={{ background: 'transparent', border: 'none', color: 'var(--light)', cursor: 'pointer', transition: 'color 0.3s' }} title="Edit"><i className="fa-solid fa-pen"></i></button>
                                            <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', transition: 'color 0.3s' }} title="Delete"><i className="fa-solid fa-trash-can"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
        </div>
    );
}
