import React from 'react';

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <p className="section-subtitle">Read testimonials and feedback from our satisfied clients.</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">❝</div>
            <p className="testimonial-text">"ProjectNexus completely transformed our workflow. Their custom software solution was delivered on time and exceeded our expectations in every way."</p>
            <div className="client-info">
              <div className="client-avatar avatar-1"></div>
              <div>
                <h4>Sarah Jenkins</h4>
                <p>CTO, TechCorp</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote-icon">❝</div>
            <p className="testimonial-text">"The technical support team is phenomenal. They are always available, incredibly responsive, and ensure our systems have zero downtime."</p>
            <div className="client-info">
              <div className="client-avatar avatar-2"></div>
              <div>
                <h4>Michael Chang</h4>
                <p>Operations Director, GlobalLogistics</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote-icon">❝</div>
            <p className="testimonial-text">"Choosing ProjectNexus was the best decision for our digital transformation. Their expertise and attention to detail are unmatched in the industry."</p>
            <div className="client-info">
              <div className="client-avatar avatar-3"></div>
              <div>
                <h4>Elena Rodriguez</h4>
                <p>Founder, InnovateHealth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
