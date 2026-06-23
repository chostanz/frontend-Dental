import { useState, useEffect } from "react";
import apiClient from "../config/axiosConfig";
import "../style/style.css";
import "../style/Produksi.css";
import Topbar from "../components/Topbar";

function Produksi() {
  const [pengerjaanList, setPengerjaanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State modal update status
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusBaru, setStatusBaru] = useState("");
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  let idKaryawanAktif = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      idKaryawanAktif = decoded.id_karyawan || decoded.id || "";
    } catch (e) {
      console.error("Gagal decode token:", e);
    }
  }

  const fetchPengerjaan = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/produksi");
      setPengerjaanList(res.data.data || []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengambil data produksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengerjaan();
  }, []);

  // Kelompokkan data berdasarkan status_produksi
  const antrian = pengerjaanList.filter((p) => p.status_produksi === "antrian");
  const dikerjakan = pengerjaanList.filter((p) => p.status_produksi === "dikerjakan");
  const revisi = pengerjaanList.filter((p) => p.status_produksi === "revisi");
  const selesai = pengerjaanList.filter((p) => p.status_produksi === "selesai");

  // Urutan status sesuai SRS, dipakai untuk validasi tidak boleh mundur
  const urutanStatus = { antrian: 1, dikerjakan: 2, revisi: 3, selesai: 4 };

  // Pilihan status berikutnya tergantung status saat ini
  const getOpsiStatus = (statusSaatIni) => {
    switch (statusSaatIni) {
      case "antrian":
        return ["dikerjakan"];
      case "dikerjakan":
        return ["revisi", "selesai"];
      case "revisi":
        return ["dikerjakan", "selesai"];
      default:
        return [];
    }
  };

  const handleCardClick = (item) => {
    // Card status "selesai" tidak bisa diklik lagi
    if (item.status_produksi === "selesai") return;

    setSelectedItem(item);
    setStatusBaru("");
    setCatatan("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setStatusBaru("");
    setCatatan("");
  };
const handleSimpan = async () => {
    if (!statusBaru) {
      alert("Pilih status baru terlebih dahulu");
      return;
    }

    if (statusBaru === "revisi" && catatan.trim() === "") {
      alert("Catatan wajib diisi saat status revisi");
      return;
    }

    setSubmitting(true);
    try {
      // 🌟 FIX: Sertakan id_karyawan teknisi yang update status
      await apiClient.put(`/api/produksi/${selectedItem.id_pengerjaan}/status`, {
        id_karyawan: idKaryawanAktif, 
        status_produksi: statusBaru,
        catatan_karyawan: catatan
      });

      await fetchPengerjaan();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengupdate status produksi");
    } finally {
      setSubmitting(false);
    }
  };
  
const renderCard = (item) => (
    <div
      className={`production-card ${item.status_produksi !== "selesai" ? "clickable" : ""}`}
      key={item.id_pengerjaan}
      onClick={() => handleCardClick(item)}
    >
      <h4>#{item.id_pesanan.slice(0, 8).toUpperCase()}</h4>
      <p className="card-produk">{item.nama_bahan || "Produk tidak diketahui"}</p>
      <small className="card-dokter">drg. {item.nama_dokter}</small>
      
      {item.nama && (
        <p className="card-karyawan" style={{ fontSize: '11px', color: '#001a8d', fontWeight: '600', marginTop: '2px' }}>
          🛠 Dikerjakan oleh: {item.nama}
        </p>
      )}

      <div className="card-detail-teknis">
        {item.kode_gigi && <span>Gigi: {item.kode_gigi}</span>}
        {item.ukuran && <span>Ukuran: {item.ukuran}</span>}
        {item.warna && <span>Warna: {item.warna}</span>}
        {item.jumlah && <span>Jumlah: {item.jumlah}</span>}
      </div>

      {item.catatan_tambahan && (
        <p className="card-catatan-dokter" style={{ fontSize: '11px', marginTop: '6px' }}>
          📝 Pesanan: {item.catatan_tambahan}
        </p>
      )}

      {/* 🌟 TAMPILAN CATATAN KELUHAN REVISI DARI DOKTER */}
      {item.status_produksi === "revisi" && item.deskripsi_revisi && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', fontSize: '11px', marginTop: '10px', border: '1px solid #fca5a5' }}>
          <strong style={{ display: 'block', marginBottom: '3px' }}>⚠ Keluhan Revisi:</strong>
          {item.deskripsi_revisi}
        </div>
      )}

      {/* 🌟 TAMPILAN CATATAN KARYAWAN (TEKNISI) DI PALING BAWAH */}
      {item.catatan_karyawan && (
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '11px', color: '#475569' }}>
          <strong style={{ display: 'block', marginBottom: '3px', color: '#334155' }}>Catatan Teknisi:</strong>
          {item.catatan_karyawan}
        </div>
      )}

      {/* Badge Status */}
      <div style={{ marginTop: '12px' }}>
        {item.status_produksi === "revisi" && (
          <span className="warning-btn" style={{ fontWeight: 'bold' }}>Sedang Direvisi</span>
        )}
        {item.status_produksi === "selesai" && (
          <span className="done-btn" style={{ fontWeight: 'bold' }}>Selesai</span>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="dashboard-container"><div className="main-content">Loading...</div></div>;

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <Topbar title="Produksi" />


        {errorMsg && <div style={{ color: "red", marginBottom: 10 }}>{errorMsg}</div>}

        <div className="production-grid">

          <div className="production-column">
            <h3>Antrian {antrian.length}</h3>
            {antrian.map(renderCard)}
          </div>

          <div className="production-column">
            <h3>Dikerjakan {dikerjakan.length}</h3>
            {dikerjakan.map(renderCard)}
          </div>

          <div className="production-column">
            <h3>Revisi {revisi.length}</h3>
            {revisi.map(renderCard)}
          </div>

          <div className="production-column">
            <h3>Selesai {selesai.length}</h3>
            {selesai.map(renderCard)}
          </div>

        </div>

      </div>

      {/* MODAL UPDATE STATUS */}
      {showModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update Status Pengerjaan</h3>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
              Pesanan #{selectedItem.id_pesanan.slice(0, 8)} — status saat ini:{" "}
              <strong>{selectedItem.status_produksi}</strong>
            </p>

            <select
              className="modal-select"
              value={statusBaru}
              onChange={(e) => setStatusBaru(e.target.value)}
            >
              <option value="" disabled>-- Pilih status baru --</option>
              {getOpsiStatus(selectedItem.status_produksi).map((opsi) => (
                <option key={opsi} value={opsi}>{opsi}</option>
              ))}
            </select>

            <textarea
              className="modal-textarea"
              placeholder={statusBaru === "revisi" ? "Catatan wajib diisi" : "Catatan (opsional)"}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-reject" onClick={handleCloseModal} disabled={submitting}>
                Batal
              </button>
              <button className="btn-approve" onClick={handleSimpan} disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Produksi;