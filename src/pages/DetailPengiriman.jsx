import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import "../style/DetailPengiriman.css";

const API_BASE = "http://localhost:8080";

const STATUS_ORDER = ["Menunggu", "Dijemput Kurir", "Dalam Pengiriman", "Diterima"];

function DetailPengiriman() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update status
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: "", keterangan: "" });
  const [updateError, setUpdateError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isCS = role === "cs" || role === "bos";

  const fetchDetail = async () => {
    try {
      setLoading(true);
      // CS pakai endpoint karyawan, dokter pakai endpoint dokter
      const endpoint = isCS
        ? `${API_BASE}/api/pengiriman/${id}/detail`
        : `${API_BASE}/api/pengiriman/${id}/detail`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil detail pengiriman");
      const data = await res.json();
      setDetails(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const currentStatus = details.length > 0 ? details[details.length - 1].status : null;
  const currentStep = STATUS_ORDER.indexOf(currentStatus);

  const nextStatuses = STATUS_ORDER.filter((_, i) => i > currentStep);

  const handleOpenUpdate = () => {
    setUpdateForm({ status: nextStatuses[0] || "", keterangan: "" });
    setUpdateError(null);
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    if (!updateForm.status) {
      setUpdateError("Pilih status terlebih dahulu");
      return;
    }
    setSubmitting(true);
    setUpdateError(null);
    try {
      const res = await fetch(`${API_BASE}/api/pengiriman/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui status");
      setShowUpdateModal(false);
      fetchDetail();
    } catch (err) {
      setUpdateError(err.message);
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

  return (
    <div className="dashboard-container">
      <div className="main-content">

        <div className="topbar">
          <div className="topbar-left">
            <button className="btn-back" onClick={() => navigate(-1)}>← Kembali</button>
            <h2>Detail Pengiriman</h2>
          </div>
          <div className="topbar-right">
            <span>{localStorage.getItem("email") || ""}</span>
          </div>
        </div>

        {loading ? (
          <div className="state-info">Memuat data...</div>
        ) : error ? (
          <div className="state-info state-error">{error}</div>
        ) : (
          <>
            <div className="stepper-card">
              <h4>Status Pengiriman</h4>
              <div className="stepper">
                {STATUS_ORDER.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step} className={`step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                      <div className="step-dot">
                        {done ? <span className="checkmark">✓</span> : <span className="step-num">{i + 1}</span>}
                      </div>
                      {i < STATUS_ORDER.length - 1 && (
                        <div className={`step-line ${i < currentStep ? "done" : ""}`} />
                      )}
                      <div className="step-label">{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

        
            <div className="timeline-card">
              <div className="timeline-header">
                <h4>Riwayat Status</h4>
                {isCS && currentStatus !== "Diterima" && (
                  <button className="btn-update-status" onClick={handleOpenUpdate}>
                    Perbarui Status
                  </button>
                )}
              </div>

              {details.length === 0 ? (
                <p className="state-info">Belum ada riwayat status.</p>
              ) : (
                <div className="timeline">
                  {[...details].reverse().map((d, i) => (
                    <div key={d.id_detail_pengiriman} className={`timeline-item ${i === 0 ? "latest" : ""}`}>
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-row">
                          <span className={`status-badge ${statusColors[d.status] || "status-yellow"}`}>
                            {d.status}
                          </span>
                          <span className="timeline-time">
                            {new Date(d.waktu).toLocaleString("id-ID", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                        {d.keterangan && (
                          <p className="timeline-note">{d.keterangan}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Perbarui Status Pengiriman</h3>

            <label>Status Baru</label>
            <select
              value={updateForm.status}
              onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
            >
              {nextStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label>Keterangan <span className="optional">(opsional)</span></label>
            <textarea
              rows={3}
              placeholder="Contoh: Paket sudah dijemput kurir JNE"
              value={updateForm.keterangan}
              onChange={(e) => setUpdateForm({ ...updateForm, keterangan: e.target.value })}
            />

            {updateError && <p className="form-error">{updateError}</p>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowUpdateModal(false)}>Batal</button>
              <button className="btn-submit" onClick={handleUpdate} disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPengiriman;
