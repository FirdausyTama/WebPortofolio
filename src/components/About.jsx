import React from 'react';
import './About.css';
import fotoDiri from '../assets/fotodiri.png';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">Tentang <span className="text-gradient">Saya</span></h2>
        <p className="section-subtitle">Perkenalan singkat tentang siapa saya dan apa yang saya lakukan.</p>
        
        <div className="about-content">
          <div className="about-image-wrapper reveal">
            <div className="about-image glass">
              <img src={fotoDiri} alt="Foto Profesional" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <div className="about-text glass reveal" style={{ transitionDelay: '0.2s' }}>
            <h3>Perjalanan Saya</h3>
            <p>
              Saya adalah pengembang yang bersemangat dengan perhatian pada detail desain. Selama beberapa tahun terakhir, saya 
              telah beralih dari membuat skrip dasar menjadi membangun aplikasi web skala penuh yang sangat interaktif. 
              Tujuan saya adalah menjembatani jarak antara estetika dan fungsionalitas.
            </p>
            <p>
              Ketika saya tidak sedang mengode, saya suka mengeksplorasi teknologi baru, berkontribusi pada *open-source*, atau mengasah kemampuan desain saya.
            </p>
            <div className="skills">
              <span className="skill-tag">React</span>
              <span className="skill-tag">JavaScript (ES6+)</span>
              <span className="skill-tag">CSS3 & HTML5</span>
              <span className="skill-tag">UI/UX Design</span>
              <span className="skill-tag">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
