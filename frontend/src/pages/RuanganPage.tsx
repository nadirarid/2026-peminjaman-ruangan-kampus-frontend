import React, { useEffect, useState } from 'react';
import { ruanganService } from '../services/ruanganService';
import type { Ruangan } from '../types/ruangan';
import Status from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const RuanganPage: React.FC = () => {
    const [ruangan, setRuangan] = useState<Ruangan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadRuangan();
    }, [page, searchQuery]);

    const loadRuangan = async () => {
        setLoading(true);
        try {
            const result = await ruanganService.getAll(page, searchQuery);
            setRuangan(result.data);
            setTotalPages(Math.max(1, result.totalPages || 1));
        } catch (error) {
            console.error('Gagal load ruangan:', error);
            setRuangan([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchInput.trim()) {
            setPage(1);
            setSearchQuery(searchInput);
        }
    };

    const handleReset = () => {
        setSearchInput('');
        setSearchQuery('');
        setPage(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            handleSearch();
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

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Daftar Ruangan</h2>
                <Link to="/ruangan/tambah" className="btn btn-primary">
                    <FaPlus className="me-2" /> Tambah Ruangan
                </Link>
            </div>

            {/* Search Section */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Cari ruangan..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        
                        {!searchQuery && (
                            <button 
                                className="btn btn-primary" 
                                type="button"
                                onClick={handleSearch}
                                disabled={!searchInput.trim()}
                            >
                                <FaSearch className="me-2" /> Cari
                            </button>
                        )}

                        {searchQuery && (
                            <button 
                                className="btn btn-outline-secondary" 
                                type="button"
                                onClick={handleReset}
                            > Reset
                            </button>
                        )}
                    </div>

                    {searchQuery && (
                        <div className="mt-2 text-muted">
                            Menampilkan hasil untuk: "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
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
                        {ruangan.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-5">
                                    <h5 className="text-muted">Tidak ada data ruangan</h5>
                                    {searchQuery && (
                                        <p className="text-muted">
                                            Pencarian "{searchQuery}" tidak ditemukan
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            ruangan.map((r) => (
                                <tr key={r.id}>
                                    <td><strong>{r.idRuangan}</strong></td>
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-4">
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

export default RuanganPage;