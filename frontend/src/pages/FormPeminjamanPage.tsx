import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { peminjamanService } from '../services/peminjamanService';
import { ruanganService } from '../services/ruanganService';
import type { BuatPeminjamanDto } from '../types/peminjaman';
import type { Ruangan } from '../types/ruangan';
import { FaSave, FaArrowLeft, FaCalendarDay, FaClock } from 'react-icons/fa';

const FormPeminjamanPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [ruangan, setRuangan] = useState<Ruangan[]>([]);
    
    const [selectedRuangan, setSelectedRuangan] = useState<number>(0);
    const [namaUser, setNamaUser] = useState('');
    const [idUser, setIdUser] = useState('');
    const [keterangan, setKeterangan] = useState('');
    
    const [tanggal, setTanggal] = useState('');
    const [jamMulai, setJamMulai] = useState('');
    const [jamSelesai, setJamSelesai] = useState('');

    useEffect(() => {
        loadRuangan();
    }, []);

    const loadRuangan = async () => {
        try {
            console.log('Loading ruangan...');
            const result = await ruanganService.getAll(1, '');
            console.log('Data dari API:', result);
            console.log('Data ruangan:', result.data);
            
            const ruanganTersedia = result.data.filter(r => r.status === 'Tersedia');
            console.log('Ruangan tersedia:', ruanganTersedia);
            
            setRuangan(ruanganTersedia);
            
            if (ruanganTersedia.length === 0) {
                console.warn('Tidak ada ruangan tersedia');
                console.log('Status semua ruangan:', result.data.map(r => ({ 
                    id: r.id, 
                    nama: r.namaRuangan, 
                    status: r.status 
                })));
            }
        } catch (error) {
            console.error('Gagal load ruangan:', error);
        }
    };

    const generateJamOptions = () => {
        const options = [];
        for (let i = 7; i <= 21; i++) {
            const jam = i.toString().padStart(2, '0') + ':00';
            options.push(jam);
        }
        return options;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedRuangan === 0) {
            alert('Pilih ruangan terlebih dahulu');
            return;
        }

        if (!tanggal || !jamMulai || !jamSelesai) {
            alert('Pilih tanggal dan jam dengan lengkap');
            return;
        }

        if (jamMulai >= jamSelesai) {
            alert('Jam selesai harus setelah jam mulai');
            return;
        }

        const startTime = `${tanggal}T${jamMulai}:00`;
        const endTime = `${tanggal}T${jamSelesai}:00`;

        if (new Date(startTime) < new Date()) {
            alert('Tidak bisa meminjam di waktu yang sudah lewat');
            return;
        }

        const formData: BuatPeminjamanDto = {
            idRuangan: selectedRuangan,
            namaUser: namaUser,
            idUser: idUser,
            keterangan: keterangan,
            startTime: startTime,
            endTime: endTime,
        };

        setLoading(true);
        try {
            await peminjamanService.create(formData);
            alert('Peminjaman berhasil diajukan');
            navigate('/peminjaman');
        } catch (error: any) {
            console.error('Error:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Gagal mengajukan peminjaman');
            }
        } finally {
            setLoading(false);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const selectedRoomDetail = ruangan.find(r => r.id === selectedRuangan);

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">Form Peminjaman Ruangan</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Pilih Ruangan <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-lg"
                                        value={selectedRuangan}
                                        onChange={(e) => setSelectedRuangan(Number(e.target.value))}
                                        required
                                    >
                                        <option value="0">-- Pilih Ruangan --</option>
                                        {ruangan.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.namaRuangan} - {r.idRuangan} (Kap. {r.kapasitas} orang)
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {selectedRoomDetail && (
                                        <div className="alert alert-info mt-2">
                                            <strong>Detail Ruangan:</strong> {selectedRoomDetail.namaRuangan} 
                                            ({selectedRoomDetail.idRuangan}) - Kapasitas {selectedRoomDetail.kapasitas} orang
                                        </div>
                                    )}
                                    
                                    {ruangan.length === 0 && (
                                        <div className="alert alert-warning mt-2">
                                            Tidak ada ruangan tersedia saat ini.
                                        </div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">
                                            Nama Peminjam <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={namaUser}
                                            onChange={(e) => setNamaUser(e.target.value)}
                                            required
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">
                                            ID/NIM Peminjam <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={idUser}
                                            onChange={(e) => setIdUser(e.target.value)}
                                            required
                                            maxLength={50}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Keterangan Peminjaman <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={keterangan}
                                        onChange={(e) => setKeterangan(e.target.value)}
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">
                                            <FaCalendarDay className="me-2" />
                                            Tanggal <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            min={getTodayDate()}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">
                                            <FaClock className="me-2" />
                                            Jam Mulai <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={jamMulai}
                                            onChange={(e) => setJamMulai(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih Jam --</option>
                                            {generateJamOptions().map(jam => (
                                                <option key={`mulai-${jam}`} value={jam}>
                                                    {jam} WIB
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">
                                            <FaClock className="me-2" />
                                            Jam Selesai <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={jamSelesai}
                                            onChange={(e) => setJamSelesai(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih Jam --</option>
                                            {generateJamOptions().map(jam => (
                                                <option key={`selesai-${jam}`} value={jam}>
                                                    {jam} WIB
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex gap-2 justify-content-end">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/peminjaman')}
                                    >
                                        <FaArrowLeft className="me-2" /> Batal
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
            </div>
        </div>
    );
};

export default FormPeminjamanPage;