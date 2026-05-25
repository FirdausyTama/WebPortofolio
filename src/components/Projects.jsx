import React from 'react';
import './Projects.css';
import fitnesGymImg from '../assets/fitnesgym.png';
import genzDriveImg from '../assets/genzdrive.png';

const projectsData = [
  {
    id: 1,
    title: 'Fitness Gym Jogja',
    category: 'Website Profil',
    description: 'Website profil modern dan layanan untuk pusat kebugaran Fitness Gym Jogja.',
    tech: ['React', 'Tailwind CSS', 'Vercel'],
    link: 'https://fitnesgymjogja.vercel.app/',
    image: fitnesGymImg
  },
  {
    id: 2,
    title: 'GenZ Drive',
    category: 'Aplikasi Penyimpanan',
    description: 'Aplikasi manajemen file dan penyimpanan cloud dengan antarmuka modern yang interaktif.',
    tech: ['React', 'Node.js', 'Vercel'],
    link: 'https://genzdrive.vercel.app/',
    image: genzDriveImg
  },
  {
    id: 3,
    title: 'Nara Stream',
    category: 'Platform Streaming',
    description: 'Platform streaming konten digital dengan fitur pencarian dan antarmuka pengguna yang responsif.',
    tech: ['React', 'API', 'Tailwind'],
    link: 'https://narastream.vercel.app/'
  }
];

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Karya <span className="text-gradient">Pilihan</span></h2>
        <p className="section-subtitle">Berikut adalah beberapa proyek yang baru saja saya kerjakan.</p>
        
        <div className="projects-grid">
          {projectsData.map((project, index) => (
            <div key={project.id} className="project-card glass reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
              {project.image ? (
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                </div>
              ) : (
                <div className="project-image-placeholder"></div>
              )}
              <div className="project-info">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((t, index) => (
                    <span key={index} className="tech-tag">{t}</span>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">Lihat Proyek &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
