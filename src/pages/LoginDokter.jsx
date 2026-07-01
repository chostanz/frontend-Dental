import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig";
import "../style/style.css";
import fixLogo from "../assets/fix.png";

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
     
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });

      const token = response.data.token || (response.data.data && response.data.data.token);

      if (token) {
        localStorage.setItem("token", token);
        
        
        localStorage.setItem("role", "dokter");
        localStorage.setItem('id_dokter', response.data.id_dokter); 

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
          <img src={fixLogo} alt="Logo Dental" />
          <h1>DENTAL</h1>
          <h2>SISTEM KLINIK</h2>
          <p>Portal Khusus Mitra Dokter</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          
      
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#e0f2fe', 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            marginBottom: '16px' 
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0C96E4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <h3>Masuk Sebagai Dokter</h3>

          {errorMsg && <p style={{ color: "red", fontSize: "12px", textAlign: "center" }}>{errorMsg}</p>}

       
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '8px' }}>Email Dokter</label>
            <input
              type="email"
              placeholder="dr.nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

         
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn" onClick={handleLogin} disabled={isLoading} style={{ background: '#0C96E4', width: '100%' }}>
            {isLoading ? "Memproses..." : "Masuk Area Dokter"}
          </button>

          <div className="register-link">
            <br/>
            Belum punya akun? <Link to="/register">Register Dokter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDokter;