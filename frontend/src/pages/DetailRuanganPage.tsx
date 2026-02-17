import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ruanganService } from '../services/ruanganService';
import type { Ruangan } from '../types/ruangan';
import Status from '../components/StatusBadge';
import { FaArrowLeft, FaEdit, FaTrash, FaDoorOpen, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const DetailRuanganPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ruangan, setRuangan] = useState<Ruangan | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        namaRuangan: '',
        kapasitas: 0,
        status: ''
    });

    useEffect(() => {
        console.log('ID dari URL:', id);
        if (id) {
            const idNumber = Number(id);
            if (isNaN(idNumber) || idNumber <= 0) {
                console.error('ID tidak valid:', id);
                navigate('/ruangan');
                return;
            }
            loadRuangan(idNumber);
        } else {
            alert('ID ruangan tidak ditemukan');
            navigate('/ruangan');
        }
    }, [id, navigate]);

    const loadRuangan = async (idNumber: number) => {
        setLoading(true);
        try {
            console.log('Memuat ruangan dengan ID:', idNumber);
            const data = await ruanganService.getById(idNumber);
            console.log('Data ruangan:', data);
            setRuangan(data);
            setEditForm({
                namaRuangan: data.namaRuangan,
                kapasitas: data.kapasitas,
                status: data.status
            });
        } catch (error: any) {
            console.error('Error detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Yakin ingin menghapus ruangan ini?')) {
            try {
                await ruanganService.delete(Number(id));
                alert('Ruangan berhasil dihapus');
                navigate('/ruangan');
            } catch (error) {
                alert('Ruangan gagal dihapus');
            }
        }
    };

    const handleUpdate = async () => {
        if (!ruangan) return;
        
        try {
            await ruanganService.update(ruangan.id, {
                idRuangan: ruangan.idRuangan,
                namaRuangan: editForm.namaRuangan,
                kapasitas: editForm.kapasitas,
                status: editForm.status
            });
            alert('Ruangan berhasil diupdate');
            setShowEditModal(false);
            loadRuangan(ruangan.id);
        } catch (error) {
            alert('Gagal mengupdate ruangan');
        }
    };

    const formatTanggal = (tanggal: string) => {
        return new Date(tanggal).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (!ruangan) {
        return (
            <div className="container mt-4 text-center">
                <h3>Ruangan tidak ditemukan</h3>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/ruangan')}
                >
                    Kembali ke Daftar Ruangan
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/ruangan')}
                >
                    <FaArrowLeft className="me-2" /> Kembali ke Daftar Ruangan
                </button>
            </div>

            <div className="card detail-card">
                <div className="detail-header" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '2rem' }}>
                    <FaDoorOpen style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                    <h2>{ruangan.namaRuangan}</h2>
                    <p className="mb-0">Kode: {ruangan.idRuangan}</p>
                </div>
                
                <div className="detail-content" style={{ padding: '2rem' }}>
                    <div className="info-row" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                        <span className="info-label" style={{ fontWeight: 600, minWidth: '150px' }}>Status</span>
                        <span className="info-value">
                            <Status status={ruangan.status} />
                        </span>
                    </div>
                    
                    <div className="info-row" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                        <span className="info-label" style={{ fontWeight: 600, minWidth: '150px' }}>Kapasitas</span>
                        <span className="info-value">
                            <FaUsers className="me-2 text-primary" />
                            {ruangan.kapasitas} orang
                        </span>
                    </div>
                    
                    <div className="info-row" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                        <span className="info-label" style={{ fontWeight: 600, minWidth: '150px' }}>Dibuat Pada</span>
                        <span className="info-value">
                            <FaCalendarAlt className="me-2 text-success" />
                            {formatTanggal(ruangan.createdAt)}
                        </span>
                    </div>

                    <div className="mt-4 d-flex gap-2 justify-content-end">
                        <button 
                            className="btn btn-warning"
                            onClick={() => setShowEditModal(true)}
                        >
                            <FaEdit className="me-2" /> Edit Ruangan
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            <FaTrash className="me-2" /> Hapus Ruangan
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
                    <div className="modal-dialog" style={{ margin: '30px auto' }}>
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title">Edit Ruangan</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nama Ruangan</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editForm.namaRuangan}
                                        onChange={(e) => setEditForm({...editForm, namaRuangan: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Kapasitas</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={editForm.kapasitas}
                                        onChange={(e) => setEditForm({...editForm, kapasitas: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                    >
                                        <option value="Tersedia">Tersedia</option>
                                        <option value="Dipakai">Dipakai</option>
                                        <option value="Perbaikan">Perbaikan</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    className="btn btn-warning"
                                    onClick={handleUpdate}
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailRuanganPage;