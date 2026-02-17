import API from './api.ts';
import type { Ruangan, BuatRuanganDto } from '../types/ruangan.ts';
import type { UpdateRuanganDto } from '../types/ruangan.ts';

export const ruanganService = {
    // GET semua ruangan
    getAll: async (page: number = 1, search: string = '') => {
        const response = await API.get('/ruangan', {
            params: { page, pageSize: 10, search },
        });
        return {
            data: response.data as Ruangan[],
            totalCount: Number(response.headers['x-total-count']),
            totalPages: Number(response.headers['x-total-pages']),
        };
    },

    // GET ruangan by id
    getById: async (id: number) => {
        const response = await API.get(`/ruangan/${id}`);
        return response.data as Ruangan;
    },

    // GET ruangan by kode
    getByKode: async (kode: string) => {
        const response = await API.get(`/ruangan/kode/${kode}`);
        return response.data as Ruangan;
    },

    // POST buat ruangan
    create: async (data: BuatRuanganDto) => {
        const response = await API.post('/ruangan', data);
        return response.data as Ruangan;
    },

    // PUT update ruangan
    update: async (id: number, data: UpdateRuanganDto) => {
        await API.put(`/ruangan/${id}`, data);
    },

    // PATCH update status
    updateStatus: async (id: number, status: string) => {
        await API.patch(`/ruangan/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // DELETE soft delete
    delete: async (id: number) => {
        await API.delete(`/ruangan/${id}`);
    },
};