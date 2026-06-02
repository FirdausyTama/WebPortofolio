import React, { useState, useEffect } from 'react';
import './Certificates.css';
import bnspImg from '../assets/sertifikatbnsp.png';
import alibabaImg from '../assets/alibaba_clouds.png';
import { useLanguage } from '../context/LanguageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const certificatesData = [];

const Certificates = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [dbCertificates, setDbCertificates] = useState([]);
  const { language, t } = useLanguage();
  const isID = language === 'ID';

  // Fetch certificates from Supabase
  const fetchCertificates = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_certificates')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) {
          const mapped = data.map(c => ({
            id: c.id,
            isDbItem: true,
            title_id: c.title_id,
            title_en: c.title_en,
            issuer_id: c.issuer_id,
            issuer_en: c.issuer_en,
            desc_id: c.desc_id,
            desc_en: c.desc_en,
            date: c.issue_date,
            duration: c.duration || 'Selamanya',
            image_url: c.image_url
          }));
          setDbCertificates(mapped);
        }
      } catch (err) {
        console.error('Error fetching certificates from Supabase:', err);
      }
    }
  };

  useEffect(() => {
    fetchCertificates();

    if (!isSupabaseConfigured) return;

    // Realtime Database synchronization
    const channel = supabase
      .channel('realtime:portfolio_certificates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_certificates' }, () => {
        fetchCertificates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleCertificatesUpdate = () => {
      fetchCertificates();
    };
    window.addEventListener('portfolio_certificates_updated', handleCertificatesUpdate);
    return () => window.removeEventListener('portfolio_certificates_updated', handleCertificatesUpdate);
  }, []);

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

  const activeCertificates = dbCertificates.length > 0 ? dbCertificates : certificatesData;

  // Helper to map image URL (local assets or web link)
  const getCertImage = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      return imgUrl;
    }
    const key = imgUrl.toLowerCase().trim();
    if (key.includes('bnsp') || key.includes('kompetensi')) return bnspImg;
    if (key.includes('alibaba') || key.includes('cloud')) return alibabaImg;
    return null;
  };

  const getCertField = (cert, field) => {
    if (cert.isDbItem) {
      if (field === 'title') return isID ? cert.title_id : cert.title_en;
      if (field === 'issuer') return isID ? cert.issuer_id : cert.issuer_en;
      if (field === 'desc') return isID ? cert.desc_id : cert.desc_en;
    } else {
      if (field === 'title') return t(`cert.${cert.id}.title`);
      if (field === 'issuer') return t(`cert.${cert.id}.issuer`);
      if (field === 'desc') return t(`cert.${cert.id}.desc`);
    }
    return '';
  };

  return (
    <div className="certificates-content">
      <div className="cert-grid">
        {activeCertificates.map((cert, index) => {
          const certImg = cert.isDbItem ? getCertImage(cert.image_url) : cert.image;
          const certTitle = getCertField(cert, 'title');

          return (
            <div 
              key={cert.id} 
              className={`cert-card glass ${certImg ? 'clickable' : ''}`} 
              style={{ transitionDelay: `${index * 0.1}s` }}
              onClick={() => openModal(certImg)}
            >
              <div className="cert-image-container">
                {certImg ? (
                  <img src={certImg} alt={certTitle} className="cert-image" />
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
                <span className="cert-issuer">{getCertField(cert, 'issuer')}</span>
                <h3 className="cert-title">{certTitle}</h3>
                <p className="cert-description">{getCertField(cert, 'desc')}</p>
                
                <div className="cert-meta">
                  <span className="cert-date">{t('cert.issued')} {cert.date}</span>
                  <span className="cert-duration">{t('cert.valid')} {cert.duration === 'Selamanya' ? t('cert.forever') : cert.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
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
