import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 1. NAVBAR ATAS */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 80px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/assets/Logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
          <div>
            <span style={{ fontWeight: 'bold', color: '#333', fontSize: '18px', display: 'block', letterSpacing: '1px' }}>DENTAL LAB</span>
            <span style={{ fontSize: '11px', color: '#0C96E4', fontWeight: 'bold', display: 'block', letterSpacing: '0.5px' }}>MANUFACTURE</span>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '25px' }}>
          <a href="#home" style={{ textDecoration: 'none', color: '#0C96E4', fontWeight: 'bold' }}>Home</a>
          <a href="#tentang" style={{ textDecoration: 'none', color: '#666' }}>Tentang Kami</a>
          <a href="#layanan" style={{ textDecoration: 'none', color: '#666' }}>Layanan Lab</a>
        </nav>
      </header>

      {/* 2. HERO SECTION HUB */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', gap: '50px' }}>
        
        {/* Sisi Kiri: Teks & Tombol Portal */}
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <span style={{ backgroundColor: '#E3F2FD', color: '#0C96E4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
            ✨ Sistem Manajemen Pemesanan Protesa Dental
          </span>
          <h1 style={{ fontSize: '46px', color: '#2c3e50', marginBottom: '20px', lineHeight: '1.2', fontWeight: '80px' }}>
            Welcome to <br />
            <span style={{ color: '#0C96E4', fontWeight: 'bold' }}>Dental Lab Manufacture</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
            Solusi digital terbaik untuk klinik gigi Anda. Kami memproduksi restorasi dental, mahkota (crown), jembatan gigi (bridge), dan akrilik berkualitas tinggi dengan presisi maksimal dan waktu pengerjaan laboratorium yang efisien.
          </p>

          {/* DUA TOMBOL UTAMA MENUJU PORTAL LOGIN */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login-dokter" style={{ padding: '16px 30px', backgroundColor: '#0C96E4', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(12, 150, 228, 0.3)', textAlign: 'center', flex: 1, transition: '0.3s' }}>
              👨‍⚕️ Masuk Area Dokter
            </Link>
            <Link to="/login" style={{ padding: '16px 30px', backgroundColor: '#fff', color: '#333', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #ccc', textAlign: 'center', flex: 1, transition: '0.3s' }}>
              🏢 Portal Karyawan
            </Link>
          </div>
        </div>

        {/* Sisi Kanan: Ilustrasi Hero */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/src/assets/hero.png" 
            alt="Dental Manufacture Illustration" 
            style={{ width: '100%', maxWidth: '48px0px', objectFit: 'contain' }}
            onError={(e) => { e.target.src = "/assets/Logo.png" }} // Fallback jika path aset terlewat
          />
        </div>

      </main>

      {/* 3. FOOTER */}
      <footer style={{ textAlign: 'center', padding: '20px', color: '#aaa', fontSize: '13px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
        &copy; {new Date().getFullYear()} Dental Lab Manufacture System. Hak Cipta Dilindungi Undang-Undang.
      </footer>

    </div>
  );
}

export default LandingPage;