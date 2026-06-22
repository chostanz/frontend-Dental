import React, { useState, useEffect } from 'react';
import apiClient from '../config/axiosConfig';

// === DASHBOARD KHUSUS BOS & CS ===
const BosCsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        const response = await apiClient.get('/api/dashboard/statistik');
        setStats(response.data.data); 
      } catch (err) {
        console.error("Gagal load statistik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistik();
  }, []);

  if (loading) return <div>Memuat data statistik...</div>;

  return (
    <>
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total Pesanan</div>
          <div className="stat-number">{stats?.total_pesanan || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Menunggu</div>
          <div className="stat-number">{stats?.pesanan_menunggu || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Diproses</div>
          <div className="stat-number">{stats?.pesanan_diproses || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Pendapatan</div>
          {/* Font diperkecil sedikit agar Rp muat di kotak */}
          <div className="stat-number" style={{ fontSize: '24px' }}>
            Rp {stats?.total_pendapatan?.toLocaleString('id-ID') || 0}
          </div>
        </div>
      </div>
    </>
  );
};

// === DASHBOARD UTAMA ===
const Dashboard = () => {
  const role = localStorage.getItem('role') || 'guest';

  return (
    <>
      {/* Topbar ini yang bikin atasnya kelihatan rapi sesuai desain */}
      <div className="topbar">
        <div className="topbar-left">
          <h2>Dashboard</h2>
        </div>
        <div className="topbar-right">
          <span>Hallo, <b style={{ textTransform: 'uppercase' }}>{role}</b></span>
          <i className="fa-regular fa-circle-user admin-avatar"></i>
        </div>
      </div>

      {/* Render Sub-Komponen Berdasarkan Role */}
      {(role === 'bos' || role === 'cs') && <BosCsDashboard />}
      
      {role === 'dokter' && <div className="card"><h3>Data Dokter (Segera Hadir)</h3></div>}
      
      {role === 'teknisi' && <div className="card"><h3>Antrian Teknisi (Segera Hadir)</h3></div>}
    </>
  );
};

const DokterDashboard = () => {
  const [pesananSaya, setPesananSaya] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPesananDokter = async () => {
      try {
        // Catatan: Pastikan API ini hanya mengembalikan data pesanan milik dokter yang sedang login
        const response = await apiClient.get('/api/pesanan');
        const data = response.data.data || response.data || [];
        setPesananSaya(data); 
      } catch (err) {
        console.error("Gagal memuat data dokter:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPesananDokter();
  }, []);

  if (loading) return <div>Memuat data pesanan klinik...</div>;

  // --- LOGIKA PERHITUNGAN CEPAT (Frontend) ---
  // Menghitung jumlah pesanan berdasarkan statusnya
  const pesananAktif = pesananSaya.filter(p => p.status_pesanan !== 'selesai' && p.status_pesanan !== 'dikirim').length;
  const pesananSelesai = pesananSaya.filter(p => p.status_pesanan === 'selesai' || p.status_pesanan === 'dikirim').length;
  
  // Mengambil 5 pesanan terbaru saja untuk ditampilkan di tabel
  const pesananTerbaru = pesananSaya.slice(0, 5);

  return (
    <div className="dokter-dashboard-container">
      {/* 1. KARTU STATISTIK DOKTER */}
      <div className="stat-cards" style={{ marginBottom: '25px' }}>
        <div className="stat-card" style={{ background: '#e3f2fd', borderLeft: '5px solid #0C96E4' }}>
          <div className="stat-label">Pesanan Sedang Diproses</div>
          <div className="stat-number">{pesananAktif}</div>
        </div>
        <div className="stat-card" style={{ background: '#e8f5e9', borderLeft: '5px solid #4caf50' }}>
          <div className="stat-label">Pesanan Selesai / Dikirim</div>
          <div className="stat-number">{pesananSelesai}</div>
        </div>
        <div className="stat-card" style={{ background: '#fff3e0', borderLeft: '5px solid #ff9800' }}>
          <div className="stat-label">Total Semua Pesanan</div>
          <div className="stat-number">{pesananSaya.length}</div>
        </div>
      </div>

      {/* 2. TOMBOL AKSI CEPAT */}
      <div style={{ marginBottom: '25px' }}>
        <Link to="/buat-pesanan" className="btn" style={{ background: '#0C96E4', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', display: 'inline-block', fontWeight: 'bold' }}>
          + Buat Pesanan Baru
        </Link>
        <Link to="/katalog-produk" className="btn" style={{ background: '#f4f7f6', color: '#333', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', display: 'inline-block', marginLeft: '10px', border: '1px solid #ccc' }}>
          Lihat Katalog
        </Link>
      </div>

      {/* 3. TABEL PESANAN TERBARU */}
      <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Pesanan Terbaru Anda</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px 5px' }}>ID Pesanan</th>
              <th style={{ padding: '10px 5px' }}>Tanggal</th>
              <th style={{ padding: '10px 5px' }}>Nama Pasien</th>
              <th style={{ padding: '10px 5px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pesananTerbaru.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Belum ada riwayat pesanan.</td></tr>
            ) : (
              pesananTerbaru.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 5px' }}><b>{item.id_pesanan || `PSN-00${index+1}`}</b></td>
                  <td style={{ padding: '10px 5px' }}>{item.tanggal_pesanan || 'Hari ini'}</td>
                  <td style={{ padding: '10px 5px' }}>{item.nama_pasien || '-'}</td>
                  <td style={{ padding: '10px 5px' }}>
                    {/* Badge Status Sederhana */}
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      fontSize: '12px',
                      background: item.status_pesanan === 'selesai' ? '#8FF669' : '#F6F34C' 
                    }}>
                      {item.status_pesanan || 'Proses'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/pesanan" style={{ color: '#0C96E4', fontSize: '14px', textDecoration: 'none' }}>Lihat Semua Pesanan &rarr;</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;