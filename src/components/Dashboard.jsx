import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  FaSignOutAlt, FaSave, FaComments, FaHeading, FaInfoCircle, 
  FaProjectDiagram, FaCertificate, FaThumbtack, FaCheckCircle, FaTrashAlt, FaUndo,
  FaPlus, FaEdit, FaTimes, FaLink, FaExternalLinkAlt, FaUpload, FaImage
} from 'react-icons/fa';

// List of translation keys that are editable from the dashboard
const EDITABLE_KEYS = [
  // Hero Section
  { key: 'hero.greeting.prefix', label: 'Greeting Prefix', section: 'hero' },
  { key: 'hero.title_1', label: 'Title Line 1', section: 'hero' },
  { key: 'hero.title_2', label: 'Title Line 2', section: 'hero' },
  { key: 'hero.tag.skills', label: 'Skills Tag', section: 'hero' },
  { key: 'hero.tag.dev', label: 'Developer Tag', section: 'hero' },
  { key: 'hero.tag.open', label: 'Status Tag', section: 'hero' },

  // About Section
  { key: 'about.title', label: 'About Title', section: 'about' },
  { key: 'about.title_highlight', label: 'About Title Highlight', section: 'about' },
  { key: 'about.subtitle', label: 'About Subtitle', section: 'about' },
  { key: 'about.journey', label: 'Journey Heading', section: 'about' },
  { key: 'about.p1', label: 'Paragraph 1 (HTML)', section: 'about', isTextarea: true },
  { key: 'about.p2', label: 'Paragraph 2 (HTML)', section: 'about', isTextarea: true },
  { key: 'about.education', label: 'Education Heading', section: 'about' },
  { key: 'about.edu.university', label: 'University Name', section: 'about' },
  { key: 'about.edu.major', label: 'Major Info', section: 'about' },
  { key: 'about.edu.year', label: 'Graduation Year', section: 'about' },
  { key: 'about.download_cv', label: 'Download CV Button Label', section: 'about' },
];

const DEFAULT_TRANSLATIONS = {
  ID: {
    'hero.greeting.prefix': 'Hello, I Am ',
    'hero.title_1': 'Vibe Code Is My',
    'hero.title_2': 'Life Style',
    'hero.tag.skills': 'Keahlian Utama',
    'hero.tag.dev': 'Web Developer',
    'hero.tag.open': 'Open to Work!',
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
  },
  EN: {
    'hero.greeting.prefix': 'Hello, I am ',
    'hero.title_1': 'Vibe Code Is My',
    'hero.title_2': 'Life Style',
    'hero.tag.skills': 'Core Skills',
    'hero.tag.dev': 'Web Developer',
    'hero.tag.open': 'Open to Work!',
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
  }
};

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'about', 'projects', 'certificates', 'comments'
  const [content, setContent] = useState({});
  const [comments, setComments] = useState([]);
  
  // Dynamic lists from Supabase
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Form Medals Toggle states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title_id: '', title_en: '', desc_id: '', desc_en: '',
    category_id: '', category_en: '', tech: '', link: '', image_url: ''
  });

  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    title_id: '', title_en: '', issuer_id: '', issuer_en: '',
    desc_id: '', desc_en: '', issue_date: '', duration: '', image_url: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error'
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      alert("Memerlukan koneksi database Supabase aktif untuk mengunggah gambar.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      const url = publicUrlData.publicUrl;

      if (type === 'project') {
        setProjectForm({ ...projectForm, image_url: url });
      } else if (type === 'cert') {
        setCertForm({ ...certForm, image_url: url });
      }
      
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah gambar. Pastikan Anda telah membuat bucket 'portfolio-assets' bersifat Public di Supabase Storage.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Load content, projects, certificates, comments
  const loadDashboardData = async () => {
    // 1. Fetch Dynamic Content Translations
    let dbContent = {};
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_content')
          .select('*');
        if (error) throw error;
        if (data) {
          data.forEach(row => {
            dbContent[row.key] = {
              ID: row.value_id,
              EN: row.value_en
            };
          });
        }
      } catch (err) {
        console.error('Error loading Supabase content:', err);
      }
    }

    const initialContent = {};
    EDITABLE_KEYS.forEach(item => {
      const dbVal = dbContent[item.key];
      initialContent[item.key] = {
        ID: dbVal ? dbVal.ID : (DEFAULT_TRANSLATIONS.ID[item.key] || ''),
        EN: dbVal ? dbVal.EN : (DEFAULT_TRANSLATIONS.EN[item.key] || '')
      };
    });
    setContent(initialContent);

    // 2. Load dynamic CRUD items
    await loadProjectsData();
    await loadCertificatesData();
    await loadCommentsData();
  };

  const loadProjectsData = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const loadCertificatesData = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_certificates')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        setCertificates(data || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const loadCommentsData = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_comments')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data) {
          const mapped = data.map(c => ({
            id: c.id,
            name: c.name,
            message: c.message,
            isAdmin: c.is_admin,
            isVerified: c.is_verified,
            isPinned: c.is_pinned,
            timestamp: c.created_at
          }));
          setComments(mapped);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    } else {
      const saved = localStorage.getItem('portfolio_comments_v3');
      setComments(saved ? JSON.parse(saved) : []);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Input Changes for Content Keys
  const handleInputChange = (key, lang, value) => {
    setContent(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value
      }
    }));
  };

  // Save General Content Tab Toggles
  const handleSaveContent = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    if (isSupabaseConfigured) {
      try {
        const upsertData = Object.keys(content).map(key => ({
          key,
          value_id: content[key].ID,
          value_en: content[key].EN
        }));

        const { error } = await supabase
          .from('portfolio_content')
          .upsert(upsertData);

        if (error) throw error;

        setSaveStatus('success');
        window.dispatchEvent(new CustomEvent('portfolio_content_updated'));
      } catch (err) {
        console.error('Error upserting content to Supabase:', err);
        setSaveStatus('error');
      }
    } else {
      localStorage.setItem('portfolio_content_fallback', JSON.stringify(content));
      setSaveStatus('success');
    }

    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Setel ulang input tab ini ke template default? (Perubahan tersimpan hanya setelah Anda klik Simpan).')) {
      const restored = { ...content };
      EDITABLE_KEYS.filter(k => k.section === activeTab).forEach(item => {
        restored[item.key] = {
          ID: DEFAULT_TRANSLATIONS.ID[item.key] || '',
          EN: DEFAULT_TRANSLATIONS.EN[item.key] || ''
        };
      });
      setContent(restored);
    }
  };

  // -------------------------------------------------------------
  // PROJECTS CRUD OPERATIONS
  // -------------------------------------------------------------
  const openProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title_id: proj.title_id || '',
        title_en: proj.title_en || '',
        desc_id: proj.desc_id || '',
        desc_en: proj.desc_en || '',
        category_id: proj.category_id || '',
        category_en: proj.category_en || '',
        tech: proj.tech ? proj.tech.join(', ') : '',
        link: proj.link || '',
        image_url: proj.image_url || ''
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title_id: '', title_en: '', desc_id: '', desc_en: '',
        category_id: '', category_en: '', tech: '', link: '', image_url: ''
      });
    }
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const techArray = projectForm.tech.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title_id: projectForm.title_id,
      title_en: projectForm.title_en,
      desc_id: projectForm.desc_id,
      desc_en: projectForm.desc_en,
      category_id: projectForm.category_id,
      category_en: projectForm.category_en,
      tech: techArray,
      link: projectForm.link || '#',
      image_url: projectForm.image_url
    };

    if (isSupabaseConfigured) {
      try {
        if (editingProject) {
          // Update
          const { error } = await supabase
            .from('portfolio_projects')
            .update(payload)
            .eq('id', editingProject.id);
          if (error) throw error;
        } else {
          // Create
          const { error } = await supabase
            .from('portfolio_projects')
            .insert([payload]);
          if (error) throw error;
        }
        await loadProjectsData();
        setShowProjectModal(false);
        window.dispatchEvent(new CustomEvent('portfolio_projects_updated'));
      } catch (err) {
        console.error(err);
        alert('Gagal menyimpan projek.');
      }
    } else {
      alert('Supabase belum terkonfigurasi. Fitur tambah projek memerlukan database cloud aktif.');
    }
    setIsSaving(false);
  };

  const handleDeleteProject = async (proj) => {
    if (window.confirm(`Hapus projek "${proj.title_id}" dari database?`)) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('portfolio_projects')
            .delete()
            .eq('id', proj.id);
          if (error) throw error;
          await loadProjectsData();
          window.dispatchEvent(new CustomEvent('portfolio_projects_updated'));
        } catch (err) {
          console.error(err);
        }
      } else {
        alert('Memerlukan koneksi database Supabase aktif.');
      }
    }
  };

  // -------------------------------------------------------------
  // CERTIFICATES CRUD OPERATIONS
  // -------------------------------------------------------------
  const openCertModal = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setCertForm({
        title_id: cert.title_id || '',
        title_en: cert.title_en || '',
        issuer_id: cert.issuer_id || '',
        issuer_en: cert.issuer_en || '',
        desc_id: cert.desc_id || '',
        desc_en: cert.desc_en || '',
        issue_date: cert.issue_date || '',
        duration: cert.duration || '',
        image_url: cert.image_url || ''
      });
    } else {
      setEditingCert(null);
      setCertForm({
        title_id: '', title_en: '', issuer_id: '', issuer_en: '',
        desc_id: '', desc_en: '', issue_date: '', duration: '', image_url: ''
      });
    }
    setShowCertModal(true);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title_id: certForm.title_id,
      title_en: certForm.title_en,
      issuer_id: certForm.issuer_id,
      issuer_en: certForm.issuer_en,
      desc_id: certForm.desc_id,
      desc_en: certForm.desc_en,
      issue_date: certForm.issue_date,
      duration: certForm.duration || 'Selamanya',
      image_url: certForm.image_url
    };

    if (isSupabaseConfigured) {
      try {
        if (editingCert) {
          const { error } = await supabase
            .from('portfolio_certificates')
            .update(payload)
            .eq('id', editingCert.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('portfolio_certificates')
            .insert([payload]);
          if (error) throw error;
        }
        await loadCertificatesData();
        setShowCertModal(false);
        window.dispatchEvent(new CustomEvent('portfolio_certificates_updated'));
      } catch (err) {
        console.error(err);
        alert('Gagal menyimpan sertifikat.');
      }
    } else {
      alert('Memerlukan database cloud aktif.');
    }
    setIsSaving(false);
  };

  const handleDeleteCert = async (cert) => {
    if (window.confirm(`Hapus sertifikat "${cert.title_id}"?`)) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('portfolio_certificates')
            .delete()
            .eq('id', cert.id);
          if (error) throw error;
          await loadCertificatesData();
          window.dispatchEvent(new CustomEvent('portfolio_certificates_updated'));
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  // -------------------------------------------------------------
  // COMMENTS MODERATION (Local/Supabase Sync)
  // -------------------------------------------------------------
  const handlePinComment = async (comment, pinState) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('portfolio_comments').update({ is_pinned: pinState }).eq('id', comment.id);
        await loadCommentsData();
        window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
      } catch (err) { console.error(err); }
    } else {
      const updated = comments.map(c => c.id === comment.id ? { ...c, isPinned: pinState } : c);
      localStorage.setItem('portfolio_comments_v3', JSON.stringify(updated));
      setComments(updated);
      window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
    }
  };

  const handleVerifyComment = async (comment, verifState) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('portfolio_comments').update({ is_verified: verifState }).eq('id', comment.id);
        await loadCommentsData();
        window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
      } catch (err) { console.error(err); }
    } else {
      const updated = comments.map(c => c.id === comment.id ? { ...c, isVerified: verifState } : c);
      localStorage.setItem('portfolio_comments_v3', JSON.stringify(updated));
      setComments(updated);
      window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
    }
  };

  const handleDeleteComment = async (comment) => {
    if (window.confirm(`Hapus komentar dari ${comment.name}?`)) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('portfolio_comments').delete().eq('id', comment.id);
          await loadCommentsData();
          window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
        } catch (err) { console.error(err); }
      } else {
        const updated = comments.filter(c => c.id !== comment.id);
        localStorage.setItem('portfolio_comments_v3', JSON.stringify(updated));
        setComments(updated);
        window.dispatchEvent(new CustomEvent('portfolio_comments_updated'));
      }
    }
  };

  const handleLogoutAction = () => {
    sessionStorage.removeItem('admin_authenticated');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="dashboard-sidebar glass">
        <div className="dashboard-brand">
          <div className="brand-logo-circle">A</div>
          <h2>Console Admin</h2>
        </div>

        <nav className="dashboard-nav">
          <button className={`nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
            <FaHeading className="nav-icon" /> Hero Section
          </button>
          <button className={`nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
            <FaInfoCircle className="nav-icon" /> About Me
          </button>
          <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <FaProjectDiagram className="nav-icon" /> Manage Projects
          </button>
          <button className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>
            <FaCertificate className="nav-icon" /> Manage Certificates
          </button>
          <button className={`nav-item ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
            <FaComments className="nav-icon" /> Buku Tamu
          </button>
        </nav>

        <button className="dashboard-logout-btn" onClick={handleLogoutAction}>
          <FaSignOutAlt /> Keluar
        </button>
      </div>

      {/* Main Panel Content Area */}
      <div className="dashboard-main-content">
        <header className="dashboard-header glass">
          <div className="header-title-area">
            <h1>Console Administrator</h1>
            <p>
              {activeTab === 'comments' && 'Kelola ulasan Buku Tamu Anda'}
              {activeTab === 'projects' && 'Kelola daftar Projek Portofolio Anda secara CRUD'}
              {activeTab === 'certificates' && 'Kelola daftar Sertifikat Penghargaan Anda secara CRUD'}
              {(activeTab === 'hero' || activeTab === 'about') && 'Ubah teks landing page secara real-time'}
            </p>
          </div>

          {/* Render Action Buttons selectively based on tab */}
          {(activeTab === 'hero' || activeTab === 'about') && (
            <div className="header-actions">
              <button className="dashboard-btn btn-secondary" onClick={handleResetToDefaults}>
                <FaUndo /> Template Default
              </button>
              <button className="dashboard-btn btn-primary" onClick={handleSaveContent} disabled={isSaving}>
                <FaSave /> {isSaving ? 'Menyimpan...' : 'Simpan Konten'}
              </button>
            </div>
          )}

          {activeTab === 'projects' && (
            <button className="dashboard-btn btn-primary" onClick={() => openProjectModal(null)}>
              <FaPlus /> Tambah Projek Baru
            </button>
          )}

          {activeTab === 'certificates' && (
            <button className="dashboard-btn btn-primary" onClick={() => openCertModal(null)}>
              <FaPlus /> Tambah Sertifikat Baru
            </button>
          )}
        </header>

        {/* Save Status Banners */}
        {saveStatus === 'success' && (
          <div className="status-toast toast-success">
            ✨ Perubahan konten berhasil disimpan dan tersinkronisasi online!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="status-toast toast-error">
            ⚠️ Gagal menyimpan ke Supabase Cloud. Silakan periksa koneksi atau RLS.
          </div>
        )}

        <div className="dashboard-body-area">
          {/* TABS 1 & 2: DYNAMIC GENERAL TEXT EDITOR */}
          {(activeTab === 'hero' || activeTab === 'about') && (
            <div className="editor-form-wrapper glass">
              <div className="editor-form-header">
                <h3>Form Pengisian Konten - Tab {activeTab.toUpperCase()}</h3>
                <span className="database-status-indicator">
                  {isSupabaseConfigured ? '🟢 Supabase Online' : '🟡 Offline Fallback'}
                </span>
              </div>

              <div className="form-fields-container">
                {EDITABLE_KEYS.filter(item => item.section === activeTab).map((field) => (
                  <div key={field.key} className="form-row-card glass">
                    <div className="form-row-label">
                      <h4>{field.label}</h4>
                      <code className="form-row-key-name">{field.key}</code>
                    </div>

                    <div className="form-inputs-grid">
                      <div className="input-box-wrapper">
                        <label className="input-box-lang-badge id-badge">ID</label>
                        {field.isTextarea ? (
                          <textarea
                            value={content[field.key] ? content[field.key].ID : ''}
                            onChange={(e) => handleInputChange(field.key, 'ID', e.target.value)}
                            rows={4}
                            className="editor-textarea"
                            placeholder="Konten Bahasa Indonesia"
                          />
                        ) : (
                          <input
                            type="text"
                            value={content[field.key] ? content[field.key].ID : ''}
                            onChange={(e) => handleInputChange(field.key, 'ID', e.target.value)}
                            className="editor-input"
                            placeholder="Konten Bahasa Indonesia"
                          />
                        )}
                      </div>

                      <div className="input-box-wrapper">
                        <label className="input-box-lang-badge en-badge">EN</label>
                        {field.isTextarea ? (
                          <textarea
                            value={content[field.key] ? content[field.key].EN : ''}
                            onChange={(e) => handleInputChange(field.key, 'EN', e.target.value)}
                            rows={4}
                            className="editor-textarea"
                            placeholder="English Content"
                          />
                        ) : (
                          <input
                            type="text"
                            value={content[field.key] ? content[field.key].EN : ''}
                            onChange={(e) => handleInputChange(field.key, 'EN', e.target.value)}
                            className="editor-input"
                            placeholder="English Content"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS VISUAL CRUD MANAGER */}
          {activeTab === 'projects' && (
            <div className="crud-list-wrapper glass">
              <div className="crud-list-header">
                <h3>Daftar Projek Aktif di Database</h3>
                <span className="database-status-indicator">
                  {isSupabaseConfigured ? '🟢 Supabase CRUD Active' : '🟡 Static Fallback (No DB)'}
                </span>
              </div>

              {!isSupabaseConfigured && (
                <div className="crud-db-warning toast-error" style={{ marginBottom: '1.5rem', animation: 'none' }}>
                  ⚠️ Koneksi database Supabase tidak terdeteksi. Pemasangan data baru (CRUD) dinonaktifkan. Silakan isi konfigurasi API Key Supabase Anda terlebih dahulu!
                </div>
              )}

              <div className="crud-items-grid">
                {projects.length === 0 ? (
                  <div className="crud-empty-state">
                    Belum ada projek di database cloud. Menampilkan data fallback statis di halaman utama.
                  </div>
                ) : (
                  projects.map(proj => (
                    <div key={proj.id} className="crud-item-card glass">
                      <div className="crud-card-thumb">
                        {proj.image_url ? (
                          <div className="thumb-preview-wrapper">
                            <span className="thumb-indicator">Custom</span>
                            {/* Render helper (if image is a link or asset keyword) */}
                            {proj.image_url.startsWith('http') ? (
                              <img src={proj.image_url} alt="preview" />
                            ) : (
                              <div className="thumb-placeholder">{proj.image_url}</div>
                            )}
                          </div>
                        ) : (
                          <div className="thumb-placeholder">No Photo</div>
                        )}
                      </div>

                      <div className="crud-card-details">
                        <span className="crud-item-category">{proj.category_id}</span>
                        <h4>{proj.title_id} / {proj.title_en}</h4>
                        <p>{proj.desc_id}</p>
                        <div className="crud-card-techs">
                          {proj.tech && proj.tech.map((t, i) => (
                            <span key={i} className="tech-badge-tag">{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="crud-card-actions">
                        <button className="crud-btn-circle edit-btn" onClick={() => openProjectModal(proj)} title="Edit Projek">
                          <FaEdit />
                        </button>
                        <button className="crud-btn-circle delete-btn" onClick={() => handleDeleteProject(proj)} title="Hapus Projek">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATES VISUAL CRUD MANAGER */}
          {activeTab === 'certificates' && (
            <div className="crud-list-wrapper glass">
              <div className="crud-list-header">
                <h3>Daftar Sertifikat Aktif di Database</h3>
                <span className="database-status-indicator">
                  {isSupabaseConfigured ? '🟢 Supabase CRUD Active' : '🟡 Static Fallback (No DB)'}
                </span>
              </div>

              {!isSupabaseConfigured && (
                <div className="crud-db-warning toast-error" style={{ marginBottom: '1.5rem', animation: 'none' }}>
                  ⚠️ Koneksi database Supabase tidak terdeteksi. Pemasangan data baru (CRUD) dinonaktifkan.
                </div>
              )}

              <div className="crud-items-grid">
                {certificates.length === 0 ? (
                  <div className="crud-empty-state">
                    Belum ada sertifikat di database cloud. Menampilkan data fallback statis di halaman utama.
                  </div>
                ) : (
                  certificates.map(cert => (
                    <div key={cert.id} className="crud-item-card glass">
                      <div className="crud-card-thumb">
                        {cert.image_url ? (
                          <div className="thumb-preview-wrapper">
                            <span className="thumb-indicator">Cert</span>
                            {cert.image_url.startsWith('http') ? (
                              <img src={cert.image_url} alt="preview" />
                            ) : (
                              <div className="thumb-placeholder">{cert.image_url}</div>
                            )}
                          </div>
                        ) : (
                          <div className="thumb-placeholder">No Photo</div>
                        )}
                      </div>

                      <div className="crud-card-details">
                        <span className="crud-item-category">{cert.issuer_id}</span>
                        <h4>{cert.title_id}</h4>
                        <p>{cert.desc_id}</p>
                        <div className="crud-card-meta-dates">
                          <span>📅 {cert.issue_date}</span>
                          <span>⏳ {cert.duration}</span>
                        </div>
                      </div>

                      <div className="crud-card-actions">
                        <button className="crud-btn-circle edit-btn" onClick={() => openCertModal(cert)} title="Edit Sertifikat">
                          <FaEdit />
                        </button>
                        <button className="crud-btn-circle delete-btn" onClick={() => handleDeleteCert(cert)} title="Hapus Sertifikat">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: COMMENTS MODERATION PANEL */}
          {activeTab === 'comments' && (
            <div className="comments-moderation-wrapper glass">
              <div className="moderation-header">
                <h3>Visual Guestbook Moderator</h3>
                <span className="comments-total-badge">Total Komentar: {comments.length}</span>
              </div>

              <div className="moderation-list-container">
                {comments.length === 0 ? (
                  <div className="moderation-empty-state">
                    Belum ada komentar untuk dimoderasi.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className={`moderation-comment-card glass ${comment.isPinned ? 'pinned-highlight' : ''}`}>
                      <div className="comment-card-main">
                        <div className="comment-card-left">
                          <div className={`mod-avatar ${comment.isAdmin ? 'admin-mod-avatar' : ''}`}>
                            {comment.isAdmin ? 'A' : (comment.name ? comment.name.charAt(0).toUpperCase() : '?')}
                          </div>
                        </div>

                        <div className="comment-card-center">
                          <div className="comment-meta-info">
                            <span className="comment-name">{comment.name}</span>
                            {comment.isVerified && (
                              <FaCheckCircle className="verified-blue-tick" title="Verified" />
                            )}
                            {comment.isAdmin && <span className="admin-text-badge">Admin</span>}
                            <span className="comment-time-stamp">
                              {new Date(comment.timestamp).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <p className="comment-message-body">{comment.message}</p>
                        </div>

                        <div className="comment-card-actions">
                          <button
                            onClick={() => handlePinComment(comment, !comment.isPinned)}
                            className={`action-icon-btn pin-btn ${comment.isPinned ? 'active' : ''}`}
                            title={comment.isPinned ? 'Lepaskan Sematan' : 'Sematkan Komentar'}
                          >
                            <FaThumbtack />
                          </button>

                          {!comment.isAdmin && (
                            <button
                              onClick={() => handleVerifyComment(comment, !comment.isVerified)}
                              className={`action-icon-btn verify-btn ${comment.isVerified ? 'active' : ''}`}
                              title={comment.isVerified ? 'Copot Ceklis Biru' : 'Beri Ceklis Biru Verified'}
                            >
                              <FaCheckCircle />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteComment(comment)}
                            className="action-icon-btn delete-btn"
                            title="Hapus Komentar"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------
          MODAL POP-UP 1: CREATE/EDIT PROJECT FORM
          ------------------------------------------------------------- */}
      {showProjectModal && (
        <div className="modal-backdrop glass">
          <div className="modal-container glass reveal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Projek' : 'Tambah Projek Baru'}</h3>
              <button className="modal-close-btn" onClick={() => setShowProjectModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="modal-form-body">
              {/* Row 1: Title ID & EN */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Judul Projek (ID)</label>
                  <input
                    type="text"
                    value={projectForm.title_id}
                    onChange={e => setProjectForm({...projectForm, title_id: e.target.value})}
                    placeholder="Contoh: Aplikasi Fitness Gym"
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Project Title (EN)</label>
                  <input
                    type="text"
                    value={projectForm.title_en}
                    onChange={e => setProjectForm({...projectForm, title_en: e.target.value})}
                    placeholder="Example: Fitness Gym App"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Desc ID & EN */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Deskripsi Projek (ID)</label>
                  <textarea
                    value={projectForm.desc_id}
                    onChange={e => setProjectForm({...projectForm, desc_id: e.target.value})}
                    placeholder="Deskripsi singkat projek dalam Bahasa Indonesia..."
                    rows={3}
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Project Description (EN)</label>
                  <textarea
                    value={projectForm.desc_en}
                    onChange={e => setProjectForm({...projectForm, desc_en: e.target.value})}
                    placeholder="Short description in English..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Category ID & EN */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Kategori (ID)</label>
                  <input
                    type="text"
                    value={projectForm.category_id}
                    onChange={e => setProjectForm({...projectForm, category_id: e.target.value})}
                    placeholder="Contoh: Website Profil / E-Commerce"
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Category (EN)</label>
                  <input
                    type="text"
                    value={projectForm.category_en}
                    onChange={e => setProjectForm({...projectForm, category_en: e.target.value})}
                    placeholder="Example: Profile Website / E-Commerce"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Tech & Link */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Teknologi / Tech Stack (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={projectForm.tech}
                    onChange={e => setProjectForm({...projectForm, tech: e.target.value})}
                    placeholder="Contoh: React, Node.js, Tailwind CSS"
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Tautan / Link Demo Projek (Opsional)</label>
                  <input
                    type="url"
                    value={projectForm.link}
                    onChange={e => setProjectForm({...projectForm, link: e.target.value})}
                    placeholder="https://projekanda.vercel.app"
                  />
                </div>
              </div>

              {/* Row 5: Image Keyword or URL */}
              <div className="form-modal-group">
                <label>Gambar Projek</label>
                <div className="image-upload-wrapper">
                  <div className="file-picker-container">
                    <label className={`file-picker-label glass ${isUploadingImage ? 'uploading' : ''}`}>
                      {isUploadingImage ? 'Mengunggah...' : <><FaUpload className="picker-icon" /> Pilih File Gambar</>}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'project')}
                        style={{ display: 'none' }}
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>
                  
                  <div className="manual-url-container">
                    <span className="manual-url-help">Atau masukkan URL / Kata Kunci Aset Lokal:</span>
                    <input
                      type="text"
                      value={projectForm.image_url}
                      onChange={e => setProjectForm({...projectForm, image_url: e.target.value})}
                      placeholder="Ketik 'fitnesgym', 'genzdrive' untuk aset lokal, atau URL gambar"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="dashboard-btn btn-secondary" onClick={() => setShowProjectModal(false)}>
                  Batal
                </button>
                <button type="submit" className="dashboard-btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Projek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL POP-UP 2: CREATE/EDIT CERTIFICATE FORM
          ------------------------------------------------------------- */}
      {showCertModal && (
        <div className="modal-backdrop glass">
          <div className="modal-container glass reveal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCert ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}</h3>
              <button className="modal-close-btn" onClick={() => setShowCertModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCertSubmit} className="modal-form-body">
              {/* Row 1: Title ID & EN */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Nama Sertifikat (ID)</label>
                  <input
                    type="text"
                    value={certForm.title_id}
                    onChange={e => setCertForm({...certForm, title_id: e.target.value})}
                    placeholder="Contoh: Junior Web Developer"
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Certificate Title (EN)</label>
                  <input
                    type="text"
                    value={certForm.title_en}
                    onChange={e => setCertForm({...certForm, title_en: e.target.value})}
                    placeholder="Example: Junior Web Developer Competency"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Issuer ID & EN */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Penerbit (ID)</label>
                  <input
                    type="text"
                    value={certForm.issuer_id}
                    onChange={e => setCertForm({...certForm, issuer_id: e.target.value})}
                    placeholder="Contoh: BNSP"
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Issuer (EN)</label>
                  <input
                    type="text"
                    value={certForm.issuer_en}
                    onChange={e => setCertForm({...certForm, issuer_en: e.target.value})}
                    placeholder="Example: National Certification Body"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Desc ID & EN */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Deskripsi (ID)</label>
                  <textarea
                    value={certForm.desc_id}
                    onChange={e => setCertForm({...certForm, desc_id: e.target.value})}
                    placeholder="Keterangan kompetensi dalam Bahasa Indonesia..."
                    rows={3}
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Description (EN)</label>
                  <textarea
                    value={certForm.desc_en}
                    onChange={e => setCertForm({...certForm, desc_en: e.target.value})}
                    placeholder="Competency description in English..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Row 4: Issue Date & Duration */}
              <div className="form-modal-row">
                <div className="form-modal-group">
                  <label>Tahun Terbit</label>
                  <input
                    type="text"
                    value={certForm.issue_date}
                    onChange={e => setCertForm({...certForm, issue_date: e.target.value})}
                    placeholder="Contoh: 2026 atau Feb 2026"
                    required
                  />
                </div>
                <div className="form-modal-group">
                  <label>Masa Berlaku</label>
                  <input
                    type="text"
                    value={certForm.duration}
                    onChange={e => setCertForm({...certForm, duration: e.target.value})}
                    placeholder="Contoh: 2026 - 2029, atau Selamanya"
                    required
                  />
                </div>
              </div>

              {/* Row 5: Image Keyword or URL */}
              <div className="form-modal-group">
                <label>Gambar Sertifikat</label>
                <div className="image-upload-wrapper">
                  <div className="file-picker-container">
                    <label className={`file-picker-label glass ${isUploadingImage ? 'uploading' : ''}`}>
                      {isUploadingImage ? 'Mengunggah...' : <><FaUpload className="picker-icon" /> Pilih File Gambar</>}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cert')}
                        style={{ display: 'none' }}
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>
                  
                  <div className="manual-url-container">
                    <span className="manual-url-help">Atau masukkan URL / Kata Kunci Aset Lokal:</span>
                    <input
                      type="text"
                      value={certForm.image_url}
                      onChange={e => setCertForm({...certForm, image_url: e.target.value})}
                      placeholder="Ketik 'bnsp' atau 'alibaba' untuk gambar lokal, atau URL gambar"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="dashboard-btn btn-secondary" onClick={() => setShowCertModal(false)}>
                  Batal
                </button>
                <button type="submit" className="dashboard-btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Sertifikat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
