"use client";
import { useEffect } from 'react';

export default function About() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('shown');
                observer.unobserve(entry.target);
            }
        }), { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main>
            <section className="about section-pad" id="about" style={{ paddingTop: '150px' }}>
                <div className="container about-grid">
                    <div className="workspace reveal">
                        <div className="workspace-card">
                            <div className="window-bar"><i></i><i></i><i></i></div>
                            <div className="workspace-content">
                                <div className="code-lines"><span></span><span></span><span></span><span></span><span></span></div>
                                <div className="site-preview"><div></div><b></b><b></b><b></b></div>
                            </div>
                        </div>
                        <div className="workspace-tag"><i className="fa-solid fa-lightbulb"></i><strong>Ideas into impact</strong><span>Since 2023</span></div>
                    </div>
                    <div className="about-copy reveal delay-1">
                        <p className="eyebrow"><span></span> About MishGa</p>
                        <h2>Building Websites That <em>Build Businesses</em></h2>
                        <p>At MishGa, we believe your website should be more than a beautiful digital brochure. It should be your hardest-working business asset.</p>
                        <p>We pair purposeful strategy, distinctive design and robust technology to create digital experiences that win attention and deliver measurable growth.</p>
                        <ul className="feature-list">
                            <li><i className="fa-solid fa-check"></i> Custom Design</li>
                            <li><i className="fa-solid fa-check"></i> Mobile First</li>
                            <li><i className="fa-solid fa-check"></i> SEO Ready</li>
                            <li><i className="fa-solid fa-check"></i> Ongoing Support</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
