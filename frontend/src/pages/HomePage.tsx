import React from 'react';
import { Link } from 'react-router-dom';
import { FaDoorOpen, FaCalendarPlus, FaList } from 'react-icons/fa';

const HomePage: React.FC = () => {
    return (
        <div className="container mt-5">
            <div className="jumbotron bg-light p-5 rounded">
                <h1 className="display-4">Sistem Peminjaman Ruangan</h1>
                <p className="lead">Kelola peminjaman ruangan dengan mudah dan efisien</p>
                <hr className="my-4" />
                <p>Pilih menu di bawah untuk memulai:</p>
                
                <div className="row mt-4">
                    <div className="col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <FaDoorOpen size={48} className="text-primary mb-3" />
                                <h5 className="card-title">Lihat Ruangan</h5>
                                <p className="card-text">Cek ketersediaan dan detail ruangan</p>
                                <Link to="/ruangan" className="btn btn-primary">Lihat Ruangan</Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <FaCalendarPlus size={48} className="text-success mb-3" />
                                <h5 className="card-title">Pinjam Ruangan</h5>
                                <p className="card-text">Ajukan peminjaman ruangan baru</p>
                                <Link to="/peminjaman-baru" className="btn btn-success">Ajukan Peminjaman</Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <FaList size={48} className="text-info mb-3" />
                                <h5 className="card-title">Daftar Peminjaman</h5>
                                <p className="card-text">Lihat status peminjaman Anda</p>
                                <Link to="/peminjaman" className="btn btn-info text-white">Lihat Peminjaman</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;