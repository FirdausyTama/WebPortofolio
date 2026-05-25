import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        alert("Pesan berhasil dikirim!");
        e.target.reset();
      } else {
        alert("Maaf, terjadi kesalahan saat mengirim pesan.");
      }
    } catch (error) {
      alert("Maaf, terjadi kesalahan pada jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Mari <span className="text-gradient">Terhubung</span></h2>
        <p className="section-subtitle">
          Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang untuk menjadi bagian dari visi Anda.
        </p>

        <div className="contact-content">
          <div className="contact-info glass reveal">
            <h3>Hubungi Saya</h3>
            <p>Silakan kirimkan email melalui formulir di samping, atau hubungi saya melalui media sosial di bawah ini.</p>
            <div className="social-links">
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">GitHub</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
          
          <form className="contact-form glass reveal" style={{ transitionDelay: '0.2s' }} onSubmit={handleSubmit}>
            {/* Konfigurasi FormSubmit */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            
            <div className="form-group">
              <label htmlFor="name">Nama</label>
              <input type="text" id="name" name="name" placeholder="Masukkan nama Anda" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Masukkan email Anda" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subjek</label>
              <input type="text" id="subject" name="_subject" placeholder="Masukkan subjek pesan" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Pesan</label>
              <textarea id="message" name="message" rows="5" placeholder="Tulis pesan Anda di sini..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>&copy; 2026 Hak Cipta Dilindungi.</p>
      </div>
    </section>
  );
};

export default Contact;
