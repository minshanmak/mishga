import { useEffect, useState } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function Contact() {
    useSEO({
        title: 'Contact Us | MishGa',
        description: 'Start a conversation with MishGa. Get in touch to discuss your next digital product, website build, or custom platform.'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState('');

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

    const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormMessage('Sending your message...');
        const form = e.currentTarget;
        const data: Record<string, string> = {};
        new FormData(form).forEach((value, key) => { data[key] = value.toString(); });

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed');
            setFormMessage('Thanks! Your message has been sent successfully.');
            form.reset();
        } catch {
            setFormMessage('Something went wrong. Please email us directly at mishgaonline@gmail.com');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <section className="contact section-pad" id="contact" style={{ paddingTop: '150px' }}>
                <div className="container contact-wrap">
                    <div className="contact-intro reveal">
                        <p className="eyebrow"><span></span> Get in touch</p>
                        <h2>Have a project in <em>mind?</em></h2>
                        <p>Tell us a little about what you are building. We will be in touch within one business day.</p>
                        <div className="contact-cards">
                            <a href="mailto:mishgaonline@gmail.com"><i className="fa-regular fa-envelope"></i><span><small>Email us</small>mishgaonline@gmail.com</span></a>
                            <a href="tel:+919037818750"><i className="fa-solid fa-phone"></i><span><small>Call us</small>+91 9037818750</span></a>
                            <div><i className="fa-solid fa-location-dot"></i><span><small>Based in</small>India · Working worldwide</span></div>
                            <div><i className="fa-regular fa-clock"></i><span><small>Response time</small>Within 1 business day</span></div>
                        </div>
                    </div>
                    <form className="contact-form glass reveal delay-1" onSubmit={handleContactSubmit}>
                        <h3>Start a conversation</h3>
                        <div className="form-row">
                            <label>Name<input type="text" name="name" placeholder="Your name" required /></label>
                            <label>Email<input type="email" name="email" placeholder="you@company.com" required /></label>
                        </div>
                        <div className="form-row">
                            <label>Phone<input type="tel" name="phone" placeholder="+91 00000 00000" /></label>
                            <label>Service
                                <select name="service">
                                    <option value="">Select a service</option>
                                    <option>Business Website</option>
                                    <option>E-Commerce Store</option>
                                    <option>Booking System</option>
                                    <option>Maintenance &amp; Support</option>
                                </select>
                            </label>
                        </div>
                        <label>Message<textarea name="message" rows={4} placeholder="Tell us about your project" required></textarea></label>
                        <button className="btn btn-gold" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'} <i className="fa-solid fa-paper-plane"></i>
                        </button>
                        <p className="form-message" aria-live="polite">{formMessage}</p>
                    </form>
                </div>
            </section>
        </main>
    );
}
