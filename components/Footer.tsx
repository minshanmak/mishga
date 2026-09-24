import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link className="brand" href="/">
                        <img src="/assets/mishga-logo.png" alt="MishGa" />
                        <span>Mish<span>Ga</span></span>
                    </Link>
                    <p>Premium digital experiences for businesses ready to grow.</p>
                    <div className="socials">
                        <a href="https://www.instagram.com/mish.gaonline?igsh=cHFjenF4eXdsdW1q" aria-label="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/mishga-online-b64573425/" aria-label="LinkedIn">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a href="https://wa.link/8acnm9" aria-label="WhatsApp">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
                <div>
                    <h4>Quick Links</h4>
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/services">Services</Link>
                    <Link href="/portfolio">Portfolio</Link>
                    <Link href="/contact">Contact</Link>
                </div>
                <div>
                    <h4>Services</h4>
                    <Link href="/services">Business Websites</Link>
                    <Link href="/services">Booking Systems</Link>
                    <Link href="/services">E-Commerce</Link>
                    <Link href="/services">Maintenance</Link>
                </div>
                <div>
                    <h4>Contact</h4>
                    <a href="mailto:mishgaonline@gmail.com">mishgaonline@gmail.com</a>
                    <a href="tel:+919037818750">+91 9037818750</a>
                    <p>India · Working worldwide</p>
                </div>
            </div>
            <div className="container footer-bottom">
                <span>Designed &amp; Developed by MishGa</span>
                <span>© 2026 MishGa. All Rights Reserved.</span>
            </div>
        </footer>
    );
}
