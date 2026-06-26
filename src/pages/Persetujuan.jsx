import { useState, useEffect } from "react";
import apiClient from "../config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import "../style/style.css";
import "../style/Persetujuan.css"
import Topbar from "../components/Topbar";

function Persetujuan() {
  const [pesananList, setPesananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State untuk modal konfirmasi
  const [showModal, setShowModal] = useState(false);
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [aksi, setAksi] = useState(""); // "disetujui" atau "ditolak"
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPesananPending = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/persetujuan/pending");
      setPesananList(res.data.data || []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesananPending();
  }, []);

  // Buka modal saat klik Setuju/Tolak
  const handleOpenModal = (pesanan, jenisAksi) => {
    setSelectedPesanan(pesanan);
    setAksi(jenisAksi);
    setCatatan("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPesanan(null);
    setCatatan("");
  };

  const handleSimpan = async () => {
    if (aksi === "ditolak" && catatan.trim() === "") {
      alert("Catatan wajib diisi untuk penolakan");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const idKaryawan = decoded.id || decoded.id_karyawan; // fallback

       // DEBUG dulu
      console.log("Token:", token);
      console.log("Decoded:", decoded);
      console.log("Selected Pesanan:", selectedPesanan);
      console.log("Aksi:", aksi);
      
      await apiClient.post("/api/persetujuan", {
        id_pesanan: selectedPesanan.id_pesanan,
        id_karyawan: idKaryawan, // id bos dari token
        status: aksi,
        catatan_bos: catatan
      });

      // Refresh list setelah berhasil
      await fetchPesananPending();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan keputusan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="dashboard-container"><div className="main-content">Loading...</div></div>;

  return (
    <div className="dashboard-container">
      <div className="main-content">

          <Topbar title="Persetujuan" />

        {errorMsg && <div style={{ color: "red", marginBottom: 10 }}>{errorMsg}</div>}

        <p className="approval-text">
          Pesanan menunggu persetujuan bos
          <span> - {pesananList.length} pesanan</span>
        </p>

        <div className="approval-wrapper">

          {pesananList.length === 0 && (
            <p style={{ padding: 20, color: "#888" }}>Tidak ada pesanan yang menunggu persetujuan</p>
          )}

          {pesananList.map((pesanan) => (
            <div className="approval-card" key={pesanan.id_pesanan}>
              <div className="approval-left">
                <div className="approval-icon">👤</div>
                <div className="approval-info">
                 
                  <h3>{pesanan.id_dokter}</h3>
                  <p>Pesanan #{pesanan.id_pesanan.slice(0, 8)}</p>
                  <small>
                    Diajukan {new Date(pesanan.tgl_pesanan).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </small>
                </div>
              </div>
              <div className="approval-action">
                <button
                  className="btn-approve"
                  onClick={() => handleOpenModal(pesanan, "disetujui")}
                >
                  Setuju
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleOpenModal(pesanan, "ditolak")}
                >
                  Tolak
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Apakah anda yakin?</h3>
            <textarea
              className="modal-textarea"
              placeholder="Catatan"
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

export default Persetujuan;