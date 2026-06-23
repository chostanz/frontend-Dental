import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/axiosConfig';
import Topbar from '../components/Topbar';
import "../style/style.css";
import "../style/Karyawan.css"; 

const ROLE_LABEL = { cs: 'CS', teknisi: 'Teknisi', bos: 'Bos' };

const roleBadgeStyle = (role) => {
  const map = {
    cs:      { background: '#dbeafe', color: '#1d4ed8' },
    teknisi: { background: '#fef9c3', color: '#854d0e' },
    bos:     { background: '#dcfce7', color: '#166534' },
  };
  return {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    ...(map[role] || { background: '#f1f5f9', color: '#475569' }),
  };
};

/* ─── Modal Tambah Karyawan ──────────────────────────────── */
function ModalTambah({ onClose, onSuccess }) {
  const [form, setForm] = useState({ nama: '', email: '', no_hp: '', role: 'cs' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempPass, setTempPass] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!form.nama || !form.email || !form.no_hp) {
      setError('Semua field wajib diisi!');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/api/karyawan', form);
      setTempPass(res.data?.data?.password_sementara || '');
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal menambah karyawan');
    } finally {
      setLoading(false);
    }
  };

  /* tampilkan password sementara setelah sukses */
  if (tempPass) {
    return (
      <div className="modal-overlay">
        <div className="modal-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h3 style={{ color: '#0369a1', marginBottom: 12 }}>Karyawan Ditambahkan!</h3>
          <p style={{ marginBottom: 16, color: '#555', fontSize: 13 }}>
            Simpan password sementara berikut dan berikan ke karyawan. Password ini hanya tampil sekali.
          </p>
          <div className="k-password-box">
            {tempPass}
          </div>
          <div className="modal-actions">
            <button className="btn-approve" style={{ background: '#0369a1', width: '100%' }} onClick={() => { onSuccess(); onClose(); }}>
              Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '400px', background: '#D7F0FF'}}>
        <h3>Tambah Karyawan</h3>
        <div style={{ marginTop: '15px' }}>
          {error && (
            <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 12, background: '#ffffff', padding: '8px', borderRadius: '6px' }}>{error}</p>
          )}
          {[
            { label: 'Nama Lengkap', key: 'nama', type: 'text', placeholder: 'Contoh: Budi Santoso' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'budi@dental.com' },
            { label: 'No. HP', key: 'no_hp', type: 'text', placeholder: '08xxxxxxxxxx' },
          ].map(f => (
            <div className="form-group" key={f.key} style={{ textAlign: 'left', marginBottom: '12px' }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: '4px' }}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
          ))}
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '12px', color:'black'}}>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: '4px' }}>Role</label>
            <select 
              value={form.role} 
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white' }}
            >
              <option value="cs">CS</option>
              <option value="teknisi">Teknisi</option>
              <option value="bos">Bos</option>
            </select>
          </div>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button className="btn-reject" onClick={onClose}>Batal</button>
            <button className="btn-approve" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalEdit({ karyawan, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama: karyawan.nama || '',
    email: karyawan.email || '',
    no_hp: karyawan.no_hp || '',
    role: karyawan.role || 'cs',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await apiClient.put(`/api/karyawan/${karyawan.id_karyawan}`, form);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal memperbarui data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '400px' }}>
        <h3>Edit Karyawan</h3>
        <div style={{ marginTop: '15px' }}>
          {error && (
            <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 12, background: '#fee2e2', padding: '8px', borderRadius: '6px' }}>{error}</p>
          )}
          {[
            { label: 'Nama Lengkap', key: 'nama', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'No. HP', key: 'no_hp', type: 'text' },
          ].map(f => (
            <div className="form-group" key={f.key} style={{ textAlign: 'left', marginBottom: '12px' }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: '4px' }}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
          ))}
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '12px' }}>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: '4px' }}>Role</label>
            <select 
              value={form.role} 
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', color:'black', borderRadius: '8px', outline: 'none', background: 'white' }}
            >
              <option value="cs">CS</option>
              <option value="teknisi">Teknisi</option>
              <option value="bos">Bos</option>
            </select>
          </div>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button className="btn-reject" onClick={onClose}>Batal</button>
            <button className="btn-approve" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalResetPassword({ karyawan, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post(`/api/karyawan/${karyawan.id_karyawan}/reset-password`);
      setNewPass(res.data?.data?.password_baru || '');
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal reset password');
    } finally {
      setLoading(false);
    }
  };

  if (newPass) {
    return (
      <div className="modal-overlay">
        <div className="modal-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h3 style={{ color: '#c2410c', marginBottom: 12 }}>Password Berhasil Direset!</h3>
          <p style={{ marginBottom: 16, color: '#555', fontSize: 13 }}>
            Password baru untuk <strong>{karyawan.nama}</strong>. Berikan ke karyawan, hanya tampil sekali.
          </p>
          <div className="k-password-box" style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }}>
            {newPass}
          </div>
          <div className="modal-actions">
            <button className="btn-approve" style={{ background: '#c2410c', width: '100%' }} onClick={() => { onSuccess(); onClose(); }}>
              Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '400px' }}>
        <h3>Reset Password</h3>
        <div style={{ marginTop: '15px' }}>
          {error && <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <p style={{ fontSize: 13, color: '#444', marginBottom: 20, lineHeight: '1.5' }}>
            Reset password <strong>{karyawan.nama}</strong>? Password lama akan hangus dan diganti password baru secara otomatis.
          </p>
          <div className="modal-actions">
            <button className="btn-reject" onClick={onClose}>Batal</button>
            <button className="btn-reject" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }} onClick={handleReset} disabled={loading}>
              {loading ? 'Mereset...' : 'Ya, Reset Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalHapus({ karyawan, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleHapus = async () => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/karyawan/${karyawan.id_karyawan}`);
      onSuccess();
      onClose();
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '400px' }}>
        <h3 style={{ background: '#dc2626' }}>Hapus Karyawan</h3>
        <div style={{ marginTop: '15px' }}>
          <p style={{ fontSize: 13, color: '#444', marginBottom: 20, lineHeight: '1.5' }}>
            Hapus karyawan <strong>{karyawan.nama}</strong> ({karyawan.email})? Aksi ini tidak bisa dibatalkan.
          </p>
          <div className="modal-actions">
            <button className="btn-reject" onClick={onClose}>Batal</button>
            <button className="btn-reject" style={{ background: '#dc2626', color: 'white', border: 'none' }} onClick={handleHapus} disabled={loading}>
              {loading ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Karyawan() {
  const navigate = useNavigate();
  const [karyawanList, setKaryawanList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('semua');

  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(null);    // karyawan obj
  const [modalReset, setModalReset] = useState(null);   // karyawan obj
  const [modalHapus, setModalHapus] = useState(null);   // karyawan obj

  const fetchKaryawan = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await apiClient.get('/api/karyawan');
      const data = res.data?.data || [];
      setKaryawanList(data);
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        setErrorMsg('Anda tidak memiliki akses ke halaman ini.');
      } else {
        setErrorMsg('Gagal memuat data karyawan.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKaryawan(); }, []);

  // filter + search
  useEffect(() => {
    let result = [...karyawanList];
    if (filterRole !== 'semua') result = result.filter(k => k.role === filterRole);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(k =>
        k.nama.toLowerCase().includes(q) ||
        k.email.toLowerCase().includes(q) ||
        k.no_hp.includes(q)
      );
    }
    setFiltered(result);
  }, [karyawanList, search, filterRole]);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        <Topbar title="Manajemen Karyawan" />

        {/* Filter & Button Container (Sejajar Sempurna) */}
        <div className="filter-bar" style={{ display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'center' }}>
          
          <div className="filter-search" style={{ background: 'white', padding: '0 18px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, display: 'flex', alignItems: 'center', height: '46px' }}>
            <input
              type="text"
              placeholder="Cari nama, email, atau nomor HP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontFamily: 'Poppins', fontSize: '13px', width: '100%', background: 'transparent', color: '#222' }}
            />
          </div>

          <div className="filter-select">
            <select 
              value={filterRole} 
              onChange={e => setFilterRole(e.target.value)}
              style={{ padding: '0 36px 0 18px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', outline: 'none', fontFamily: 'Poppins', fontSize: '13px', color: '#222', background: 'white', height: '46px', cursor: 'pointer' }}
            >
              <option value="semua">Semua Role</option>
              <option value="cs">CS</option>
              <option value="teknisi">Teknisi</option>
              <option value="bos">Bos</option>
            </select>
          </div>

          {/* Tombol Tambah Karyawan Yang Ditunggu-tunggu */}
         <button
            className="btn-tambah"
            style={{ 
              padding: '12px 20px', 
              background: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              fontWeight: '600', 
              whiteSpace: 'nowrap' 
            }}
            onClick={() => setModalTambah(true)}
          >
            + Tambah Karyawan
          </button>

        </div>

        {/* Table Card (Tabel Rapi Disesuaikan Global CSS Lab) */}
        <div className="table-card" style={{ background: '#e0f2fe' }}>
          {loading ? (
            <p style={{ padding: 20, textAlign: 'center' }}>Memuat data karyawan...</p>
          ) : errorMsg ? (
            <p style={{ padding: 20, textAlign: 'center', color: 'red', fontWeight: 500 }}>{errorMsg}</p>
          ) : (
            <table className="pesanan-table" style={{ background: 'transparent' }}>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. HP</th>
                  <th>Role</th>
                  <th>Bergabung</th>
                  <th style={{textAlign: 'center'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 25, color: '#676060' }}>
                      Tidak ada karyawan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map(k => (
                    <tr key={k.id_karyawan}>
                      <td style={{ fontWeight: 600, color: '#222' }}>{k.nama}</td>
                      <td style={{ fontSize: 13, color: '#676060' }}>{k.email}</td>
                      <td style={{ fontSize: 13 }}>{k.no_hp}</td>
                      <td>
                        <span style={roleBadgeStyle(k.role)}>
                          {ROLE_LABEL[k.role] || k.role}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: '#676060' }}>
                        {new Date(k.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="karyawan-aksi" style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => setModalEdit(k)}
                            className="btn-aksi"
                            style={{ background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setModalReset(k)}
                            className="btn-aksi"
                            style={{ background: '#fff7ed', color: '#c2410c', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Reset PW
                          </button>
                          <button
                            onClick={() => setModalHapus(k)}
                            className="btn-aksi"
                            style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {modalTambah && (
        <ModalTambah
          onClose={() => setModalTambah(false)}
          onSuccess={fetchKaryawan}
        />
      )}
      {modalEdit && (
        <ModalEdit
          karyawan={modalEdit}
          onClose={() => setModalEdit(null)}
          onSuccess={fetchKaryawan}
        />
      )}
      {modalReset && (
        <ModalResetPassword
          karyawan={modalReset}
          onClose={() => setModalReset(null)}
          onSuccess={fetchKaryawan}
        />
      )}
      {modalHapus && (
        <ModalHapus
          karyawan={modalHapus}
          onClose={() => setModalHapus(null)}
          onSuccess={fetchKaryawan}
        />
      )}
    </div>
  );
}

export default Karyawan;