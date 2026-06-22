import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig";
import "../style/style.css";

function LoginDokter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Email dan password tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // FIX: Langsung tembak API Dokter
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });

      const token = response.data.token || (response.data.data && response.data.data.token);

      if (token) {
        localStorage.setItem("token", token);
        
        // KARENA DOKTER TIDAK PUNYA FIELD ROLE, KITA HARDCODE SAJA DI SINI:
        localStorage.setItem("role", "dokter");
        localStorage.setItem('id_dokter', response.data.id_dokter); // Sesuai respons JSON login backend Anda

        navigate("/dashboard");
      } else {
        setErrorMsg("Token tidak valid dari server.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Koneksi ke server gagal.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="logo-section">
          <img src="/assets/Logo.png" alt="Logo Dental" />
          <h1>DENTAL</h1>
          <h2>SISTEM KLINIK</h2>
          <p>Portal Khusus Mitra Dokter</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <div className="avatar">
            {/* Pakai icon stetoskop atau bedakan warnanya jika mau */}
            <i className="fa-solid fa-user-doctor" style={{color: '#0C96E4'}}></i>
          </div>

          <h3>Masuk Sebagai Dokter</h3>

          {errorMsg && <p style={{ color: "red", fontSize: "12px", textAlign: "center" }}>{errorMsg}</p>}

          <div className="form-group">
            <label>Email Dokter</label>
            <input
              type="email"
              placeholder="dr.nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn" onClick={handleLogin} disabled={isLoading} style={{background: '#0C96E4'}}>
            {isLoading ? "Memproses..." : "Masuk Area Dokter"}
          </button>

          <div className="register-link">
            Bukan Dokter? <Link to="/" style={{color: 'blue'}}>Login Karyawan</Link>
            <br/><br/>
            Belum punya akun? <Link to="/register">Register Dokter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDokter;