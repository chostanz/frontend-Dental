import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/axiosConfig'; 
import "../style/style.css"; 
import FotoProfil from "../assets/pfp.png";

// 🌟 Tambahkan props role ('karyawan' atau 'dokter')
const Topbar = ({ title, showBackButton, role = 'karyawan' }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("Memuat...");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 🌟 Tentukan endpoint secara kondisional berdasarkan props role
        const endpoint = role === 'dokter' ? '/api/profil/dokter' : '/api/profil/karyawan';
        
        const response = await apiClient.get(endpoint); 
        
        const emailFromServer = response.data?.data?.email || response.data?.email || "admin@klinik.com";
        setUserEmail(emailFromServer);
        localStorage.setItem('email', emailFromServer);
      } catch (error) {
        console.error("Gagal memuat profil untuk topbar:", error);
        setUserEmail(localStorage.getItem('email') || 'admin@klinik.com');
      }
    };

    fetchProfileData();
  }, [role]); // Tambahkan role sebagai dependensi useEffect

  return (
    <div className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center' }}>
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'transparent', border: 'none', color: '#676060', fontSize: '18px', cursor: 'pointer', marginRight: '15px' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
        <h2>{title}</h2>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#676060', fontWeight: '500' }}>{userEmail}</span>
         <img 
        src="/src/assets/pfp.png" 
        alt="Profil" 
        title="Ke Halaman Profil"
        style={{ 
          width: '100%', 
          maxWidth: '45px', 
          height: 'auto', 
          objectFit: 'contain', 
          cursor: 'pointer', /* Menampilkan kursor tangan saat dihover */
          borderRadius: '50%' /* Membuat gambar profil membulat estetik */
        }} 
        onClick={() => navigate("/profil")} // 🌟 Aksi navigasi dipindahkan ke sini
        onError={(e) => { e.target.src = {FotoProfil} }} 
      />
        </div>
      </div>
    </div>
  );
};

export default Topbar;