import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../config/axiosConfig';
import "../style/DetailPesanan.css";

const DetailPesanan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pesanan, setPesanan] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        // Menggunakan endpoint /full yang sudah Anda daftarkan untuk dokter maupun karyawan
        const res = await apiClient.get(`/api/pesanan/${id}/full`);
        const data = res.data.data;

        // Ambil dari struct lengkap/full
        setPesanan(data.pesanan);
        setDetailItems(data.detail_pesanan || []);
      } catch (err) {
        setErrorMsg('Gagal memuat detail pesanan.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat data...</div>;
  if (errorMsg) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>{errorMsg}</div>;
  if (!pesanan) return <div style={{ padding: '50px', textAlign: 'center' }}>Pesanan tidak ditemukan.</div>;

  const totalKeseluruhan = detailItems.reduce((sum, item) => sum + (item.harga_satuan * item.jumlah), 0);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        <div className="topbar">
          <div className="topbar-left">
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#676060', fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2>Detail Transaksi</h2>
          </div>
        </div>

        <div className="detail-page-wrapper">
          <div className="detail-header-section">
            <h1 className="detail-title">Order ID: #{pesanan.id_pesanan?.substring(0,8).toUpperCase()}</h1>
            <span className="detail-status-badge" style={{
              background: pesanan.status_pesanan === 'selesai' ? '#8FF669' : pesanan.status_pesanan === 'ditolak' ? '#ff7f88' : '#F6F34C',
              color: '#222'
            }}>
              {pesanan.status_pesanan}
            </span>
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
    </div>
  );
};

export default DetailPesanan;