import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import "../style/pengiriman.css";
import Topbar from "../components/Topbar";
const API_BASE = "http://localhost:8080";

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
        } catch (e) {}
      }

      // Tentukan URL berdasarkan Role
      const endpoint = (isDokter && idDokter) 
        ? `/api/pengiriman/dokter/${idDokter}` 
        : `/api/pengiriman`;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Gagal mengambil data pengiriman");
      const data = await res.json();
      setPengirimanList(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiapKirim = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pengiriman/siap-kirim`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSiapKirimList(data.data || []);
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
      const res = await fetch(`${API_BASE}/api/pengiriman`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambah pengiriman");
      setShowModal(false);
      fetchPengiriman();
    } catch (err) {
      setFormError(err.message);
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

      {/* Modal Tambah Pengiriman */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Tambah Pengiriman</h3>
            <p className="modal-sub">Hanya pesanan yang sudah selesai diproduksi yang bisa dikirim.</p>

            <label>Pesanan</label>
            <select
              value={form.id_pesanan}
              onChange={(e) => setForm({ ...form, id_pesanan: e.target.value })}
            >
              <option value="">-- Pilih Pesanan --</option>
              {siapKirimList.map((p) => (
                <option key={p.id_pesanan} value={p.id_pesanan}>
                  {p.id_pesanan.slice(0, 8)}...
                </option>
              ))}
            </select>

            <label>Jasa Kurir</label>
            <select
              value={form.nama_jasa}
              onChange={(e) => setForm({ ...form, nama_jasa: e.target.value })}
            >
              <option value="">-- Pilih Kurir --</option>
              {["JNE", "J&T", "SiCepat", "Anteraja", "Gosend", "Grab Express"].map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>

            <label>No. Resi</label>
            <input
              type="text"
              placeholder="Masukkan nomor resi"
              value={form.no_resi}
              onChange={(e) => setForm({ ...form, no_resi: e.target.value })}
            />

            {formError && <p className="form-error">{formError}</p>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
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