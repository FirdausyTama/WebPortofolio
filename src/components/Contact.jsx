import React, { useState } from 'react';
import './Contact.css';
import { useLanguage } from '../context/LanguageContext';
import Comments from './Comments';
import { FaLinkedin, FaGithub, FaInstagram, FaUser, FaEnvelope, FaPaperPlane, FaShareAlt, FaRegComment } from 'react-icons/fa';

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
        <h2 className="section-title reveal">
          {t('contact.title')} <span className="text-gradient">{t('contact.title_highlight')}</span>
        </h2>
        <p className="section-subtitle reveal">
          {t('contact.subtitle')}
        </p>

        <div className="contact-content">
          {/* Left Column: Contact Form (Simplified Mockup Style) */}
          <div className="contact-card-left glass reveal">
            <div className="contact-card-header-row">
              <h3 className="contact-form-title">{t('contact.info.title')}</h3>
              <FaShareAlt className="contact-share-icon" />
            </div>
            
            <p className="contact-card-desc">{t('contact.info.desc')}</p>

            <form className="contact-form-inner" onSubmit={handleSubmit}>
              {/* Konfigurasi FormSubmit */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              
              <div className="form-group-with-icon">
                <FaUser className="input-field-icon" />
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder={t('contact.form.name_placeholder')} 
                  required 
                  className="contact-card-input"
                />
              </div>
              
              <div className="form-group-with-icon">
                <FaEnvelope className="input-field-icon" />
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder={t('contact.form.email_placeholder')} 
                  required 
                  className="contact-card-input"
                />
              </div>
              
              <div className="form-group-with-icon">
                <FaRegComment className="input-field-icon message-icon" />
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  placeholder={t('contact.form.message_placeholder')} 
                  required 
                  className="contact-card-textarea"
                ></textarea>
              </div>
              
              <button type="submit" className="comments-card-submit-btn btn-submit-message" disabled={isSubmitting}>
                <FaPaperPlane className="comments-submit-icon" />
                {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
              </button>
            </form>

            {/* Connect With Me Divider */}
            <div className="connect-divider">
              <span className="connect-divider-line"></span>
              <span className="connect-divider-text">Connect With Me</span>
              <span className="connect-divider-line"></span>
            </div>

            {/* Premium Social Media Card Layout */}
            <div className="connect-cards-container">
              {/* LinkedIn: Full Width */}
              <a href="https://www.instagram.com/firdausy_tamz/" target="_blank" rel="noopener noreferrer" className="connect-social-card side-box instagram-box">
                  <div className="social-box-icon instagram-brand">
                    <FaInstagram />
                  </div>
                  <div className="social-box-text">
                    <span className="social-box-title">Instagram</span>
                    <span className="social-box-subtitle">@firdausy_tamz</span>
                  </div>
                </a>
              

              {/* Instagram & GitHub: Side by Side */}
              <div className="connect-social-row">
                <a href="https://www.linkedin.com/in/firdausy-tama/" target="_blank" rel="noopener noreferrer" className="connect-social-card linkedin-box">
                <div className="social-box-icon linkedin-brand">
                  <FaLinkedin />
                </div>
                <div className="social-box-text">
                  <span className="social-box-title">Let's Connect</span>
                  <span className="social-box-subtitle">on LinkedIn</span>
                </div>
                </a>

                <a href="https://github.com/firdausytama/" target="_blank" rel="noopener noreferrer" className="connect-social-card side-box github-box">
                  <div className="social-box-icon github-brand">
                    <FaGithub />
                  </div>
                  <div className="social-box-text">
                    <span className="social-box-title">GitHub</span>
                    <span className="social-box-subtitle">@firdausytama</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Comments Guestbook */}
          <div className="reveal" style={{ transitionDelay: '0.15s', width: '100%' }}>
            <Comments />
          </div>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>{t('footer.copyright')}</p>
      </div>
    </section>
  );
};

export default Contact;
