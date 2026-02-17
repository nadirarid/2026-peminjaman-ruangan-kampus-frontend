import React from 'react';

interface Props {
    status: string;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
    const getVariant = () => {
        switch (status) {
            case 'Tersedia': return 'success';
            case 'Dipakai': return 'warning';
            case 'Perbaikan': return 'danger';
            case 'Diproses': return 'info';
            case 'Disetujui': return 'primary';
            case 'Ditolak': return 'danger';
            case 'Selesai': return 'secondary';
            case 'Dihapus': return 'dark';
            default: return 'light';
        }
    };

    return <span className={`badge bg-${getVariant()}`}>{status}</span>;
};

export default StatusBadge;