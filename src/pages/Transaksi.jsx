import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import apiClient from "../config/axiosConfig"; 
import "../style/style.css";
import "../style/Produksi.css"; 

function Transaksi() {
  const navigate = useNavigate();
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State untuk Modal Konfirmasi Pembayaran
  const [showModal, setShowModal] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [metode, setMetode] = useState("");
  const [jumlahDibayar, setJumlahDibayar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  let role = "";
  let idKaryawan = "";
  let displayEmail = localStorage.getItem("email") || "user@klinik.com";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role || "";
      idKaryawan = decoded.id_karyawan || decoded.id || "";
    } catch (e) {
      console.error("Gagal decode token:", e);
    }
  }

  // Hak akses tombol aksi (Hanya CS dan Bos)
  const isAksesKeuangan = role === "cs" || role === "bos";

  const fetchTransaksi = async () => {
    setLoading(true);
    try {
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
        ? `/api/transaksi/dokter/${idDokter}` 
        : `/api/transaksi`;

      const res = await apiClient.get(endpoint);
      setTransaksiList(res.data.data || res.data || []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal memuat data transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const handleBukaModal = (trx) => {
    setSelectedTrx(trx);
    setMetode(trx.metode_pembayaran || "transfer");
    setJumlahDibayar(trx.total_harga || 0); 
    setShowModal(true);
  };

  // --- FUNGSI EXPORT / DOWNLOAD EXCEL / CSV ---
  const handleExportCSV = () => {
    if (transaksiList.length === 0) {
        alert("Data transaksi kosong untuk di-export!");
        return;
    }

    const headers = ["ID Transaksi", "ID Pesanan", "Nama Dokter", "Total Harga", "Metode Pembayaran", "Status Pembayaran", "Tanggal"];
    
    const rows = transaksiList.map(t => [
        t.id_transaksi,
        t.id_pesanan,
        `drg. ${t.nama_dokter || "-"}`,
        t.total_harga,
        t.metode_pembayaran || "-",
        t.status_pembayaran,
        new Date(t.tgl_transaksi).toLocaleDateString('id-ID')
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Transaksi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTutupModal = () => {
    setShowModal(false);
    setSelectedTrx(null);
    setMetode("");
    setJumlahDibayar(0);
  };

  const handleKonfirmasi = async () => {
    if (!metode) {
      alert("Metode pembayaran wajib dipilih!");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.put(`/api/transaksi/pesanan/${selectedTrx.id_pesanan}/konfirmasi`, {
        id_karyawan: idKaryawan,
        metode_pembayaran: metode,
        status_pembayaran: "lunas", 
        jumlah_dibayar: parseFloat(jumlahDibayar)
      });

      alert("Pembayaran berhasil dikonfirmasi!");
      await fetchTransaksi();
      handleTutupModal();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengkonfirmasi pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        
        {/* TOPBAR - Rapi, Menampilkan Role dan Email */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Transaksi & Pembayaran</h2>
          </div>
          <div className="topbar-right">
            <span style={{fontWeight: '600', color: '#001a8d', textTransform: 'uppercase', fontSize: '14px'}}>Hallo, {role}</span>
            <span style={{fontSize: '12px', color: '#676060', marginLeft: '6px'}}>{displayEmail}</span>
            <i 
              className="fa-regular fa-circle-user admin-avatar" 
              style={{marginLeft: '10px', fontSize: '24px', cursor: 'pointer'}}
              onClick={() => navigate("/profil")}
              title="Ke Halaman Profil"
            ></i>
          </div>
        </div>

        {/* Filter & Tombol Export */}
        <div className="transaksi-filter" style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Cari ID Pesanan..."
            className="search-transaksi"
            style={{padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', flex: 1, outline: 'none', background: 'white'}}
          />
          <select className="filter-status" style={{padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', outline: 'none'}}>
            <option>Semua</option>
            <option>Lunas</option>
            <option>Belum Bayar</option>
          </select>
          
          {/* 🌟 TOMBOL EXPORT CSV / EXCEL */}
          <button 
            className="btn" 
            onClick={handleExportCSV}
            style={{padding: '12px 20px', width: 'auto', background: '#3498db', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600'} }
          >
            <i className="fa-solid fa-download" style={{marginRight: '8px'}}></i> Export CSV
          </button>
        </div>

        {/* Tabel Data Transaksi */}
        <div className="table-card" style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Memuat transaksi...</p>
          ) : errorMsg ? (
            <p style={{ textAlign: "center", color: "red", padding: "20px" }}>{errorMsg}</p>
          ) : (
            <table className="transaksi-table" style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #f0f4f8', textAlign: 'left'}}>
                  <th style={{padding: '12px 10px', color: '#676060'}}>ID Transaksi</th>
                  <th style={{padding: '12px 10px', color: '#676060'}}>ID Pesanan</th>
                  <th style={{padding: '12px 10px', color: '#676060'}}>Dokter</th>
                  <th style={{padding: '12px 10px', color: '#676060'}}>Tgl Transaksi</th>
                  <th style={{padding: '12px 10px', color: '#676060', textAlign: 'right'}}>Total Tagihan</th>
                  <th style={{padding: '12px 10px', color: '#676060', textAlign: 'center'}}>Metode</th>
                  <th style={{padding: '12px 10px', color: '#676060', textAlign: 'center'}}>Status</th>
                  <th style={{padding: '12px 10px', color: '#676060', textAlign: 'center'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: '#676060' }}>Belum ada data transaksi.</td>
                  </tr>
                ) : (
                  transaksiList.map((trx) => (
                    <tr key={trx.id_transaksi} style={{borderBottom: '1px solid #f0f4f8'}}>
                      <td style={{padding: '15px 10px', fontWeight: '600', color: '#222'}}>
                        #{trx.id_transaksi ? trx.id_transaksi.substring(0,8).toUpperCase() : "-"}
                      </td>
                      <td style={{padding: '15px 10px', color: '#3498db', fontWeight: '600'}}>
                        {trx.id_pesanan ? trx.id_pesanan.substring(0,8).toUpperCase() : "-"}
                      </td>
                      <td style={{padding: '15px 10px', color: '#676060', fontSize: '13px'}}>
                        drg. {trx.nama_dokter || "-"}
                      </td>
                      <td style={{padding: '15px 10px', fontSize: '13px'}}>
                        {new Date(trx.tgl_transaksi).toLocaleDateString('id-ID')}
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'right', fontWeight: 'bold', color: '#222'}}>
                        Rp {Number(trx.total_harga).toLocaleString('id-ID')}
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'center', textTransform: 'capitalize', fontSize: '13px'}}>
                        {trx.metode_pembayaran || "-"}
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'center'}}>
                        <span className={`badge ${trx.status_pembayaran === 'lunas' ? 'badge-selesai' : 'badge-baru'}`}>
                          {trx.status_pembayaran}
                        </span>
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'center'}}>
                        {trx.status_pembayaran !== 'lunas' && isAksesKeuangan ? (
                          <button 
                            onClick={() => handleBukaModal(trx)}
                            style={{background: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}
                          >
                            Konfirmasi Bayar
                          </button>
                        ) : (
                          <span style={{fontSize: '12px', color: '#999'}}>-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI PEMBAYARAN */}
      {showModal && selectedTrx && (
        <div className="modal-overlay">
          <div className="modal-box" style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', maxWidth: '400px'}}>
            <h3 style={{ color: '#1a5694', marginBottom: '10px', textAlign: 'center' }}>Konfirmasi Pembayaran</h3>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 20, textAlign: 'center' }}>
              Pesanan: <strong>#{selectedTrx.id_pesanan.substring(0,8).toUpperCase()}</strong>
            </p>

            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Metode Pembayaran</label>
              <select
                className="modal-select"
                value={metode}
                onChange={(e) => setMetode(e.target.value)}
                style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#f8fafc', outline: 'none'}}
              >
                <option value="" disabled>-- Pilih Metode --</option>
                <option value="transfer">Transfer Bank</option>
                <option value="tunai">Tunai</option>
                <option value="qris">QRIS</option>
                <option value="gopay">GoPay</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Jumlah Dibayar (Rp)</label>
              <input
                type="number"
                className="modal-select" 
                value={jumlahDibayar}
                onChange={(e) => setJumlahDibayar(e.target.value)}
                style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#f8fafc', outline: 'none'}}
              />
              <small style={{ color: '#e74c3c', fontSize: '11px', marginTop: '5px', display: 'block' }}>
                *Total tagihan: Rp {Number(selectedTrx.total_harga).toLocaleString('id-ID')}
              </small>
            </div>

            <div className="modal-actions" style={{display: 'flex', gap: '12px'}}>
              <button className="btn-reject" style={{flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer'}} onClick={handleTutupModal} disabled={submitting}>
                Batal
              </button>
              <button className="btn-approve" style={{flex: 1, padding: '12px', background: '#0C96E4', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer'}} onClick={handleKonfirmasi} disabled={submitting}>
                {submitting ? "Memproses..." : "Lunas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaksi;