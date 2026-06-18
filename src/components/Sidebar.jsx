function Sidebar() {
  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        <img src="/assets/Logo.png" alt="Logo" />

        <div>
          <p className="logo-title">DENTAL</p>
          <p className="logo-sub">SYSTEM</p>
        </div>
      </div>

      <nav className="sidebar-nav">

        <a href="/dashboard" className="nav-item">
          Dashboard
        </a>

        <a href="/pesanan" className="nav-item">
          Pesanan
        </a>

        <a href="/persetujuan" className="nav-item">
          Persetujuan
        </a>

        <a href="/produksi" className="nav-item">
          Produksi
        </a>

        <a href="/pengiriman" className="nav-item">
          Pengiriman
        </a>

        <a href="/transaksi" className="nav-item">
          Transaksi
        </a>

      </nav>

    </div>
  );
}

export default Sidebar;