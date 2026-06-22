import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig"; // sesuaikan path axios instance kamu
import "../style/style.css";

function Register() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nama: "",
    nohp: "",
    klinik: "",
    alamat: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // cegah reload halaman
    setLoading(true);
    setErrorMsg("");

    try {
      // Sesuaikan key dengan struct models.RegisterDokter di backend
      const payload = {
        email: formData.email,
        password: formData.password,
        nama: formData.nama,
        no_hp: formData.nohp,      // fix: backend pakai "no_hp" bukan "nohp"
        klinik: formData.klinik,
        alamat: formData.alamat
      };

      await apiClient.post("/register", payload); // sesuai routes: e.POST("/register", ...)

      alert("Register Berhasil!");
      navigate("/"); // ke halaman login

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="header">
        <img src="/assets/Logo.png" alt="Logo Dental" />
        <h1>DENTAL</h1>
        <h2>MANAGEMENT SYSTEM</h2>
        <p className="subtitle">
          Silakan Register Untuk Melanjutkan
          <br />
          Ke Sistem
        </p>
      </div>

      <div className="register-box">

        {errorMsg && (
          <div style={{ background: '#ffebee', color: 'red', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
            {errorMsg}
          </div>
        )}

        <form className="form-register" onSubmit={handleRegister}>

          <div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} />
            </div>

            <div className="input-group">
              <label>Nama</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>No HP</label>
              <input type="text" name="nohp" value={formData.nohp} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <div className="input-group">
              <label>Klinik (Opsional)</label>
              <input type="text" name="klinik" value={formData.klinik} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Alamat Lengkap</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleChange} />
            </div>
          </div>

          <button
            type="submit"
            className="btn register-btn"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Register"}
          </button>

        </form>

        <div className="login-link">
          Sudah punya akun ?{" "}
          <Link to="/">Login</Link>
        </div>

      </div>

    </div>
  );
}

export default Register;