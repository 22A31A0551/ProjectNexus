import React, { useState, useEffect } from 'react';

function Navbar({ onLoginClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Handle scroll events to shrink navbar and highlight active section
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            const sections = ['home', 'about', 'services', 'portfolio', 'contact'];
            const scrollPosition = window.scrollY + 100; // offset for better detection

            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = (sectionId) => {
        setIsMenuOpen(false);
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <div className="logo" onClick={() => handleLinkClick('home')}>
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">Project<span className="accent-text">Nexus</span></span>
                </div>

                {/* Right side group containing links and login button */}
                <div className="nav-right">
                    <div className="nav-links">
                        {[
                            { id: 'home', label: 'Home' },
                            { id: 'about', label: 'About' },
                            { id: 'services', label: 'Services' },
                            { id: 'portfolio', label: 'Portfolio' }
                        ].map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                className={activeSection === link.id ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick(link.id);
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="nav-cta">
                        <a href="#login" className="cta-btn" onClick={(e) => {
                            e.preventDefault();
                            if (onLoginClick) onLoginClick();
                        }}>
                            Login
                        </a>
                    </div>
                </div>

                {/* Hamburger Toggle Icon for Mobile */}
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
                    {isMenuOpen ? (
                        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    ) : (
                        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Drawer Navigation Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                {[
                    { id: 'home', label: 'Home' },
                    { id: 'about', label: 'About' },
                    { id: 'services', label: 'Services' },
                    { id: 'portfolio', label: 'Portfolio' }
                ].map((link) => (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={activeSection === link.id ? 'active' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.id);
                        }}
                    >
                        {link.label}
                    </a>
                ))}
                <a href="#login" className="mobile-cta-btn" onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    if (onLoginClick) onLoginClick();
                }}>
                    Login
                </a>
            </div>
        </nav>
    );
}

export default Navbar;


