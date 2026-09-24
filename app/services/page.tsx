"use client";
import { useEffect } from 'react';
import Link from 'next/link';

export default function Services() {
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
            <section className="services section-pad" id="services" style={{ paddingTop: '150px' }}>
                <div className="container">
                    <div className="section-heading reveal">
                        <div><p className="eyebrow"><span></span> What we do</p><h2>Digital solutions for<br /><em>ambitious brands.</em></h2></div>
                        <p>From first click to long-term growth, we build the digital foundation your business needs to lead.</p>
                    </div>
                    <div className="service-grid">
                        <article className="service-card reveal"><div className="icon-box"><i className="fa-solid fa-laptop-code"></i></div><span>01</span><h3>Business Websites</h3><p>Beautiful, strategic websites that make your business impossible to ignore.</p><Link href="/contact">Learn More <i className="fa-solid fa-arrow-right"></i></Link></article>
                        <article className="service-card reveal delay-1"><div className="icon-box"><i className="fa-solid fa-bag-shopping"></i></div><span>02</span><h3>E-Commerce Stores</h3><p>Seamless online shopping experiences built to convert visitors into customers.</p><Link href="/contact">Learn More <i className="fa-solid fa-arrow-right"></i></Link></article>
                        <article className="service-card reveal delay-2"><div className="icon-box"><i className="fa-solid fa-calendar-check"></i></div><span>03</span><h3>Booking Systems</h3><p>Smart booking platforms that simplify scheduling for you and your customers.</p><Link href="/contact">Learn More <i className="fa-solid fa-arrow-right"></i></Link></article>
                        <article className="service-card reveal delay-3"><div className="icon-box"><i className="fa-solid fa-headset"></i></div><span>04</span><h3>Maintenance &amp; Support</h3><p>Dependable ongoing support to keep your digital presence at its best.</p><Link href="/contact">Learn More <i className="fa-solid fa-arrow-right"></i></Link></article>
                    </div>
                </div>
            </section>
        </main>
    );
}
