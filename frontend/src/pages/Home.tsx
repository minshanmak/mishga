import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function Home() {
    useSEO({
        title: 'MishGa | Digital Experiences That Drive Growth',
        description: 'MishGa designs and builds high-performing websites and digital products that turn ambitious visions into unforgettable brands.'
    });

    useEffect(() => {
        // Reveal Observer
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
            <section className="hero section-pad">
                <div className="hero-glow glow"></div>
                <div className="container hero-grid">
                    <div className="hero-copy reveal">
                        <p className="eyebrow" id="home"><span></span> Digital solutions, beautifully built</p>
                        <h1>Crafting Digital <em>Experiences</em> That Drive Growth</h1>
                        <p className="lead">We design and build high-performing websites that turn your next great idea into a business people remember.</p>
                        <div className="hero-actions">
                            <Link to="/contact" className="btn btn-gold">Start Your Project <i className="fa-solid fa-arrow-right"></i></Link>
                            <Link to="/portfolio" className="btn btn-outline">View Portfolio <i className="fa-solid fa-play"></i></Link>
                        </div>
                        <div className="hero-trust">
                            <div className="avatars"><span></span><span>S</span><span>A</span><span>+</span></div>
                            <p>Trusted by ambitious<br /><strong>businesses worldwide</strong></p>
                        </div>
                    </div>
                    <div className="hero-visual reveal delay-1" aria-label="Website performance dashboard illustration">
                        <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
                        <div className="dashboard glass">
                            <div className="dash-top"><span className="dash-dot"></span><span>Performance overview</span><i className="fa-solid fa-ellipsis"></i></div>
                            <div className="satisfaction">
                                <div><small>CLIENT SATISFACTION</small><strong>98<span>%</span></strong><p><i className="fa-solid fa-arrow-trend-up"></i> 12.4% this month</p></div>
                                <div className="progress-ring"><span>98%</span></div>
                            </div>
                            <div className="chart">
                                <div className="chart-label"><span>Growth analytics</span><strong>+ 42.8%</strong></div>
                                <svg viewBox="0 0 380 110" preserveAspectRatio="none" aria-hidden="true">
                                    <defs>
                                        <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0" stopColor="#d4af37" stopOpacity=".35" />
                                            <stop offset="1" stopColor="#d4af37" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,93 C30,80 36,85 59,66 S93,80 118,51 S152,67 179,37 S209,64 236,44 S270,51 298,22 S338,39 380,5 V110 H0Z" fill="url(#fill)" />
                                    <path d="M0,93 C30,80 36,85 59,66 S93,80 118,51 S152,67 179,37 S209,64 236,44 S270,51 298,22 S338,39 380,5" fill="none" stroke="#e7c85c" strokeWidth="3" />
                                </svg>
                            </div>
                            <div className="metrics">
                                <div><i className="fa-solid fa-bolt"></i><span>Lightning<br /><b>Fast</b></span></div>
                                <div><i className="fa-solid fa-mobile-screen-button"></i><span>Mobile<br /><b>Responsive</b></span></div>
                                <div><i className="fa-solid fa-magnifying-glass"></i><span>SEO<br /><b>Optimized</b></span></div>
                            </div>
                        </div>
                        <div className="floating-pill pill-design"><i className="fa-solid fa-wand-magic-sparkles"></i> Premium Design</div>
                        <div className="floating-pill pill-live"><span></span> Website live</div>
                    </div>
                </div>
            </section>

            <section className="why section-pad">
                <div className="container">
                    <div className="center-heading reveal">
                        <p className="eyebrow"><span></span> The MishGa difference <span></span></p>
                        <h2>Built with purpose.<br /><em>Made to perform.</em></h2>
                    </div>
                    <div className="why-grid">
                        <article className="why-card reveal"><i className="fa-solid fa-gauge-high"></i><h3>Fast Performance</h3><p>Fast-loading websites that keep people engaged and search engines happy.</p></article>
                        <article className="why-card reveal delay-1"><i className="fa-solid fa-mobile-screen"></i><h3>Mobile First</h3><p>Exceptional experiences on every screen, starting with the one in their hand.</p></article>
                        <article className="why-card reveal delay-2"><i className="fa-solid fa-shield-halved"></i><h3>Secure</h3><p>Reliable, secure foundations that protect your business and your customers.</p></article>
                        <article className="why-card reveal delay-3"><i className="fa-solid fa-heart"></i><h3>Dedicated Support</h3><p>A responsive partner by your side, long after your website launches.</p></article>
                    </div>
                </div>
            </section>

            <section className="process section-pad">
                <div className="container">
                    <div className="section-heading reveal">
                        <div><p className="eyebrow"><span></span> How we work</p><h2>From idea to <em>impact.</em></h2></div>
                        <p>Our refined process gives every great idea the clarity, craft and momentum it deserves.</p>
                    </div>
                    <div className="process-grid">
                        <article className="process-step reveal"><span>01</span><div><i className="fa-solid fa-compass"></i><h3>Discover</h3><p>We get to know your business, goals and the people you want to reach.</p></div></article>
                        <article className="process-step reveal delay-1"><span>02</span><div><i className="fa-solid fa-pen-ruler"></i><h3>Design</h3><p>We shape a visual identity and experience people will want to return to.</p></div></article>
                        <article className="process-step reveal delay-2"><span>03</span><div><i className="fa-solid fa-code"></i><h3>Develop</h3><p>We turn the vision into a fast, flexible and reliable digital product.</p></div></article>
                        <article className="process-step reveal delay-3"><span>04</span><div><i className="fa-solid fa-rocket"></i><h3>Launch</h3><p>We take you live, then keep helping you build momentum.</p></div></article>
                    </div>
                </div>
            </section>
        </main>
    );
}
