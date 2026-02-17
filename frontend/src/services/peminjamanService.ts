import API from './api';
import type { Peminjaman, BuatPeminjamanDto } from '../types/peminjaman';

export const peminjamanService = {
    // GET semua peminjaman
    getAll: async (page: number = 1, status?: string) => {
        const response = await API.get('/peminjaman', {
            params: { page, pageSize: 10, status },
        });
        return {
            data: response.data as Peminjaman[],
            totalCount: Number(response.headers['x-total-count']),
        };
    },

    // GET peminjaman by id
    getById: async (id: number) => {
        const response = await API.get(`/peminjaman/${id}`);
        return response.data as Peminjaman;
    },

    // POST buat peminjaman
    create: async (data: BuatPeminjamanDto) => {
        const response = await API.post('/peminjaman', data);
        return response.data as Peminjaman;
    },

    // PATCH setujui
    setujui: async (id: number) => {
        await API.patch(`/peminjaman/${id}/setujui`);
    },

    // PATCH tolak
    tolak: async (id: number) => {
        await API.patch(`/peminjaman/${id}/tolak`);
    },

    // PATCH selesai
    selesai: async (id: number) => {
        await API.patch(`/peminjaman/${id}/selesai`);
    },
};