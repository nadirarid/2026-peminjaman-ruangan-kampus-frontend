export interface Ruangan {
    id: number;
    idRuangan: string;
    namaRuangan: string;
    kapasitas: number;
    status: 'Tersedia' | 'Dipinjam' | 'Perbaikan';
    createdAt: string;
}

export interface BuatRuanganDto {
    idRuangan: string;
    namaRuangan: string;
    kapasitas: number;
}

export interface UpdateRuanganDto {
    idRuangan: string;
    namaRuangan: string;
    kapasitas: number;
    status: string;
}