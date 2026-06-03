import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      text: "ProjectNexus completely transformed our workflow. Their custom software solution was delivered on time and exceeded our expectations in every way.",
      name: "Sarah Jenkins",
      role: "CTO, TechCorp",
      avatarClass: "avatar-1"
    },
    {
      text: "The technical support team is phenomenal. They are always available, incredibly responsive, and ensure our systems have zero downtime.",
      name: "Michael Chang",
      role: "Operations Director, GlobalLogistics",
      avatarClass: "avatar-2"
    },
    {
      text: "Choosing ProjectNexus was the best decision for our digital transformation. Their expertise and attention to detail are unmatched in the industry.",
      name: "Elena Rodriguez",
      role: "Founder, InnovateHealth",
      avatarClass: "avatar-3"
    },
    {
      text: "From concept to deployment, the team delivered a flawless mobile app that our customers love. Their agile approach kept us ahead of schedule.",
      name: "David Park",
      role: "Product Manager, FinEdge",
      avatarClass: "avatar-4"
    },
    {
      text: "Their maintenance service is a game-changer. Bugs are resolved within hours, and they proactively suggest improvements we hadn't even considered.",
      name: "Priya Sharma",
      role: "VP Engineering, CloudWave",
      avatarClass: "avatar-5"
    },
    {
      text: "We've worked with many vendors, but ProjectNexus stands out for their transparency, communication, and genuine commitment to our success.",
      name: "James Mitchell",
      role: "CEO, RetailHub",
      avatarClass: "avatar-6"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <p className="section-subtitle">Hear from businesses that trust us with their technology needs.</p>

        <div className="marquee-container">
          <div className="marquee-track testimonials-track">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={`t1-${i}`}>
                <div className="quote-icon">❝</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="client-info">
                  <div className={`client-avatar ${t.avatarClass}`}></div>
                  <div>
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={`t2-${i}`}>
                <div className="quote-icon">❝</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="client-info">
                  <div className={`client-avatar ${t.avatarClass}`}></div>
                  <div>
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
