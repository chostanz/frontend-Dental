import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import "../style/Pengiriman.css";
import Topbar from "../components/Topbar";

function Pengiriman() {
  const navigate = useNavigate();
  const [pengirimanList, setPengirimanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Modal tambah pengiriman
  const [showModal, setShowModal] = useState(false);
  const [siapKirimList, setSiapKirimList] = useState([]);
  const [form, setForm] = useState({ id_pesanan: "", nama_jasa: "", no_resi: "" });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "cs", "bos", "teknisi"

  const isCS = role === "cs" || role === "bos";

  const fetchPengiriman = async () => {
  try {
    setLoading(true);

    let isDokter = false;
    let idDokter = null;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.id_dokter) {
          isDokter = true;
          idDokter = decodedToken.id_dokter;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Tentukan endpoint berdasarkan role
    const endpoint =
      isDokter && idDokter
        ? `/api/pengiriman/dokter/${idDokter}`
        : `/api/pengiriman`;

    const res = await apiClient.get(endpoint);
    setPengirimanList(res.data.data || []);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  const fetchSiapKirim = async () => {
    try {
      const res = await apiClient.get("/api/pengiriman/siap-kirim");
      setSiapKirimList(res.data.data || []);
    } catch (_) {}
  };

  useEffect(() => {
    fetchPengiriman();
  }, []);

  const handleOpenModal = () => {
    fetchSiapKirim();
    setForm({ id_pesanan: "", nama_jasa: "", no_resi: "" });
    setFormError(null);
    setShowModal(true);
  };

    const handleSubmit = async () => {
      if (!form.id_pesanan || !form.nama_jasa || !form.no_resi) {
        setFormError("Semua field wajib diisi");
        return;
      }

      setSubmitting(true);
      setFormError(null);

      try {
        await apiClient.post("/api/pengiriman", form);

        setShowModal(false);
        fetchPengiriman();
      } catch (err) {
        setFormError(err.response?.data?.message || err.message);
      } finally {
        setSubmitting(false);
      }
    };

  const statusColors = {
    Menunggu: "status-yellow",
    "Dijemput Kurir": "status-blue",
    "Dalam Pengiriman": "status-orange",
    Diterima: "status-green",
  };

  const getLatestStatus = (item) => item.status_terakhir || "Menunggu";

  const filtered = pengirimanList.filter((p) => {
    const matchSearch =
      search === "" ||
      p.no_resi?.toLowerCase().includes(search.toLowerCase()) ||
      p.nama_jasa?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterStatus === "Semua" || getLatestStatus(p) === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div className="dashboard-container">
      <div className="main-content">

        <Topbar title="Pengiriman" />
        <div className="shipping-top">
          <input
            className="shipping-search"
            placeholder="Cari no. resi atau kurir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="shipping-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>Semua</option>
            <option>Menunggu</option>
            <option>Dijemput Kurir</option>
            <option>Dalam Pengiriman</option>
            <option>Diterima</option>
          </select>
          {isCS && (
            <button className="shipping-add" onClick={handleOpenModal}>
              + Tambah Pengiriman
            </button>
          )}
        </div>

        <div className="shipping-wrapper">
          {loading ? (
            <div className="state-info">Memuat data...</div>
          ) : error ? (
            <div className="state-info state-error">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="state-info">Tidak ada data pengiriman.</div>
          ) : (
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Jasa Kurir</th>
                  <th>No. Resi</th>
                  <th>Tgl Kirim</th>
                  <th>Tgl Diterima</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const status = getLatestStatus(item);
                  return (
                    <tr key={item.id_pengiriman}>
                      <td>{idx + 1}</td>
                      <td>{item.nama_jasa}</td>
                      <td className="resi-cell">{item.no_resi}</td>
                      <td>{item.tgl_kirim ? new Date(item.tgl_kirim).toLocaleDateString("id-ID") : "-"}</td>
                      <td>{item.tgl_diterima ? new Date(item.tgl_diterima).toLocaleDateString("id-ID") : "-"}</td>
                      <td>
                        <span className={`status-badge ${statusColors[status] || "status-yellow"}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-detail"
                          onClick={() => navigate(`/pengiriman/${item.id_pengiriman}/detail`)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* ─── MODAL DENGAN UKURAN UKURAN INPUT RAMPING & SERASI ─── */}
      {showModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(30, 41, 59, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div 
            className="modal-box" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#e3f2fd', 
              padding: '30px 35px', 
              width: '100%',
              maxWidth: '460px', /* Dibuat sedikit lebih compact agar pas di mata */
              borderRadius: '24px', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>
              Tambah Pengiriman
            </h3>
            <p className="modal-sub" style={{ margin: '-10px 0 5px 0', fontSize: '13px', color: '#64748b', textAlign: 'center', lineHeight: '1.4' }}>
              Hanya pesanan yang sudah selesai diproduksi yang bisa dikirim.
            </p>

            {/* Input 1: Pilih Pesanan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <label style={{ textAlign: "left", fontSize: '14px', fontWeight: '600', color: '#334155', paddingLeft: '2px' }}>Pesanan</label>
              <select
                value={form.id_pesanan}
                onChange={(e) => setForm({ ...form, id_pesanan: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', /* Mengecilkan ukuran vertikal input */
                  border: '1px solid #cbd5e1', 
                  borderRadius: '12px', 
                  outline: 'none', 
                  background: '#ffffff', 
                  fontFamily: 'inherit', 
                  fontSize: '14px', 
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">-- Pilih Pesanan --</option>
                {siapKirimList.map((p) => (
                  <option key={p.id_pesanan} value={p.id_pesanan}>
                    {p.id_pesanan.slice(0, 8)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Input 2: Jasa Kurir */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <label style={{ textAlign: "left", fontSize: '14px', fontWeight: '600', color: '#334155', paddingLeft: '2px' }}>Jasa Kurir</label>
              <select
                value={form.nama_jasa}
                onChange={(e) => setForm({ ...form, nama_jasa: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', /* Mengecilkan ukuran vertikal input */
                  border: '1px solid #cbd5e1', 
                  borderRadius: '12px', 
                  outline: 'none', 
                  background: '#ffffff', 
                  fontFamily: 'inherit', 
                  fontSize: '14px', 
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">-- Pilih Kurir --</option>
                {["JNE", "J&T", "SiCepat", "Anteraja", "Gosend", "Grab Express"].map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>

            {/* Input 3: No Resi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <label style={{ textAlign: "left", fontSize: '14px', fontWeight: '600', color: '#334155', paddingLeft: '2px' }}>No. Resi</label>
              <input
                type="text"
                placeholder="Masukkan nomor resi"
                value={form.no_resi}
                onChange={(e) => setForm({ ...form, no_resi: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', /* Mengecilkan ukuran vertikal input */
                  border: '1px solid #cbd5e1', 
                  borderRadius: '12px', 
                  outline: 'none', 
                  background: '#ffffff', 
                  fontFamily: 'inherit', 
                  fontSize: '14px', 
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>

            {formError && <p className="form-error" style={{ color: '#ef4444', fontSize: '13px', margin: '0', textAlign: 'left', fontWeight: '500' }}>{formError}</p>}

            {/* Tombol Kapsul Bulat Merah dan Hijau */}
            <div className="modal-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
              <button 
                type="button"
                className="btn-cancel" 
                onClick={() => setShowModal(false)}
                style={{ background: '#ff5c75', color: 'white', padding: '10px 28px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', minWidth: '110px', boxShadow: '0 2px 4px rgba(255,92,117,0.2)' }}
              >
                Batal
              </button>
              <button 
                type="button"
                className="btn-submit" 
                onClick={handleSubmit} 
                disabled={submitting}
                style={{ background: '#00e640', color: 'white', padding: '10px 28px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', minWidth: '110px', boxShadow: '0 2px 4px rgba(0,230,64,0.2)' }}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pengiriman;