import React from 'react';
import Lanyard from './Lanyard';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content animate-fade-up">
          <p className="greeting">Halo, Saya</p>
          <h1 className="hero-title">
            Pengembang Kreatif<br />
            & <span className="text-gradient">Desainer UI</span>
          </h1>
          <p className="hero-description">
            Saya menciptakan pengalaman digital yang indah, intuitif, dan dirancang untuk web modern. 
            Berfokus pada detail piksel sempurna dan interaksi yang mulus.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">Lihat Karya Saya</a>
            <a href="#contact" className="btn btn-outline">Hubungi Saya</a>
          </div>
        </div>
        <div className="hero-lanyard-wrapper animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </div>
      </div>
      <div className="hero-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
    </section>
  );
};

export default Hero;
