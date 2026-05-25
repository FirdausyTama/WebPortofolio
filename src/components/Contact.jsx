import React, { useState } from 'react';
import './Contact.css';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/atama.firdausy@gmail.com", {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        alert(t('contact.alert.success'));
        e.target.reset();
      } else {
        alert(t('contact.alert.error'));
      }
    } catch (error) {
      alert(t('contact.alert.network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">{t('contact.title')} <span className="text-gradient">{t('contact.title_highlight')}</span></h2>
        <p className="section-subtitle">
          {t('contact.subtitle')}
        </p>

        <div className="contact-content">
          <div className="contact-info glass reveal">
            <h3>{t('contact.info.title')}</h3>
            <p>{t('contact.info.desc')}</p>
            <p style={{ marginTop: '1rem', fontWeight: '500' }}>
              {t('contact.info.direct_email').split('atama.firdausy@gmail.com')[0]}
              <a href="mailto:atama.firdausy@gmail.com" style={{ color: 'var(--accent-color)' }}>
                atama.firdausy@gmail.com
              </a>
            </p>
            <div className="social-links" style={{ marginTop: '1.5rem' }}>
              <a href="https://www.linkedin.com/in/firdausy-tama/" className="social-link">LinkedIn</a>
              <a href="https://github.com/firdausytama/" className="social-link">GitHub</a>
              <a href="https://www.instagram.com/firdausy_tamz/" className="social-link">Instagram</a>
            </div>
          </div>
          
          <form className="contact-form glass reveal" style={{ transitionDelay: '0.2s' }} onSubmit={handleSubmit}>
            {/* Konfigurasi FormSubmit */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            
            <div className="form-group">
              <label htmlFor="name">{t('contact.form.name')}</label>
              <input type="text" id="name" name="name" placeholder={t('contact.form.name_placeholder')} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact.form.email')}</label>
              <input type="email" id="email" name="email" placeholder={t('contact.form.email_placeholder')} required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">{t('contact.form.subject')}</label>
              <input type="text" id="subject" name="_subject" placeholder={t('contact.form.subject_placeholder')} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.form.message')}</label>
              <textarea id="message" name="message" rows="5" placeholder={t('contact.form.message_placeholder')} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>{t('footer.copyright')}</p>
      </div>
    </section>
  );
};

export default Contact;
