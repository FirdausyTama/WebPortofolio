import React, { useState, useEffect } from 'react';
import './Projects.css';
import fitnesGymImg from '../assets/fitnesgym.png';
import genzDriveImg from '../assets/genzdrive.png';
import randImg from '../assets/rand.png';
import { useLanguage } from '../context/LanguageContext';

const projectsData = [
  {
    id: 1,
    category: 'Website Profil',
    tech: ['Laravel', 'Tailwind CSS', 'Vercel'],
    link: 'https://fitnesgymjogja.vercel.app/',
    image: fitnesGymImg
  },
  {
    id: 2,
    category: 'Website Profil',
    tech: ['React', 'Node.js', 'Vercel'],
    link: 'https://genzdrive.vercel.app/',
    image: genzDriveImg
  },
  {
    id: 3,
    category: 'Manajemen Gudang',
    tech: ['Laravel', 'MySQL', 'Bootstrap'],
    link: '',
    image: randImg
  },
  {
    id: 4,
    category: 'Website Toko Online',
    tech: ['Next.js', 'Stripe', 'Tailwind'],
    link: '#',
    image: null
  },
  {
    id: 5,
    category: 'Aplikasi Internal',
    tech: ['React Native', 'Firebase', 'Node.js'],
    link: '#',
    image: null
  },
  {
    id: 6,
    category: 'Aplikasi Analitik',
    tech: ['Vue.js', 'Chart.js', 'Express'],
    link: '#',
    image: null
  }
];

const Projects = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const elements = document.querySelectorAll('.projects-grid .reveal:not(.active)');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleCount]);

  const handleSeeMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, projectsData.length));
  };

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{t('projects.title')} <span className="text-gradient">{t('projects.title_highlight')}</span></h2>
        <p className="section-subtitle">{t('projects.subtitle')}</p>
        
        <div className="projects-grid">
          {projectsData.slice(0, visibleCount).map((project, index) => (
            <div key={project.id} className="project-card glass reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
              {project.image ? (
                <div className="project-image-wrapper">
                  <img src={project.image} alt={t(`projects.p${project.id}.title`)} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                </div>
              ) : (
                <div className="project-image-placeholder"></div>
              )}
              <div className="project-info">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{t(`projects.p${project.id}.title`)}</h3>
                <p className="project-desc">{t(`projects.p${project.id}.desc`)}</p>
                <div className="project-tech">
                  {project.tech.map((t_tech, index) => (
                    <span key={index} className="tech-tag">{t_tech}</span>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">Lihat Proyek &rarr;</a>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < projectsData.length && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-outline" onClick={handleSeeMore}>
              {t('projects.see_more')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
