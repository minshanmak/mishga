import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../css/projects.css'; // specific styles for projects admin

interface Project {
    id?: number;
    title: string;
    description: string;
    technologies: string;
    live_url: string;
    case_study_url: string;
    published: boolean;
}

export default function Projects() {
    const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Project>({
        title: '', description: '', technologies: '', live_url: '', case_study_url: '', published: true
    });
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const load = async () => {
        try {
            const resp = await fetch('/api/projects');
            if (resp.ok) setProjects(await resp.json());
        } catch {
            // ignore
        }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ title: '', description: '', technologies: '', live_url: '', case_study_url: '', published: true });
        setFeedback('');
    };

    const handleEdit = (p: Project) => {
        setIsEditing(true);
        setFormData(p);
        setFeedback('');
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDelete = async (id: number, title: string) => {
        if (confirm(`Delete ${title}?`)) {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            await load();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = isEditing && formData.id ? `/api/projects/${formData.id}` : '/api/projects';
            const method = isEditing && formData.id ? 'PUT' : 'POST';
            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!resp.ok) throw new Error();
            setFeedback(isEditing ? 'Project updated.' : 'Project added.');
            resetForm();
            await load();
        } catch {
            setFeedback('Unable to save project.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="console-main">
            <header className="console-header">
                <div>
                    <p className="eyebrow"><span></span> Portfolio</p>
                    <h1>Manage projects</h1>
                    <p>Add published work to feature it on your website.</p>
                </div>
                <button aria-label="Toggle navigation" className="mobile-menu" onClick={toggleMenu}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            </header>
            <div className="project-layout">
                <form className="project-form" ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-title">
                        <h2>{isEditing ? 'Edit project' : 'Add a project'}</h2>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel edit</button>}
                    </div>

                    <label>Project title
                        <input
                            placeholder="e.g. Smart Venue" required
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </label>
                    <label>Description
                        <textarea
                            placeholder="What did you build and why?" required rows={5}
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </label>
                    <label>Technologies <small>Separate with commas</small>
                        <input
                            placeholder="Flask, SQLite, Responsive"
                            value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                        />
                    </label>
                    <div className="project-url-row">
                        <label>Live project URL
                            <input
                                type="url" placeholder="https://..."
                                value={formData.live_url} onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                            />
                        </label>
                        <label>Case study URL
                            <input
                                type="url" placeholder="https://..."
                                value={formData.case_study_url} onChange={e => setFormData({ ...formData, case_study_url: e.target.value })}
                            />
                        </label>
                    </div>
                    <label className="publish-toggle">
                        <input
                            type="checkbox"
                            checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })}
                        />
                        <span></span> Publish on website
                    </label>
                    <button className="btn btn-gold" type="submit" disabled={isSubmitting}>
                        <i className="fa-solid fa-plus"></i>
                        <span>{isEditing ? 'Save changes' : 'Add project'}</span>
                    </button>
                    <p aria-live="polite" className="project-feedback">{feedback}</p>
                </form>

                <section className="project-list-wrap">
                    <div className="project-list-heading">
                        <h2>Your projects</h2>
                        <span>{projects.length} {projects.length === 1 ? 'project' : 'projects'}</span>
                    </div>

                    {projects.length === 0 ? (
                        <div className="empty-state">
                            <div><i className="fa-solid fa-layer-group"></i></div>
                            <h3>Build your portfolio</h3>
                            <p>Add your first project using the form.</p>
                        </div>
                    ) : (
                        <div className="project-list">
                            {projects.map(p => (
                                <article key={p.id} className="project-admin-card">
                                    <div className="project-card-top">
                                        <span className="project-mark"><i className="fa-solid fa-gem"></i></span>
                                        <div>
                                            <h3>{p.title}</h3>
                                            <span className={`project-status ${p.published ? 'is-published' : 'is-draft'}`}>
                                                {p.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <button className="project-menu" title="Edit project" onClick={() => handleEdit(p)}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                    </div>
                                    <p className="project-card-description">{p.description}</p>
                                    <div className="project-tags">
                                        {p.technologies.split(',').map(tag => tag.trim()).filter(Boolean).map((t, i) => (
                                            <span key={i}>{t}</span>
                                        ))}
                                    </div>
                                    <div className="project-card-actions">
                                        {p.live_url ? (
                                            <a className="visit-project" href={p.live_url} target="_blank" rel="noopener noreferrer">Visit <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                        ) : <div></div>}
                                        <button className="delete-project" onClick={() => p.id && handleDelete(p.id, p.title)}>Delete</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}
