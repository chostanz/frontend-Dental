import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import apiClient from '../config/axiosConfig';
import "../style/style.css";
import "../style/Produksi.css"; 

// === 1. STATISTIK KEUANGAN & JUMLAH (Khusus CS & Bos) ===
const BosCsStats = () => {
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

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data statistik...</div>;

  return (
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
        <div className="stat-number" style={{ fontSize: '24px' }}>
          Rp {stats?.total_pendapatan?.toLocaleString('id-ID') || 0}
        </div>
      </div>
    </div>

    
  );
};

// === 2. MODUL RANGKUMAN BAWAH (Intip Status Produksi & Pesanan Terbaru) ===
const OperationalSummary = () => {
  const [pengerjaanList, setPengerjaanList] = useState([]);

  useEffect(() => {
    const fetchPengerjaan = async () => {
      try {
        const res = await apiClient.get("/api/produksi");
        setPengerjaanList(res.data.data || []);
      } catch (err) {
        console.error("Gagal load data pengerjaan ringkasan:", err);
      }
    };
    fetchPengerjaan();
  }, []);

  const pesananTerbaru = pengerjaanList.slice(0, 4);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "dikerjakan": return "badge badge-proses";
      case "selesai": return "badge badge-selesai";
      case "revisi": return "badge badge-revisi";
      default: return "badge badge-baru";
    }
  };

  return (
    <div className="bottom-grid" style={{ marginTop: '20px' }}>
      <div className="card pesanan-card" style={{flex: 1}}>
        <div className="card-header">
          <h3>Pesanan Produksi Terbaru</h3>
          <Link to="/produksi">Lihat Semua</Link>
        </div>

        {pesananTerbaru.length === 0 ? (
          <p style={{textAlign: 'center', padding: '20px', color: '#676060', fontSize: '13px'}}>Tidak ada antrean pengerjaan.</p>
        ) : (
          pesananTerbaru.map((item) => (
            <div className="pesanan-item" key={item.id_pengerjaan}>
              <div className="pesanan-info">
                <p className="drg-name">drg. {item.nama_dokter}</p>
                <p className="drg-sub">{item.nama_bahan || "Protesa Dental"} • Gigi: {item.kode_gigi || '-'}</p>
              </div>
              <span className={getStatusBadgeClass(item.status_produksi)}>
                {item.status_produksi}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="right-col" style={{width: '320px'}}>
        <div className="card" style={{height: '100%'}}>
          <h3 className="card-title" style={{borderBottom: '1px solid #f0f4f8', paddingBottom: '10px'}}>Progres Pengerjaan Bahan</h3>
          
          <div className="produksi-item" style={{marginTop: '15px'}}>
            <span className="produksi-label">Crown (Mahkota)</span>
            <span className="produksi-pct" style={{background: '#e6f0fa', color: '#001a8d'}}>78%</span>
          </div>
          <div className="produksi-item">
            <span className="produksi-label">Veneer</span>
            <span className="produksi-pct" style={{background: '#e6f0fa', color: '#001a8d'}}>62%</span>
          </div>
          <div className="produksi-item">
            <span className="produksi-label">Bridge (Jembatan)</span>
            <span className="produksi-pct" style={{background: '#e6f0fa', color: '#001a8d'}}>45%</span>
          </div>
          <div className="produksi-item">
            <span className="produksi-label">Gigi Tiruan</span>
            <span className="produksi-pct" style={{background: '#e6f0fa', color: '#001a8d'}}>30%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// === 3. DASHBOARD DOKTER (Sesuai Figma Landing Page + Tombol Aksi) ===
const DokterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", width: "100%" }}>
      <div style={{ background: "white", padding: "60px 40px", borderRadius: "24px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", maxWidth: "650px", width: "100%" }}>
        <div style={{ fontSize: "70px", marginBottom: "20px" }}>🦷</div>
        <h1 style={{ color: "#1a5694", fontSize: "28px", fontWeight: "850", margin: "0 0 15px 0" }}>DENTAL MANAGEMENT SYSTEM</h1>
        <p style={{ fontWeight: "600", color: "#4a5568", lineHeight: "1.6", marginBottom: "35px" }}>
          Selamat datang di Dental Management System. Kami menyediakan berbagai macam produk gigi palsu yang premium, awet, dengan harga terjangkau.
        </p>
        
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={() => navigate("/buat-pesanan")}
            style={{ padding: "16px 35px", background: "#73c2fb", color: "white", border: "none", borderRadius: "14px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", boxShadow: "0 6px 20px rgba(115,194,251,0.3)" }}
          >
            Pesan Sekarang
          </button>
          <button 
            onClick={() => navigate("/produk")}
            style={{ padding: "16px 35px", background: "#f4f7f6", color: "#4a5568", border: "1px solid #cbd5e1", borderRadius: "14px", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}
          >
            Lihat Katalog Produk
          </button>
        </div>
      </div>
    </div>
  );
};

// === 4. DASHBOARD UTAMA (Directing Dinamis Berdasarkan Role) ===
const Dashboard = () => {
  const role = localStorage.getItem('role') || 'guest';
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [profil, setProfil] = useState({ nama: "", email: "" });

  useEffect(() => {
    const fetchUserIdentifier = async () => {
      if (!token) return;
      try {
        const res = await apiClient.get("/api/profil");
        const data = res.data.data;
        setProfil({
          nama: data.nama || data.nama_dokter || "User",
          email: data.email
        });
      } catch (err) {
        console.error("Gagal get profil navbar", err);
        try {
          const decoded = jwtDecode(token);
          setProfil({
            nama: decoded.nama || decoded.nama_dokter || "User",
            email: decoded.email || "—"
          });
        } catch(e) {
          setProfil({ nama: "User", email: "—" });
        }
      }
    };
    fetchUserIdentifier();
  }, [token]);

  return (
    <div className="dashboard-container">
      <div className="main-content">

        {/* TOPBAR - Dinamis, Menampilkan nama dan email aktif */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Dashboard</h2>
          </div>
          <div className="topbar-right">
            <span style={{marginRight: '8px'}}>Halo, <b>{profil.nama}</b></span> 
            <span style={{fontSize: '13px', color: '#676060'}}>{profil.email}</span>
            {/* Mengarahkan ke halaman profil saat ikon diklik */}
            <i 
              className="fa-regular fa-circle-user admin-avatar" 
              style={{marginLeft: '12px', fontSize: '24px', cursor: 'pointer', color: '#001a8d'}}
              title="Ke Halaman Profil & Ganti Password"
              onClick={() => navigate("/profil")}
            ></i>
          </div>
        </div>

        {/* TAMPILAN STATISTIK KEUANGAN (Hanya untuk CS & Bos) */}
        {(role === 'bos' || role === 'cs') && <BosCsStats />}
        
        {/* TAMPILAN LANDING PAGE (Hanya untuk Dokter) */}
        {role === 'dokter' && <DokterDashboard />}
        
        {/* TAMPILAN OPERASIONAL & INTIM KELOLAAN LAB */}
        {(role === 'teknisi' || role === 'cs' || role === 'bos') && <OperationalSummary />}

        {/* TAMPILAN JIKA GUEST / EXPIRED */}
        {role === 'guest' && (
          <div className="card" style={{padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', marginTop: '30px'}}>
            <h3 style={{color: '#e74c3c'}}> Sesi Login Anda tidak terdeteksi, silakan login ulang. </h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;