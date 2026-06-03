import React from 'react';

const Services = () => {
  const servicesList = [
    {
      icon: "💻",
      title: "Custom Software Development",
      desc: "We build tailored software solutions designed to meet your unique business requirements and scale with your growth."
    },
    {
      icon: "🌐",
      title: "Web Applications",
      desc: "High-performance, responsive web apps built with modern frameworks to engage users and streamline operations."
    },
    {
      icon: "📱",
      title: "Mobile Applications",
      desc: "Native and cross-platform mobile apps for iOS and Android, offering smooth performance and premium UX."
    },
    {
      icon: "🛠️",
      title: "Project Maintenance",
      desc: "Ensure your applications run smoothly with our dedicated maintenance, bug tracking, and continuous improvement services."
    },
    {
      icon: "🎧",
      title: "Technical Support",
      desc: "Reliable, round-the-clock technical support to resolve issues quickly and keep your systems operational."
    },
    {
      icon: "🏢",
      title: "Enterprise Solutions",
      desc: "Scalable software systems designed to integrate enterprise workflows, enhance security, and optimize resources."
    }
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <h2>Our Services</h2>
        <p className="section-subtitle">Explore the wide range of services we offer to help your business thrive.</p>
        
        <div className="marquee-container">
          <div className="marquee-track services-track">
            {/* Set 1 */}
            {servicesList.map((service, index) => (
              <div className="service-card" key={`s1-${index}`} style={{ width: '320px', flexShrink: 0 }}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
            {/* Set 2 */}
            {servicesList.map((service, index) => (
              <div className="service-card" key={`s2-${index}`} style={{ width: '320px', flexShrink: 0 }}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
