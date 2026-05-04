import { HardHat, Bell } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const online = useOnlineStatus();
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <HardHat size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-[10px] text-gray-400 leading-tight">BTP RH Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400' : 'bg-red-400'}`} title={online ? 'En ligne' : 'Hors ligne'} />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
