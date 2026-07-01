import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig"; 
import "../style/style.css";
import fixLogo from "../assets/fix.png";

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

  const baseInputStyle = {
    width: '100%',
    padding: '14px 14px 14px 16px',
    border: '1px solid #cbd5e1', 
    background: '#ffffff', 
    borderRadius: '12px',
    outline: 'none',
    fontSize: '14px',
    color: '#333333',
    boxSizing: 'border-box',
    display: 'block'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#4a5568',
    textAlign: 'left'
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>

      <div style={{ textAlign: 'center', marginBottom: '25px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <img 
          src={fixLogo} 
          alt="Logo Dental" 
          style={{ 
            width: '85px', 
            height: 'auto', 
            marginBottom: '10px',
            filter: 'invert(53%) sepia(81%) saturate(2225%) hue-rotate(178deg) brightness(97%) contrast(93%)' 
          }} 
        />
        
        <h1 style={{ color: '#2298ea', fontSize: '34px', fontWeight: '800', letterSpacing: '0.5px', margin: '0' }}>DENTAL</h1>
        <h2 style={{ color: '#001a8d', fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px', margin: '4px 0 12px 0' }}>MANAGEMENT SYSTEM</h2>
        <p style={{ fontWeight: '700', color: '#718096', fontSize: '13px', margin: '0' }}>
          Silakan Register Untuk Melanjutkan Ke Sistem
        </p>
      </div>

  
      <div style={{ width: '100%', maxWidth: '850px', boxSizing: 'border-box', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '45px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', border: '1px solid #fee2e2', textAlign: 'left' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ width: '100%', display: 'block' }}>
          
         
          <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', marginBottom: '35px', width: '100%' }}>
            
       
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', width: '50%' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={baseInputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={baseInputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Nama</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required style={baseInputStyle} />
              </div>

              <div>
                <label style={labelStyle}>No Hp</label>
                <input type="text" name="nohp" value={formData.nohp} onChange={handleChange} required style={baseInputStyle} />
              </div>
            </div>

        
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', width: '50%' }}>
              <div>
                <label style={labelStyle}>Klinik (Opsional)</label>
                <input type="text" name="klinik" value={formData.klinik} onChange={handleChange} style={baseInputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                <label style={labelStyle}>Alamat Lengkap</label>
                <div style={{ flex: '1', display: 'flex' }}>
                  <textarea 
                    name="alamat" 
                    value={formData.alamat} 
                    onChange={handleChange} 
                    required 
                    style={{ 
                      ...baseInputStyle, 
                      height: '215px', 
                      minHeight: '215px',
                      resize: 'none',
                      flex: '1'
                    }} 
                  />
                </div>
              </div>
            </div>

          </div>

         
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                maxWidth: '320px', 
                padding: '13px', 
                background: '#34a8e4', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(52, 168, 228, 0.3)',
                display: 'block'
              }}
            >
              {loading ? "Memproses..." : "Register"}
            </button>

            <div style={{ fontSize: '13px', color: '#718096', fontWeight: '500' }}>
              Sudah punya akun ? <Link to="/" style={{ color: '#2298ea', fontWeight: '700', textDecoration: 'none', marginLeft: '4px' }}>Login</Link>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Register;