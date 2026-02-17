import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaDoorOpen, FaCalendarAlt, FaHistory } from 'react-icons/fa';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <FaDoorOpen className="me-2" />
                    Peminjaman Ruangan
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/ruangan">
                                <FaDoorOpen className="me-1" /> Ruangan
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/peminjaman">
                                <FaCalendarAlt className="me-1" /> Peminjaman
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/riwayat">
                                <FaHistory className="me-1" /> Riwayat
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;