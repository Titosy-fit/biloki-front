// src/services/products.ts
import type { Product } from '../types';
import api from './api';


export const productService = {
    // Récupérer tous les produits
    getAll: (page = 1) => 
        api.get(`/products?page=${page}`),
    
    // Récupérer un produit
    getById: (id: number) => 
        api.get(`/products/${id}`),
    
    // Créer un produit
    create: (data: Partial<Product>) => 
        api.post('/products', data),
    
    // Modifier un produit
    update: (id: number, data: Partial<Product>) => 
        api.put(`/products/${id}`, data),
    
    // Supprimer un produit
    delete: (id: number) => 
        api.delete(`/products/${id}`),
    
    // Mettre à jour le stock
    updateStock: (productId: number, quantity: number, type: 'set' | 'add' | 'subtract', reason?: string) => 
        api.put(`/products/${productId}/stock`, { quantity, type, reason }),
    
    // Historique des mouvements
    getMovements: (productId: number, page = 1) => 
        api.get(`/products/${productId}/stock-movements?page=${page}`),
};