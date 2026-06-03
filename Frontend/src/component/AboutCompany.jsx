import React from 'react';

const AboutCompany = () => {
  return (
    <section className="about-company" id="about">
      <div className="container">
        <h2>About Our Company</h2>
        <p className="about-desc">
          ProjectNexus is a trusted software solutions company specializing in custom software development, project maintenance, and technical support. With years of industry experience, we help businesses build, manage, and enhance digital solutions through innovation, quality, and continuous support.
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Clients Worked For</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">120+</h3>
            <p className="stat-label">Projects Made</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">10+</h3>
            <p className="stat-label">Years of Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCompany;
