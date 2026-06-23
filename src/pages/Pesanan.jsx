import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import apiClient from '../config/axiosConfig';
import Topbar from '../components/Topbar'; // 🌟 Integrasi Topbar Dinamis
import "../style/style.css";

function Pesanan() {
  const navigate = useNavigate();
  const [pesananList, setPesananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State pencarian dan filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterDate, setFilterDate] = useState(''); // Default kosong

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
          setErrorMsg('Gagal memuat data pesanan.');
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

  // 🌟 LOGIKA FILTER & SEARCH RAPI AMAN DARI ZONA WAKTU DB
  const filtered = pesananList.filter((item) => {
    const matchSearch =
      search === "" ||
      item.id_pesanan?.toLowerCase().includes(search.toLowerCase());
      
    const itemStatus = (item.status_pesanan || "").toLowerCase();
    const matchFilter =
      filterStatus === "Semua" || itemStatus === filterStatus.toLowerCase();

    let matchDate = true;
    if (filterDate && item.tgl_pesanan) {
      // Ambil 10 digit awal string tanggal (YYYY-MM-DD) kemudian potong (YYYY-MM)
      const dateString = item.tgl_pesanan.substring(0, 10);
      const dbMonthStr = dateString.substring(0, 7); 
      matchDate = dbMonthStr === filterDate;
    }

    return matchSearch && matchFilter && matchDate;
  });

  return (
    <div className="dashboard-container">
      <div className="main-content">

        {/* 🌟 Topbar Dinamis Rapi */}
        <Topbar 
          title="Pesanan" 
          rightAction={
            isUserDokter ? (
              <Link to="/buat-pesanan" className="btn" style={{ width: 'auto', padding: '10px 20px', textDecoration: 'none' }}>
                + Tambah Pesanan
              </Link>
            ) : null
          }
        />

        {/* 🌟 FILTER BAR (Tinggi Mutlak Dikunci 46px Biar Sejajar Sempurna) */}
        <div className="filter-bar" style={{display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'center'}}>
          
          <div className="filter-search" style={{background: 'white', padding: '0 18px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, height: '46px', display: 'flex', alignItems: 'center'}}>
            <input 
              type="text" 
              placeholder="Cari ID Pesanan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{border: 'none', outline: 'none', fontFamily: 'Poppins', fontSize: '13px', width: '100%', color: '#222', background: 'transparent'}} 
            />
          </div>

          <div className="filter-select">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{padding: '0 36px 0 18px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', outline: 'none', fontFamily: 'Poppins', fontSize: '13px', background: 'white', color: '#222', cursor: 'pointer', height: '46px'}}
            >
              <option>Semua</option>
              <option>Proses</option>
              <option>Baru</option>
              <option>Selesai</option>
              <option>Revisi</option>
            </select>
          </div>

          <div className="filter-date" style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '0 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', height: '46px'}}>
            <input 
              type="month" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{border: 'none', outline: 'none', fontFamily: 'Poppins', fontSize: '13px', cursor: 'pointer', background: 'white', color: '#222'}}
            />
            
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                title="Tampilkan Semua Bulan"
                style={{background: 'none', border: 'none', color: '#e74c3c', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold'}}
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {/* TABLE CARD */}
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '25px', color: '#676060' }}>Data pesanan tidak ditemukan.</td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id_pesanan}>
                      <td style={{ fontWeight: '600', color: '#222' }}>
                        {item.id_pesanan ? item.id_pesanan.substring(0,8).toUpperCase() : '-'}
                      </td>
                      <td style={{ fontSize: '12px', color: '#676060' }}>
                        Protesa Dental Lab
                      </td>
                      <td>{new Date(item.tgl_pesanan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                      <td>
                        <span className={`badge ${getStatusClass(item.status_pesanan)}`} style={{textTransform: 'capitalize'}}>
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