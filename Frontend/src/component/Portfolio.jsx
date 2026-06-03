import React from 'react';

const Portfolio = () => {
  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2>Our Portfolio</h2>
        <p className="section-subtitle">Explore some of our recent projects and successful implementations.</p>
        <div className="portfolio-grid">
          <div className="portfolio-card">
            <div className="portfolio-image placeholder-img-1"></div>
            <div className="portfolio-content">
              <h3>FinTech Dashboard</h3>
              <p>A comprehensive financial dashboard for real-time analytics and reporting.</p>
            </div>
          </div>
          <div className="portfolio-card">
            <div className="portfolio-image placeholder-img-2"></div>
            <div className="portfolio-content">
              <h3>E-Commerce Platform</h3>
              <p>A scalable e-commerce solution with integrated payment gateways and inventory management.</p>
            </div>
          </div>
          <div className="portfolio-card">
            <div className="portfolio-image placeholder-img-3"></div>
            <div className="portfolio-content">
              <h3>Healthcare Portal</h3>
              <p>A secure patient portal facilitating telehealth appointments and medical records access.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
