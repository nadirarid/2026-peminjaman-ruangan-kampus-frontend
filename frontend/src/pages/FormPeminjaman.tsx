import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { peminjamanService } from '../services/peminjamanService';
import { ruanganService } from '../services/ruanganService';
import type { BuatPeminjamanDto } from '../types/peminjaman';
import type { Ruangan } from '../types/ruangan';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const BuatPeminjamanPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [ruangan, setRuangan] = useState<Ruangan[]>([]);
    const [formData, setFormData] = useState<BuatPeminjamanDto>({
        idRuangan: 0,
        namaUser: '',
        idUser: '',
        keterangan: '',
        startTime: '',
        endTime: '',
    });

    useEffect(() => {
        loadRuangan();
    }, []);

    const loadRuangan = async () => {
        try {
            const result = await ruanganService.getAll(1, '');
            // Filter hanya ruangan yang kosong
            const ruanganKosong = result.data.filter(r => r.status === 'Tersedia');
            setRuangan(ruanganKosong);
        } catch (error) {
            console.error('Gagal load ruangan:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idRuangan' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi waktu
        if (new Date(formData.startTime) >= new Date(formData.endTime)) {
            alert('Waktu selesai harus setelah waktu mulai!');
            return;
        }

        setLoading(true);
        try {
            await peminjamanService.create(formData);
            alert('Peminjaman berhasil diajukan!');
            navigate('/peminjaman');
        } catch (error: any) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Gagal mengajukan peminjaman');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-success text-white d-flex align-items-center">
                    <button 
                        className="btn btn-sm btn-light me-3"
                        onClick={() => navigate('/peminjaman')}
                    >
                        <FaArrowLeft /> Kembali
                    </button>
                    <h4 className="mb-0">Ajukan Peminjaman Ruangan</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Pilih Ruangan <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    name="idRuangan"
                                    value={formData.idRuangan}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Pilih Ruangan --</option>
                                    {ruangan.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.namaRuangan} (Kap. {r.kapasitas} orang)
                                        </option>
                                    ))}
                                </select>
                                {ruangan.length === 0 && (
                                    <small className="text-warning">
                                        Tidak ada ruangan kosong saat ini
                                    </small>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nama Peminjam <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="namaUser"
                                    value={formData.namaUser}
                                    onChange={handleChange}
                                    placeholder="Contoh: John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">ID/NIM Peminjam <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="idUser"
                                    value={formData.idUser}
                                    onChange={handleChange}
                                    placeholder="Contoh: 12345678"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Keterangan <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="keterangan"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                    placeholder="Contoh: Rapat, Kuliah, Seminar"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Waktu Mulai <span className="text-danger">*</span></label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Waktu Selesai <span className="text-danger">*</span></label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="alert alert-info">
                            <strong>Info:</strong> Peminjaman akan diproses oleh admin. 
                            Status awal adalah <span className="badge bg-info">Diproses</span>
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button 
                                type="button" 
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate('/peminjaman')}
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-success"
                                disabled={loading || ruangan.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="me-2" /> Ajukan Peminjaman
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

export default BuatPeminjamanPage;