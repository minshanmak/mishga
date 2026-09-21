import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link className="brand" to="/">
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
                    <Link to="/">Home</Link>
                    <a href="/#about">About</a>
                    <a href="/#services">Services</a>
                    <a href="/#portfolio">Portfolio</a>
                    <a href="/#contact">Contact</a>
                </div>
                <div>
                    <h4>Services</h4>
                    <a href="/#services">Business Websites</a>
                    <a href="/#services">Booking Systems</a>
                    <a href="/#services">E-Commerce</a>
                    <a href="/#services">Maintenance</a>
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
