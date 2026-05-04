import { useState } from 'react';
import { 
  Search, ChevronRight, Phone, Mail, MapPin, Heart, Baby, 
  Calendar, FileText, Shield, Monitor, DollarSign, Plus,
  Filter, X, Users, UserCheck, UserX, CalendarOff,
  Briefcase, Building2, Clock, GraduationCap
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, departements, postes } from '../../data/mockDataRH';
import type { Employee } from '../../data/mockDataRH';
import { toast } from 'sonner';

const statutVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  'Présent': 'success', 'Absent': 'danger', 'Congé': 'warning',
};

const statutIcon = { 'Présent': UserCheck, 'Absent': UserX, 'Congé': CalendarOff };

const getInitials = (firstName: string, lastName: string) => `${firstName[0]}${lastName[0]}`.toUpperCase();

const getAvatarColor = (name: string) => {
  const colors = ['bg-amber-100 text-amber-700','bg-sky-100 text-sky-700','bg-emerald-100 text-emerald-700','bg-violet-100 text-violet-700','bg-rose-100 text-rose-700','bg-teal-100 text-teal-700','bg-orange-100 text-orange-700','bg-indigo-100 text-indigo-700'];
  return colors[name.charCodeAt(0) % colors.length];
};

export default function DossiersPersonnel() {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('rh-employees', mockData.employees);
  const [search, setSearch] = useState('');
  const [filtreDept, setFiltreDept] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newEmp, setNewEmp] = useState({ firstName: '', lastName: '', poste: postes[0], departement: departements[0], telephone: '', email: '', typeContrat: 'CDI' });

  const filtered = employees.filter((e) => {
    if (search && !`${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filtreDept && e.departement !== filtreDept) return false;
    if (filtreStatut && e.statut !== filtreStatut) return false;
    return true;
  });

  const presents = employees.filter(e => e.statut === 'Présent').length;
  const absents = employees.filter(e => e.statut === 'Absent').length;
  const enConge = employees.filter(e => e.statut === 'Congé').length;

  const handleAdd = () => {
    if (!newEmp.firstName || !newEmp.lastName) { toast.error('Veuillez remplir le prénom et le nom'); return; }
    const emp: Employee = {
      id: `emp-${Date.now()}`, firstName: newEmp.firstName, lastName: newEmp.lastName, photo: '',
      poste: newEmp.poste, departement: newEmp.departement, dateEmbauche: new Date().toISOString().split('T')[0],
      anciennete: 0, statut: 'Présent', telephone: newEmp.telephone, email: newEmp.email,
      adresse: '', situationFamiliale: 'Célibataire', nombreEnfants: 0, dateNaissance: '', lieuNaissance: '',
      numeroSecuriteSociale: '', typeContrat: newEmp.typeContrat,
    };
    setEmployees([emp, ...employees]);
    setShowAdd(false);
    setNewEmp({ firstName: '', lastName: '', poste: postes[0], departement: departements[0], telephone: '', email: '', typeContrat: 'CDI' });
    toast.success('Employé ajouté');
  };

  const empDocs = selected ? mockData.documents.filter(d => d.employeeId === selected.id) : [];
  const empConges = selected ? mockData.conges.filter(c => c.employeeId === selected.id) : [];
  const empSanctions = selected ? mockData.sanctions.filter(s => s.employeeId === selected.id) : [];
  const empMateriel = selected ? mockData.materiels.filter(m => m.employeeId === selected.id) : [];
  const empBulletins = selected ? mockData.bulletins.filter(b => b.employeeId === selected.id) : [];

  const hasActiveFilters = filtreDept || filtreStatut;

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dossiers du personnel</h1><p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestion des employés</p></div>
        <div className="flex items-center gap-2"><Users size={18} className="text-amber-600" /><span className="text-sm font-semibold text-gray-700">{employees.length} employés</span></div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white border border-emerald-200 rounded-2xl p-3 text-center"><UserCheck size={18} className="text-emerald-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{presents}</p><p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Présents</p></div>
        <div className="bg-white border border-red-200 rounded-2xl p-3 text-center"><UserX size={18} className="text-red-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-red-600">{absents}</p><p className="text-[10px] sm:text-xs text-red-600 font-medium">Absents</p></div>
        <div className="bg-white border border-amber-200 rounded-2xl p-3 text-center"><CalendarOff size={18} className="text-amber-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-amber-600">{enConge}</p><p className="text-[10px] sm:text-xs text-amber-600 font-medium">En congé</p></div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un employé..." className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />{search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"><X size={14} className="text-gray-400" /></button>}</div>
        <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${hasActiveFilters || showFilters ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}><Filter size={18} /></button>
        <Button size="sm" onClick={() => setShowAdd(true)} className="flex-shrink-0"><Plus size={16} /> <span className="hidden sm:inline ml-1">Ajouter</span></Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-white border border-gray-100 rounded-2xl">
          <select value={filtreDept} onChange={(e) => setFiltreDept(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[130px]"><option value="">Tous départements</option>{departements.map(d => <option key={d} value={d}>{d}</option>)}</select>
          <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[110px]"><option value="">Tous statuts</option><option value="Présent">✅ Présent</option><option value="Absent">❌ Absent</option><option value="Congé">🏖️ Congé</option></select>
          {hasActiveFilters && <button onClick={() => { setFiltreDept(''); setFiltreStatut(''); }} className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">Réinitialiser</button>}
        </div>
      )}

      <p className="text-xs text-gray-500 font-medium">{filtered.length} employé(s) trouvé(s)</p>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12"><Users size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-sm text-gray-500 font-medium">Aucun employé trouvé</p></div>
        ) : filtered.map((emp) => (
          <div key={emp.id} onClick={() => setSelected(emp)} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(emp.firstName + emp.lastName)}`}>{getInitials(emp.firstName, emp.lastName)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5"><p className="text-sm font-bold text-gray-900 truncate">{emp.firstName} {emp.lastName}</p><div className={`w-2 h-2 rounded-full flex-shrink-0 ${emp.statut === 'Présent' ? 'bg-emerald-500' : emp.statut === 'Absent' ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`} /><Badge variant={statutVariant[emp.statut]}>{emp.statut}</Badge></div>
                <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap"><span className="flex items-center gap-1"><Briefcase size={11} /> {emp.poste}</span><span className="text-gray-300">•</span><span className="flex items-center gap-1"><Building2 size={11} /> {emp.departement}</span></div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={11} /> Embauché le {emp.dateEmbauche}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Dossier employé" size="xl">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${getAvatarColor(selected.firstName + selected.lastName)}`}>{getInitials(selected.firstName, selected.lastName)}</div>
              <div><h3 className="text-lg font-bold text-gray-900">{selected.firstName} {selected.lastName}</h3><p className="text-sm text-gray-500">{selected.poste} • {selected.departement}</p><div className="flex items-center gap-2 mt-1.5"><Badge variant={statutVariant[selected.statut]}>{selected.statut}</Badge><span className="text-xs text-gray-400">{selected.typeContrat}</span></div></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2"><Phone size={14} className="text-amber-500" /><span className="text-xs text-gray-600 truncate">{selected.telephone || 'N/A'}</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2"><Mail size={14} className="text-amber-500" /><span className="text-xs text-gray-600 truncate">{selected.email || 'N/A'}</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2"><MapPin size={14} className="text-amber-500" /><span className="text-xs text-gray-600 truncate">{selected.adresse || 'N/A'}</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2"><Calendar size={14} className="text-amber-500" /><span className="text-xs text-gray-600">Embauché {selected.dateEmbauche}</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2"><Heart size={14} className="text-amber-500" /><span className="text-xs text-gray-600">{selected.situationFamiliale}</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2"><Baby size={14} className="text-amber-500" /><span className="text-xs text-gray-600">{selected.nombreEnfants} enfant(s)</span></div>
            </div>
            <div className="space-y-3">
              <Section title="Documents" icon={FileText} count={empDocs.length} data={empDocs} render={(d: any) => `${d.type} - ${d.statut}`} />
              <Section title="Congés" icon={Calendar} count={empConges.length} data={empConges} render={(c: any) => `${c.type} (${c.dateDebut} → ${c.dateFin}) - ${c.statut}`} />
              <Section title="Sanctions" icon={Shield} count={empSanctions.length} data={empSanctions} render={(s: any) => `${s.type} - ${s.description}`} variant="danger" />
              <Section title="Matériel" icon={Monitor} count={empMateriel.length} data={empMateriel} render={(m: any) => `${m.designation} - ${m.etat}`} />
              <Section title="Bulletins" icon={DollarSign} count={empBulletins.length} data={empBulletins} render={(b: any) => `${new Intl.NumberFormat('fr-FR').format(b.salaireBase)} €`} />
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvel employé" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3"><Input label="Prénom *" value={newEmp.firstName} onChange={(e) => setNewEmp({ ...newEmp, firstName: e.target.value })} placeholder="Sophie" /><Input label="Nom *" value={newEmp.lastName} onChange={(e) => setNewEmp({ ...newEmp, lastName: e.target.value })} placeholder="Martin" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Poste</label><select value={newEmp.poste} onChange={(e) => setNewEmp({ ...newEmp, poste: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">{postes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Département</label><select value={newEmp.departement} onChange={(e) => setNewEmp({ ...newEmp, departement: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">{departements.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          <Input label="Téléphone" value={newEmp.telephone} onChange={(e) => setNewEmp({ ...newEmp, telephone: e.target.value })} placeholder="+33 6 XX XX XX XX" />
          <Input label="Email" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} placeholder="exemple@entreprise.fr" />
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type contrat</label><select value={newEmp.typeContrat} onChange={(e) => setNewEmp({ ...newEmp, typeContrat: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"><option value="CDI">CDI</option><option value="CDD">CDD</option><option value="Stage">Stage</option></select></div>
          <Button onClick={handleAdd} className="w-full" disabled={!newEmp.firstName || !newEmp.lastName}><Plus size={16} /> Ajouter l'employé</Button>
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, icon: Icon, count, data, render, variant }: { title: string; icon: any; count: number; data: any[]; render: (item: any) => string; variant?: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}><Icon size={14} className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'} /></div>{title}<span className="ml-auto text-xs text-gray-400 font-normal">{count}</span></h4>
      {data.length === 0 ? <p className="text-xs text-gray-400 italic">Aucun élément</p> : <div className="space-y-1.5 max-h-32 overflow-y-auto">{data.map((item, i) => <p key={item.id || i} className="text-xs text-gray-600 bg-white rounded-lg px-3 py-1.5">{render(item)}</p>)}</div>}
    </div>
  );
}