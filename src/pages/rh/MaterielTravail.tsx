import { useState } from 'react';
import { 
  Plus, RotateCcw, AlertTriangle, Package, 
  Search, Filter, X, Monitor, Smartphone, 
  User, Building2, Calendar, CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, typesMateriel, departements } from '../../data/mockDataRH';
import type { Materiel } from '../../data/mockDataRH';
import { toast } from 'sonner';

const etatVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  'Bon': 'success', 'À remplacer': 'warning', 'Manquant/Perdu': 'danger', 'En réparation': 'neutral',
};

const etatIcon: Record<string, typeof CheckCircle2> = {
  'Bon': CheckCircle2, 'À remplacer': AlertTriangle, 'Manquant/Perdu': ShieldAlert, 'En réparation': RotateCcw,
};

const typeConfig: Record<string, { icon: typeof Monitor; color: string; bg: string; label: string }> = {
  'Informatique': { icon: Monitor, color: 'text-sky-600', bg: 'bg-sky-50', label: 'Informatique' },
  'Mobilier': { icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Mobilier' },
  'Téléphonie': { icon: Smartphone, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Téléphonie' },
};

export default function MaterielTravail() {
  const [materiels, setMateriels] = useLocalStorage<Materiel[]>('rh-materiels', mockData.materiels);
  const [filtreType, setFiltreType] = useState('');
  const [filtreEtat, setFiltreEtat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newMat, setNewMat] = useState({ 
    type: typesMateriel[0], designation: '', employeeName: '', departement: departements[0] 
  });

  const handleAdd = () => {
    if (!newMat.designation) {
      toast.error('Veuillez renseigner la désignation');
      return;
    }
    const mat: Materiel = {
      id: `mat-${Date.now()}`,
      type: newMat.type,
      designation: newMat.designation,
      employeeId: '',
      employeeName: newMat.employeeName,
      dateAttribution: new Date().toISOString().split('T')[0],
      departement: newMat.departement,
      etat: 'Bon',
    };
    setMateriels([mat, ...materiels]);
    setShowAdd(false);
    setNewMat({ type: typesMateriel[0], designation: '', employeeName: '', departement: departements[0] });
    toast.success('Matériel attribué avec succès');
  };

  const signalerUsure = (id: string) => {
    setMateriels(materiels.map(m => m.id === id ? { ...m, etat: 'À remplacer' as const } : m));
    toast.warning('Usure signalée');
  };

  const recuperer = (id: string) => {
    setMateriels(materiels.map(m => m.id === id ? { ...m, employeeName: '', employeeId: '', etat: 'Bon' as const } : m));
    toast.success('Matériel récupéré');
  };

  const filtered = materiels.filter(m => {
    if (filtreType && m.type !== filtreType) return false;
    if (filtreEtat && m.etat !== filtreEtat) return false;
    if (searchTerm && !m.designation.toLowerCase().includes(searchTerm.toLowerCase()) && !m.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: materiels.length,
    bon: materiels.filter(m => m.etat === 'Bon').length,
    remplacer: materiels.filter(m => m.etat === 'À remplacer').length,
    perdu: materiels.filter(m => m.etat === 'Manquant/Perdu').length,
    reparation: materiels.filter(m => m.etat === 'En réparation').length,
    attribues: materiels.filter(m => m.employeeName !== '').length,
  };

  const hasActiveFilters = filtreType || filtreEtat;

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Matériel de travail</h1><p className="text-gray-500 text-xs sm:text-sm mt-0.5">Attribution et suivi du matériel</p></div>
        <div className="flex items-center gap-2"><Package size={18} className="text-amber-600" /><span className="text-sm font-semibold text-gray-700">{stats.total} équipements</span></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-2"><Package size={18} className="text-amber-600" /></div><p className="text-lg sm:text-xl font-extrabold text-gray-900">{stats.total}</p><p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total</p></div>
        <div className="bg-white border border-emerald-200 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-2"><CheckCircle2 size={18} className="text-emerald-600" /></div><p className="text-lg sm:text-xl font-extrabold text-emerald-600">{stats.bon}</p><p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Bon état</p></div>
        <div className="bg-white border border-amber-200 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-2"><AlertTriangle size={18} className="text-amber-600" /></div><p className="text-lg sm:text-xl font-extrabold text-amber-600">{stats.remplacer}</p><p className="text-[10px] sm:text-xs text-amber-600 font-medium">À remplacer</p></div>
        <div className="bg-white border border-red-200 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-2"><ShieldAlert size={18} className="text-red-600" /></div><p className="text-lg sm:text-xl font-extrabold text-red-600">{stats.perdu + stats.reparation}</p><p className="text-[10px] sm:text-xs text-red-600 font-medium">Perdu/Réparation</p></div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher un matériel ou employé..." className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition" />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"><X size={14} className="text-gray-400" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${hasActiveFilters || showFilters ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}><Filter size={18} /></button>
        <Button size="sm" onClick={() => setShowAdd(true)} className="flex-shrink-0"><Plus size={16} /> <span className="hidden sm:inline ml-1">Attribuer</span></Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-white border border-gray-100 rounded-2xl">
          <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[140px]">
            <option value="">Tous types</option>
            {typesMateriel.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filtreEtat} onChange={(e) => setFiltreEtat(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[140px]">
            <option value="">Tous états</option>
            <option value="Bon">✅ Bon</option><option value="À remplacer">⚠️ À remplacer</option><option value="Manquant/Perdu">❌ Manquant/Perdu</option><option value="En réparation">🔄 En réparation</option>
          </select>
          {hasActiveFilters && <button onClick={() => { setFiltreType(''); setFiltreEtat(''); }} className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">Réinitialiser</button>}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <User size={14} /><span>{stats.attribues} matériels attribués sur {stats.total}</span>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.total > 0 ? (stats.attribues / stats.total) * 100 : 0}%` }} /></div>
        <span className="font-semibold">{stats.total > 0 ? Math.round((stats.attribues / stats.total) * 100) : 0}%</span>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12"><Package size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-sm text-gray-500 font-medium">Aucun matériel trouvé</p></div>
        ) : filtered.map((m) => {
          const cfg = typeConfig[m.type] || { icon: Package, color: 'text-gray-600', bg: 'bg-gray-50' };
          const TypeIcon = cfg.icon; const StatutIcon = etatIcon[m.etat];
          return (
            <div key={m.id} className={`bg-white border rounded-2xl p-3 sm:p-4 transition-all hover:shadow-sm ${m.etat === 'Bon' ? 'border-gray-100' : m.etat === 'À remplacer' ? 'border-amber-200 bg-amber-50/20' : m.etat === 'Manquant/Perdu' ? 'border-red-200 bg-red-50/20' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}><TypeIcon size={20} className={cfg.color} /></div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5"><p className="text-sm font-bold text-gray-900 truncate">{m.designation}</p><Badge variant={etatVariant[m.etat]}><StatutIcon size={10} className="mr-1 inline" />{m.etat}</Badge></div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap"><span className="flex items-center gap-1"><TypeIcon size={11} /> {m.type}</span><span className="text-gray-300">•</span><span className="flex items-center gap-1"><Building2 size={11} /> {m.departement}</span></div>
                    {m.employeeName ? <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500"><span className="flex items-center gap-1"><User size={11} /> {m.employeeName}</span><span className="text-gray-300">•</span><span className="flex items-center gap-1"><Calendar size={11} /> {m.dateAttribution}</span></div> : <p className="text-xs text-gray-400 mt-1.5 italic">Non attribué</p>}
                  </div>
                </div>
                {m.etat === 'Bon' && m.employeeName && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => signalerUsure(m.id)} className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100" title="Signaler usure"><AlertTriangle size={14} className="text-amber-600" /></button>
                    <button onClick={() => recuperer(m.id)} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100" title="Récupérer"><RotateCcw size={14} className="text-blue-600" /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Attribuer du matériel" size="md">
        <div className="space-y-4">
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type de matériel</label><select value={newMat.type} onChange={(e) => setNewMat({ ...newMat, type: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">{typesMateriel.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <Input label="Désignation *" value={newMat.designation} onChange={(e) => setNewMat({ ...newMat, designation: e.target.value })} placeholder="Ex: MacBook Pro 14 pouces" />
          <Input label="Attribué à" value={newMat.employeeName} onChange={(e) => setNewMat({ ...newMat, employeeName: e.target.value })} placeholder="Nom de l'employé" />
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Département</label><select value={newMat.departement} onChange={(e) => setNewMat({ ...newMat, departement: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">{departements.map(d => <option key={d} value={d}>🏢 {d}</option>)}</select></div>
          <Button onClick={handleAdd} className="w-full" disabled={!newMat.designation}><Plus size={16} /> Attribuer le matériel</Button>
        </div>
      </Modal>
    </div>
  );
}