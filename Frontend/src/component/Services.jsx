import React from 'react';

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="container">
        <h2>Our Services</h2>
        <p className="section-subtitle">Explore the wide range of services we offer to help your business thrive.</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">💻</div>
            <h3>Custom Software Development</h3>
            <p>We build tailored software solutions designed to meet your unique business requirements and scale with your growth.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🛠️</div>
            <h3>Project Maintenance</h3>
            <p>Ensure your applications run smoothly with our dedicated maintenance, bug tracking, and continuous improvement services.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎧</div>
            <h3>Technical Support</h3>
            <p>Reliable, round-the-clock technical support to resolve issues quickly and keep your systems operational.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
