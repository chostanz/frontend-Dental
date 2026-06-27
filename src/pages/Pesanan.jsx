import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import apiClient from '../config/axiosConfig';
import Topbar from '../components/Topbar'; 
import "../style/style.css";

function Pesanan() {
  const navigate = useNavigate();
  const [pesananList, setPesananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  
  // Default bulan berjalan sekarang
  const [filterDate, setFilterDate] = useState(() => {
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, '0');
    return `${tahun}-${bulan}`;
  }); 

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

  // Pengaturan warna background & teks agar konsisten & rapi
  const getBadgeStyle = (status) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '6px 16px', // Ukuran padding disamakan rata untuk semua status
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textAlign: 'center',
      minWidth: '90px', // Menjaga lebar box badge tetap seragam
      textTransform: 'capitalize'
    };

    if (!status) return baseStyle;

    switch (status.toLowerCase()) {
      case 'proses':
      case 'produksi': 
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' }; // Kuning/Oranye
      case 'selesai': 
        return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' }; // Hijau soft
      case 'baru': 
        return { ...baseStyle, backgroundColor: '#cce5ff', color: '#004085' }; // Biru soft
      case 'revisi': 
        return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' }; // Abu-abu / Ungu muda
      case 'ditolak':
      case 'tolak': 
        return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' }; // Merah soft
      default: 
        return baseStyle;
    }
  };

  const formatKeTanggalLengkap = (tglStr) => {
    if (!tglStr || tglStr.length < 10) return '----';
    
    const tahun = tglStr.substring(0, 4);
    const kodeBulan = tglStr.substring(5, 7);
    const tanggal = tglStr.substring(8, 10);
    
    const daftarBulan = {
      '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
      '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
      '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };

    const namaBulan = daftarBulan[kodeBulan] || 'Januari';
    return `${parseInt(tanggal, 10)} ${namaBulan} ${tahun}`;
  };

  const filtered = pesananList.filter((item) => {
    const matchSearch =
      search === "" ||
      item.id_pesanan?.toLowerCase().includes(search.toLowerCase());
      
    const itemStatus = (item.status_pesanan || "").toLowerCase();
    
    let matchFilter = filterStatus === "Semua";
    if (!matchFilter) {
      if (filterStatus.toLowerCase() === "proses") {
        matchFilter = itemStatus === "proses" || itemStatus === "produksi";
      } else if (filterStatus.toLowerCase() === "ditolak") {
        matchFilter = itemStatus === "ditolak" || itemStatus === "tolak";
      } else {
        matchFilter = itemStatus === filterStatus.toLowerCase();
      }
    }

    let matchDate = true;
    if (filterDate && item.tgl_pesanan) {
      const dbYearMonth = item.tgl_pesanan.substring(0, 7); 
      matchDate = dbYearMonth === filterDate;
    }

    return matchSearch && matchFilter && matchDate;
  });

  return (
    <div className="dashboard-container">
      <div className="main-content">

        <Topbar 
          title="Pesanan" 
          rightAction={
            token && jwtDecode(token).id_dokter ? (
              <Link to="/buat-pesanan" className="btn" style={{ width: 'auto', padding: '10px 20px', textDecoration: 'none' }}>
                + Tambah Pesanan
              </Link>
            ) : null
          }
        />

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
              style={{
                padding: '0 38px 0 18px', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
                outline: 'none', 
                fontFamily: 'Poppins', 
                fontSize: '13px', 
                background: 'white', 
                color: '#222', 
                cursor: 'pointer', 
                height: '46px',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23676060' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '16px'
              }}
            >
              <option>Semua</option>
              <option>Proses</option>
              <option>Baru</option>
              <option>Selesai</option>
              <option>Revisi</option>
              <option>Ditolak</option>
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
                style={{background: 'none', border: 'none', color: '#e74c3c', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold'}}
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {/* Tabel Utama yang Diatur Simetris */}
        <div className="table-card" style={{ background: '#ffffff', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', padding: '10px', overflowX: 'auto' }}>
          {loading ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>Memuat pesanan...</p>
          ) : errorMsg ? (
            <p style={{ padding: '20px', textAlign: 'center', color: 'red', fontWeight: '500' }}>{errorMsg}</p>
          ) : (
            <table className="pesanan-table" style={{ width: '100%', borderCollapse: 'collapse', verticalAlign: 'middle' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #edf2f7' }}>
                  <th style={{ width: '15%', padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>ID</th>
                  <th style={{ width: '25%', padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>Pesanan</th>
                  <th style={{ width: '25%', padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>Tanggal Pesanan</th> 
                  <th style={{ width: '20%', padding: '16px 20px', textAlign: 'center', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>Status</th>
                  <th style={{ width: '15%', padding: '16px 20px', textAlign: 'center', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '35px', color: '#718096', fontSize: '14px' }}>Data pesanan tidak ditemukan.</td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id_pesanan} style={{ borderBottom: '1px solid #edf2f7', transition: 'background 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '18px 20px', fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>
                        {item.id_pesanan ? item.id_pesanan.substring(0,8).toUpperCase() : '----'}
                      </td>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: '#4a5568' }}>
                        Protesa Dental Lab
                      </td>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: '#4a5568' }}>
                        {formatKeTanggalLengkap(item.tgl_pesanan)}
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <span style={getBadgeStyle(item.status_pesanan)}>
                          {item.status_pesanan || '----'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <Link to={`/pesanan/detail/${item.id_pesanan}`} className="aksi-link" style={{ textDecoration: 'none', color: '#3182ce', fontWeight: '600', fontSize: '14px' }}>
                          Detail
                        </Link>
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