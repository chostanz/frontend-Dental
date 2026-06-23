import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/axiosConfig'; // Sesuaikan path config axios kamu
import "../style/style.css"; 

const Topbar = ({ title, showBackButton }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("Memuat...");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Ganti '/api/profil' sesuai dengan endpoint GET profile/detail user yang aktif di backend-mu
        const response = await apiClient.get('/api/profil/karyawan'); 
        
        // Pastikan properti email diambil sesuai respons JSON dari backend Golang-mu
        // (Biasa berupa response.data?.data?.email atau response.data?.email)
        const emailFromServer = response.data?.data?.email || response.data?.email || "admin@klinik.com";
        
        setUserEmail(emailFromServer);
        
        // Opsional: Simpan juga ke localStorage agar bisa dipakai halaman lain jika dibutuhkan
        localStorage.setItem('email', emailFromServer);
      } catch (error) {
        console.error("Gagal memuat profil untuk topbar:", error);
        // Fallback ke localStorage jika internet/API gagal, agar tidak stuck di tulisan "Memuat..."
        setUserEmail(localStorage.getItem('email') || 'admin@klinik.com');
      }
    };

    fetchProfileData();
  }, []);

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
          <i 
            className="fa-regular fa-circle-user admin-avatar" 
            style={{ fontSize: '24px', color: '#001a8d', cursor: 'pointer' }}
            onClick={() => navigate("/profil")}
            title="Ke Halaman Profil"
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Topbar;