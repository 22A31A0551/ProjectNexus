import React from 'react';
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

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutCompany />
      <ChairmanMessage />
      <Statistics />
      <Services />
      <Portfolio />
      <Testimonials />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </>
  );
}

export default HomePage;
