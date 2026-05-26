import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ID: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'Tentang',
    'nav.projects': 'Projek',
    'nav.certificates': 'Sertifikat',
    'nav.techstack': 'Tech Stack',
    'nav.contact': 'Kontak',

    // Showcase
    'showcase.title': 'Portfolio',
    'showcase.title_highlight': 'Showcase',
    'showcase.subtitle': 'Jelajahi perjalanan saya melalui projek, sertifikasi, dan keahlian teknis.',
    'showcase.tab.projects': 'Projek',
    'showcase.tab.certificates': 'Sertifikat',
    'showcase.tab.techstack': 'Tech Stack',

    // Hero
    'hero.greeting.prefix': 'Hello, I Am ',
    'hero.title_1': 'Vibe Code Is My',
    'hero.title_2': 'Life Style',
    'hero.tag.skills': 'Keahlian Utama',
    'hero.tag.dev': 'Web Developer',
    'hero.tag.open': 'Open to Work!',
    'hero.scroll': '^ Gulir ke Atas ^',

    // About
    'about.title': 'Tentang',
    'about.title_highlight': 'Saya',
    'about.subtitle': 'Perkenalan singkat tentang siapa saya dan apa yang saya lakukan.',
    'about.journey': 'Perjalanan Saya',
    'about.p1': 'Nama saya Atama Cahya El-firdausy, seorang mahasiswa semester akhir di jurusan Teknologi Informasi, Universitas Muhammadiyah Yogyakarta. Saya sekarang masih berada di kota <strong>Yogyakarta</strong>',
    'about.p2': 'Ketika saya tidak sedang ngoding, saya suka mengeksplorasi teknologi baru, berkontribusi pada open-source, atau mengasah kemampuan desain saya.',
    'about.education': 'Pendidikan',
    'about.edu.university': 'Universitas Muhammadiyah Yogyakarta',
    'about.edu.year': 'Tahun Lulus: 2026',
    'about.edu.major': 'Jurusan: Teknologi Informasi',
    'about.download_cv': 'CV BELUM UPDATE',
    'about.tech_stack': 'Tech Stack',

    // Projects
    'projects.title': 'Projek',
    'projects.title_highlight': 'Saya',
    'projects.subtitle': 'Karya-karya terbaik yang pernah saya bangun dan kembangkan.',
    'projects.see_more': 'Lihat Lebih Banyak',
    'projects.p1.title': 'Aplikasi Fitness Gym',
    'projects.p1.desc': 'Aplikasi manajemen fitness yang komprehensif, memungkinkan pengguna melacak latihan harian, mengatur jadwal kelas, dan memonitor asupan nutrisi.',
    'projects.p2.title': 'GenzDrive App',
    'projects.p2.desc': 'Platform berbagi dokumen yang aman berbasis cloud dengan fitur kolaborasi real-time dan manajemen hak akses yang detail.',
    'projects.p3.title': 'PT. RAND Dashboard',
    'projects.p3.desc': 'Dashboard analitik interaktif untuk memonitor KPI perusahaan, tren penjualan, dan efisiensi operasional dengan visualisasi data real-time.',
    'projects.p4.title': 'Sistem E-Learning',
    'projects.p4.desc': 'Platform pembelajaran digital terintegrasi untuk institusi pendidikan, dilengkapi dengan modul tugas, ujian online, dan laporan progres siswa.',
    'projects.p5.title': 'Toko Online Fashion',
    'projects.p5.desc': 'Aplikasi e-commerce modern dengan pengalaman pengguna yang mulus, integrasi gateway pembayaran, dan manajemen keranjang belanja.',
    'projects.p6.title': 'Sistem Manajemen Inventaris',
    'projects.p6.desc': 'Solusi pelacakan stok barang waktu nyata untuk ritel menengah, menampilkan pemindaian barcode dan notifikasi stok rendah.',

    // Certificates
    'cert.title': 'Sertifikat',
    'cert.title_highlight': 'Penghargaan',
    'cert.subtitle': 'Beberapa sertifikasi dan pencapaian profesional yang memvalidasi keahlian saya.',
    'cert.no_photo': 'Tidak ada pratinjau foto',
    'cert.issued': 'Diterbitkan:',
    'cert.valid': 'Masa Berlaku:',
    'cert.forever': 'Selamanya',

    'cert.1.title': 'Junior Web Developer',
    'cert.1.issuer': 'Badan Nasional Sertifikasi Profesi (BNSP)',
    'cert.1.desc': 'Sertifikasi kompetensi resmi dari BNSP untuk profesi Junior Web Developer, memvalidasi kemampuan dalam membangun dan memelihara aplikasi web.',

    'cert.2.title': 'Alibaba Cloud Certified Developers',
    'cert.2.issuer': 'Alibaba Cloud',
    'cert.2.desc': 'Sertifikasi profesional dari Alibaba Cloud yang memvalidasi keahlian dalam menggunakan layanan komputasi awan untuk pengembangan aplikasi.',

    'cert.3.title': 'Internasional Softwere Developer',
    'cert.3.issuer': 'Certiport',
    'cert.3.desc': 'Pelatihan di bidang rekayasa perangkat lunak modern, termasuk metodologi Agile, arsitektur sistem, dan pengembangan aplikasi yang skalabel.',

    // Contact
    'contact.title': 'Hubungi',
    'contact.title_highlight': 'Saya',
    'contact.subtitle': 'Punya pertanyaan? Kirimi saya pesan, dan saya akan segera membalasnya.',
    'contact.info.title': 'Hubungi',
    'contact.info.desc': 'Ada yang ingin didiskusikan? Kirim saya pesan dan mari kita bicara.',
    'contact.info.direct_email': 'Atau hubungi langsung melalui email: atama.firdausy@gmail.com',
    'contact.form.name': 'Nama',
    'contact.form.name_placeholder': 'Nama Anda',
    'contact.form.email': 'Email',
    'contact.form.email_placeholder': 'Email Anda',
    'contact.form.subject': 'Subjek',
    'contact.form.subject_placeholder': 'Pesan Anda',
    'contact.form.message': 'Pesan',
    'contact.form.message_placeholder': 'Pesan Anda',
    'contact.form.submit': 'Kirim Pesan',
    'contact.form.sending': 'Mengirim...',
    'contact.alert.success': 'Pesan berhasil dikirim!',
    'contact.alert.error': 'Maaf, terjadi kesalahan saat mengirim pesan.',
    'contact.alert.network': 'Maaf, terjadi kesalahan pada jaringan.',

    // Comments Guestbook
    'comments.title': 'Komentar',
    'comments.label.name': 'Nama',
    'comments.placeholder.name': 'Nama Anda',
    'comments.label.message': 'Pesan',
    'comments.placeholder.message': 'Tulis komentar Anda di sini...',
    'comments.button.post': 'Kirim Komentar',
    'comments.tag.pinned': 'KOMENTAR TERSEMAT',

    // Footer
    'footer.copyright': '© 2026 Hak Cipta Dilindungi.',
  },
  EN: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.certificates': 'Certificates',
    'nav.techstack': 'Tech Stack',
    'nav.contact': 'Contact',

    // Showcase
    'showcase.title': 'Portfolio',
    'showcase.title_highlight': 'Showcase',
    'showcase.subtitle': 'Explore my journey through projects, certifications, and technical expertise.',
    'showcase.tab.projects': 'Projects',
    'showcase.tab.certificates': 'Certificates',
    'showcase.tab.techstack': 'Tech Stack',

    // Hero
    'hero.greeting.prefix': 'Hello, I am ',
    'hero.title_1': 'Vibe Code Is My',
    'hero.title_2': 'Life Style',
    'hero.tag.skills': 'Core Skills',
    'hero.tag.dev': 'Web Developer',
    'hero.tag.open': 'Open to Work!',
    'hero.scroll': '^ Scroll Up ^',

    // About
    'about.title': 'About',
    'about.title_highlight': 'Me',
    'about.subtitle': 'A brief introduction about who I am and what I do.',
    'about.journey': 'My Journey',
    'about.p1': 'My name is Atama Cahya El-firdausy, a final semester student majoring in Information Technology at Muhammadiyah University of Yogyakarta. I am currently still in the city of <strong>Yogyakarta</strong>',
    'about.p2': 'When I am not coding, I enjoy exploring new technologies, contributing to open-source, or sharpening my design skills.',
    'about.education': 'Education',
    'about.edu.university': 'Universitas Muhammadiyah Yogyakarta',
    'about.edu.year': 'Graduation Year: 2026',
    'about.edu.major': 'Major: Information Technology',
    'about.download_cv': 'CV NOT UPDATED',
    'about.tech_stack': 'Tech Stack',

    // Projects
    'projects.title': 'My',
    'projects.title_highlight': 'Projects',
    'projects.subtitle': 'The best works I have ever built and developed.',
    'projects.see_more': 'See More',
    'projects.p1.title': 'Fitness Gym App',
    'projects.p1.desc': 'A comprehensive fitness management application, allowing users to track daily workouts, manage class schedules, and monitor nutritional intake.',
    'projects.p2.title': 'GenzDrive App',
    'projects.p2.desc': 'A secure cloud-based document sharing platform with real-time collaboration features and detailed access rights management.',
    'projects.p3.title': 'PT. RAND Dashboard',
    'projects.p3.desc': 'An interactive analytics dashboard to monitor company KPIs, sales trends, and operational efficiency with real-time data visualization.',
    'projects.p4.title': 'E-Learning System',
    'projects.p4.desc': 'An integrated digital learning platform for educational institutions, equipped with assignment modules, online exams, and student progress reports.',
    'projects.p5.title': 'Fashion Online Store',
    'projects.p5.desc': 'A modern e-commerce application with seamless user experience, payment gateway integration, and shopping cart management.',
    'projects.p6.title': 'Inventory Management System',
    'projects.p6.desc': 'A real-time stock tracking solution for medium-sized retail, featuring barcode scanning and low stock notifications.',

    // Certificates
    'cert.title': 'Awards &',
    'cert.title_highlight': 'Certificates',
    'cert.subtitle': 'Some professional certifications and achievements that validate my expertise.',
    'cert.no_photo': 'No photo preview available',
    'cert.issued': 'Issued:',
    'cert.valid': 'Valid:',
    'cert.forever': 'Lifetime',

    'cert.1.title': 'Junior Web Developer',
    'cert.1.issuer': 'National Professional Certification Agency (BNSP)',
    'cert.1.desc': 'Official competency certification from BNSP for the Junior Web Developer profession, validating skills in building and maintaining web applications.',

    'cert.2.title': 'Alibaba Cloud Certified Developers',
    'cert.2.issuer': 'Alibaba Cloud',
    'cert.2.desc': 'Professional certification from Alibaba Cloud validating expertise in using cloud computing services for application development.',

    'cert.3.title': 'International Software Development',
    'cert.3.issuer': 'Certiport',
    'cert.3.desc': 'Training in modern software engineering, including Agile methodologies, system architecture, and scalable application development.',

    // Contact
    'contact.title': 'Contact',
    'contact.title_highlight': 'Me',
    'contact.subtitle': 'Have a question? Send me a message, and I will reply as soon as possible.',
    'contact.info.title': 'Contact',
    'contact.info.desc': 'Have something to discuss? Send me a message and let\'s talk.',
    'contact.info.direct_email': 'Or contact directly via email: atama.firdausy@gmail.com',
    'contact.form.name': 'Name',
    'contact.form.name_placeholder': 'Your Name',
    'contact.form.email': 'Email',
    'contact.form.email_placeholder': 'Your Email',
    'contact.form.subject': 'Subject',
    'contact.form.subject_placeholder': 'Your Message',
    'contact.form.message': 'Message',
    'contact.form.message_placeholder': 'Your Message',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.alert.success': 'Message sent successfully!',
    'contact.alert.error': 'Sorry, an error occurred while sending the message.',
    'contact.alert.network': 'Sorry, a network error occurred.',

    // Comments Guestbook
    'comments.title': 'Comments',
    'comments.label.name': 'Name',
    'comments.placeholder.name': 'Enter your name',
    'comments.label.message': 'Message',
    'comments.placeholder.message': 'Write your message here...',
    'comments.button.post': 'Post Comment',
    'comments.tag.pinned': 'PINNED COMMENT',

    // Footer
    'footer.copyright': '© 2026 All Rights Reserved.',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Optionally read from localStorage here
    const saved = localStorage.getItem('app_lang');
    return saved || 'ID';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
