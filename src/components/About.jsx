import React, { useState, useEffect } from 'react';
import './About.css';
import fotoDiri from '../assets/fotodiri.png';
import { useLanguage } from '../context/LanguageContext';
import { GitHubCalendar } from 'react-github-calendar';

const About = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">{t('about.title')} <span className="">{t('about.title_highlight')}</span></h2>
        <p className="section-subtitle">{t('about.subtitle')}</p>
        
        <div className="about-content">
          <div className="about-image-wrapper reveal">
            <div className="about-image glass">
              <div className="corner-triangle">
                <div className="corner-triangle-text">
                  <span>Open</span>
                
                  <span>To Work!</span>
                </div>
              </div>
              <img src={fotoDiri} alt="Foto Profesional" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <div className="about-text glass reveal" style={{ transitionDelay: '0.2s' }}>
            <h3>{t('about.journey')}</h3>
            <p dangerouslySetInnerHTML={{ __html: t('about.p1') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('about.p2') }}></p>

            <div className="about-education" style={{ marginTop: '2.5rem' }}>
              <h3>{t('about.education')}</h3>
              <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{t('about.edu.university')}</li>
                <li style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{t('about.edu.major')}</li>
                <li style={{ color: 'var(--text-secondary)' }}>{t('about.edu.year')}</li>
              </ul>

              <a href="/cv_atama_firdausy.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {t('about.download_cv')}
              </a>
            </div>
          </div>
        </div>

        <div className="github-calendar-wrapper glass reveal">
          <h3 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>GitHub Contributions</h3>
          <div className="github-calendar-scroll" style={isMobile ? { minWidth: 'unset', width: '100%', padding: '0 0.5rem' } : {}}>
            <GitHubCalendar 
              username="firdausytama" 
              colorScheme="dark"
              blockSize={isMobile ? 5 : 15}
              blockMargin={isMobile ? 1 : 5}
              fontSize={isMobile ? 10 : 14}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
