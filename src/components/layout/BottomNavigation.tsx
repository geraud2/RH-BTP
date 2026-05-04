import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, DollarSign, Calendar, Plus, Target, Scale, GraduationCap, Package, BarChart3, X } from 'lucide-react';
import { useState } from 'react';

const mainTabs = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/dossiers', icon: Users, label: 'Dossiers' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/paie', icon: DollarSign, label: 'Paie' },
  { to: '/conges', icon: Calendar, label: 'Congés' },
];

const moreItems = [
  { to: '/recrutement', icon: Target, label: 'Recrutement' },
  { to: '/sanctions', icon: Scale, label: 'Sanctions' },
  { to: '/formations', icon: GraduationCap, label: 'Formations' },
  { to: '/materiel', icon: Package, label: 'Matériel' },
  { to: '/reporting', icon: BarChart3, label: 'Reporting' },
];

export function BottomNavigation() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Plus de modules</h3>
              <button onClick={() => setMoreOpen(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <item.icon size={20} className="text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {mainTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${isActive ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-amber-100' : ''}`}>
                    <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-amber-600' : ''}`}>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <div className="p-1 rounded-lg">
              <Plus size={20} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium">Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
}
