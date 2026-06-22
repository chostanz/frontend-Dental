import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig"; 
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
    e.preventDefault(); 
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        nama: formData.nama,
        no_hp: formData.nohp,      
        klinik: formData.klinik,
        alamat: formData.alamat
      };

      await apiClient.post("/register", payload); 

      alert("Register Berhasil!");
      navigate("/"); 

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>

      <div className="header" style={{ textAlign: 'center', marginBottom: '25px' }}>
        <img src="/assets/Logo.png" alt="Logo Dental" style={{ width: '90px', marginBottom: '10px' }} />
        <h1 style={{ color: '#3498db', fontSize: '36px', fontWeight: '800', lineHeight: '1.1' }}>DENTAL</h1>
        <h2 style={{ color: '#001a8d', fontSize: '24px', fontWeight: '700' }}>MANAGEMENT SYSTEM</h2>
        <p className="subtitle" style={{ marginTop: '10px', fontWeight: '500', color: '#666', fontSize: '14px' }}>
          Silakan Register Untuk Melanjutkan Ke Sistem
        </p>
      </div>

      <div className="register-box" style={{ width: '100%', maxWidth: '750px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '35px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>

        {errorMsg && (
          <div style={{ background: '#ffebee', color: '#c53030', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '500', border: '1px solid #ffcdd2' }}>
            {errorMsg}
          </div>
        )}

        <form className="form-register" onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#333' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#333' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} placeholder="Minimal 8 karakter" style={{ width: '100%', padding: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#333' }}>Nama Lengkap</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleChange} required style={{ width: '100%', padding: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#333' }}>No. HP</label>
              <input type="text" name="nohp" value={formData.nohp} onChange={handleChange} required style={{ width: '100%', padding: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#333' }}>Klinik <span style={{color: '#64748b', fontSize: '11px'}}>(Opsional)</span></label>
              <input type="text" name="klinik" value={formData.klinik} onChange={handleChange} style={{ width: '100%', padding: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#333' }}>Alamat Lengkap</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleChange} style={{ width: '100%', padding: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '10px', outline: 'none', fontSize: '13px', height: '110px', resize: 'vertical' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn register-btn"
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '10px' }}
          >
            {loading ? "Memproses..." : "Daftar Akun"}
          </button>

        </form>

        <div className="login-link" style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#4a5568' }}>
          Sudah punya akun? <Link to="/" style={{ color: '#3498db', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;