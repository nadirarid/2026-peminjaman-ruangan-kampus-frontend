import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ruanganService } from '../services/ruanganService';
import type { BuatRuanganDto } from '../types/ruangan';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const TambahRuanganPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BuatRuanganDto>({
        idRuangan: '',
        namaRuangan: '',
        kapasitas: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'kapasitas' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ruanganService.create(formData);
            alert('Ruangan berhasil ditambahkan');
            navigate('/ruangan');
        } catch (error) {
            alert('Gagal menambahkan ruangan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    <button 
                        className="btn btn-sm btn-light me-3"
                        onClick={() => navigate('/ruangan')}
                    >
                        <FaArrowLeft /> Kembali
                    </button>
                    <h4 className="mb-0">Tambah Ruangan Baru</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Kode Ruangan <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="idRuangan"
                                value={formData.idRuangan}
                                onChange={handleChange}
                                required
                                maxLength={50}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nama Ruangan <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="namaRuangan"
                                value={formData.namaRuangan}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kapasitas <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                name="kapasitas"
                                value={formData.kapasitas || ''}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button 
                                type="button" 
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate('/ruangan')}
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="me-2" /> Simpan Ruangan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TambahRuanganPage;