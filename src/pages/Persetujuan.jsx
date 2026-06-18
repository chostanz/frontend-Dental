import { Link } from "react-router-dom"; // 1. Import Link dari react-router-dom
import "../style/Style.css";

function Persetujuan() {
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

          <Link to="/persetujuan" className="nav-item active">
            Persetujuan
          </Link>

          <Link to="/produksi" className="nav-item">
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
            <h2>Persetujuan Bos</h2>
          </div>
          <div className="topbar-right">
            <span>bos@gmail.com</span>
          </div>
        </div>

        <p className="approval-text">
          Pesanan menunggu persetujuan bos
          <span> - 3 pesanan</span>
        </p>

        <div className="approval-wrapper">

          {/* CARD 1 */}
          <div className="approval-card">
            <div className="approval-left">
              <div className="approval-icon">👤</div>
              <div className="approval-info">
                <h3>drg. Budi Santoso</h3>
                <p>Crown Zirconia</p>
                <small>#PSN-010 - Diajukan 24 Apr 2026 - Klinik Sehat</small>
              </div>
            </div>
            <div className="approval-action">
              <button className="btn-approve">Setuju</button>
              <button className="btn-reject">Tolak</button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="approval-card red-card">
            <div className="approval-left">
              <div className="approval-icon">👤</div>
              <div className="approval-info">
                <h3>drg. Ratna Sari</h3>
                <p>Veneer Porselen x3</p>
                <small>#PSN-011 - Diajukan 24 Apr 2026 - Klinik Medika</small>
              </div>
            </div>
            <div className="approval-action">
              <button className="btn-approve">Setuju</button>
              <button className="btn-reject">Tolak</button>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="approval-card green-card">
            <div className="approval-left">
              <div className="approval-icon">👤</div>
              <div className="approval-info">
                <h3>drg. Dian Wulandari</h3>
                <p>Gigi Tiruan</p>
                <small>#PSN-012 - Diajukan 23 Apr 2026 - Klinik Prima</small>
              </div>
            </div>
            <div className="approval-action">
              <button className="btn-approve">Setuju</button>
              <button className="btn-reject">Tolak</button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Persetujuan;