import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="container nav" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="MishGa home" onClick={closeMenu}>
          <img src="/assets/mishga-logo.png" alt="MishGa" />
          <span>Mish<span>Ga</span></span>
        </Link>
        <button
          className="menu-toggle"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fa-solid fa-${isOpen ? 'xmark' : 'bars'}`}></i>
        </button>
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/portfolio" onClick={closeMenu}>Portfolio</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <Link className="btn btn-gold nav-cta" to="/contact" onClick={closeMenu}>
            Let's Talk <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </Link>
        </div>
      </nav>
    </header>
  );
}
