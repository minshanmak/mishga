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
}

export default function Portfolio() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.ok ? r.json() : [])
            .then((data: Project[]) => {
                setProjects(data.filter(p => p.published));
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('shown');
                observer.unobserve(entry.target);
            }
        }), { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [projects]);

    return (
        <main>
            <section className="portfolio-library section-pad" id="portfolio" style={{ paddingTop: '150px', minHeight: '100vh' }}>
                <div className="container">
                    <div className="portfolio-library-head reveal">
                        <div>
                            <p className="eyebrow"><span></span> Selected work</p>
                            <h2>Our <em>Projects</em></h2>
                        </div>
                        <p>Explore more projects built for ambitious businesses.</p>
                    </div>
                    {projects.length > 0 ? (
                        <div className="portfolio-grid reveal delay-1">
                            {projects.map(item => (
                                <article key={item.id} className="portfolio-card">
                                    <div className="portfolio-card-icon"><i className="fa-solid fa-gem"></i></div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <div className="portfolio-card-tags">
                                        {item.technologies.split(',').map(tag => tag.trim()).filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
                                    </div>
                                    {item.live_url && <a href={item.live_url} target="_blank" rel="noopener noreferrer">View Project <i className="fa-solid fa-arrow-up-right-from-square"></i></a>}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="reveal delay-1" style={{ color: 'var(--muted)' }}>Gathering portfolio projects...</div>
                    )}
                </div>
            </section>
        </main>
    );
}
