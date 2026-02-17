import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { peminjamanService } from '../services/peminjamanService';
import { ruanganService } from '../services/ruanganService';
import type { Peminjaman } from '../types/peminjaman';
import type { Ruangan } from '../types/ruangan';
import Status from '../components/StatusBadge';
import { FaArrowLeft, FaCheck, FaTimes, FaCheckCircle, FaDoorOpen, FaUser, FaIdCard, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

const DetailPeminjamanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [peminjaman, setPeminjaman] = useState<Peminjaman | null>(null);
    const [ruangan, setRuangan] = useState<Ruangan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await peminjamanService.getById(Number(id));
            setPeminjaman(data);
            
            const ruangData = await ruanganService.getById(data.idRuangan);
            setRuangan(ruangData);
        } catch (error) {
            console.error('Gagal load data:', error);
            alert('Data peminjaman tidak ditemukan');
            navigate('/peminjaman');
        } finally {
            setLoading(false);
        }
    };

    const handleSetujui = async () => {
        if (window.confirm('Setujui peminjaman ini?')) {
            try {
                await peminjamanService.setujui(Number(id));
                alert('Peminjaman disetujui');
                loadData();
            } catch (error) {
                alert('Gagal menyetujui peminjaman');
            }
        }
    };

    const handleTolak = async () => {
        if (window.confirm('Tolak peminjaman ini?')) {
            try {
                await peminjamanService.tolak(Number(id));
                alert('Peminjaman ditolak');
                loadData();
            } catch (error) {
                alert('Gagal menolak peminjaman');
            }
        }
    };

    const handleSelesai = async () => {
        if (window.confirm('Tandai peminjaman ini selesai?')) {
            try {
                await peminjamanService.selesai(Number(id));
                alert('Peminjaman selesai');
                loadData();
            } catch (error) {
                alert('Gagal menyelesaikan peminjaman');
            }
        }
    };

    const formatTanggal = (tanggal: string) => {
        return format(new Date(tanggal), 'dd MMMM yyyy HH:mm');
    };

    const hitungDurasi = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        return diffHours.toFixed(1);
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!peminjaman || !ruangan) {
        return (
            <div className="container mt-4 text-center">
                <h3>Data peminjaman tidak ditemukan</h3>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/peminjaman')}
                >
                    Kembali ke Daftar Peminjaman
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/peminjaman')}
                >
                    <FaArrowLeft className="me-2" /> Kembali ke Daftar Peminjaman
                </button>
            </div>

            <div className="card detail-card">
                <div className="detail-header" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                    <FaCalendarAlt className="detail-icon" />
                    <h2>Detail Peminjaman</h2>
                    <p className="mb-0">ID: {peminjaman.idPeminjaman}</p>
                </div>
                
                <div className="detail-content">
                    <div className="info-row">
                        <span className="info-label">Status</span>
                        <span className="info-value">
                            <Status status={peminjaman.status} />
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Ruangan</span>
                        <span className="info-value">
                            <FaDoorOpen className="me-2 text-primary" />
                            {ruangan.namaRuangan} ({ruangan.idRuangan})
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Kapasitas Ruangan</span>
                        <span className="info-value">{ruangan.kapasitas} orang</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Nama Peminjam</span>
                        <span className="info-value">
                            <FaUser className="me-2 text-success" />
                            {peminjaman.namaUser}
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">ID/NIM</span>
                        <span className="info-value">
                            <FaIdCard className="me-2 text-info" />
                            {peminjaman.idUser}
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Keterangan</span>
                        <span className="info-value">{peminjaman.keterangan}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Waktu Mulai</span>
                        <span className="info-value">
                            <FaClock className="me-2 text-warning" />
                            {formatTanggal(peminjaman.startTime)}
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Waktu Selesai</span>
                        <span className="info-value">
                            <FaClock className="me-2 text-danger" />
                            {formatTanggal(peminjaman.endTime)}
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Durasi</span>
                        <span className="info-value">
                            {hitungDurasi(peminjaman.startTime, peminjaman.endTime)} jam
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Diajukan Pada</span>
                        <span className="info-value">
                            <FaCalendarAlt className="me-2 text-secondary" />
                            {formatTanggal(peminjaman.createdAt)}
                        </span>
                    </div>

                    <div className="mt-4 d-flex gap-2 justify-content-end">
                        {peminjaman.status === 'Diproses' && (
                            <>
                                <button 
                                    className="btn btn-success"
                                    onClick={handleSetujui}
                                >
                                    <FaCheck className="me-2" /> Setujui
                                </button>
                                <button 
                                    className="btn btn-danger"
                                    onClick={handleTolak}
                                >
                                    <FaTimes className="me-2" /> Tolak
                                </button>
                            </>
                        )}
                        
                        {peminjaman.status === 'Disetujui' && (
                            <button 
                                className="btn btn-primary"
                                onClick={handleSelesai}
                            >
                                <FaCheckCircle className="me-2" /> Tandai Selesai
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPeminjamanPage;