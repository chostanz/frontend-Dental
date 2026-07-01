import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import apiClient from "../config/axiosConfig";
import "../style/style.css";
import fixLogo from "../assets/fix.png";

function Login() {
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
      // FIX: Langsung tembak API Karyawan
      const response = await apiClient.post("/login/karyawan", {
        email,
        password,
      });

      const token =
        response.data.token ||
        (response.data.data && response.data.data.token);

      if (token) {
        localStorage.setItem("token", token);

        // Karyawan pasti punya role (bos, cs, teknisi)
        const decoded = jwtDecode(token);
        localStorage.setItem("role", decoded.role);

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
          <h2>MANAGEMENT SYSTEM</h2>
          <p>Silakan Masuk Untuk Melanjutkan Ke Sistem</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">

        
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e0f2fe",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              marginBottom: "16px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h3>Masuk Sebagai Karyawan</h3>

          {errorMsg && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {errorMsg}
            </p>
          )}

          {/* Email */}
          <div className="form-group" style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                textAlign: "left",
                width: "100%",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                boxSizing: "border-box",
                width: "100%",
              }}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                textAlign: "left",
                width: "100%",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                boxSizing: "border-box",
                width: "100%",
              }}
            />
          </div>

          <button
            className="btn"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>

        

        </div>
      </div>
    </div>
  );
}

export default Login;