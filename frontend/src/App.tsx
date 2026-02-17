import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RuanganPage from './pages/RuanganPage';
import TambahRuangan from './pages/TambahRuangan';
import PeminjamanPage from './pages/PeminjamanPage';
import FormPeminjaman from './pages/FormPeminjaman';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ruangan" element={<RuanganPage />} />
        <Route path="/ruangan/tambah" element={<TambahRuangan />} />
        <Route path="/peminjaman" element={<PeminjamanPage />} />
        <Route path="/peminjaman-baru" element={<FormPeminjaman />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;