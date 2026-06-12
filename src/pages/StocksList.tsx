// resources/js/pages/StocksList.tsx
import { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle } from 'lucide-react';
import { productService } from '../services/products';
import { TableSkeleton } from '../components/Skeleton';

interface Product {
    id: number;
    name: string;
    sku: string;
    stock?: {
        quantity: number;
        reserved_quantity: number;
        alert_threshold: number;
    };
}

export default function StocksList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            setProducts(response.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStockStatus = (product: Product) => {
        const quantity = product.stock?.quantity || 0;
        const threshold = product.stock?.alert_threshold || 5;
        if (quantity === 0) return { color: 'text-red-500', bg: 'bg-red-500/10', text: 'Rupture' };
        if (quantity <= threshold) return { color: 'text-orange-500', bg: 'bg-orange-500/10', text: 'Stock bas' };
        return { color: 'text-green-500', bg: 'bg-green-500/10', text: 'Normal' };
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    const lowStockProducts = filteredProducts.filter(p => (p.stock?.quantity || 0) <= (p.stock?.alert_threshold || 5));

    if (loading) return <TableSkeleton />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Gestion des Stocks</h1>

            {lowStockProducts.length > 0 && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-orange-400 mb-2"><AlertTriangle size={20} /><h3 className="font-semibold">Alertes stock bas ({lowStockProducts.length})</h3></div>
                    <div className="flex flex-wrap gap-2">{lowStockProducts.map(p => (<span key={p.id} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm">{p.name}: {p.stock?.quantity || 0} unités</span>))}</div>
                </div>
            )}

            <div className="mb-6 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" /></div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800 border-b border-slate-700">
                        <tr><th className="text-left p-4 text-slate-400">Produit</th><th className="text-left p-4 text-slate-400">SKU</th><th className="text-right p-4 text-slate-400">Stock actuel</th><th className="text-right p-4 text-slate-400">Réservé</th><th className="text-right p-4 text-slate-400">Disponible</th><th className="text-right p-4 text-slate-400">Seuil alerte</th><th className="text-center p-4 text-slate-400">Statut</th></tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((p) => {
                            const qty = p.stock?.quantity || 0;
                            const reserved = p.stock?.reserved_quantity || 0;
                            const available = qty - reserved;
                            const status = getStockStatus(p);
                            return (<tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                                <td className="p-4"><div className="flex items-center gap-3"><Package size={16} className="text-indigo-400" /><span className="text-white">{p.name}</span></div></td>
                                <td className="p-4 text-slate-300">{p.sku}</td>
                                <td className="p-4 text-right text-white font-medium">{qty}</td>
                                <td className="p-4 text-right text-slate-300">{reserved}</td>
                                <td className="p-4 text-right"><span className={`font-medium ${available > 0 ? 'text-green-400' : 'text-red-400'}`}>{available}</span></td>
                                <td className="p-4 text-right text-slate-300">{p.stock?.alert_threshold || 5}</td>
                                <td className="p-4 text-center"><span className={`px-2 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>{status.text}</span></td>
                            </tr>);
                        })}
                    </tbody>
                 </table>
                {filteredProducts.length === 0 && <div className="text-center py-12 text-slate-400">Aucun produit trouvé</div>}
            </div>
        </div>
    );
}