import React, { useEffect, useState } from 'react';
import { peminjamanService } from '../services/peminjamanService';
import { ruanganService } from '../services/ruanganService';
import type { Peminjaman } from '../types/peminjaman';
import type { Ruangan } from '../types/ruangan';
import Status from '../components/Status';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaCheckCircle, FaEye, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PeminjamanPage: React.FC = () => {
    const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
    const [ruangan, setRuangan] = useState<Ruangan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [selectedRuangan, setSelectedRuangan] = useState<number | ''>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        loadRuangan();
    }, []);

    useEffect(() => {
        loadPeminjaman();
    }, [page, filterStatus, selectedRuangan]);

    const loadRuangan = async () => {
        try {
            const result = await ruanganService.getAll(1, '');
            setRuangan(result.data);
        } catch (error) {
            console.error('Gagal load ruangan:', error);
        }
    };

    const loadPeminjaman = async () => {
        setLoading(true);
        try {
            const result = await peminjamanService.getAll(page, filterStatus || undefined);
            // Filter berdasarkan ruangan jika dipilih
            let filteredData = result.data;
            if (selectedRuangan) {
                filteredData = filteredData.filter(p => p.idRuangan === selectedRuangan);
            }
            setPeminjaman(filteredData);
            setTotalPages(Math.ceil(result.totalCount / 10));
        } catch (error) {
            console.error('Gagal load peminjaman:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetujui = async (id: number) => {
        if (window.confirm('Setujui peminjaman ini?')) {
            try {
                await peminjamanService.setujui(id);
                loadPeminjaman();
            } catch (error) {
                alert('Gagal menyetujui peminjaman');
            }
        }
    };

    const handleTolak = async (id: number) => {
        if (window.confirm('Tolak peminjaman ini?')) {
            try {
                await peminjamanService.tolak(id);
                loadPeminjaman();
            } catch (error) {
                alert('Gagal menolak peminjaman');
            }
        }
    };

    const handleSelesai = async (id: number) => {
        if (window.confirm('Tandai peminjaman ini selesai?')) {
            try {
                await peminjamanService.selesai(id);
                loadPeminjaman();
            } catch (error) {
                alert('Gagal menyelesaikan peminjaman');
            }
        }
    };

    const formatTanggal = (tanggal: string) => {
        return format(new Date(tanggal), 'dd MMM yyyy HH:mm', { locale: id });
    };

    const getNamaRuangan = (idRuangan: number) => {
        const ruang = ruangan.find(r => r.id === idRuangan);
        return ruang ? ruang.namaRuangan : 'Unknown';
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Daftar Peminjaman</h2>
                <Link to="/peminjaman-baru" className="btn btn-success">
                    + Ajukan Peminjaman
                </Link>
            </div>

            {/* Filter Section */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <span>Filter Peminjaman</span>
                    <button 
                        className="btn btn-sm btn-light"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <FaFilter /> {showFilter ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                </div>
                {showFilter && (
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Filter Status</label>
                                <select 
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Disetujui">Disetujui</option>
                                    <option value="Ditolak">Ditolak</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Filter Ruangan</label>
                                <select 
                                    className="form-select"
                                    value={selectedRuangan}
                                    onChange={(e) => setSelectedRuangan(e.target.value ? Number(e.target.value) : '')}
                                >
                                    <option value="">Semua Ruangan</option>
                                    {ruangan.map(r => (
                                        <option key={r.id} value={r.id}>{r.namaRuangan}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={loadPeminjaman}>
                            Terapkan Filter
                        </button>
                    </div>
                )}
            </div>

            {/* Tabel Peminjaman */}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th>No</th>
                            <th>Ruangan</th>
                            <th>Peminjam</th>
                            <th>ID User</th>
                            <th>Keterangan</th>
                            <th>Waktu Mulai</th>
                            <th>Waktu Selesai</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peminjaman.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-4">
                                    Tidak ada data peminjaman
                                </td>
                            </tr>
                        ) : (
                            peminjaman.map((p, index) => (
                                <tr key={p.idPeminjaman}>
                                    <td>{(page - 1) * 10 + index + 1}</td>
                                    <td>{getNamaRuangan(p.idRuangan)}</td>
                                    <td>{p.namaUser}</td>
                                    <td>{p.idUser}</td>
                                    <td>{p.keterangan}</td>
                                    <td>{formatTanggal(p.startTime)}</td>
                                    <td>{formatTanggal(p.endTime)}</td>
                                    <td><Status status={p.status} /></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Link 
                                                to={`/peminjaman/${p.idPeminjaman}`} 
                                                className="btn btn-sm btn-info text-white"
                                                title="Lihat Detail"
                                            >
                                                <FaEye />
                                            </Link>
                                            
                                            {p.status === 'Diproses' && (
                                                <>
                                                    <button 
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleSetujui(p.idPeminjaman)}
                                                        title="Setujui"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleTolak(p.idPeminjaman)}
                                                        title="Tolak"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            
                                            {p.status === 'Disetujui' && (
                                                <button 
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleSelesai(p.idPeminjaman)}
                                                    title="Selesai"
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default PeminjamanPage;