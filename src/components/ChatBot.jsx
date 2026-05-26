import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaRobot, FaPaperPlane, FaTimes, FaTrashAlt, FaUser, FaExternalLinkAlt, FaComments 
} from 'react-icons/fa';

const ChatBot = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize welcome message when language changes or on mount
  useEffect(() => {
    const isID = language === 'ID';
    const welcomeMsg = isID 
      ? "Halo! Saya **Atama AI Assistant** 🤖. Ada yang bisa saya bantu tentang perjalanan karir, keahlian, proyek, atau kontak Atama Cahya?"
      : "Hello! I am **Atama AI Assistant** 🤖. How can I help you regarding Atama Cahya's career journey, skills, projects, or contact info?";
    
    setMessages([
      { id: 1, text: welcomeMsg, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [language]);

  // Scroll to bottom when messages list or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Quick Suggestions
  const getSuggestions = () => {
    const isID = language === 'ID';
    return isID ? [
      { text: "👤 Siapa Atama?", value: "siapa_atama" },
      { text: "🛠️ Keahlian", value: "keahlian" },
      { text: "🚀 Projek", value: "proyek" },
      { text: "🏆 Sertifikat", value: "sertifikat" },
      { text: "📞 Kontak", value: "kontak" }
    ] : [
      { text: "👤 Who is Atama?", value: "who_is_atama" },
      { text: "🛠️ Skills", value: "skills" },
      { text: "🚀 Projects", value: "projects" },
      { text: "🏆 Certificates", value: "certificates" },
      { text: "📞 Contact", value: "contact" }
    ];
  };

  // Logic to process bot responses
  const generateBotResponse = (userInput) => {
    const text = userInput.toLowerCase().trim();
    const isID = language === 'ID';

    // -------------------------------------------------------------
    // SECRET ADMIN COMMANDS
    // -------------------------------------------------------------
    const getSortedComments = () => {
      const saved = localStorage.getItem('portfolio_comments_v3');
      const list = saved ? JSON.parse(saved) : [];
      return list.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    };

    const getRelativeTime = (isoString) => {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now - past;
      if (diffMs < 0) return isID ? "baru saja" : "just now";
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);
      if (diffSec < 60) return isID ? "baru saja" : "just now";
      if (diffMin < 60) return isID ? `${diffMin}m yang lalu` : `${diffMin}m ago`;
      if (diffHr < 24) return isID ? `${diffHr}j yang lalu` : `${diffHr}h ago`;
      return isID ? `${diffDay} hari yang lalu` : `${diffDay}d ago`;
    };

    const updateRawComments = (updatedList) => {
      localStorage.setItem('portfolio_comments_v3', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
    };

    // 1. Enter Admin Mode / List Comments
    if (text === '/admin' || text === '/admin-mode' || text === '/atama-admin') {
      const sorted = getSortedComments();
      const pinnedComments = sorted.filter(c => c.isPinned);

      if (sorted.length === 0) {
        return isID 
          ? "🔑 **ADMIN PANEL ATAMA** 🔑\n\nBelum ada komentar saat ini.\n\nGunakan perintah berikut:\n• `/clear` : Kosongkan seluruh komentar"
          : "🔑 **ATAMA ADMIN PANEL** 🔑\n\nThere are no comments currently.\n\nUse command:\n• `/clear` : Clear all comments";
      }

      let listStr = isID 
        ? "🔑 **ADMIN PANEL ATAMA** 🔑\n\n📌 **Komentar yang disematkan saat ini:**\n\n"
        : "🔑 **ATAMA ADMIN PANEL** 🔑\n\n📌 **Currently pinned comments:**\n\n";

      if (pinnedComments.length === 0) {
        listStr += isID 
          ? "*(Belum ada komentar yang disematkan)*\n"
          : "*(No pinned comments currently)*\n";
      } else {
        pinnedComments.forEach((c) => {
          listStr += `• **${c.name}**: "${c.message}" (${getRelativeTime(c.timestamp)})\n`;
        });
      }

      listStr += isID
        ? "\n**Gunakan perintah rahasia berdasarkan nama:**\n" +
          "• `/pin <nama>` : Sematkan komentar dari nama tersebut\n" +
          "• `/unpin <nama>` : Lepaskan sematan komentar dari nama tersebut\n" +
          "• `/hapus <nama>` atau `/delete <nama>` : Hapus komentar dari nama tersebut\n" +
          "• `/clear` : Kosongkan seluruh komentar"
        : "\n**Use the following secret commands based on name:**\n" +
          "• `/pin <name>` : Pin comment by name\n" +
          "• `/unpin <name>` : Unpin comment by name\n" +
          "• `/delete <name>` : Delete comment by name\n" +
          "• `/clear` : Clear all comments";

      return listStr;
    }

    // 2. Clear All Comments
    if (text === '/clear') {
      updateRawComments([]);
      return isID
        ? "🧹 **Semua data komentar berhasil dikosongkan!** Buku tamu kini bersih dari komentar."
        : "🧹 **All comments have been successfully cleared!** The guestbook is now empty.";
    }

    // 3. Pin Comment by Name
    if (text.startsWith('/pin ')) {
      const nameAndSub = text.substring(5).trim();
      const match = nameAndSub.match(/^(.+?)(?:\s+(\d+))?$/);
      if (!match) return isID ? "⚠️ Format salah. Gunakan `/pin <nama>`." : "⚠️ Invalid format. Use `/pin <name>`.";
      
      const targetName = match[1].trim().toLowerCase();
      const subIdxStr = match[2];
      
      const saved = localStorage.getItem('portfolio_comments_v3');
      const raw = saved ? JSON.parse(saved) : [];
      const matches = raw.filter(c => c.name.toLowerCase() === targetName);

      if (matches.length === 0) {
        return isID 
          ? `⚠️ Tidak ditemukan komentar dari nama **${match[1]}**.`
          : `⚠️ No comments found from name **${match[1]}**.`;
      }

      if (matches.length === 1) {
        const target = matches[0];
        const updated = raw.map(c => c.id === target.id ? { ...c, isPinned: true } : c);
        updateRawComments(updated);
        return isID 
          ? `📌 Komentar dari **${target.name}** ("${target.message}") berhasil disematkan!`
          : `📌 Comment from **${target.name}** ("${target.message}") has been pinned!`;
      }

      // If multiple matches exist
      if (subIdxStr) {
        const subIdx = parseInt(subIdxStr, 10) - 1;
        if (isNaN(subIdx) || subIdx < 0 || subIdx >= matches.length) {
          return isID
            ? `⚠️ Pilihan tidak valid. Silakan pilih 1 hingga ${matches.length}.`
            : `⚠️ Invalid selection. Please select between 1 and ${matches.length}.`;
        }
        const target = matches[subIdx];
        const updated = raw.map(c => c.id === target.id ? { ...c, isPinned: true } : c);
        updateRawComments(updated);
        return isID 
          ? `📌 Komentar pilihan ke-${subIdxStr} dari **${target.name}** ("${target.message}") berhasil disematkan!`
          : `📌 Selected comment #${subIdxStr} from **${target.name}** ("${target.message}") has been pinned!`;
      } else {
        let reply = isID
          ? `⚠️ Ditemukan **${matches.length}** komentar dengan nama **${matches[0].name}**. Silakan pilih salah satu:\n\n`
          : `⚠️ Found **${matches.length}** comments with the name **${matches[0].name}**. Please choose one:\n\n`;
        
        matches.forEach((c, idx) => {
          reply += `[${idx + 1}] "${c.message}" (${getRelativeTime(c.timestamp)}) ${c.isPinned ? '📌' : ''}\n`;
        });
        
        reply += isID
          ? `\nKetik kembali: \`/pin ${matches[0].name} <nomor>\` (contoh: \`/pin ${matches[0].name} 1\`)`
          : `\nType again: \`/pin ${matches[0].name} <number>\` (example: \`/pin ${matches[0].name} 1\`)`;
        return reply;
      }
    }

    // 4. Unpin Comment by Name
    if (text.startsWith('/unpin ')) {
      const nameAndSub = text.substring(7).trim();
      const match = nameAndSub.match(/^(.+?)(?:\s+(\d+))?$/);
      if (!match) return isID ? "⚠️ Format salah. Gunakan `/unpin <nama>`." : "⚠️ Invalid format. Use `/unpin <name>`.";
      
      const targetName = match[1].trim().toLowerCase();
      const subIdxStr = match[2];
      
      const saved = localStorage.getItem('portfolio_comments_v3');
      const raw = saved ? JSON.parse(saved) : [];
      const matches = raw.filter(c => c.name.toLowerCase() === targetName);

      if (matches.length === 0) {
        return isID 
          ? `⚠️ Tidak ditemukan komentar dari nama **${match[1]}**.`
          : `⚠️ No comments found from name **${match[1]}**.`;
      }

      if (matches.length === 1) {
        const target = matches[0];
        const updated = raw.map(c => c.id === target.id ? { ...c, isPinned: false } : c);
        updateRawComments(updated);
        return isID 
          ? `🔓 Sematan komentar dari **${target.name}** ("${target.message}") berhasil dilepas!`
          : `🔓 Comment from **${target.name}** ("${target.message}") has been unpinned!`;
      }

      // If multiple matches exist
      if (subIdxStr) {
        const subIdx = parseInt(subIdxStr, 10) - 1;
        if (isNaN(subIdx) || subIdx < 0 || subIdx >= matches.length) {
          return isID
            ? `⚠️ Pilihan tidak valid. Silakan pilih 1 hingga ${matches.length}.`
            : `⚠️ Invalid selection. Please select between 1 and ${matches.length}.`;
        }
        const target = matches[subIdx];
        const updated = raw.map(c => c.id === target.id ? { ...c, isPinned: false } : c);
        updateRawComments(updated);
        return isID 
          ? `🔓 Sematan komentar pilihan ke-${subIdxStr} dari **${target.name}** ("${target.message}") berhasil dilepas!`
          : `🔓 Unpinned selected comment #${subIdxStr} from **${target.name}** ("${target.message}")!`;
      } else {
        let reply = isID
          ? `⚠️ Ditemukan **${matches.length}** komentar dengan nama **${matches[0].name}**. Silakan pilih salah satu:\n\n`
          : `⚠️ Found **${matches.length}** comments with the name **${matches[0].name}**. Please choose one:\n\n`;
        
        matches.forEach((c, idx) => {
          reply += `[${idx + 1}] "${c.message}" (${getRelativeTime(c.timestamp)}) ${c.isPinned ? '📌' : ''}\n`;
        });
        
        reply += isID
          ? `\nKetik kembali: \`/unpin ${matches[0].name} <nomor>\` (contoh: \`/unpin ${matches[0].name} 1\`)`
          : `\nType again: \`/unpin ${matches[0].name} <number>\` (example: \`/unpin ${matches[0].name} 1\`)`;
        return reply;
      }
    }

    // 5. Delete Comment by Name
    if (text.startsWith('/delete ') || text.startsWith('/hapus ')) {
      const offset = text.startsWith('/delete ') ? 8 : 7;
      const cmdWord = text.startsWith('/delete ') ? 'delete' : 'hapus';
      const nameAndSub = text.substring(offset).trim();
      const match = nameAndSub.match(/^(.+?)(?:\s+(\d+))?$/);
      if (!match) return isID ? `⚠️ Format salah. Gunakan \`/${cmdWord} <nama>\`.` : `⚠️ Invalid format. Use \`/${cmdWord} <name>\`.`;
      
      const targetName = match[1].trim().toLowerCase();
      const subIdxStr = match[2];
      
      const saved = localStorage.getItem('portfolio_comments_v3');
      const raw = saved ? JSON.parse(saved) : [];
      const matches = raw.filter(c => c.name.toLowerCase() === targetName);

      if (matches.length === 0) {
        return isID 
          ? `⚠️ Tidak ditemukan komentar dari nama **${match[1]}**.`
          : `⚠️ No comments found from name **${match[1]}**.`;
      }

      if (matches.length === 1) {
        const target = matches[0];
        const updated = raw.filter(c => c.id !== target.id);
        updateRawComments(updated);
        return isID 
          ? `✅ Komentar dari **${target.name}** ("${target.message}") berhasil dihapus!`
          : `✅ Comment from **${target.name}** ("${target.message}") has been deleted!`;
      }

      // If multiple matches exist
      if (subIdxStr) {
        const subIdx = parseInt(subIdxStr, 10) - 1;
        if (isNaN(subIdx) || subIdx < 0 || subIdx >= matches.length) {
          return isID
            ? `⚠️ Pilihan tidak valid. Silakan pilih 1 hingga ${matches.length}.`
            : `⚠️ Invalid selection. Please select between 1 and ${matches.length}.`;
        }
        const target = matches[subIdx];
        const updated = raw.filter(c => c.id !== target.id);
        updateRawComments(updated);
        return isID 
          ? `✅ Komentar pilihan ke-${subIdxStr} dari **${target.name}** ("${target.message}") berhasil dihapus!`
          : `✅ Selected comment #${subIdxStr} from **${target.name}** ("${target.message}") has been deleted!`;
      } else {
        let reply = isID
          ? `⚠️ Ditemukan **${matches.length}** komentar dengan nama **${matches[0].name}**. Silakan pilih salah satu untuk dihapus:\n\n`
          : `⚠️ Found **${matches.length}** comments with the name **${matches[0].name}**. Please choose one to delete:\n\n`;
        
        matches.forEach((c, idx) => {
          reply += `[${idx + 1}] "${c.message}" (${getRelativeTime(c.timestamp)}) ${c.isPinned ? '📌' : ''}\n`;
        });
        
        reply += isID
          ? `\nKetik kembali: \`/${cmdWord} ${matches[0].name} <nomor>\` (contoh: \`/${cmdWord} ${matches[0].name} 1\`)`
          : `\nType again: \`/${cmdWord} ${matches[0].name} <number>\` (example: \`/${cmdWord} ${matches[0].name} 1\`)`;
        return reply;
      }
    }

    // 1. WHO IS ATAMA
    if (text.includes("siapa_atama") || text.includes("who_is_atama") || text.includes("siapa atama") || text.includes("who is atama") || text.includes("siapa dia") || text.includes("profil") || text.includes("biodata") || text.includes("tentang atama") || text.includes("about atama")) {
      return isID
        ? "Atama Cahya El-firdausy adalah seorang mahasiswa semester akhir di jurusan **Teknologi Informasi, Universitas Muhammadiyah Yogyakarta (UMY)** yang dijadwalkan lulus pada tahun **2026**.\n\nBeliau adalah seorang **Web Developer** yang aktif, suka mengeksplorasi teknologi modern, berkontribusi ke open-source, dan mengasah keahlian desain UI/UX. Moto hidupnya adalah *'Vibe Code Is My Life Style'*."
        : "Atama Cahya El-firdausy is a final-semester student majoring in **Information Technology at Universitas Muhammadiyah Yogyakarta (UMY)**, scheduled to graduate in **2026**.\n\nHe is an active **Web Developer** passionate about exploring modern tech, contributing to open-source, and sharpening UI/UX design skills. His life motto is *'Vibe Code Is My Life Style'*.";
    }

    // 2. PROJECTS (Checks both 'proyek' and 'projek', plus 'projects')
    if (text.includes("proyek") || text.includes("projek") || text.includes("project") || text.includes("projects") || text.includes("portofolio") || text.includes("karya") || text.includes("bikin") || text.includes("dashboard") || text.includes("gym") || text.includes("drive")) {
      return isID
        ? "Beberapa proyek unggulan yang telah dikembangkan oleh Atama antara lain:\n\n" +
          "1. **Aplikasi Fitness Gym**: Sistem manajemen gym berbasis Laravel & Tailwind CSS.\n" +
          "2. **GenzDrive App**: Platform berbagi dokumen cloud aman berbasis React, Node.js & Vercel.\n" +
          "3. **PT. RAND Dashboard**: Dashboard KPI analitik interaktif berbasis Laravel, MySQL & Bootstrap.\n" +
          "4. **Sistem E-Learning**: Platform digital pembelajaran terintegrasi berbasis Next.js & Stripe.\n" +
          "5. **Toko Online Fashion**: E-Commerce modern dengan integrasi payment gateway.\n" +
          "6. **Sistem Inventaris**: Pelacakan stok real-time ritel menengah.\n\n" +
          "Anda dapat melihat visual lengkapnya di bagian **Showcase/Projek** di website ini!"
        : "Some of the highlight projects developed by Atama include:\n\n" +
          "1. **Fitness Gym App**: Gym management system built with Laravel & Tailwind CSS.\n" +
          "2. **GenzDrive App**: Secure cloud document sharing platform built with React, Node.js & Vercel.\n" +
          "3. **PT. RAND Dashboard**: Interactive KPI analytics dashboard using Laravel, MySQL & Bootstrap.\n" +
          "4. **E-Learning System**: Integrated digital learning platform built with Next.js & Stripe.\n" +
          "5. **Fashion Online Store**: Modern E-Commerce application with payment gateway integration.\n" +
          "6. **Inventory System**: Real-time stock tracking solution for retail.\n\n" +
          "You can explore all of these in detail under the **Showcase/Projects** section of this site!";
    }

    // 3. EDUCATION / UNIVERSITY / LULUS
    if (text.includes("pendidikan") || text.includes("kuliah") || text.includes("sekolah") || text.includes("education") || text.includes("university") || text.includes("umy") || text.includes("lulus") || text.includes("mahasiswa") || text.includes("kampus")) {
      return isID
        ? "Atama Cahya El-firdausy saat ini adalah mahasiswa semester akhir di **Universitas Muhammadiyah Yogyakarta (UMY)**, mengambil jurusan **Teknologi Informasi**. Beliau dijadwalkan lulus pada tahun **2026**."
        : "Atama Cahya El-firdausy is currently a final-semester student at **Universitas Muhammadiyah Yogyakarta (UMY)**, majoring in **Information Technology**. He is expected to graduate in **2026**.";
    }

    // 4. SKILLS / TECH STACK
    if (text.includes("skills") || text.includes("keahlian") || text.includes("tech") || text.includes("teknologi") || text.includes("stack") || text.includes("bahasa") || text.includes("coding") || text.includes("programming") || text.includes("bahasa pemrograman") || text.includes("mengode")) {
      return isID
        ? "Berikut adalah keahlian teknologi (*Tech Stack*) yang dikuasai Atama:\n\n" +
          "• **Front-End**: HTML5, CSS3, JavaScript, TypeScript, ReactJS, Next.js, Bootstrap, Tailwind CSS, Vite\n" +
          "• **Back-End & DB**: Node.js, Express.js, PHP, Laravel, MySQL\n" +
          "• **Tools & Lainnya**: Git, GitHub, Figma (Design)"
        : "Here is the technology stack (*Tech Stack*) that Atama specializes in:\n\n" +
          "• **Front-End**: HTML5, CSS3, JavaScript, TypeScript, ReactJS, Next.js, Bootstrap, Tailwind CSS, Vite\n" +
          "• **Back-End & DB**: Node.js, Express.js, PHP, Laravel, MySQL\n" +
          "• **Tools & Others**: Git, GitHub, Figma (Design)";
    }

    // 5. CERTIFICATES
    if (text.includes("sertifikat") || text.includes("sertifikasi") || text.includes("certificate") || text.includes("certificates") || text.includes("achievement") || text.includes("penghargaan") || text.includes("bnsp") || text.includes("alibaba") || text.includes("certiport")) {
      return isID
        ? "Atama memiliki sertifikasi profesional terkemuka untuk memvalidasi keahliannya:\n\n" +
          "1. 🏆 **Junior Web Developer** - Diterbitkan oleh *Badan Nasional Sertifikasi Profesi (BNSP)*, memvalidasi kemampuan web development standar nasional.\n" +
          "2. 🏆 **Alibaba Cloud Certified Developer** - Diterbitkan oleh *Alibaba Cloud*, memvalidasi kemampuan arsitektur cloud computing.\n" +
          "3. 🏆 **International Software Developer** - Sertifikasi *Certiport* untuk rekayasa perangkat lunak modern & metodologi Agile."
        : "Atama holds prominent professional certifications validating his expertise:\n\n" +
          "1. 🏆 **Junior Web Developer** - Issued by *National Professional Certification Agency (BNSP)*, validating national-standard web engineering skills.\n" +
          "2. 🏆 **Alibaba Cloud Certified Developer** - Issued by *Alibaba Cloud*, validating cloud architecture & services expertise.\n" +
          "3. 🏆 **International Software Developer** - *Certiport* certification in modern software engineering & Agile methodologies.";
    }

    // 6. CONTACT / CV
    if (text.includes("kontak") || text.includes("contact") || text.includes("hubungi") || text.includes("email") || text.includes("sosmed") || text.includes("cv") || text.includes("resume") || text.includes("telepon") || text.includes("nomor") || text.includes("github") || text.includes("nomor hp") || text.includes("whatsapp")) {
      return isID
        ? "Anda dapat menghubungi Atama Cahya secara langsung melalui:\n\n" +
          "• 📧 **Email**: [atama.firdausy@gmail.com](mailto:atama.firdausy@gmail.com)\n" +
          "• 🐙 **GitHub**: [github.com/firdausytama](https://github.com/firdausytama)\n" +
          "• 📄 **CV/Resume**: Klik tombol unduh di bagian Tentang Saya atau [klik di sini](/cv_atama_firdausy.pdf).\n\n" +
          "Anda juga bisa mengirim pesan langsung menggunakan **Formulir Kontak** di bagian paling bawah halaman ini!"
        : "You can reach out to Atama Cahya directly via:\n\n" +
          "• 📧 **Email**: [atama.firdausy@gmail.com](mailto:atama.firdausy@gmail.com)\n" +
          "• 🐙 **GitHub**: [github.com/firdausytama](https://github.com/firdausytama)\n" +
          "• 📄 **CV/Resume**: Click the download button in the About Me section or [click here](/cv_atama_firdausy.pdf).\n\n" +
          "You can also send a direct message using the **Contact Form** at the bottom of this page!";
    }

    // 7. GREETINGS & CASUAL SAPAAN (Checked AFTER specific topics to prevent false positives)
    if (text.match(/^(halo|hai|hi|hello|hey|helo|oy|yo|p|permisi|assalamualaikum|pagi|siang|sore|malam|good morning|good afternoon|good evening)/)) {
      return isID 
        ? "Halo! Senang bisa menyapa Anda. Silakan pilih menu di bawah atau ketik pertanyaan apa pun tentang Atama! 😊"
        : "Hello! Glad to greet you. Please select one of the suggestions below or ask me anything about Atama! 😊";
    }

    // 8. HOW ARE YOU / KABAR
    if (text.includes("apa kabar") || text.includes("kabar") || text.includes("how are you") || text.includes("piye") || text.includes("sehat")) {
      return isID
        ? "Saya luar biasa baik! Selalu siap membantu Anda menemukan informasi tentang Atama Cahya. Bagaimana dengan kabar Anda sendiri hari ini? 😊"
        : "I am doing great! Always ready to assist you with information about Atama Cahya. How are you doing today? 😊";
    }

    // 9. THANK YOU / TERIMA KASIH
    if (text.includes("terima kasih") || text.includes("makasih") || text.includes("thanks") || text.includes("thank you") || text.includes("suwun") || text.includes("nuhun") || text.includes("ty")) {
      return isID
        ? "Sama-sama! Senang sekali bisa membantu Anda. Jika ada hal lain yang ingin ditanyakan seputar Atama, ketik saja langsung di sini! 😄"
        : "You're very welcome! Glad I could help. If you have any other questions regarding Atama, feel free to type them here! 😄";
    }

    // 10. HOBBY / HOBI
    if (text.includes("hobi") || text.includes("hobby") || text.includes("kegemaran") || text.includes("suka ngapain") || text.includes("waktu luang") || text.includes("free time")) {
      return isID
        ? "Ketika tidak sedang mengode, Atama sangat senang mengeksplorasi teknologi baru, berkontribusi ke open-source di GitHub, mengasah kemampuan desain UI/UX di Figma, serta membaca tren seputar AI terbaru!"
        : "When not coding, Atama loves exploring new technologies, contributing to open-source on GitHub, sharpening UI/UX design skills in Figma, and keeping up with the latest AI trends!";
    }

    // 11. ADDRESS / LOCATION / TINGGAL
    if (text.includes("tinggal") || text.includes("lokasi") || text.includes("alamat") || text.includes("location") || text.includes("address") || text.includes("yogyakarta") || text.includes("jogja") || text.includes("mana")) {
      return isID
        ? "Atama saat ini tinggal dan berkuliah di **Yogyakarta**, Indonesia. Kampusnya berada di Universitas Muhammadiyah Yogyakarta (UMY)!"
        : "Atama currently resides and studies in **Yogyakarta**, Indonesia. His university is Universitas Muhammadiyah Yogyakarta (UMY)!";
    }

    // 12. WHO ARE YOU
    if (text.includes("siapa kamu") || text.includes("who are you") || text.includes("namamu") || text.includes("chatbot") || text.includes("assistant") || text.includes("asisten") || text.includes("bot")) {
      return isID
        ? "Saya adalah **AI Assistant** portofolio 🤖. Tugas saya adalah membantu mengenalkan profil, keahlian, proyek, dan sertifikat Atama Cahya kepada Anda secara interaktif!"
        : "I am the portfolio **AI Assistant** 🤖. My job is to help introduce Atama Cahya's profile, skills, projects, and certificates to you interactively!";
    }

    // FALLBACK
    return isID
      ? "Maaf, saya belum memahami hal tersebut. 😅\n\nSilakan klik tombol menu cepat di atas untuk menanyakan tentang:\n• **Siapa Atama**\n• **Keahlian**\n• **Sertifikat**\n• **Kontak**"
      : "I'm sorry, I didn't quite catch that. 😅\n\nPlease use the quick action buttons above to ask about:\n• **Who is Atama**\n• **Skills**\n• **Certificates**\n• **Contact**";
  };

  // Helper to format text with basic markdown (bold, links)
  const renderFormattedText = (text) => {
    // Escape HTML tags to prevent XSS
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Convert **bold** to <strong>bold</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert *italic* or bullet •
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert markdown link [text](url) to HTML anchor
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-left:2px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>');

    // Replace linebreaks with <br />
    formatted = formatted.replace(/\n/g, '<br />');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Handle Form Submission
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgObj = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      time
    };

    setMessages(prev => [...prev, userMsgObj]);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      const botMsgObj = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsgObj]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle suggestion click
  const handleSuggestionClick = (value, label) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgObj = {
      id: Date.now(),
      text: label,
      sender: 'user',
      time
    };

    setMessages(prev => [...prev, userMsgObj]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(value);
      const botMsgObj = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsgObj]);
      setIsTyping(false);
    }, 900);
  };

  const handleClearChat = () => {
    const isID = language === 'ID';
    const welcomeMsg = isID 
      ? "Halo! Saya **Atama AI Assistant** 🤖. Ada yang bisa saya bantu tentang perjalanan karir, keahlian, proyek, atau kontak Atama Cahya?"
      : "Hello! I am **Atama AI Assistant** 🤖. How can I help you regarding Atama Cahya's career journey, skills, projects, or contact info?";
    
    setMessages([
      { id: 1, text: welcomeMsg, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Action Button (FAB) */}
      <button 
        className={`chatbot-fab ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Assistant"
        title="Atama AI Assistant"
      >
        {isOpen ? (
          <FaTimes />
        ) : (
          <div className="chatbot-fab-icon-container">
            <svg 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="chatbot-custom-icon"
            >
              <path d="M22,45 A 7,7 0 0,0 22,59" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M78,45 A 7,7 0 0,1 78,59" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <line x1="66" y1="30" x2="66" y2="16" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <circle cx="66" cy="11" r="4.5" fill="currentColor" />
              <path 
                d="M36,74 L20,85 L26,70 A 14,14 0 0,1 22,60 L22,44 A 14,14 0 0,1 36,30 L64,30 A 14,14 0 0,1 78,44 L78,60 A 14,14 0 0,1 64,74 Z" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="38" cy="52" r="4.5" fill="currentColor" />
              <circle cx="50" cy="52" r="4.5" fill="currentColor" />
              <circle cx="62" cy="52" r="4.5" fill="currentColor" />
            </svg>
          </div>
        )}
        {!isOpen && <span className="chatbot-pulse-ring"></span>}
      </button>

      {/* Chat Window Panel */}
      <div className={`chatbot-window glass ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar-container">
              <FaRobot className="chatbot-avatar-icon" />
              <span className="chatbot-avatar-status"></span>
            </div>
            <div>
              <h4 className="chatbot-title">AI Assistant</h4>
              <p className="chatbot-status-text">Online</p>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button 
              className="chatbot-header-btn" 
              onClick={handleClearChat}
              title={language === 'ID' ? 'Hapus Obrolan' : 'Clear Chat'}
            >
              <FaTrashAlt />
            </button>
            <button 
              className="chatbot-header-btn" 
              onClick={() => setIsOpen(false)}
              title={language === 'ID' ? 'Tutup' : 'Close'}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Message Logs Area */}
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-message-bubble ${msg.sender}`}>
                <div className="chatbot-message-meta">
                  {msg.sender === 'bot' ? <FaRobot className="chat-meta-icon" /> : <FaUser className="chat-meta-icon" />}
                  <span className="chat-meta-time">{msg.time}</span>
                </div>
                <div className="chatbot-message-text">
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message-bubble bot">
                <div className="chatbot-message-meta">
                  <FaRobot className="chat-meta-icon" />
                  <span className="chat-meta-time">{language === 'ID' ? 'mengetik...' : 'typing...'}</span>
                </div>
                <div className="chatbot-message-text typing-loader">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="chatbot-suggestions">
          {getSuggestions().map((suggestion, idx) => (
            <button 
              key={idx}
              className="chatbot-suggestion-btn"
              onClick={() => handleSuggestionClick(suggestion.value, suggestion.text)}
            >
              {suggestion.text}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSendMessage} className="chatbot-input-form">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={language === 'ID' ? 'Tanyakan sesuatu...' : 'Ask something...'}
            className="chatbot-input-field"
            maxLength={200}
          />
          <button type="submit" className="chatbot-submit-btn" disabled={!inputValue.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
