import React, { useState, useEffect } from 'react';
import apiClient from '../config/axiosConfig';
import "../style/style.css";
import Topbar from '../components/Topbar';

const KatalogProduk = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id_produk: '', nama_bahan: '', spesifikasi: '', harga: '' });

  const role = localStorage.getItem('role');
  const isAdmin = role === 'cs' || role === 'bos';

  const fetchProduk = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/produk');
      setProduk(response.data.data || response.data || []);
    } catch (err) {
      setError('Gagal memuat katalog produk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        nama_bahan: formData.nama_bahan,
        spesifikasi: formData.spesifikasi,
        harga: parseFloat(formData.harga) 
      };

      if (isEditing) {
        await apiClient.put(`/produk/edit/${formData.id_produk}`, { ...payload, id_produk: formData.id_produk });
      } else {
        await apiClient.post('/add/produk', payload);
      }
      
      setShowForm(false);
      setFormData({ id_produk: '', nama_bahan: '', spesifikasi: '', harga: '' });
      setIsEditing(false);
      fetchProduk();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan produk');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await apiClient.delete(`/api/produk/${id}`);
        fetchProduk();
      } catch (err) {
        alert('Gagal menghapus produk');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        <Topbar title="Produk" />
        
        {isAdmin && !showForm && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button 
              className="btn" 
              onClick={() => { 
                setShowForm(true); 
                setIsEditing(false); 
                setFormData({ id_produk: '', nama_bahan: '', spesifikasi: '', harga: '' }); 
              }} 
              style={{ width: 'auto', padding: '12px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
            >
              + Tambah Produk Baru
            </button>
          </div>
        )}

        {/* ─── DESAIN FORM (TAMBAH & EDIT SAMA PERSIS - MAX WIDTH 700PX DI TENGAH) ─── */}
        {showForm && isAdmin && (
          <div style={{ 
            background: '#d7f0ff', 
            padding: '25px 30px', 
            margin: '10px auto 25px auto', /* Otomatis ke tengah halaman */
            maxWidth: '700px', /* Ukuran sedang ideal (tidak kebesaran/kekecilan) */
            width: '100%',
            borderRadius: '12px', 
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            border: '1px solid #bce1f7',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', fontWeight: '700', color: '#1e293b', textAlign: 'left' }}>
              {isEditing ? 'Edit Detail Produk' : 'Tambah Produk Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Input 1: Nama Produk */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Nama Bahan / Produk</label>
                <input 
                  type="text" 
                  name="nama_bahan" 
                  value={formData.nama_bahan} 
                  onChange={handleChange} 
                  required 
                  placeholder="Contoh: Crown PFM"
                  style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#ffffff', fontFamily: 'inherit', fontSize: '14px', width: '100%', boxSizing: 'border-box', color:'black'}}
                />
              </div>
              
              {/* Input 2: Harga */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Harga (Rp)</label>
                <input 
                  type="number" 
                  name="harga" 
                  value={formData.harga} 
                  onChange={handleChange} 
                  required 
                  placeholder="Contoh: 500000"
                  style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#ffffff', fontFamily: 'inherit', fontSize: '14px', width: '100%', boxSizing: 'border-box', color:'black' }}
                />
              </div>

              {/* Input 3: Spesifikasi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Spesifikasi Detail</label>
                <textarea 
                  name="spesifikasi" 
                  value={formData.spesifikasi} 
                  onChange={handleChange} 
                  required 
                  rows="4" 
                  placeholder="Masukkan detail atau spesifikasi bahan..."
                  style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#ffffff', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical', width: '100%', boxSizing: 'border-box', color:'black' }}
                ></textarea>
              </div>

              {/* Tombol Aksi Simpan & Batal */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  style={{ background: '#e2e8f0', color: '#334155', padding: '10px 22px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#3498db', color: 'white', padding: '10px 26px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  Simpan Produk
                </button>
              </div>

            </form>
          </div>
        )}

        <div className="shipping-wrapper" style={{ marginTop: '10px' }}>
          {loading ? (
            <p style={{padding: '20px'}}>Memuat katalog...</p>
          ) : error ? (
            <p style={{color: 'red', padding: '20px'}}>{error}</p>
          ) : (
            <table className="shipping-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Nama Produk</th>
                  <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Spesifikasi</th>
                  <th style={{ textAlign: 'center' }}>Harga</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {produk.map((item) => (
                  <tr key={item.id_produk}>
                    <td style={{ fontWeight: '600', color: '#222', textAlign: 'left', paddingLeft: '20px' }}>
                      {item.nama_bahan}
                    </td>
                    <td style={{ textAlign: 'left', paddingLeft: '20px', color: '#555' }}>
                      {item.spesifikasi}
                    </td>
                    <td style={{ color: '#3498db', fontWeight: '700', textAlign: 'center' }}>
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => handleEditClick(item)} 
                          className="btn-approve" 
                          style={{ background: '#dbeafe', color: '#1d4ed8', padding: '6px 16px', display: 'inline-block', marginRight: '8px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id_produk)} 
                          className="btn-reject" 
                          style={{ background: '#fee2e2', color: '#991b1b', padding: '6px 16px', display: 'inline-block', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default KatalogProduk;