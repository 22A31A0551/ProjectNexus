import React from 'react';

const Portfolio = () => {
  const projects = [
    {
      title: "FinTech Dashboard",
      desc: "A comprehensive financial dashboard for real-time analytics, reporting, and investment tracking.",
      gradient: "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)",
      tag: "Finance"
    },
    {
      title: "E-Commerce Platform",
      desc: "A scalable e-commerce solution with integrated payment gateways and inventory management.",
      gradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
      tag: "Retail"
    },
    {
      title: "Healthcare Portal",
      desc: "A secure patient portal facilitating telehealth appointments and medical records access.",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
      tag: "Healthcare"
    },
    {
      title: "Logistics Tracker",
      desc: "Real-time fleet and shipment tracking system with route optimization and delivery analytics.",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      tag: "Logistics"
    },
    {
      title: "EdTech Learning App",
      desc: "Interactive learning platform with live classes, progress tracking, and AI-powered recommendations.",
      gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
      tag: "Education"
    },
    {
      title: "HR Management System",
      desc: "End-to-end HR suite with payroll, attendance, leave management, and employee self-service portal.",
      gradient: "linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)",
      tag: "Enterprise"
    },
    {
      title: "Restaurant POS",
      desc: "Cloud-based point-of-sale system with table management, kitchen display, and online ordering integration.",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
      tag: "Hospitality"
    },
    {
      title: "Real Estate Portal",
      desc: "Property listing platform with virtual tours, mortgage calculator, and agent management dashboard.",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
      tag: "Real Estate"
    }
  ];

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2>Our Portfolio</h2>
        <p className="section-subtitle">Explore some of our recent projects and successful implementations across industries.</p>

        <div className="marquee-container">
          <div className="marquee-track portfolio-track">
            {projects.map((project, i) => (
              <div className="portfolio-card" key={`p1-${i}`}>
                <div className="portfolio-image" style={{ backgroundImage: project.gradient }}>
                  <span className="portfolio-tag">{project.tag}</span>
                </div>
                <div className="portfolio-content">
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {projects.map((project, i) => (
              <div className="portfolio-card" key={`p2-${i}`}>
                <div className="portfolio-image" style={{ backgroundImage: project.gradient }}>
                  <span className="portfolio-tag">{project.tag}</span>
                </div>
                <div className="portfolio-content">
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
