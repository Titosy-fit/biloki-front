// resources/js/pages/DashboardStats.tsx
import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { productService } from '../services/products';
import { clientService } from '../services/clients';
import { CardSkeleton } from '../components/Skeleton';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

interface Product {
    id: number;
    name: string;
    price: number;
    stock?: {
        quantity: number;
        alert_threshold: number;
    };
}

interface CategoryStat {
    name: string;
    count: number;
    totalValue: number;
}

export default function DashboardStats() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStockValue: 0,
        totalClients: 0,
        lowStockProducts: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [productsRes, clientsRes] = await Promise.all([
                productService.getAll(),
                clientService.getAll(),
            ]);

            const productsData = productsRes.data?.data || [];
            setProducts(productsData);
            
            const totalStockValue = productsData.reduce((sum: number, product: Product) => {
                const stockQty = product.stock?.quantity || 0;
                return sum + (stockQty * product.price);
            }, 0);

            const lowStockCount = productsData.filter((product: Product) => {
                const qty = product.stock?.quantity || 0;
                const threshold = product.stock?.alert_threshold || 5;
                return qty <= threshold;
            }).length;

            // Simulation de données par catégorie (à adapter selon votre structure)
            const simulatedCategories = [
                { name: 'Électronique', count: 45, totalValue: 12500 },
                { name: 'Vêtements', count: 32, totalValue: 8900 },
                { name: 'Alimentation', count: 28, totalValue: 5600 },
                { name: 'Maison', count: 24, totalValue: 7200 },
                { name: 'Sports', count: 18, totalValue: 4300 },
            ];
            setCategoryStats(simulatedCategories);

            setStats({
                totalProducts: productsRes.data?.total || productsData.length,
                totalStockValue,
                totalClients: clientsRes.data?.total || clientsRes.data?.length || 0,
                lowStockProducts: lowStockCount,
            });
        } catch (err: any) {
            console.error('Erreur:', err);
            setError(err.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    // Données pour le graphique des stocks par produit (top 10)
    const topProductsByStock = products
        .sort((a, b) => (b.stock?.quantity || 0) - (a.stock?.quantity || 0))
        .slice(0, 10);

    const stockChartData = {
        labels: topProductsByStock.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
        datasets: [
            {
                label: 'Quantité en stock',
                data: topProductsByStock.map(p => p.stock?.quantity || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    // Données pour le graphique des catégories
    const categoryChartData = {
        labels: categoryStats.map(c => c.name),
        datasets: [
            {
                label: 'Nombre de produits',
                data: categoryStats.map(c => c.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Données pour le graphique de valeur par catégorie
    const valueByCategoryData = {
        labels: categoryStats.map(c => c.name),
        datasets: [
            {
                label: 'Valeur du stock (€)',
                data: categoryStats.map(c => c.totalValue),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
            },
        ],
    };

    // Options des graphiques
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#fff',
                },
            },
            title: {
                display: true,
                text: 'Top 10 des produits par stock',
                color: '#fff',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: '#fff',
                    rotation: 45,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#fff',
                    font: {
                        size: 12,
                    },
                },
            },
            title: {
                display: true,
                text: 'Distribution par catégorie',
                color: '#fff',
                font: {
                    size: 16,
                },
            },
        },
    };

    const valueBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#fff',
                },
            },
            title: {
                display: true,
                text: 'Valeur du stock par catégorie',
                color: '#fff',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: '#fff',
                    callback: function(value: any) {
                        return value + ' €';
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    const cards = [
        { title: 'Total Produits', value: stats.totalProducts, icon: Package, color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20' },
        { title: 'Valeur du Stock', value: `${stats.totalStockValue.toLocaleString()} €`, icon: TrendingUp, color: 'bg-green-500/10 text-green-500', border: 'border-green-500/20' },
        { title: 'Clients', value: stats.totalClients, icon: Users, color: 'bg-purple-500/10 text-purple-500', border: 'border-purple-500/20' },
        { title: 'Stock Bas', value: stats.lowStockProducts, icon: AlertTriangle, color: 'bg-orange-500/10 text-orange-500', border: 'border-orange-500/20' },
    ];

    if (loading) return <CardSkeleton />;

    if (error) {
        return (
            <div className="text-center text-red-400 p-8">
                <p>Erreur : {error}</p>
                <button onClick={fetchStats} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
            
            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card) => (
                    <div key={card.title} className={`bg-slate-800/50 backdrop-blur-sm border ${card.border} rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                                <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Graphique à barres - Top produits */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <div className="h-[400px]">
                        <Bar data={stockChartData} options={barOptions} />
                    </div>
                </div>

                {/* Graphique circulaire - Catégories */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <div className="h-[400px]">
                        <Pie data={categoryChartData} options={pieOptions} />
                    </div>
                </div>
            </div>

            {/* Deuxième ligne de graphiques */}
            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <div className="h-[400px]">
                        <Bar data={valueByCategoryData} options={valueBarOptions} />
                    </div>
                </div>
            </div>

            {/* Message de bienvenue */}
            <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Bienvenue sur Biloki Admin</h3>
                <p className="text-slate-400 text-sm">
                    Gérez vos produits, stocks et clients depuis cette interface. Les graphiques vous permettent de visualiser rapidement l'état de votre inventaire.
                </p>
            </div>
        </div>
    );
}