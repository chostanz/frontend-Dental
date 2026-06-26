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
              style={{ width: 'auto', padding: '12px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + Tambah Produk Baru
            </button>
          </div>
          )}

      
        {showForm && isAdmin && (
          <div className="register-box" style={{ padding: '30px', margin: '10px 0 25px', maxWidth: '1100px' }}>
            <h3>{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3><br/>
            <form onSubmit={handleSubmit} className="form-register">
              <div className="input-group">
                <label>Nama Bahan / Produk</label>
                <input type="text" name="nama_bahan" value={formData.nama_bahan} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Harga (Rp)</label>
                <input type="number" name="harga" value={formData.harga} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Spesifikasi Detail</label>
                <textarea name="spesifikasi" value={formData.spesifikasi} onChange={handleChange} required rows="3"></textarea>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn" style={{ background: '#3498db', width: '180px' }}>Simpan Produk</button>
                <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ background: '#e8e8e8', color: '#333', width: '120px' }}>Batal</button>
              </div>
            </form>
          </div>
        )}

      
        <div className="shipping-wrapper" style={{ marginTop: '10px' }}>
          {loading ? <p style={{padding: '20px'}}>Memuat katalog...</p> : error ? <p style={{color: 'red', padding: '20px'}}>{error}</p> : (
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
                        <button onClick={() => handleEditClick(item)} className="btn-approve" style={{ background: '#f6f34c', color: '#222', padding: '6px 16px', display: 'inline-block', marginRight: '8px' }}>Edit</button>
                        <button onClick={() => handleDelete(item.id_produk)} className="btn-reject" style={{ background: '#ff7f88', padding: '6px 16px', display: 'inline-block' }}>Hapus</button>
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