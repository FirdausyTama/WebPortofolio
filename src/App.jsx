import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Showcase from './components/Showcase';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio', 'login', 'dashboard'

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#dashboard') {
        const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
        if (isAuth) {
          setCurrentView('dashboard');
        } else {
          window.location.hash = '#login';
        }
      } else {
        setCurrentView('portfolio');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [currentView]);

  if (currentView === 'login') {
    return <Login onLoginSuccess={() => window.location.hash = '#dashboard'} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={() => window.location.hash = '#'} />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <About />
      <Showcase />
      <Contact />
      <ChatBot />
    </div>
  );
}

export default App;
