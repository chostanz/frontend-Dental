import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import apiClient from '../config/axiosConfig';
import "../style/style.css";
import "../style/Produksi.css"; 

function Profil() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'guest';
  const token = localStorage.getItem('token');

  // State Data Profil
  const [formData, setFormData] = useState({
    email: '',
    nama: '',
    no_hp: ''
  });

  // State Modal Password
  const [showModal, setShowModal] = useState(false);
  const [passData, setPassData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Data Profil
useEffect(() => {
    const fetchProfil = async () => {
      try {
        // Tentukan endpoint berdasarkan role yang sedang aktif
        const endpoint = role === 'dokter' ? '/api/profil/dokter' : '/api/profil/karyawan';
        
        const res = await apiClient.get(endpoint);
        const data = res.data.data;
        
        setFormData({
          email: data.email,
          nama: data.nama_dokter || data.nama || '',
          no_hp: data.no_hp || ''
        });
      } catch (err) {
        console.error("Gagal load profil", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, [role]);

  const handleUpdateProfil = async () => {
    setSubmitting(true);
    try {
      const endpoint = role === 'dokter' ? '/api/profil/dokter' : '/api/profil/karyawan';
      await apiClient.put(endpoint, {
        nama: formData.nama, 
        nama_dokter: formData.nama, 
        no_hp: formData.no_hp
      });
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update profil");
    } finally {
      setSubmitting(false);
    }
  };


  const handleGantiPassword = async () => {
    if (passData.new_password !== passData.confirm_password) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = role === 'dokter' ? '/api/dokter/change-password' : '/karyawan/change-password';
      await apiClient.put(endpoint, {
        old_password: passData.old_password,
        new_password: passData.new_password
      });
      alert("Password berhasil diubah!");
      setShowModal(false);
      setPassData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Gagal ganti password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="main-content">Memuat profil...</div>;

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Profil</h2>
          </div>
          <div className="topbar-right">
             <span style={{fontSize: '14px', color: '#676060'}}>{formData.email}</span>
             <i className="fa-regular fa-circle-user admin-avatar" style={{marginLeft: '10px', fontSize: '24px'}}></i>
          </div>
        </div>

        {/* LINK KEMBALI */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#0C96E4', cursor: 'pointer', fontWeight: '600' }}>
            ← Kembali
          </button>
        </div>

        {/* KONTEN UTAMA (CENTER CARD) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <div style={{ background: '#D7F0FF', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
            
            {/* INPUT EMAIL (READONLY) */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#666' }}>Email</label>
              <input 
                type="text" 
                value={formData.email} 
                disabled 
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: '#f9f9f9' }}
              />
            </div>

            {/* INPUT NAMA */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#666' }}>Nama</label>
              <input 
                type="text" 
                value={formData.nama} 
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', color:'#666', background:'white'}}
              />
            </div>

            {/* INPUT NO HP */}
            <div style={{ marginBottom: '25px'}}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color:'#666' }}>No Hp</label>
              <input 
                type="text" 
                value={formData.no_hp} 
                onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', color:'#666', background:'white' }}
              />
            </div>

            {/* TOMBOL AKSI */}
            <button 
              onClick={handleUpdateProfil}
              disabled={submitting}
              style={{ width: '100%', padding: '12px', background: '#0C96E4', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}
            >
              {submitting ? "Menyimpan..." : "Update Profil"}
            </button>

            <button 
              onClick={() => setShowModal(true)}
              style={{ width: '100%', padding: '12px', background: '#FF4D4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Ganti Password
            </button>

          </div>
        </div>
      </div>

      {/* MODAL GANTI PASSWORD (POPUP) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '400px', background:'#D7F0FF'}}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Ganti Password</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <input 
                type="password" 
                placeholder="Password Lama"
                className="modal-select" 
                value={passData.old_password}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', color:'#666', background:'white' }}
                onChange={(e) => setPassData({...passData, old_password: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <input 
                type="password" 
                placeholder="Password Baru"
                className="modal-select" 
                value={passData.new_password}
                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', color:'#666', background:'white' }}
                onChange={(e) => setPassData({...passData, new_password: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input 
                type="password" 
                placeholder="Konfirmasi Password Baru"
                className="modal-select" 
                value={passData.confirm_password}
                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', color:'#666', background:'white' }}
                onChange={(e) => setPassData({...passData, confirm_password: e.target.value})}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-reject" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-approve" onClick={handleGantiPassword} disabled={submitting}>
                {submitting ? "Proses..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profil;