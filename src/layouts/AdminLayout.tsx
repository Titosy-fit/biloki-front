// resources/js/layouts/AdminLayout.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Déterminer l'onglet actif basé sur l'URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/products') return 'products';
    if (path === '/stocks') return 'stocks';
    if (path === '/clients') return 'clients';
    return 'dashboard';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        navigate('/');
        break;
      case 'products':
        navigate('/products');
        break;
      case 'stocks':
        navigate('/stocks');
        break;
      case 'clients':
        navigate('/clients');
        break;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Afficher la Navbar seulement sur desktop ou toujours */}
        <Navbar activeTab={getActiveTab()} onTabChange={handleTabChange} />
        <main className={`flex-1 overflow-y-auto p-6 bg-slate-950 ${isMobile ? 'mt-0' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}