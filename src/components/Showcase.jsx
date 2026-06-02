import React, { useState, useEffect } from 'react';
import './Showcase.css';
import Projects from './Projects';
import Certificates from './Certificates';
import TechStack from './TechStack';
import { useLanguage } from '../context/LanguageContext';

const Showcase = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const { t } = useLanguage();

  useEffect(() => {
    // Listen for custom event from Navbar
    const handleTabChange = (e) => {
      if (e.detail && ['projects', 'certificates', 'techstack'].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('changeShowcaseTab', handleTabChange);
    return () => window.removeEventListener('changeShowcaseTab', handleTabChange);
  }, []);

  return (
    <section id="showcase" className="showcase">
      <div className="container">
        <div className="showcase-header reveal">
          <h2 className="section-title">{t('showcase.title')} <span className="">{t('showcase.title_highlight')}</span></h2>
          <p className="section-subtitle">{t('showcase.subtitle')}</p>
        </div>

        <div className="showcase-tabs reveal" style={{ transitionDelay: '0.1s' }}>
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            {t('showcase.tab.projects')}
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="m8.21 13.89-3 4 2.54-1.27L6 21l4.89-2.45"></path><path d="m15.79 13.89 3 4-2.54-1.27L20 21l-4.89-2.45"></path></svg>
            {t('showcase.tab.certificates')}
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'techstack' ? 'active' : ''}`}
            onClick={() => setActiveTab('techstack')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            {t('showcase.tab.techstack')}
          </button>
        </div>

        <div className="showcase-content">
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'certificates' && <Certificates />}
          {activeTab === 'techstack' && <TechStack />}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
