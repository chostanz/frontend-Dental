import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pesanan from "./pages/Pesanan";
import Persetujuan from "./pages/Persetujuan";
import Produksi from "./pages/Produksi";
import Pengiriman from "./pages/Pengiriman";
import Transaksi from "./pages/Transaksi";
import Produk from "./pages/Produk";
import Karyawan from "./pages/Karyawan";
import LoginDokter from "./pages/LoginDokter";
import BuatPesanan from "./pages/BuatPesanan";
import DetailPesanan from "./pages/DetailPesanan";
import Layout from "./components/Layout"; // Import Layout yang baru dibuat

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE LUAR (Tanpa Sidebar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-dokter" element={<LoginDokter />} /> {/* URL khusus Dokter */}
        <Route path="/register" element={<Register />} />

        {/* RUTE DALAM (Dengan Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/persetujuan" element={<Persetujuan />} />
          <Route path="/produksi" element={<Produksi />} />
          <Route path="/pengiriman" element={<Pengiriman />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/produk" element={<Produk />} />
          <Route path="/karyawan" element={<Karyawan />} />
          <Route path="/buat-pesanan" element={<BuatPesanan />} />
          <Route path="/pesanan/detail/:id" element={<DetailPesanan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;