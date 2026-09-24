"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
        <Link className="brand" href="/" aria-label="MishGa home" onClick={closeMenu}>
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
          <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About</Link>
          <Link href="/services" className={pathname === '/services' ? 'active' : ''} onClick={closeMenu}>Services</Link>
          <Link href="/portfolio" className={pathname === '/portfolio' ? 'active' : ''} onClick={closeMenu}>Portfolio</Link>
          <Link href="/contact" className={pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>Contact</Link>
          <Link href="/contact" className="btn btn-gold nav-cta" onClick={closeMenu}>
            Let's Talk <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </Link>
        </div>
      </nav>
    </header>
  );
}
