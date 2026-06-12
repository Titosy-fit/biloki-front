// resources/js/pages/ProductsList.tsx
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package, X, TrendingUp } from 'lucide-react';
import { productService } from '../services/products';
import { TableSkeleton } from '../components/Skeleton';
import ConfirmModal from '../components/ConfirmModal';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    sku: string;
    status: 'active' | 'inactive';
    stock?: {
        quantity: number;
        reserved_quantity: number;
        alert_threshold: number;
    };
}

export default function ProductsList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [formLoading, setFormLoading] = useState(false);
    const [stockLoading, setStockLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', price: 0, sku: '', status: 'active' as 'active' | 'inactive',
    });
    const [stockData, setStockData] = useState({
        quantity: 0, type: 'add' as 'set' | 'add' | 'subtract', reason: '',
    });

    useEffect(() => {
        fetchProducts();
    }, [pagination.current_page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll(pagination.current_page);
            const data = response.data;
            setProducts(data.data || []);
            setPagination({
                current_page: data.current_page || 1,
                last_page: data.last_page || 1,
                total: data.total || 0,
            });
        } catch (err: any) {
            setError(err.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
        setDeleting(true);
        try {
            await productService.delete(productToDelete);
            await fetchProducts();
            setShowConfirmModal(false);
            setProductToDelete(null);
        } catch (err) {
            alert('Erreur lors de la suppression');
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            sku: product.sku,
            status: product.status,
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: 0, sku: '', status: 'active' });
        setShowModal(true);
    };

    const handleStock = (product: Product) => {
        setSelectedProduct(product);
        setStockData({ quantity: 0, type: 'add', reason: '' });
        setShowStockModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, formData);
            } else {
                await productService.create(formData);
            }
            setShowModal(false);
            await fetchProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur');
        } finally {
            setFormLoading(false);
        }
    };

    const handleStockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        setStockLoading(true);
        try {
            await productService.updateStock(selectedProduct.id, stockData.quantity, stockData.type, stockData.reason);
            setShowStockModal(false);
            await fetchProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur');
        } finally {
            setStockLoading(false);
        }
    };

    const getStockStatus = (product: Product) => {
        const quantity = product.stock?.quantity || 0;
        const threshold = product.stock?.alert_threshold || 5;
        if (quantity === 0) return { color: 'text-red-500', text: 'Rupture', bg: 'bg-red-500/10' };
        if (quantity <= threshold) return { color: 'text-orange-500', text: 'Stock bas', bg: 'bg-orange-500/10' };
        return { color: 'text-green-500', text: 'En stock', bg: 'bg-green-500/10' };
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <TableSkeleton />;
    if (error) return <div className="text-center text-red-400 p-8">Erreur : {error}<button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg ml-4">Réessayer</button></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Gestion des Produits</h1>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    <Plus size={20} /> Nouveau produit
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="text-left p-4 text-slate-400">Produit</th>
                            <th className="text-left p-4 text-slate-400">SKU</th>
                            <th className="text-right p-4 text-slate-400">Prix</th>
                            <th className="text-right p-4 text-slate-400">Stock</th>
                            <th className="text-center p-4 text-slate-400">Statut</th>
                            <th className="text-right p-4 text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product);
                            return (
                                <tr key={product.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center"><Package size={16} className="text-indigo-400" /></div>
                                            <div><p className="text-white font-medium">{product.name}</p></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300">{product.sku}</td>
                                    <td className="p-4 text-right text-white">{product.price.toLocaleString()} €</td>
                                    <td className="p-4 text-right"><span className={`font-medium ${stockStatus.color}`}>{product.stock?.quantity || 0} unités</span></td>
                                    <td className="p-4 text-center"><span className={`px-2 py-1 rounded-full text-xs ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{product.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleStock(product)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><TrendingUp size={18} /></button>
                                            <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Pencil size={18} /></button>
                                            <button onClick={() => handleDeleteClick(product.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="text-center py-12 text-slate-400">Aucun produit trouvé</div>}
                {products.length > 0 && (
                    <div className="p-4 border-t border-slate-700 flex justify-between items-center">
                        <p className="text-slate-400 text-sm">Total : {pagination.total} produits</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPagination(p => ({ ...p, current_page: p.current_page - 1 }))} disabled={pagination.current_page === 1} className="px-3 py-1 bg-slate-700 rounded-lg disabled:opacity-50">Précédent</button>
                            <span className="px-3 py-1 text-slate-300">Page {pagination.current_page} / {pagination.last_page}</span>
                            <button onClick={() => setPagination(p => ({ ...p, current_page: p.current_page + 1 }))} disabled={pagination.current_page === pagination.last_page} className="px-3 py-1 bg-slate-700 rounded-lg disabled:opacity-50">Suivant</button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal isOpen={showConfirmModal} title="Confirmer la suppression" message="Supprimer ce produit ? Action irréversible." onConfirm={handleDeleteConfirm} onCancel={() => { setShowConfirmModal(false); setProductToDelete(null); }} loading={deleting} />

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl w-full max-w-md p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">{editingProduct ? 'Modifier' : 'Nouveau produit'}</h2><button onClick={() => setShowModal(false)}><X size={24} /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Nom" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="0.01" placeholder="Prix" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                <input type="text" placeholder="SKU" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            </div>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                                <option value="active">Actif</option><option value="inactive">Inactif</option>
                            </select>
                            <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-700 rounded-lg">Annuler</button><button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-50">{formLoading ? 'Enregistrement...' : (editingProduct ? 'Modifier' : 'Créer')}</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showStockModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl w-full max-w-md p-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Gérer le stock : {selectedProduct.name}</h2>
                        <div className="mb-4 p-3 bg-slate-700/30 rounded-lg"><p className="text-slate-300">Stock actuel : <span className="font-bold text-white">{selectedProduct.stock?.quantity || 0} unités</span></p></div>
                        <form onSubmit={handleStockSubmit} className="space-y-4">
                            <select value={stockData.type} onChange={(e) => setStockData({ ...stockData, type: e.target.value as any })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                                <option value="set">Définir quantité exacte</option><option value="add">Ajouter</option><option value="subtract">Retirer</option>
                            </select>
                            <input type="number" placeholder="Quantité" required value={stockData.quantity} onChange={(e) => setStockData({ ...stockData, quantity: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <input type="text" placeholder="Motif (optionnel)" value={stockData.reason} onChange={(e) => setStockData({ ...stockData, reason: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <div className="flex gap-3"><button type="button" onClick={() => setShowStockModal(false)} className="flex-1 px-4 py-2 bg-slate-700 rounded-lg">Annuler</button><button type="submit" disabled={stockLoading} className="flex-1 px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-50">{stockLoading ? 'Traitement...' : 'Valider'}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}