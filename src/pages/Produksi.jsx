import { Link } from "react-router-dom"; // 1. Import Link dari react-router-dom
import "../style/Style.css";

function Produksi() {
  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="sidebar-logo">
          <img src="/assets/Logo.png" alt="Logo" />
          <div>
            <p className="logo-title">DENTAL</p>
            <p className="logo-sub">SYSTEM</p>
          </div>
        </div>

        {/* 2. Mengubah semua tag <a> navigasi menjadi <Link> */}
        <nav className="sidebar-nav">

          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>

          <Link to="/pesanan" className="nav-item">
            Pesanan
          </Link>

          <Link to="/persetujuan" className="nav-item">
            Persetujuan
          </Link>

          <Link to="/produksi" className="nav-item active">
            Produksi
          </Link>

          <Link to="/pengiriman" className="nav-item">
            Pengiriman
          </Link>

          <Link to="/transaksi" className="nav-item">
            Transaksi
          </Link>

        </nav>

        {/* Tombol keluar menggunakan <Link> */}
        <Link to="/" className="btn-keluar">
          Keluar
        </Link>

      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="topbar">
          <div className="topbar-left">
            <h2>Proses Produksi</h2>
          </div>
          <div className="topbar-right">
            <span>admin@gmail.com</span>
          </div>
        </div>

        <div className="production-grid">

          {/* ANTRIAN */}
          <div className="production-column">
            <h3>Antrian 3</h3>

            <div className="production-card">
              <h4>PSN-003</h4>
              <p>Gigi Tiruan Full</p>
              <small>drg. Dian W.</small>
              <span>Natural</span>
            </div>

            <div className="production-card">
              <h4>PSN-007</h4>
              <p>Veneer Porselen</p>
              <small>drg. Lina M.</small>
            </div>
          </div>

          {/* DIKERJAKAN */}
          <div className="production-column">
            <h3>Dikerjakan 2</h3>

            <div className="production-card">
              <h4>PSN-001</h4>
              <p>Crown Zirconia</p>
              <small>Ahmad R</small>
              <span>65%</span>
            </div>

            <div className="production-card">
              <h4>PSN-005</h4>
              <p>Bridge Porselen</p>
              <small>Rina S</small>
              <span>88%</span>
            </div>
          </div>

          {/* REVISI */}
          <div className="production-column">
            <h3>Revisi 1</h3>

            <div className="production-card">
              <h4>PSN-004</h4>
              <p>Bridge Porselen</p>
              <small>drg. Hendra S</small>
              <button className="warning-btn">Warna tidak sesuai</button>
            </div>
          </div>

          {/* SELESAI */}
          <div className="production-column">
            <h3>Selesai 2</h3>

            <div className="production-card">
              <h4>PSN-002</h4>
              <p>Veneer Porselen</p>
              <small>drg. Anita R.</small>
              <button className="done-btn">Terkirim</button>
            </div>

            <div className="production-card">
              <h4>PSN-008</h4>
              <p>Crown Zirconia</p>
              <small>drg. Tono P.</small>
              <button className="done-btn">Terkirim</button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Produksi;