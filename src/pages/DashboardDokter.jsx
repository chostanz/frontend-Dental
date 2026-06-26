import { useState, useEffect } from "react";
import apiClient from "../config/axiosConfig"; 
function DashboardDokter() {
  // Tempat menampung data dari API jika nanti dibutuhkan (contoh: data ringkasan/summary)
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Contoh template useEffect jika ke depannya Anda ingin mengambil data API untuk Dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // const response = await apiClient.get("/doctor/dashboard-summary");
        // setSummaryData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ flex: 1, padding: '35px', background: '#f0f7ff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header Atas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>Dashboard Dokter</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#4a5568', fontWeight: '500' }}>zahida@gmail.com</span>
          {/* Avatar Icon */}
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
      </div>

      {/* Konten Utama Container */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        
        {/* Banner Welcome Kotak Putih */}
        <div style={{ width: '100%', maxWidth: '750px', background: '#ffffff', borderRadius: '24px', padding: '50px 40px', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* PERUBAHAN: Logo Gigi 3D diganti dengan SVG Icon Gigi Flat Berwarna Biru Cerah */}
          <div style={{ marginBottom: '20px', color: '#2298ea' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.5 2 6.5 4.5 6 8c-.5 3.5-1 5.5-2 7 1.5 2.5 3 2.5 4 1 1 2.5 3 3 4 1.5 1 1.5 3 1 4-1.5 1 1.5 2.5-1 4-2.5-1-1.5-1.5-3-2-7-.5-3.5-2.5-6-6-6z" />
            </svg>
          </div>

          {/* Text Title */}
          <h2 style={{ color: '#0f52ba', fontSize: '26px', fontWeight: '800', letterSpacing: '0.5px', margin: '0 0 15px 0' }}>
            DENTAL MANAGEMENT SYSTEM
          </h2>
          
          {/* Deskripsi */}
          <p style={{ color: '#4a5568', fontSize: '15px', fontWeight: '500', lineHeight: '1.6', maxWidth: '580px', margin: '0 0 35px 0' }}>
            Selamat datang di Dental Management System. Kami menyediakan berbagai macam produk gigi palsu yang premium, awet, dengan harga terjangkau.
          </p>

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
            <button style={{ padding: '13px 28px', background: '#34a8e4', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(52, 168, 228, 0.3)' }}>
              Pesan Sekarang
            </button>
            <button style={{ padding: '13px 28px', background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              Lihat Katalog Produk
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardDokter;