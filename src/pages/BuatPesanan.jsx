import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/axiosConfig';
import "../style/BuatPesanan.css";

const BuatPesanan = () => {
  const navigate = useNavigate();
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [items, setItems] = useState([
    { id_produk: '', warna: '', ukuran: '', jumlah: 1, kode_gigi: '', catatan_tambahan: '' }
  ]);

  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [subtotalKeseluruhan, setSubtotalKeseluruhan] = useState(0);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await apiClient.get('/api/produk');
        setProdukList(response.data.data || response.data || []);
      } catch (err) {
        console.error("Gagal load produk:", err);
      }
    };
    fetchProduk();
  }, []);

  useEffect(() => {
    let total = 0;
    items.forEach(item => {
      if (item.id_produk) {
        const produk = produkList.find(p => p.id_produk === item.id_produk);
        if (produk) {
          total += parseFloat(produk.harga) * parseInt(item.jumlah || 1);
        }
      }
    });
    setSubtotalKeseluruhan(total);
  }, [items, produkList]);

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const handleTambahDetail = () => {
    setItems([...items, { id_produk: '', warna: '', ukuran: '', jumlah: 1, kode_gigi: '', catatan_tambahan: '' }]);
  };

  const handleHapusDetail = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Mapping items ke format detail_pesanan yang benar
      const detailPesanan = items.map(item => {
        const produk = produkList.find(p => p.id_produk === item.id_produk);
        return {
          id_produk: item.id_produk,
          kode_gigi: item.kode_gigi,
          ukuran: item.ukuran,
          warna: item.warna,
          jumlah: parseInt(item.jumlah),
          harga_satuan: produk ? parseFloat(produk.harga) : 0, // ambil harga dari produkList
          catatan_tambahan: item.catatan_tambahan
        };
      });

      const payload = {
        detail_pesanan: detailPesanan
      };


      await apiClient.post('/api/pesanan/dokter', payload);
      alert('Pesanan berhasil dibuat!');
      navigate('/pesanan'); 
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        <div className="topbar" style={{ padding: '20px 0 10px' }}>
          <div className="topbar-left">
            <h2>Tambah Pesanan</h2>
          </div>
        </div>

        <div className="pesanan-page-wrapper">
          <button className="pesanan-back-btn" onClick={() => navigate('/pesanan')}>
            &larr; Kembali
          </button>
          
          {errorMsg && <div style={{ background: '#ffebee', color: 'red', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            
            {items.map((item, index) => (
              <div key={index} className="pesanan-card-item">
                
                <div className="pesanan-card-header">
                  <h3>Item Pesanan {index + 1}</h3>
                  {items.length > 1 && (
                    <button type="button" className="pesanan-del-btn" onClick={() => handleHapusDetail(index)}>Hapus Item</button>
                  )}
                </div>

                <div className="pesanan-form-grid">
                  
                  <div className="pesanan-input-group">
                    <label>Kode Gigi</label>
                    <input type="text" name="kode_gigi" placeholder="Contoh: 1.1, 2.1..." value={item.kode_gigi} onChange={(e) => handleItemChange(index, e)} required />
                  </div>

                  <div className="pesanan-input-group">
                    <label>Ukuran</label>
                    <div className="pesanan-input-suffix">
                      <input type="text" name="ukuran" value={item.ukuran} onChange={(e) => handleItemChange(index, e)} required />
                      <span className="pesanan-suffix-text">cm</span>
                    </div>
                  </div>

                  <div className="pesanan-input-group">
                    <label>Warna / Shade</label>
                    <input type="text" name="warna" placeholder="A2, B3, Natural..." value={item.warna} onChange={(e) => handleItemChange(index, e)} required />
                  </div>

                  <div className="pesanan-input-group">
                    <label>Jumlah</label>
                    <input type="number" name="jumlah" min="1" value={item.jumlah} onChange={(e) => handleItemChange(index, e)} required />
                  </div>

                  <div className="pesanan-input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Jenis Produk</label>
                    <select name="id_produk" value={item.id_produk} onChange={(e) => handleItemChange(index, e)} required>
                      <option value="" disabled>-- Pilih Jenis Protesa --</option>
                      {produkList.map(p => (
                        <option key={p.id_produk} value={p.id_produk}>
                          {p.nama_bahan} - Rp {Number(p.harga).toLocaleString('id-ID')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pesanan-input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Catatan untuk Teknisi</label>
                    <textarea name="catatan_tambahan" placeholder="Instruksi Khusus, referensi bentuk, warna oklusal" value={item.catatan_tambahan} onChange={(e) => handleItemChange(index, e)}></textarea>
                  </div>

                </div>
              </div>
            ))}

            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <button type="button" className="pesanan-add-btn" onClick={handleTambahDetail}>
                + Tambah Detail
              </button>
            </div>

            <hr style={{ border: '0', borderTop: '2px solid #ccc', marginBottom: '25px' }} />

            <div className="pesanan-input-group" style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>Pilih Metode Pembayaran</label>
              <select value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)} required>
                <option value="" disabled>-- Pilih Metode Pembayaran --</option>
                <option value="transfer">Transfer Bank</option>
                <option value="qris">QRIS</option>
                <option value="gopay">GoPay</option>
                <option value="tunai">Tunai</option>
              </select>
            </div>

            <div className="pesanan-footer">
              <h3>
                Subtotal: <span>Rp {subtotalKeseluruhan.toLocaleString('id-ID')}</span>
              </h3>
              
              <div className="pesanan-action-group">
                <button type="button" className="pesanan-btn-batal" onClick={() => navigate('/pesanan')}>Batal</button>
                <button type="submit" className="pesanan-btn-pesan" disabled={loading}>
                  {loading ? 'Memproses...' : 'Pesan'}
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default BuatPesanan;