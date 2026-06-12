// resources/js/components/Sidebar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Database, Users, LogOut, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fermer le menu mobile lors de la navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path 
      ? "bg-indigo-600 text-white" 
      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200";
  };

  const navigation = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', name: 'Produits', icon: Package },
    { path: '/stocks', name: 'Stocks', icon: Database },
    { path: '/clients', name: 'Clients', icon: Users },
  ];

  // Contenu du menu (réutilisable)
  const MenuContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded"></div>
          <span className="text-xl font-black tracking-wider text-indigo-400">Biloki</span>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive(item.path)}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Déconnexion */}
      <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors font-medium mt-auto">
        <LogOut size={20} />
        <span>Déconnexion</span>
      </button>
    </>
  );

  // Sur desktop, afficher le sidebar normal
  if (!isMobile) {
    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
        <div className="flex flex-col h-full">
          <MenuContent />
        </div>
      </aside>
    );
  }

  // Sur mobile, afficher le bouton hamburger et le menu coulissant
  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu coulissant */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <MenuContent />
        </div>
      </aside>
    </>
  );
}