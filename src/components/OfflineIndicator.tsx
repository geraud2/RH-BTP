import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="fixed top-14 left-0 right-0 z-30 bg-red-500 text-white text-center py-1 text-xs font-medium flex items-center justify-center gap-1.5">
      <WifiOff size={14} />
      Mode hors ligne - Données locales uniquement
    </div>
  );
}
