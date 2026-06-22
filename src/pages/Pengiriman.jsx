import { Link } from "react-router-dom"; // 1. Import Link dari react-router-dom
import "../style/style.css";

function Pengiriman() {
  return (
    <div className="dashboard-container">

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="topbar">
          <div className="topbar-left">
            <h2>Pengiriman</h2>
          </div>
          <div className="topbar-right">
            <span>admin@gmail.com</span>
          </div>
        </div>

        <div className="shipping-top">
          <div className="shipping-search">
            Cari Pesanan
          </div>
          <div className="shipping-filter">
            Semua
          </div>
          <div className="shipping-add">
            + Tambah Pengiriman
          </div>
        </div>

        <div className="shipping-wrapper">

          <table className="shipping-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dokter</th>
                <th>Pesanan</th>
                <th>No Resi</th>
                <th>Status Pengiriman</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>PSN001</td>
                <td>drg. Budi Santoso</td>
                <td>Crown Zirconia</td>
                <td>SPX239123ND</td>
                <td className="yellow-status">Menunggu Kurir</td>
                <td>Detail</td>
              </tr>

              <tr>
                <td>PSN002</td>
                <td>drg. Anita Rahayu</td>
                <td>Veneer Porselen</td>
                <td>JNT20938243912</td>
                <td className="red-status">Dikemas</td>
                <td>Detail</td>
              </tr>

              <tr>
                <td>PSN003</td>
                <td>drg. Dian Wulandari</td>
                <td>Gigi Tiruan Full</td>
                <td>EXPRS29319313</td>
                <td className="green-status">Diterima</td>
                <td>Detail</td>
              </tr>

              <tr>
                <td>PSN004</td>
                <td>drg. Hendra Setiawan</td>
                <td>Bridge Porselen</td>
                <td>REG12133423</td>
                <td className="green-status">Diterima</td>
                <td>Detail</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}

export default Pengiriman;