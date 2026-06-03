import React from 'react';
const logo = new URL('../assets/ProjectNexusLogo.jpeg', import.meta.url).href;

const Hero = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        {/* Left Side — Text Content */}
        <div className="hero-left">
          <h1 className="hero-heading">ProjectNexus</h1>
          <p className="hero-tagline">
            Connecting Clients, Teams, and Projects Beyond Delivery.
          </p>
          <p className="hero-description">
            ProjectNexus is a Project Maintenance &amp; Service Management Platform
            that enables software companies to efficiently manage client support,
            maintenance requests, bug reports, feature enhancements, and project
            communication through a centralized and transparent workflow.
          </p>
          <div className="hero-buttons">
            <a href="#services" className="hero-btn-primary">Explore Services</a>
            <a href="#login" className="hero-btn-secondary">Client Login</a>
          </div>
        </div>

        {/* Right Side — Logo */}
        <div className="hero-right">
          <div className="hero-logo-card">
            <img src={logo} alt="ProjectNexus Logo" className="hero-logo-img" />
            <span className="hero-logo-label">ProjectNexus</span>
            <span className="hero-logo-sub">Maintenance &amp; Service Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
