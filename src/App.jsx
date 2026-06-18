import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pesanan from "./pages/Pesanan";
import Persetujuan from "./pages/Persetujuan";
import Produksi from "./pages/Produksi";
import Pengiriman from "./pages/Pengiriman";
import Transaksi from "./pages/Transaksi";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* PESANAN */}
        <Route
          path="/pesanan"
          element={<Pesanan />}
        />

        {/* PERSETUJUAN */}
        <Route
          path="/persetujuan"
          element={<Persetujuan />}
        />

        {/* PRODUKSI */}
        <Route
          path="/produksi"
          element={<Produksi />}
        />

        {/* PENGIRIMAN */}
        <Route
          path="/pengiriman"
          element={<Pengiriman />}
        />

        {/* TRANSAKSI */}
        <Route
          path="/transaksi"
          element={<Transaksi />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;