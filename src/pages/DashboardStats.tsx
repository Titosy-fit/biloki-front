// src/pages/DashboardStats.tsx
import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { productService } from '../services/products';
import { clientService } from '../services/clients';
import type { Product } from '../types';

export default function DashboardStats() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStockValue: 0,
        totalClients: 0,
        lowStockProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsRes, clientsRes] = await Promise.all([
                productService.getAll(),
                clientService.getAll(),
            ]);

            const products = productsRes.data.data || [];
            
            const totalStockValue = products.reduce((sum: number, product: Product) => {
                const stockQty = product.stock?.quantity || 0;
                return sum + (stockQty * product.price);
            }, 0);

            const lowStockCount = products.filter((product: Product) => {
                const qty = product.stock?.quantity || 0;
                const threshold = product.stock?.alert_threshold || 5;
                return qty <= threshold;
            }).length;

            setStats({
                totalProducts: productsRes.data.total || 0,
                totalStockValue,
                totalClients: clientsRes.data.total || 0,
                lowStockProducts: lowStockCount,
            });
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'Total Produits',
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-blue-500/10 text-blue-500',
        },
        {
            title: 'Valeur du Stock',
            value: `${stats.totalStockValue.toLocaleString()} €`,
            icon: TrendingUp,
            color: 'bg-green-500/10 text-green-500',
        },
        {
            title: 'Clients',
            value: stats.totalClients,
            icon: Users,
            color: 'bg-purple-500/10 text-purple-500',
        },
        {
            title: 'Stock Bas',
            value: stats.lowStockProducts,
            icon: AlertTriangle,
            color: 'bg-orange-500/10 text-orange-500',
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">{card.title}</p>
                                <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}