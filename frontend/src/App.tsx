import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RuanganPage from './pages/RuanganPage';
import DetailRuanganPage from './pages/DetailRuanganPage';
import TambahRuanganPage from './pages/TambahRuangan';
import PeminjamanPage from './pages/PeminjamanPage';
import DetailPeminjamanPage from './pages/DetailPeminjamanPage';
import FormPeminjaman from './pages/FormPeminjamanPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ruangan" element={<RuanganPage />} />
        <Route path="/ruangan/:id" element={<DetailRuanganPage />} /> 
        <Route path="/ruangan/tambah" element={<TambahRuanganPage />} />
        <Route path="/peminjaman" element={<PeminjamanPage />} />
        <Route path="/peminjaman/:id" element={<DetailPeminjamanPage />} />
        <Route path="/peminjaman-baru" element={<FormPeminjaman />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;