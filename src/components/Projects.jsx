import React, { useState, useEffect } from 'react';
import './Projects.css';
import fitnesGymImg from '../assets/fitnesgym.png';
import genzDriveImg from '../assets/genzdrive.png';
import randImg from '../assets/rand.png';
import { useLanguage } from '../context/LanguageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const projectsData = [];

const Projects = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [dbProjects, setDbProjects] = useState([]);
  const { language, t } = useLanguage();
  const isID = language === 'ID';

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) {
          const mapped = data.map(p => ({
            id: p.id,
            isDbItem: true,
            title_id: p.title_id,
            title_en: p.title_en,
            desc_id: p.desc_id,
            desc_en: p.desc_en,
            category_id: p.category_id,
            category_en: p.category_en,
            tech: p.tech || [],
            link: p.link || '#',
            image_url: p.image_url
          }));
          setDbProjects(mapped);
        }
      } catch (err) {
        console.error('Error fetching projects from Supabase:', err);
      }
    }
  };

  useEffect(() => {
    fetchProjects();

    if (!isSupabaseConfigured) return;

    // Realtime Database synchronization
    const channel = supabase
      .channel('realtime:portfolio_projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleProjectsUpdate = () => {
      fetchProjects();
    };
    window.addEventListener('portfolio_projects_updated', handleProjectsUpdate);
    return () => window.removeEventListener('portfolio_projects_updated', handleProjectsUpdate);
  }, []);

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
  }, [visibleCount, dbProjects]);

  const activeProjects = dbProjects.length > 0 ? dbProjects : projectsData;

  const handleSeeMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, activeProjects.length));
  };

  // Helper to map image URL (local assets or web link)
  const getProjectImage = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      return imgUrl;
    }
    const key = imgUrl.toLowerCase().trim();
    if (key.includes('fitnes') || key.includes('gym')) return fitnesGymImg;
    if (key.includes('genz') || key.includes('drive')) return genzDriveImg;
    if (key.includes('rand') || key.includes('dashboard')) return randImg;
    return null;
  };

  const getProjectField = (project, field) => {
    if (project.isDbItem) {
      if (field === 'title') return isID ? project.title_id : project.title_en;
      if (field === 'desc') return isID ? project.desc_id : project.desc_en;
      if (field === 'category') return isID ? project.category_id : project.category_en;
    } else {
      if (field === 'title') return t(`projects.p${project.id}.title`);
      if (field === 'desc') return t(`projects.p${project.id}.desc`);
      if (field === 'category') return project.category;
    }
    return '';
  };

  return (
    <div className="projects-content">
      <div className="projects-grid">
        {activeProjects.slice(0, visibleCount).map((project, index) => {
          const projectImg = project.isDbItem ? getProjectImage(project.image_url) : project.image;
          const projectTitle = getProjectField(project, 'title');

          return (
            <div key={project.id} className="project-card glass reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
              {projectImg ? (
                <div className="project-image-wrapper">
                  <img src={projectImg} alt={projectTitle} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                </div>
              ) : (
                <div className="project-image-placeholder"></div>
              )}
              <div className="project-info">
                <span className="project-category">{getProjectField(project, 'category')}</span>
                <h3 className="project-title">{projectTitle}</h3>
                <p className="project-desc">{getProjectField(project, 'desc')}</p>
                <div className="project-tech">
                  {project.tech.map((t_tech, idx) => (
                    <span key={idx} className="tech-tag">{t_tech}</span>
                  ))}
                </div>
                {project.link && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    {isID ? 'Lihat Proyek' : 'View Project'} &rarr;
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < activeProjects.length && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn btn-outline" onClick={handleSeeMore}>
            {t('projects.see_more')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
