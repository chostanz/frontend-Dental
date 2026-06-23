import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import apiClient from '../config/axiosConfig';
import "../style/DetailPesanan.css";
import "../style/style.css";

const DetailPesanan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pesanan, setPesanan] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 🌟 State untuk Modal Revisi
  const [showModalRevisi, setShowModalRevisi] = useState(false);
  const [catatanRevisi, setCatatanRevisi] = useState('');
  const [submittingRevisi, setSubmittingRevisi] = useState(false);

  // 🌟 Ambil Info Token untuk memastikan role Dokter
  const token = localStorage.getItem('token');
  let userEmail = localStorage.getItem('email') || 'user@gmail.com';
  let isDokter = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.email) userEmail = decoded.email;
      if (decoded.id_dokter) isDokter = true;
    } catch (e) {
      console.error("Token error:", e);
    }
  }

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const res = await apiClient.get(`/api/pesanan/${id}/full`);
      const data = res.data.data;

      setPesanan(data.pesanan);
      setDetailItems(data.detail_pesanan || []);
    } catch (err) {
      setErrorMsg('Gagal memuat detail pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailData();
    // eslint-disable-next-line
  }, [id]);

// 🌟 Fungsi Kirim Pengajuan Revisi ke Backend API
  const handleKirimRevisi = async () => {
    if (!catatanRevisi.trim()) {
      alert("Catatan poin revisi wajib diisi!");
      return;
    }
    setSubmittingRevisi(true);
    try {
      // Sesuaikan endpoint dan payload dengan backend Golang-mu
      await apiClient.post(`/api/revisi`, {
        id_pesanan: id,
        deskripsi_revisi: catatanRevisi
      });
      
      alert("Pengajuan revisi pesanan berhasil dikirim!");
      setShowModalRevisi(false);
      setCatatanRevisi('');
      fetchDetailData(); // Refresh data supaya statusnya otomatis berubah
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengajukan revisi.");
    } finally {
      setSubmittingRevisi(false);
    }
  };
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat data...</div>;
  if (errorMsg) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>{errorMsg}</div>;
  if (!pesanan) return <div style={{ padding: '50px', textAlign: 'center' }}>Pesanan tidak ditemukan.</div>;

  const totalKeseluruhan = detailItems.reduce((sum, item) => sum + (item.harga_satuan * item.jumlah), 0);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        {/* TOPBAR YANG KONSISTEN DENGAN EMAIL */}
        <div className="topbar">
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#676060', fontSize: '18px', cursor: 'pointer', marginRight: '15px' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2>Detail Transaksi</h2>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#676060' }}>{userEmail}</span>
            <i className="fa-regular fa-circle-user admin-avatar" style={{ fontSize: '24px', color: '#001a8d' }}></i>
          </div>
        </div>

        <div className="detail-page-wrapper">
          
          {/* HEADER SECTION - Tombol Revisi di Kanan Atas */}
          <div className="detail-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h1 className="detail-title" style={{ margin: 0 }}>Order ID: #{pesanan.id_pesanan?.substring(0,8).toUpperCase()}</h1>
              <span className="detail-status-badge" style={{
                background: pesanan.status_pesanan === 'selesai' ? '#8FF669' : pesanan.status_pesanan === 'ditolak' ? '#ff7f88' : '#F6F34C',
                color: '#222',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                {pesanan.status_pesanan}
              </span>
            </div>

            {/* TOMBOL REVISI: Hanya muncul untuk Dokter dan jika pesanan Selesai */}
            {isDokter && pesanan.status_pesanan === 'selesai' && (
              <button 
                onClick={() => setShowModalRevisi(true)}
                style={{ background: '#e11d48', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(225,29,72,0.2)' }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i> Ajukan Revisi
              </button>
            )}
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Informasi Umum</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Tanggal Pesanan</label>
                <p>{new Date(pesanan.tgl_pesanan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="info-item">
                <label>ID Dokter</label>
                <p>{pesanan.id_dokter}</p>
              </div>
            </div>
            {/* Tampilkan Riwayat Catatan Revisi jika ada di database */}
            {pesanan.catatan_revisi && (
              <div style={{ marginTop: '20px', background: '#fff7ed', border: '1px solid #fed7aa', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ color: '#c2410c', margin: '0 0 5px 0', fontSize: '13px' }}>Riwayat Catatan Revisi:</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>{pesanan.catatan_revisi}</p>
              </div>
            )}
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Rincian Protesa Dental</h3>
            <div className="detail-table-wrapper">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Gigi</th>
                    <th>Warna</th>
                    <th>Ukuran</th>
                    <th>Catatan</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Harga/Unit</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailItems.map((item, index) => (
                    <tr key={item.id_detail}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 'bold' }}>{item.kode_gigi}</td>
                      <td>{item.warna}</td>
                      <td>{item.ukuran}</td>
                      <td style={{ maxWidth: '200px', fontSize: '11px' }}>{item.catatan_tambahan || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{item.jumlah}</td>
                      <td style={{ textAlign: 'right' }}>Rp {Number(item.harga_satuan).toLocaleString('id-ID')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#3498db' }}>
                        Rp {(item.jumlah * item.harga_satuan).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="detail-total-section">
              <div className="total-box">
                <h4>Total Pembayaran</h4>
                <h2>Rp {totalKeseluruhan.toLocaleString('id-ID')}</h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🌟 MODAL FORM REVISI */}
      {showModalRevisi && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div className="modal-box" style={{ background: 'white', padding: '30px', borderRadius: '16px', maxWidth: '450px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1a5694', marginBottom: '10px' }}>Form Pengajuan Revisi</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
              Jelaskan secara detail bagian protesa gigi yang tidak sesuai / kurang pas agar teknisi dapat memperbaikinya.
            </p>
            
            <textarea 
              placeholder="Contoh: Elemen gigi 12 kurang rapat pada bagian margin servikal..."
              value={catatanRevisi}
              onChange={(e) => setCatatanRevisi(e.target.value)}
              style={{ width: '100%', height: '120px', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontFamily: 'Poppins', fontSize: '13px', outline: 'none', resize: 'none', color: '#222', background: '#f8fafc', boxSizing: 'border-box' }}
            />

            <div className="modal-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }} 
                onClick={() => setShowModalRevisi(false)} 
                disabled={submittingRevisi}
              >
                Batal
              </button>
              <button 
                style={{ flex: 1, padding: '12px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }} 
                onClick={handleKirimRevisi} 
                disabled={submittingRevisi}
              >
                {submittingRevisi ? "Mengirim..." : "Kirim Revisi"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DetailPesanan;