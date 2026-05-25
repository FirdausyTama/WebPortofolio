import React from 'react';
import './TechStack.css';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaReact, FaNodeJs, FaPython, FaFigma, FaBootstrap, FaGithub, FaPhp, FaLaravel, FaHtml5, FaCss3Alt 
} from 'react-icons/fa';
import { 
  SiJavascript, SiTailwindcss, SiTypescript, SiNextdotjs, SiExpress, SiMysql, SiVite
} from 'react-icons/si';

const techData = [
  { name: 'HTML5', icon: FaHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'ReactJS', icon: FaReact, color: '#61DAFB' },
  { name: 'Vite', icon: SiVite, color: '#646CFF' },
  { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
  { name: 'Bootstrap', icon: FaBootstrap, color: '#7952B3' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'PHP', icon: FaPhp, color: '#777BB4' },
  { name: 'Laravel', icon: FaLaravel, color: '#FF2D20' },
  { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  { name: 'Express.js', icon: SiExpress, color: '#FFFFFF' },
  { name: 'Git & GitHub', icon: FaGithub, color: '#FFFFFF' },
  { name: 'Figma', icon: FaFigma, color: '#F24E1E' },
];

const TechStack = () => {
  const { t } = useLanguage();

  return (
    <div className="tech-stack-container">
      <div className="tech-grid">
        {techData.map((tech, index) => (
          <div key={index} className="tech-card">
            <div className="tech-icon" style={{ color: tech.color }}>
              <tech.icon />
            </div>
            <span className="tech-name">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
