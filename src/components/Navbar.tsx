// resources/js/components/Navbar.tsx
import { Bell, User, Package, Database, Users, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', name: 'Produits', icon: Package },
  { id: 'stocks', name: 'Stocks', icon: Database },
  { id: 'clients', name: 'Clients', icon: Users },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
      {/* Barre du haut */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Biloki Admin
            </h2>
            <p className="text-xs text-slate-500">Gestion Produits & Stocks</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center">
                <User size={16} className="text-slate-300" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-slate-300">Administrateur</p>
                <p className="text-xs text-slate-500">admin@biloki.fr</p>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-medium text-slate-200">Admin Biloki</p>
                    <p className="text-xs text-slate-400">admin@biloki.fr</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 transition-colors">
                    <LogOut size={14} />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6">
        <nav className="flex gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  px-4 py-2.5 text-sm font-medium transition-all duration-200 relative
                  flex items-center gap-2 rounded-t-lg
                  ${isActive 
                    ? 'text-indigo-400 bg-slate-800/50' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                  }
                `}
              >
                <Icon size={16} />
                {item.name}
                
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

// Import manquant pour LogOut
import { LogOut } from 'lucide-react';