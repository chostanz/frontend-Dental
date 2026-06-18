import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 1. Import Link dan useNavigate
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

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = () => {

    console.log("Data Register :", formData);

    alert("Register Berhasil!");
    
    navigate("/"); 
  };

  return (
    <div className="register-page">

      <div className="header">

        <img
          src="/assets/Logo.png"
          alt="Logo Dental"
        />

        <h1>DENTAL</h1>
        <h2>MANAGEMENT SYSTEM</h2>

        <p className="subtitle">
          Silakan Register Untuk Melanjutkan
          <br />
          Ke Sistem
        </p>

      </div>

      <div className="register-box">

        <form className="form-register">

          <div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Nama</label>
              <input
                type="text"
                name="nama"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>No HP</label>
              <input
                type="text"
                name="nohp"
                onChange={handleChange}
              />
            </div>

          </div>

          <div>

            <div className="input-group">
              <label>Klinik (Opsional)</label>
              <input
                type="text"
                name="klinik"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Alamat Lengkap</label>
              <textarea
                name="alamat"
                onChange={handleChange}
              />
            </div>

          </div>

        </form>

        <button
          className="btn register-btn"
          onClick={handleRegister}
        >
          Register
        </button>

        <div className="login-link">
          Sudah punya akun ?{" "}
          {/* 4. Mengubah tag <a> menjadi <Link> */}
          <Link to="/">
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Register;