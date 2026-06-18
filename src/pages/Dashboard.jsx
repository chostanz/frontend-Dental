import { Link } from "react-router-dom";
import "../style/style.css";

function Dashboard() {
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

        <nav className="sidebar-nav">

          <Link to="/dashboard" className="nav-item active">
            Dashboard
          </Link>

          <Link to="/pesanan" className="nav-item">
            Pesanan
          </Link>

          <Link to="/persetujuan" className="nav-item">
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

      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="topbar">
          <h2>Dashboard</h2>
        </div>

        <div className="stat-cards">

          <div className="stat-card">
            <p>Total Pesanan</p>
            <h2>128</h2>
          </div>

          <div className="stat-card">
            <p>Disetujui</p>
            <h2>100</h2>
          </div>

          <div className="stat-card">
            <p>Sedang Diproses</p>
            <h2>35</h2>
          </div>

          <div className="stat-card">
            <p>Pengiriman</p>
            <h2>15</h2>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;