// resources/js/pages/ClientsList.tsx
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Users, Mail, Phone, X } from 'lucide-react';
import { clientService } from '../services/clients';
import { TableSkeleton } from '../components/Skeleton';
import ConfirmModal from '../components/ConfirmModal';

interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string;
    status: 'active' | 'inactive';
    notes: string | null;
}

export default function ClientsList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', phone: '', address: '', city: '', postal_code: '', country: 'France', status: 'active' as 'active' | 'inactive', notes: '',
    });

    useEffect(() => {
        fetchClients();
    }, [pagination.current_page]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientService.getAll(pagination.current_page);
            const data = response.data;
            setClients(data.data || []);
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
        setClientToDelete(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!clientToDelete) return;
        setDeleting(true);
        try {
            await clientService.delete(clientToDelete);
            await fetchClients();
            setShowConfirmModal(false);
            setClientToDelete(null);
        } catch (err) {
            alert('Erreur lors de la suppression');
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setFormData({
            first_name: client.first_name, last_name: client.last_name, email: client.email, phone: client.phone || '', address: client.address || '', city: client.city || '', postal_code: client.postal_code || '', country: client.country, status: client.status, notes: client.notes || '',
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingClient(null);
        setFormData({ first_name: '', last_name: '', email: '', phone: '', address: '', city: '', postal_code: '', country: 'France', status: 'active', notes: '' });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingClient) {
                await clientService.update(editingClient.id, formData);
            } else {
                await clientService.create(formData);
            }
            setShowModal(false);
            await fetchClients();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredClients = clients.filter(c => c.first_name.toLowerCase().includes(search.toLowerCase()) || c.last_name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <TableSkeleton />;
    if (error) return <div className="text-center text-red-400 p-8">Erreur : {error}<button onClick={fetchClients} className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg ml-4">Réessayer</button></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Gestion des Clients</h1>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"><Plus size={20} /> Nouveau client</button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                    <div key={client.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"><Users size={20} className="text-white" /></div>
                                <div><h3 className="text-white font-semibold">{client.first_name} {client.last_name}</h3><span className={`text-xs ${client.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{client.status === 'active' ? 'Actif' : 'Inactif'}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(client)} className="p-2 hover:bg-slate-700 rounded-lg"><Pencil size={16} /></button>
                                <button onClick={() => handleDeleteClick(client.id)} className="p-2 hover:bg-red-400/10 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-400 text-sm"><Mail size={14} /> {client.email}</div>
                            {client.phone && <div className="flex items-center gap-2 text-slate-400 text-sm"><Phone size={14} /> {client.phone}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {filteredClients.length === 0 && <div className="text-center py-12 text-slate-400">Aucun client trouvé</div>}

            {clients.length > 0 && (
                <div className="mt-6 p-4 flex justify-between items-center">
                    <p className="text-slate-400 text-sm">Total : {pagination.total} clients</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPagination(p => ({ ...p, current_page: p.current_page - 1 }))} disabled={pagination.current_page === 1} className="px-3 py-1 bg-slate-700 rounded-lg disabled:opacity-50">Précédent</button>
                        <span className="px-3 py-1 text-slate-300">Page {pagination.current_page} / {pagination.last_page}</span>
                        <button onClick={() => setPagination(p => ({ ...p, current_page: p.current_page + 1 }))} disabled={pagination.current_page === pagination.last_page} className="px-3 py-1 bg-slate-700 rounded-lg disabled:opacity-50">Suivant</button>
                    </div>
                </div>
            )}

            <ConfirmModal isOpen={showConfirmModal} title="Confirmer la suppression" message="Supprimer ce client ? Action irréversible." onConfirm={handleDeleteConfirm} onCancel={() => { setShowConfirmModal(false); setClientToDelete(null); }} loading={deleting} />

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl w-full max-w-md p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">{editingClient ? 'Modifier' : 'Nouveau client'}</h2><button onClick={() => setShowModal(false)}><X size={24} /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Prénom" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                <input type="text" placeholder="Nom" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            </div>
                            <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <input type="tel" placeholder="Téléphone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <input type="text" placeholder="Adresse" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Code postal" value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                <input type="text" placeholder="Ville" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            </div>
                            <input type="text" placeholder="Pays" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                                <option value="active">Actif</option><option value="inactive">Inactif</option>
                            </select>
                            <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-700 rounded-lg">Annuler</button><button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-50">{formLoading ? 'Enregistrement...' : (editingClient ? 'Modifier' : 'Créer')}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}