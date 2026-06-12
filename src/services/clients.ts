// resources/js/services/clients.ts
import type { Client } from '../types';
import api from './api';

export const clientService = {
    getAll: (page = 1) => 
        api.get(`/clients?page=${page}`),
    
    getById: (id: number) => 
        api.get(`/clients/${id}`),
    
    create: (data: Partial<Client>) => 
        api.post('/clients', data),
    
    update: (id: number, data: Partial<Client>) => 
        api.put(`/clients/${id}`, data),
    
    delete: (id: number) => 
        api.delete(`/clients/${id}`),
};