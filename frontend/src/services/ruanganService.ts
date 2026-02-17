import API from './api';
import type { Ruangan, BuatRuanganDto, UpdateRuanganDto } from '../types/ruangan';

export const ruanganService = {
    getAll: async (page: number = 1, search: string = '') => {
        console.log('📡 Request ke:', `/ruangan?page=${page}&pageSize=10&search=${search}`);
        
        const response = await API.get('/ruangan', {
            params: { page, pageSize: 10, search },
        });
        
        console.log('📦 Response data:', response.data);
        
        const mappedData = response.data.map((item: any) => ({
            id: item.idPeminjaman,
            idRuangan: item.idRuangan,
            namaRuangan: item.namaRuangan,
            kapasitas: item.kapasitas,
            status: item.status,
            createdAt: item.createdAt
        }));
        
        console.log('✅ Data setelah mapping:', mappedData);
        
        return {
            data: mappedData as Ruangan[],
            totalCount: Number(response.headers['x-total-count'] || 0),
            totalPages: Number(response.headers['x-total-pages'] || 1),
        };
    },

    getById: async (id: number) => {
        if (!id || isNaN(id) || id <= 0) {
            throw new Error('ID tidak valid');
        }
        const response = await API.get(`/ruangan/${id}`);
        
        const item = response.data;
        return {
            id: item.idPeminjaman,
            idRuangan: item.idRuangan,
            namaRuangan: item.namaRuangan,
            kapasitas: item.kapasitas,
            status: item.status,
            createdAt: item.createdAt
        } as Ruangan;
    },

    create: async (data: BuatRuanganDto) => {
        const response = await API.post('/ruangan', data);
        
        const item = response.data;
        return {
            id: item.idPeminjaman,
            idRuangan: item.idRuangan,
            namaRuangan: item.namaRuangan,
            kapasitas: item.kapasitas,
            status: item.status,
            createdAt: item.createdAt
        } as Ruangan;
    },

    update: async (id: number, data: UpdateRuanganDto) => {
        if (!id || isNaN(id) || id <= 0) {
            throw new Error('ID tidak valid');
        }
        await API.put(`/ruangan/${id}`, data);
    },

    delete: async (id: number) => {
        if (!id || isNaN(id) || id <= 0) {
            throw new Error('ID tidak valid');
        }
        await API.delete(`/ruangan/${id}`);
    },
};