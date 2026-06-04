import React, { useState } from 'react';
import Navbar from "../component/Navbar";
import Hero from "../component/Hero";
import AboutCompany from "../component/AboutCompany";
import ChairmanMessage from "../component/ChairmanMessage";
import Statistics from "../component/Statistics";
import Services from "../component/Services";
import Portfolio from "../component/Portfolio";
import Testimonials from "../component/Testimonials";
import WhyChooseUs from "../component/WhyChooseUs";
import Contact from "../component/Contact";
import Footer from "../component/Footer";
import AuthModal from "../component/AuthModal";

function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <>
      <Navbar onLoginClick={openAuthModal} />
      <Hero onLoginClick={openAuthModal} />
      <AboutCompany />
      <ChairmanMessage />
      <Statistics />
      <Services />
      <Portfolio />
      <Testimonials />
      <WhyChooseUs />
      <Contact />
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}

export default HomePage;

