import { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, Circle, Plus, Scale, 
  Users, AlertTriangle, FileCheck, Calendar, Building2,
  MessageSquare, Clock, Check, X
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, typesSanction, departements } from '../../data/mockDataRH';
import type { Sanction, Conflit } from '../../data/mockDataRH';
import { toast } from 'sonner';

const statutVariant: Record<string, 'warning' | 'success' | 'danger'> = { 'En cours': 'warning', 'Appliquée': 'success', 'Contestée': 'danger' };
const statutIcon = { 'En cours': Clock, 'Appliquée': CheckCircle2, 'Contestée': AlertTriangle };
const conflitStatutVariant: Record<string, 'warning' | 'success' | 'danger'> = { 'Ouvert': 'danger', 'En médiation': 'warning', 'Résolu': 'success' };
const conflitIcon = { 'Ouvert': AlertTriangle, 'En médiation': MessageSquare, 'Résolu': CheckCircle2 };
const typeIcons: Record<string, string> = { 'Avertissement oral': '🗣️', 'Avertissement écrit': '📝', 'Mise à pied temporaire': '⏰', 'Licenciement': '❌', 'Blâme': '🔒' };
const conflitTypeIcons: Record<string, string> = { 'personnel': '👤', 'matériel': '📦', 'hiérarchique': '🏢' };

export default function SanctionsConformite() {
  const [sanctions, setSanctions] = useLocalStorage<Sanction[]>('rh-sanctions', mockData.sanctions);
  const [conflits, setConflits] = useLocalStorage<Conflit[]>('rh-conflits', mockData.conflits);
  const [tab, setTab] = useState<'sanctions' | 'conflits' | 'conformite'>('sanctions');
  const [showAdd, setShowAdd] = useState(false);
  const [newSan, setNewSan] = useState({ employeeName: '', type: typesSanction[0], departement: departements[0], description: '', temoins: '', decision: '' });

  const handleAdd = () => {
    if (!newSan.employeeName || !newSan.description) { toast.error('Veuillez remplir les champs obligatoires'); return; }
    const san: Sanction = { id: `san-${Date.now()}`, employeeId: '', employeeName: newSan.employeeName, departement: newSan.departement, dateIncident: new Date().toISOString().split('T')[0], type: newSan.type, description: newSan.description, temoins: newSan.temoins, decision: newSan.decision, dateApplication: new Date().toISOString().split('T')[0], statut: 'En cours' };
    setSanctions([san, ...sanctions]);
    setShowAdd(false);
    setNewSan({ employeeName: '', type: typesSanction[0], departement: departements[0], description: '', temoins: '', decision: '' });
    toast.success('Sanction enregistrée');
  };

  const resolveConflit = (id: string) => { setConflits(conflits.map(c => c.id === id ? { ...c, statut: 'Résolu' as const } : c)); toast.success('Conflit résolu'); };

  const conformiteItems = [
    { label: 'Documents obligatoires à jour', done: true },
    { label: 'Visites médicales à jour', done: false },
    { label: 'Équipements de travail conformes', done: true },
    { label: 'Formations sécurité complétées', done: false },
    { label: 'Affichages légaux en place', done: true },
    { label: 'Registre du personnel à jour', done: true },
    { label: "Plan d'évacuation affiché", done: false },
  ];

  const tauxConformite = Math.round(conformiteItems.filter(i => i.done).length / conformiteItems.length * 100);
  const stats = { total: sanctions.length, enCours: sanctions.filter(s => s.statut === 'En cours').length, appliquees: sanctions.filter(s => s.statut === 'Appliquée').length, contestees: sanctions.filter(s => s.statut === 'Contestée').length, conflitsOuverts: conflits.filter(c => c.statut !== 'Résolu').length };
  const tabs = [
    { key: 'sanctions' as const, label: 'Sanctions', icon: Scale, count: stats.enCours },
    { key: 'conflits' as const, label: 'Conflits', icon: AlertTriangle, count: stats.conflitsOuverts },
    { key: 'conformite' as const, label: 'Conformité', icon: ShieldCheck, count: tauxConformite },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sanctions & Conformité</h1><p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestion des sanctions, conflits et conformité</p></div><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-amber-600" /><span className="text-sm font-semibold text-gray-700">{stats.total} sanctions</span></div></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"><div className="bg-white border border-amber-200 rounded-2xl p-3 text-center"><Clock size={18} className="text-amber-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.enCours}</p><p className="text-[10px] sm:text-xs text-amber-600 font-medium">En cours</p></div><div className="bg-white border border-emerald-200 rounded-2xl p-3 text-center"><CheckCircle2 size={18} className="text-emerald-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.appliquees}</p><p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Appliquées</p></div><div className="bg-white border border-red-200 rounded-2xl p-3 text-center"><AlertTriangle size={18} className="text-red-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-red-600">{stats.contestees}</p><p className="text-[10px] sm:text-xs text-red-600 font-medium">Contestées</p></div><div className="bg-white border border-violet-200 rounded-2xl p-3 text-center"><MessageSquare size={18} className="text-violet-600 mx-auto mb-1" /><p className="text-xl sm:text-2xl font-extrabold text-violet-600">{stats.conflitsOuverts}</p><p className="text-[10px] sm:text-xs text-violet-600 font-medium">Conflits ouverts</p></div></div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">{tabs.map((t) => (<button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><t.icon size={14} /> {t.label}{t.count !== undefined && tab !== t.key && t.count > 0 && (<span className="w-5 h-5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center justify-center">{typeof t.count === 'number' && t.key === 'conformite' ? `${t.count}%` : t.count}</span>)}</button>))}</div>

      {tab === 'sanctions' && (<>
        <div className="flex justify-end"><Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> <span className="hidden sm:inline ml-1">Sanction</span></Button></div>
        <div className="space-y-3">{sanctions.length === 0 ? (<div className="text-center py-12"><Scale size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-sm text-gray-500 font-medium">Aucune sanction</p></div>) : sanctions.map((s) => { const StatusIcon = statutIcon[s.statut]; return (<div key={s.id} className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-sm ${s.statut === 'En cours' ? 'border-amber-200' : s.statut === 'Appliquée' ? 'border-emerald-200' : 'border-red-200'}`}><div className="flex items-start justify-between gap-3 mb-3"><div className="flex items-start gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${s.statut === 'En cours' ? 'bg-amber-50' : s.statut === 'Appliquée' ? 'bg-emerald-50' : 'bg-red-50'}`}>{typeIcons[s.type] || '📋'}</div><div><p className="text-sm font-bold text-gray-900">{s.employeeName}</p><p className="text-xs text-gray-500">{s.type}</p><p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Building2 size={11} /> {s.departement}</p></div></div><Badge variant={statutVariant[s.statut]}><StatusIcon size={10} className="mr-1 inline" />{s.statut}</Badge></div><p className="text-sm text-gray-600 mb-3">{s.description}</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-2"><div className="bg-gray-50 rounded-xl p-2.5"><p className="text-[10px] text-gray-400 mb-0.5">Date incident</p><p className="text-xs font-semibold text-gray-700">{s.dateIncident}</p></div><div className="bg-gray-50 rounded-xl p-2.5"><p className="text-[10px] text-gray-400 mb-0.5">Témoins</p><p className="text-xs font-semibold text-gray-700">{s.temoins || 'Aucun'}</p></div><div className="bg-gray-50 rounded-xl p-2.5"><p className="text-[10px] text-gray-400 mb-0.5">Décision</p><p className="text-xs font-semibold text-gray-700">{s.decision}</p></div></div></div>); })}</div></>)}

      {tab === 'conflits' && (<div className="space-y-3">{conflits.length === 0 ? (<div className="text-center py-12"><MessageSquare size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-sm text-gray-500 font-medium">Aucun conflit</p></div>) : conflits.map((c) => { const StatusIcon = conflitIcon[c.statut]; return (<div key={c.id} className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-sm ${c.statut === 'Ouvert' ? 'border-red-200 bg-red-50/20' : c.statut === 'En médiation' ? 'border-amber-200 bg-amber-50/20' : 'border-emerald-200'}`}><div className="flex items-start justify-between gap-3 mb-3"><div><div className="flex items-center gap-2 mb-1"><span className="text-lg">{conflitTypeIcons[c.type]}</span><Badge variant={c.type === 'personnel' ? 'info' : c.type === 'matériel' ? 'warning' : 'danger'}>{c.type}</Badge></div><p className="text-sm font-bold text-gray-900 mt-1">{c.personnesImpliquees}</p></div><Badge variant={conflitStatutVariant[c.statut]}><StatusIcon size={10} className="mr-1 inline" />{c.statut}</Badge></div><p className="text-sm text-gray-600 mb-2">{c.description}</p><p className="text-xs text-gray-500 mb-3"><span className="font-semibold">Résolution :</span> {c.resolution}</p>{c.statut !== 'Résolu' && (<Button variant="primary" size="sm" onClick={() => resolveConflit(c.id)}><CheckCircle2 size={14} /> Marquer résolu</Button>)}</div>); })}</div>)}

      {tab === 'conformite' && (<div className="bg-white border border-gray-100 rounded-2xl p-5"><h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><FileCheck size={16} className="text-amber-600" /></div>Checklist conformité entreprise<span className="ml-auto text-xs font-normal text-amber-600">{tauxConformite}%</span></h3><div className="space-y-2 mb-4">{conformiteItems.map((item, i) => (<div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${item.done ? 'bg-emerald-50' : 'bg-gray-50'}`}>{item.done ? <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" /> : <Circle size={20} className="text-gray-300 flex-shrink-0" />}<span className={`text-sm font-medium ${item.done ? 'text-emerald-700' : 'text-gray-500'}`}>{item.label}</span>{item.done ? <Check size={14} className="text-emerald-500 ml-auto" /> : <X size={14} className="text-gray-300 ml-auto" />}</div>))}</div><div className="bg-gray-50 rounded-xl p-4"><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-600">Taux de conformité</span><span className="text-sm font-extrabold text-amber-600">{tauxConformite}%</span></div><div className="h-2.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${tauxConformite >= 80 ? 'bg-emerald-500' : tauxConformite >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${tauxConformite}%` }} /></div></div></div>)}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle sanction" size="md">
        <div className="space-y-4">
          <Input label="Employé concerné *" value={newSan.employeeName} onChange={(e) => setNewSan({ ...newSan, employeeName: e.target.value })} placeholder="Nom de l'employé" />
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type de sanction</label><select value={newSan.type} onChange={(e) => setNewSan({ ...newSan, type: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">{typesSanction.map(t => (<option key={t} value={t}>{typeIcons[t]} {t}</option>))}</select></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Département</label><select value={newSan.departement} onChange={(e) => setNewSan({ ...newSan, departement: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">{departements.map(d => (<option key={d} value={d}>🏢 {d}</option>))}</select></div>
          <Input label="Description des faits *" value={newSan.description} onChange={(e) => setNewSan({ ...newSan, description: e.target.value })} placeholder="Décrire l'incident..." />
          <Input label="Témoins" value={newSan.temoins} onChange={(e) => setNewSan({ ...newSan, temoins: e.target.value })} placeholder="Noms des témoins" />
          <Input label="Décision" value={newSan.decision} onChange={(e) => setNewSan({ ...newSan, decision: e.target.value })} placeholder="Décision prise" />
          <Button onClick={handleAdd} className="w-full" disabled={!newSan.employeeName || !newSan.description}><Plus size={16} /> Enregistrer la sanction</Button>
        </div>
      </Modal>
    </div>
  );
}