import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import apiClient from "../config/axiosConfig"; 
import "../style/style.css";
import "../style/Produksi.css"; 
import Topbar from "../components/Topbar";

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
        
        <Topbar title="Transaksi" />

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
          
          <button 
            className="btn" 
            onClick={handleExportCSV}
            style={{
              padding: '12px 20px', 
              width: 'auto', 
              background: '#3498db', 
              border: 'none', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              fontWeight: '600',
              color: 'white', 
              display: 'flex', 
              alignItems: 'center',
              gap: '8px' 
            }}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>

        <div className="table-card" style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Memuat transaksi...</p>
          ) : errorMsg ? (
            <p style={{ textAlign: "center", color: "red", padding: "20px" }}>{errorMsg}</p>
          ) : (
            <table className="transaksi-table" style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #f0f4f8', textAlign: 'left'}}>
                  {/* Font Th dikecilkan jadi 12px & diberi font-weight normal agar lurus vertikal dengan data di bawahnya */}
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', width: '14%'}}>ID Transaksi</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', width: '13%'}}>ID Pesanan</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', width: '15%'}}>Dokter</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', width: '14%'}}>Tgl Transaksi</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', textAlign: 'right', width: '15%'}}>Total Tagihan</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', textAlign: 'center', width: '10%'}}>Metode</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', textAlign: 'center', width: '11%'}}>Status</th>
                  <th style={{padding: '12px 10px', color: '#676060', fontSize: '12px', fontWeight: '500', textAlign: 'center', width: '13%'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: '#676060', fontSize: '12px' }}>Belum ada data transaksi.</td>
                  </tr>
                ) : (
                  transaksiList.map((trx) => (
                    <tr key={trx.id_transaksi} style={{borderBottom: '1px solid #f0f4f8'}}>
                      {/* Font ukuran data utama memakai 12px, data sekunder (tgl/nama) memakai 11px */}
                      <td style={{padding: '15px 10px', fontWeight: '600', color: '#222', fontSize: '12px'}}>
                        #{trx.id_transaksi ? trx.id_transaksi.substring(0,8).toUpperCase() : "-"}
                      </td>
                      <td style={{padding: '15px 10px', color: '#3498db', fontWeight: '600', fontSize: '12px'}}>
                        {trx.id_pesanan ? trx.id_pesanan.substring(0,8).toUpperCase() : "-"}
                      </td>
                      <td style={{padding: '15px 10px', color: '#676060', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        drg. {trx.nama_dokter || "-"}
                      </td>
                      <td style={{padding: '15px 10px', fontSize: '11px', color: '#555'}}>
                        {new Date(trx.tgl_transaksi).toLocaleDateString('id-ID')}
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'right', fontWeight: '700', color: '#222', fontSize: '12px'}}>
                        Rp {Number(trx.total_harga).toLocaleString('id-ID')}
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'center', textTransform: 'capitalize', fontSize: '11px', color: '#555'}}>
                        {trx.metode_pembayaran || "-"}
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'center'}}>
                        {/* Font badge status disesuaikan ke 11px padat */}
                        <span className={`badge ${trx.status_pembayaran === 'lunas' ? 'badge-selesai' : 'badge-baru'}`} style={{fontSize: '11px', padding: '4px 8px'}}>
                          {trx.status_pembayaran}
                        </span>
                      </td>
                      <td style={{padding: '15px 10px', textAlign: 'center'}}>
                        {trx.status_pembayaran !== 'lunas' && isAksesKeuangan ? (
                          <button 
                            onClick={() => handleBukaModal(trx)}
                            style={{background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600'}}
                          >
                            Konfirmasi
                          </button>
                        ) : (
                          <span style={{fontSize: '11px', color: '#999'}}>-</span>
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

      {showModal && selectedTrx && (
        <div 
          className="modal-overlay"
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
          onClick={handleTutupModal}
        >
          <div 
            className="modal-box" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#e3f2fd', 
              padding: '30px 35px', 
              width: '100%',
              maxWidth: '460px', 
              borderRadius: '24px', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>
              Konfirmasi Pembayaran
            </h3>
            <p style={{ margin: '-10px 0 5px 0', fontSize: '14px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>
              Pesanan: <span style={{ color: '#1e293b' }}>#{selectedTrx.id_pesanan.substring(0,8).toUpperCase()}</span>
            </p>

            {/* Input 1: Metode Pembayaran */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <label style={{ textAlign: "left", fontSize: '14px', fontWeight: '600', color: '#334155', paddingLeft: '2px' }}>
                Metode Pembayaran
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '12px', 
                    outline: 'none', 
                    background: '#ffffff', 
                    fontFamily: 'inherit', 
                    fontSize: '14px', 
                    boxSizing: 'border-box',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    color: '#334155',
                    appearance: 'none', 
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" disabled>-- Pilih Metode --</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="tunai">Tunai</option>
                  <option value="qris">QRIS</option>
                  <option value="gopay">GoPay</option>
                </select>
                <div style={{
                  position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', color: '#64748b', fontSize: '11px', fontWeight: 'bold'
                }}>
                  ▲▼
                </div>
              </div>
            </div>

            {/* Input 2: Jumlah Dibayar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <label style={{ textAlign: "left", fontSize: '14px', fontWeight: '600', color: '#334155', paddingLeft: '2px' }}>
                Jumlah Dibayar (Rp)
              </label>
              
              <style>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>

              <input
                type="number"
                placeholder="Masukkan jumlah pembayaran"
                value={jumlahDibayar}
                onChange={(e) => setJumlahDibayar(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '12px', 
                  outline: 'none', 
                  background: '#ffffff', 
                  fontFamily: 'inherit', 
                  fontSize: '14px', 
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  color: '#334155'
                }}
              />
              <small style={{ color: '#ef4444', fontSize: '13px', margin: '4px 0 0 2px', textAlign: 'left', fontWeight: '500' }}>
                *Total tagihan: Rp {Number(selectedTrx.total_harga).toLocaleString('id-ID')}
              </small>
            </div>

            {/* Tombol Aksi */}
            <div className="modal-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
              <button 
                type="button"
                onClick={handleTutupModal} 
                disabled={submitting}
                style={{ 
                  background: '#ff5c75', color: 'white', padding: '10px 28px', border: 'none', 
                  borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', 
                  minWidth: '110px', boxShadow: '0 2px 4px rgba(255,92,117,0.2)' 
                }}
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleKonfirmasi} 
                disabled={submitting}
                style={{ 
                  background: '#00e640', color: 'white', padding: '10px 28px', border: 'none', 
                  borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', 
                  minWidth: '110px', boxShadow: '0 2px 4px rgba(0,230,64,0.2)' 
                }}
              >
                {submitting ? "Proses..." : "Lunas"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Transaksi;