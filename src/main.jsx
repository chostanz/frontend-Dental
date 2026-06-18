import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Tambahkan baris ini untuk mengaktifkan Font Awesome di seluruh aplikasi
import '@fortawesome/fontawesome-free/css/all.min.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)