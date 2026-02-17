export interface Peminjaman {
    idPeminjaman: number;
    idRuangan: number;
    namaRuangan: string;
    namaUser: string;
    idUser: string;
    keterangan: string;
    startTime: string;
    endTime: string;
    status: 'Diproses' | 'Disetujui' | 'Ditolak' | 'Selesai';
    createdAt: string;
}

export interface BuatPeminjamanDto {
    idRuangan: number;
    namaUser: string;
    idUser: string;
    keterangan: string;
    startTime: string;
    endTime: string;
}