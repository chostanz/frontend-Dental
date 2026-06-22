import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'guest';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Fungsi untuk mengecek path aktif agar menu menyala (highlighted) sesuai CSS asli
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

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
        {/* Menu wajib untuk semua role */}
        <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>

        {/* Akses KHUSUS TEKNISI */}
        {role === 'teknisi' && (
          <>
            <Link to="/produk" className={isActive('/produk')}>Produk</Link>
            <Link to="/pesanan" className={isActive('/pesanan')}>Pesanan</Link>
            <Link to="/produksi" className={isActive('/produksi')}>Produksi</Link>
          </>
        )}

        {/* Akses KHUSUS DOKTER */}
        {role === 'dokter' && (
          <>
            <Link to="/pesanan" className={isActive('/pesanan')}>Pesanan</Link>
            <Link to="/pengiriman" className={isActive('/pengiriman')}>Pengiriman</Link>
            <Link to="/transaksi" className={isActive('/transaksi')}>Transaksi</Link>
          </>
        )}

        {/* Akses KHUSUS BOS */}
        {role === 'bos' && (
          <>
            <Link to="/produk" className={isActive('/produk')}>Produk</Link>
            <Link to="/pesanan" className={isActive('/pesanan')}>Pesanan</Link>
            <Link to="/persetujuan" className={isActive('/persetujuan')}>Persetujuan</Link>
            <Link to="/produksi" className={isActive('/produksi')}>Produksi</Link>
            <Link to="/pengiriman" className={isActive('/pengiriman')}>Pengiriman</Link>
            <Link to="/transaksi" className={isActive('/transaksi')}>Transaksi</Link>
            <Link to="/karyawan" className={isActive('/karyawan')}>Karyawan</Link>
          </>
        )}

        {/* Akses KHUSUS CS */}
        {role === 'cs' && (
          <>
            <Link to="/pesanan" className={isActive('/pesanan')}>Pesanan</Link>
            <Link to="/pengiriman" className={isActive('/pengiriman')}>Pengiriman</Link>
            <Link to="/produksi" className={isActive('/produksi')}>Produksi</Link>
            <Link to="/transaksi" className={isActive('/transaksi')}>Transaksi</Link>
            <Link to="/produk" className={isActive('/produk')}>Produk</Link>
          </>
        )}
      </nav>
      
      <button onClick={handleLogout} className="btn-keluar" style={{ marginBottom: '20px' }}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;