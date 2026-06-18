import { Link } from "react-router-dom"; 
import "../style/Style.css";

function Transaksi() {
  return (
    <div className="dashboard-container">

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

          <Link to="/produksi" className="nav-item">
            Produksi
          </Link>

          <Link to="/pengiriman" className="nav-item">
            Pengiriman
          </Link>

          <Link to="/transaksi" className="nav-item active">
            Transaksi
          </Link>

        </nav>

        {/* Tombol keluar juga diubah menjadi <Link> */}
        <Link to="/" className="btn-keluar">
          Keluar
        </Link>

      </div>

      <div className="main-content">

        <div className="topbar">

          <div className="topbar-left">
            <h2>Transaksi</h2>
          </div>

          <div className="topbar-right">
            <span>admin@gmail.com</span>
          </div>

        </div>

        <div className="transaksi-filter">

          <input
            type="text"
            placeholder="Cari transaksi"
            className="search-transaksi"
          />

          <select className="filter-status">
            <option>Semua</option>
            <option>Lunas</option>
            <option>Belum</option>
          </select>

          <div className="filter-bulan">
            April 2026
          </div>

          <button className="download-btn">
            Download
          </button>

        </div>

        <div className="transaksi-card">

          <table className="transaksi-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>ID Pesanan</th>
                <th>Dokter</th>
                <th>Total</th>
                <th>Metode</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>TRX-001</td>
                <td>PSN-001</td>
                <td>drg. Budi Santoso</td>
                <td className="harga">Rp 1.700.000</td>
                <td>Transfer</td>
                <td>
                  <span className="status-lunas">
                    Lunas
                  </span>
                </td>
              </tr>

              <tr>
                <td>TRX-002</td>
                <td>PSN-002</td>
                <td>drg. Anita Rahayu</td>
                <td className="harga">Rp 1.950.000</td>
                <td>Tunai</td>
                <td>
                  <span className="status-lunas">
                    Lunas
                  </span>
                </td>
              </tr>

              <tr>
                <td>TRX-003</td>
                <td>PSN-003</td>
                <td>drg. Dian Wulandari</td>
                <td className="harga">Rp 1.200.000</td>
                <td>Transfer</td>
                <td>
                  <span className="status-belum">
                    Belum
                  </span>
                </td>
              </tr>

              <tr>
                <td>TRX-004</td>
                <td>PSN-004</td>
                <td>drg. Ratna Sari</td>
                <td className="harga">Rp 3.000.000</td>
                <td>Tempo</td>
                <td>
                  <span className="status-warning">
                    Belum
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Transaksi;