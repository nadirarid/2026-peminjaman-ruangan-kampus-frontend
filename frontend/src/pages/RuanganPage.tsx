import React, { useEffect, useState } from 'react';
import { ruanganService } from '../services/ruanganService';
import type { Ruangan } from '../types/ruangan';
import Status from '../components/Status';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const RuanganPage: React.FC = () => {
    const [ruangan, setRuangan] = useState<Ruangan[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadRuangan();
    }, [page, search]);

    const loadRuangan = async () => {
        setLoading(true);
        try {
            const result = await ruanganService.getAll(page, search);
            setRuangan(result.data);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Gagal load ruangan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Yakin ingin menghapus ruangan ini?')) {
            try {
                await ruanganService.delete(id);
                loadRuangan();
            } catch (error) {
                alert('Gagal menghapus ruangan');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Daftar Ruangan</h2>
                <Link to="/ruangan/tambah" className="btn btn-primary">
                    <FaPlus className="me-2" /> Tambah Ruangan
                </Link>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Cari ruangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th>Kode</th>
                            <th>Nama Ruangan</th>
                            <th>Kapasitas</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ruangan.map((r) => (
                            <tr key={r.id}>
                                <td>{r.idRuangan}</td>
                                <td>{r.namaRuangan}</td>
                                <td>{r.kapasitas} orang</td>
                                <td><Status status={r.status} /></td>
                                <td>
                                    <Link to={`/ruangan/${r.id}`} className="btn btn-sm btn-info me-2 text-white">
                                        <FaEdit /> Detail
                                    </Link>
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination">
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default RuanganPage;