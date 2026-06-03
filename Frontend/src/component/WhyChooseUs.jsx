import React from 'react';

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us" id="why-choose-us">
      <div className="container">
        <h2>Why Choose Us</h2>
        <p className="section-subtitle">Discover the values and key differentiators that set us apart.</p>
        <div className="features-grid">
          <div className="feature-point">
            <div className="feature-check">✓</div>
            <div className="feature-content">
              <h4>Proven Track Record</h4>
              <p>Successfully delivered over 120 projects across various industries with a 98% client satisfaction rate.</p>
            </div>
          </div>
          <div className="feature-point">
            <div className="feature-check">✓</div>
            <div className="feature-content">
              <h4>Expert Team</h4>
              <p>Our team consists of highly skilled senior developers, architects, and dedicated project managers.</p>
            </div>
          </div>
          <div className="feature-point">
            <div className="feature-check">✓</div>
            <div className="feature-content">
              <h4>Agile Methodology</h4>
              <p>We use transparent, agile processes ensuring you are always involved and updated at every sprint.</p>
            </div>
          </div>
          <div className="feature-point">
            <div className="feature-check">✓</div>
            <div className="feature-content">
              <h4>24/7 Dedicated Support</h4>
              <p>Round-the-clock monitoring and technical support to guarantee maximum uptime and reliability.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
