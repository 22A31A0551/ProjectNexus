import React from 'react';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2>Get In Touch</h2>
        <p className="section-subtitle">
          If you want to contact the team, feel free to reach out — we'd love to hear from you and discuss how we can help bring your ideas to life.
        </p>

        <div className="contact-layout">
          {/* Left — Info Cards */}
          <div className="contact-info">
            <div className="contact-info-card">
              <span className="contact-info-icon">📍</span>
              <div>
                <h4>Our Office</h4>
                <p>Hyderabad, Telangana, India</p>
              </div>
            </div>
            <div className="contact-info-card">
              <span className="contact-info-icon">📧</span>
              <div>
                <h4>Email Us</h4>
                <p>contact@projectnexus.in</p>
              </div>
            </div>
            <div className="contact-info-card">
              <span className="contact-info-icon">📞</span>
              <div>
                <h4>Call Us</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-info-card">
              <span className="contact-info-icon">⏰</span>
              <div>
                <h4>Working Hours</h4>
                <p>Mon – Sat, 9 AM – 7 PM IST</p>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input type="text" id="contact-name" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input type="email" id="contact-email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input type="text" id="contact-subject" placeholder="How can we help?" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" rows="5" placeholder="Tell us about your project or question..."></textarea>
            </div>
            <button type="submit" className="contact-submit-btn">Send Message ✉️</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
