import React from 'react';
import { Link } from 'react-router-dom';
import "../style/LandingPage.css"; 

function LandingPage() {
  return (
    <div className="landing-wrapper">
      
      {/* NAVBAR ATAS */}
      <header className="landing-header">
        <div className="logo-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
         
          <img 
            src="/assets/Logo.png" 
            alt="" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1.2' }}>
            <span className="logo-text" style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a', letterSpacing: '0.5px' }}>DENTAL LAB</span>
            <span className="logo-subtext" style={{ fontWeight: '600', fontSize: '11px', color: '#3498db', letterSpacing: '1px' }}>MANUFACTURE</span>
          </div>
        </div>
        
        <nav className="nav-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#tentang" className="nav-link">Tentang Kami</a>
          <a href="#layanan" className="nav-link">Layanan Lab</a>
        </nav>
      </header>

     
      <main className="landing-main">
        <div className="hero-left">
          <div className="badge-tag">
            ✨ Digital Prosthetic Management System
          </div>
          <h1 className="hero-title">
            Precision & Quality <br />
            <span className="highlight">For Your Dental Lab</span>
          </h1>
          <p className="hero-desc">
            Platform digital end-to-end untuk restorasi dental modern. Mudahkan alur 
            pemesanan, produksi crown, bridge, veneer, hingga akrilik dengan presisi maksimal.
          </p>

          <div className="hero-buttons">

            <Link to="/login-dokter" className="btn-portal btn-primary">
              Mulai Pesan
            </Link>
          </div>
        </div>

        <div className="hero-right">
  
          <img 
            src="/assets/Logo.png" 
            alt="" 
          />
        </div>
      </main>

    
      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} Dental Lab Manufacture. All rights reserved. 
        <span style={{marginLeft: '20px', fontSize: '10px', color: '#cbd5e1'}}>
          <Link to="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Internal System</Link>
        </span>
      </footer>

    </div>
  );
}

export default LandingPage;