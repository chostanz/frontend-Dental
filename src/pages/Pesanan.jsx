import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import apiClient from '../config/axiosConfig';
import "../style/style.css";

function Pesanan() {
  const [pesananList, setPesananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        let isDokter = false;
        let idDokter = null;

        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.id_dokter) {
              isDokter = true;
              idDokter = decodedToken.id_dokter;
            }
          } catch (decodeErr) {
            console.error("Gagal decode token:", decodeErr);
          }
        }

        let response;
        if (isDokter && idDokter) {
          response = await apiClient.get(`/api/pesanan/dokter/${idDokter}`);
        } else {
          response = await apiClient.get('/api/pesanan');
        }

        const result = response.data?.data || response.data || [];
        setPesananList(Array.isArray(result) ? result : []);
        
      } catch (err) {
        console.error("Detail Gagal Fetching:", err.response || err.message);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          setErrorMsg('Sesi login Anda habis atau tidak memiliki hak akses.');
        } else {
          setErrorMsg('Gagal memuat data pesanan. Cek konsol log server.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'proses': return 'badge-proses';
      case 'selesai': return 'badge-selesai';
      case 'baru': return 'badge-baru';
      case 'revisi': return 'badge-revisi';
      default: return '';
    }
  };

  let isUserDokter = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.id_dokter) isUserDokter = true;
    } catch (e) {}
  }

  return (
    <div className="dashboard-container">
      {/* SIDEBAR DAN NAVIGASI DAPAT DISESUAIKAN BERDASARKAN LAYOUT DASHBOARD ANDA */}
      <div className="main-content">

        <div className="topbar">
          <div className="topbar-left">
            <h2>Pesanan</h2>
          </div>
          {isUserDokter && (
            <div className="topbar-right">
              <Link to="/buat-pesanan" className="btn" style={{ width: 'auto', padding: '10px 20px', textDecoration: 'none' }}>
                + Tambah Pesanan
              </Link>
            </div>
          )}
        </div>

        {/* FILTER BAR - Disesuaikan persis kotak-kotak card mockup figma */}
        <div className="filter-bar" style={{display: 'flex', gap: '14px', marginBottom: '20px'}}>
          <div className="filter-search" style={{background: 'white', padding: '10px 18px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
            <input type="text" placeholder="Cari Pesanan" style={{border: 'none', outline: 'none', fontFamily: 'Poppins', fontSize: '13px'}} />
          </div>

          <div className="filter-select">
            <select style={{padding: '12px 36px 12px 18px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', outline: 'none', fontFamily: 'Poppins', fontSize: '13px', background: 'white'}}>
              <option>Semua</option>
              <option>Proses</option>
              <option>Baru</option>
              <option>Selesai</option>
              <option>Revisi</option>
            </select>
          </div>

          <div className="filter-date" style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '12px 18px', fontSize: '13px'}}>
            <span>April 2026</span>
          </div>
        </div>

        {/* TABLE CARD - Dibungkus dengan background lembut .table-card dari style.css */}
        <div className="table-card">
          {loading ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>Memuat pesanan...</p>
          ) : errorMsg ? (
            <p style={{ padding: '20px', textAlign: 'center', color: 'red', fontWeight: '500' }}>{errorMsg}</p>
          ) : (
            <table className="pesanan-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pesanan</th>
                  <th>Tgl Pesanan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pesananList.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '25px', color: '#676060' }}>Belum ada data pesanan tercatat.</td>
                  </tr>
                ) : (
                  pesananList.map((item) => (
                    <tr key={item.id_pesanan}>
                      <td style={{ fontWeight: '600', color: '#222' }}>
                        {item.id_pesanan ? item.id_pesanan.substring(0,8).toUpperCase() : '-'}
                      </td>
                      <td style={{ fontSize: '12px', color: '#676060' }}>
                        {/* Menampilkan ringkasan pesanan atau produk lab jika direlasikan */}
                        Protesa Dental Lab
                      </td>
                      <td>{new Date(item.tgl_pesanan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                      <td>
                        <span className={`badge ${getStatusClass(item.status_pesanan)}`}>
                          {item.status_pesanan}
                        </span>
                      </td>
                      <td>
                        <Link to={`/pesanan/detail/${item.id_pesanan}`} className="aksi-link">Detail</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default Pesanan;