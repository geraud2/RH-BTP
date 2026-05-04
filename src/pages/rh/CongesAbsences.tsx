import { useState } from 'react';
import { Check, X, Plus, Calendar, Users, Clock, CheckCircle, XCircle, Filter, ChevronDown, Search } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, typesConge, chantiers } from '../../data/mockDataRH';
import type { Conge, SoldeConge } from '../../data/mockDataRH';
import { toast } from 'sonner';

const statutVariant: Record<string, 'success' | 'warning' | 'danger'> = { 
  'Approuvé': 'success', 'En attente': 'warning', 'Refusé': 'danger' 
};

const congeColors: Record<string, string> = {
  'Congé annuel': 'bg-emerald-400', 'Permission': 'bg-blue-400', 'Maladie': 'bg-red-400',
  'Accident de travail': 'bg-red-600', 'Maternité/Paternité': 'bg-pink-400', 'Fête religieuse': 'bg-amber-400',
};

const congeIcons: Record<string, string> = {
  'Congé annuel': '🏖️', 'Permission': '⏰', 'Maladie': '🤒',
  'Accident de travail': '🚑', 'Maternité/Paternité': '👶', 'Fête religieuse': '🕌',
};

export default function CongesAbsences() {
  const [conges, setConges] = useLocalStorage<Conge[]>('rh-conges', mockData.conges);
  const [soldes] = useLocalStorage<SoldeConge[]>('rh-soldes', mockData.soldes);
  const [tab, setTab] = useState<'demandes' | 'calendrier' | 'soldes'>('demandes');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRefuse, setShowRefuse] = useState<string | null>(null);
  const [motifRefus, setMotifRefus] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newConge, setNewConge] = useState({ 
    employeeName: '', employeeId: '', type: typesConge[0], 
    chantier: chantiers[0], dateDebut: '', dateFin: '' 
  });

  const approve = (id: string) => {
    setConges(conges.map(c => c.id === id ? { ...c, statut: 'Approuvé' as const } : c));
    toast.success('Congé approuvé avec succès');
  };

  const refuse = (id: string) => {
    setConges(conges.map(c => c.id === id ? { ...c, statut: 'Refusé' as const, motifRefus } : c));
    setShowRefuse(null);
    setMotifRefus('');
    toast.error('Congé refusé');
  };

  const handleAdd = () => {
    if (!newConge.employeeName || !newConge.dateDebut || !newConge.dateFin) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const conge: Conge = {
      id: `cong-${Date.now()}`,
      employeeId: newConge.employeeId || `emp-${Date.now()}`,
      employeeName: newConge.employeeName,
      chantier: newConge.chantier,
      type: newConge.type,
      dateDebut: newConge.dateDebut,
      dateFin: newConge.dateFin,
      statut: 'En attente',
    };
    setConges([conge, ...conges]);
    setShowAdd(false);
    setNewConge({ employeeName: '', employeeId: '', type: typesConge[0], chantier: chantiers[0], dateDebut: '', dateFin: '' });
    toast.success('Demande de congé créée');
  };

  const filtered = conges.filter(c => {
    const matchStatut = !filtreStatut || c.statut === filtreStatut;
    const matchType = !filtreType || c.type === filtreType;
    const matchSearch = !searchTerm || c.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatut && matchType && matchSearch;
  });

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonth = 'Mai 2026';

  const stats = {
    enAttente: conges.filter(c => c.statut === 'En attente').length,
    approuves: conges.filter(c => c.statut === 'Approuvé').length,
    refuses: conges.filter(c => c.statut === 'Refusé').length,
    total: conges.length,
  };

  const tabs = [
    { key: 'demandes' as const, label: 'Demandes', icon: Calendar, count: stats.enAttente },
    { key: 'calendrier' as const, label: 'Calendrier', icon: Calendar },
    { key: 'soldes' as const, label: 'Soldes', icon: Users },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      {/* En-tête */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Congés & Absences</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestion des congés du personnel chantier</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-gray-900">{stats.total}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.enAttente}</p>
          <p className="text-[10px] sm:text-xs text-amber-600 font-medium">En attente</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-2xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.approuves}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Approuvés</p>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-red-600">{stats.refuses}</p>
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">Refusés</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              tab === t.key 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={14} />
            {t.label}
            {t.count !== undefined && tab !== t.key && (
              <span className="w-5 h-5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Demandes */}
      {tab === 'demandes' && (
        <>
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un employé..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="">Tous statuts</option>
                <option value="En attente">En attente</option>
                <option value="Approuvé">Approuvé</option>
                <option value="Refusé">Refusé</option>
              </select>
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="">Tous types</option>
                {typesConge.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Demande
            </Button>
          </div>

          {/* Liste */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Aucune demande trouvée</p>
              </div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c.id}
                  className={`bg-white border rounded-2xl p-3 sm:p-4 transition-all hover:shadow-sm ${
                    c.statut === 'En attente' ? 'border-amber-200' :
                    c.statut === 'Approuvé' ? 'border-emerald-200' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                        c.statut === 'Approuvé' ? 'bg-emerald-50' :
                        c.statut === 'Refusé' ? 'bg-red-50' : 'bg-amber-50'
                      }`}>
                        {congeIcons[c.type] || '📅'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{c.employeeName}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-500">{c.type}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{c.chantier}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {c.dateDebut} → {c.dateFin}
                        </p>
                        {c.motifRefus && (
                          <p className="text-xs text-red-500 mt-1 bg-red-50 px-2 py-1 rounded-lg inline-block">
                            Motif : {c.motifRefus}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={statutVariant[c.statut]}>{c.statut}</Badge>
                      {c.statut === 'En attente' && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => approve(c.id)} 
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                            title="Approuver"
                          >
                            <Check size={15} className="text-emerald-600" />
                          </button>
                          <button 
                            onClick={() => setShowRefuse(c.id)} 
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                            title="Refuser"
                          >
                            <X size={15} className="text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Calendrier */}
      {tab === 'calendrier' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-amber-600" />
              {currentMonth}
            </h3>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronDown size={16} className="rotate-90" /></button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronDown size={16} className="-rotate-90" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <div key={i} className={`text-xs font-bold py-2 ${i >= 5 ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`empty-${i}`} className="py-2 text-xs text-gray-300">-</div>
            ))}
            {calendarDays.map((day) => {
              const dayStr = `2026-05-${String(day).padStart(2, '0')}`;
              const dayConges = conges.filter(c => c.statut === 'Approuvé' && c.dateDebut <= dayStr && c.dateFin >= dayStr);
              const isToday = day === new Date().getDate();
              return (
                <div key={day} className="py-1.5 relative hover:bg-amber-50/50 rounded-lg transition-colors cursor-pointer">
                  <span className={`text-xs font-medium ${isToday ? 'bg-amber-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {dayConges.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayConges.slice(0, 3).map((c, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${congeColors[c.type] || 'bg-gray-400'}`} title={c.employeeName} />
                      ))}
                      {dayConges.length > 3 && (
                        <span className="text-[9px] text-gray-400">+</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Légende</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(congeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  {congeIcons[type]} {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Soldes */}
      {tab === 'soldes' && (
        <div className="space-y-2">
          {soldes.slice(0, 15).map((s) => (
            <div key={s.employeeId} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
              <p className="font-bold text-sm text-gray-900 mb-3">{s.employeeName}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-blue-600">{s.acquis}</p>
                  <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">Acquis</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-amber-600">{s.pris}</p>
                  <p className="text-[10px] text-amber-500 font-medium uppercase tracking-wider">Pris</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-emerald-600">{s.restants}</p>
                  <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Restants</p>
                </div>
              </div>
              {/* Barre de progression */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                  style={{ width: `${Math.min((s.pris / s.acquis) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {Math.round((s.pris / s.acquis) * 100)}% utilisé
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Refus */}
      <Modal open={!!showRefuse} onClose={() => setShowRefuse(null)} title="Refuser la demande" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Veuillez indiquer le motif du refus :</p>
          <textarea
            value={motifRefus}
            onChange={(e) => setMotifRefus(e.target.value)}
            placeholder="Motif du refus..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none"
          />
          <Button variant="danger" className="w-full" onClick={() => showRefuse && refuse(showRefuse)} disabled={!motifRefus.trim()}>
            <XCircle size={16} /> Confirmer le refus
          </Button>
        </div>
      </Modal>

      {/* Modal Ajout */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle demande de congé" size="md">
        <div className="space-y-4">
          <Input 
            label="Nom de l'employé" 
            placeholder="Ex: Jean Traore"
            value={newConge.employeeName} 
            onChange={(e) => setNewConge({ ...newConge, employeeName: e.target.value })} 
          />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type de congé</label>
            <select
              value={newConge.type}
              onChange={(e) => setNewConge({ ...newConge, type: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {typesConge.map(t => (
                <option key={t} value={t}>{congeIcons[t]} {t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Chantier</label>
            <select
              value={newConge.chantier}
              onChange={(e) => setNewConge({ ...newConge, chantier: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {chantiers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Date début" 
              type="date" 
              value={newConge.dateDebut} 
              onChange={(e) => setNewConge({ ...newConge, dateDebut: e.target.value })} 
            />
            <Input 
              label="Date fin" 
              type="date" 
              value={newConge.dateFin} 
              onChange={(e) => setNewConge({ ...newConge, dateFin: e.target.value })} 
            />
          </div>
          <Button onClick={handleAdd} className="w-full" disabled={!newConge.employeeName || !newConge.dateDebut || !newConge.dateFin}>
            <Plus size={16} /> Soumettre la demande
          </Button>
        </div>
      </Modal>
    </div>
  );
}