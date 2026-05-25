import React, { useState } from 'react';
import './Certificates.css';
import bnspImg from '../assets/sertifikatbnsp.png';
import alibabaImg from '../assets/alibaba_clouds.png';
import { useLanguage } from '../context/LanguageContext';

const certificatesData = [
  {
    id: 1,
    date: '2026',
    duration: '2026 - 2029',
    image: bnspImg
  },
  {
    id: 2,
    date: '2024',
    duration: '2026',
    image: alibabaImg
  },
  {
    id: 3,
    date: 'Masih Berlangsung',
    duration: '-',
    image: null
  }
];

const Certificates = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useLanguage();

  const openModal = (image) => {
    if (image) {
      setSelectedImage(image);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="certificates-content">
      <div className="cert-grid">
        {certificatesData.map((cert, index) => (
          <div 
            key={cert.id} 
            className={`cert-card glass ${cert.image ? 'clickable' : ''}`} 
            style={{ transitionDelay: `${index * 0.1}s` }}
            onClick={() => openModal(cert.image)}
          >
            <div className="cert-image-container">
              {cert.image ? (
                <img src={cert.image} alt={t(`cert.${cert.id}.title`)} className="cert-image" />
              ) : (
                <div className="cert-image-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>{t('cert.no_photo')}</span>
                </div>
              )}
            </div>
            
            <div className="cert-info">
              <span className="cert-issuer">{t(`cert.${cert.id}.issuer`)}</span>
              <h3 className="cert-title">{t(`cert.${cert.id}.title`)}</h3>
              <p className="cert-description">{t(`cert.${cert.id}.desc`)}</p>
              
              <div className="cert-meta">
                <span className="cert-date">{t('cert.issued')} {cert.date}</span>
                <span className="cert-duration">{t('cert.valid')} {cert.duration === 'Selamanya' ? t('cert.forever') : cert.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="cert-modal" onClick={closeModal}>
          <div className="cert-modal-content" onClick={e => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={closeModal}>&times;</button>
            <img src={selectedImage} alt="Sertifikat Detail" className="cert-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
