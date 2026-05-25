import React from 'react';
import Lanyard from './Lanyard';
import LightRays from './LightRays';
import './Hero.css';
import { useLanguage } from '../context/LanguageContext';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content animate-fade-up">
          <p className="greeting" style={{ minHeight: '30px' }}>
            {t('hero.greeting.prefix')}
            <TypeAnimation
              key={language} // Forces re-render on language change
              sequence={[
                'Atama Cahya',
                2000,
                t('hero.tag.open'),
                2000,
                t('hero.tag.dev'),
                2000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}
            />
          </p>
          <h1 className="hero-title">
            {t('hero.title_1')}<br />
            <span className="text-rgb">{t('hero.title_2')}</span>
          </h1>
          <div className="hero-tags">
            <span className="hero-tag highlight-tag">{t('hero.tag.open')}</span>
            <span className="hero-tag">{t('hero.tag.dev')}</span>
          </div>
        </div>
        <div className="hero-lanyard-wrapper animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </div>
        <div className="hero-scroll-indicator">
          {t('hero.scroll')}
        </div>
      </div>
      <div className="hero-background">
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#00d2ff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
    </section>
  );
};

export default Hero;
