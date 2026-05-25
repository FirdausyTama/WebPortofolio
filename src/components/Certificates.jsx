import React from 'react';
import './Certificates.css';

const certificatesData = [
  {
    id: 1,
    title: 'Frontend Web Development',
    issuer: 'Dicoding Indonesia',
    date: '2025'
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    issuer: 'Coursera',
    date: '2024'
  },
  {
    id: 3,
    title: 'Advanced React Patterns',
    issuer: 'Frontend Masters',
    date: '2025'
  }
];

const Certificates = () => {
  return (
    <section id="sertifikat" className="certificates">
      <div className="container">
        <h2 className="section-title">Sertifikat <span className="text-gradient">Penghargaan</span></h2>
        <p className="section-subtitle">Beberapa sertifikasi dan penghargaan yang pernah saya raih.</p>
        
        <div className="cert-grid">
          {certificatesData.map((cert, index) => (
            <div key={cert.id} className="cert-card glass reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="cert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15l-2 5l9-9l-9-9l2 5z" opacity="0.5"/>
                  <circle cx="12" cy="12" r="8"></circle>
                  <path d="M12 8v4l3 3"></path>
                </svg>
              </div>
              <div className="cert-info">
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <span className="cert-date">{cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
