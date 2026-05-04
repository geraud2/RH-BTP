import { useState } from 'react';
import { 
  Download, Users, Calendar, DollarSign, GraduationCap, 
  Package, Scale, FileCheck, Printer
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockData, departements, formatCurrency } from '../../data/mockDataRH';
import { toast } from 'sonner';

type ReportType = 'effectifs' | 'conges' | 'paie' | 'formations' | 'materiel' | 'sanctions' | 'documents';

const reports = [
  { key: 'effectifs' as const, label: 'Effectifs', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'conges' as const, label: 'Congés', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'paie' as const, label: 'Paie', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'formations' as const, label: 'Formations', icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50' },
  { key: 'materiel' as const, label: 'Matériel', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'sanctions' as const, label: 'Sanctions', icon: Scale, color: 'text-red-600', bg: 'bg-red-50' },
  { key: 'documents' as const, label: 'Documents', icon: FileCheck, color: 'text-sky-600', bg: 'bg-sky-50' },
];

const getNetPaie = (b: any) => b.salaireBase + b.montantHeuresSup + b.primeDeplacement + b.primeAnciennete + b.primeRendement - b.avances - b.absencesNonJustifiees - b.retenuesDiverses - b.cotisationsSociales;

export default function Reporting() {
  const [selected, setSelected] = useState<ReportType>('effectifs');
  const { employees, conges, bulletins, formations, materiels, sanctions, documents } = mockData;
  const currentReport = reports.find(r => r.key === selected)!;

  const exportCSV = () => {
    let csv = '', filename = '';
    if (selected === 'effectifs') { csv = 'Nom,Poste,Département,Statut\n' + employees.map(e => `${e.lastName} ${e.firstName},${e.poste},${e.departement},${e.statut}`).join('\n'); filename = 'rapport-effectifs'; }
    else if (selected === 'conges') { csv = 'Employé,Type,Début,Fin,Statut\n' + conges.map(c => `${c.employeeName},${c.type},${c.dateDebut},${c.dateFin},${c.statut}`).join('\n'); filename = 'rapport-conges'; }
    else if (selected === 'paie') { csv = 'Employé,Département,Salaire base,Net\n' + bulletins.map(b => `${b.employeeName},${b.departement},${b.salaireBase},${getNetPaie(b)}`).join('\n'); filename = 'rapport-paie'; }
    else if (selected === 'formations') { csv = 'Titre,Type,Durée,Coût,Organisme,Statut\n' + formations.map(f => `${f.titre},${f.type},${f.duree},${f.cout},${f.organisme},${f.statut}`).join('\n'); filename = 'rapport-formations'; }
    else if (selected === 'materiel') { csv = 'Type,Désignation,Employé,Département,État\n' + materiels.map(m => `${m.type},${m.designation},${m.employeeName || 'N/A'},${m.departement},${m.etat}`).join('\n'); filename = 'rapport-materiel'; }
    else if (selected === 'sanctions') { csv = 'Type,Employé,Date,Statut\n' + sanctions.map(s => `${s.type},${s.employeeName},${s.dateIncident},${s.statut}`).join('\n'); filename = 'rapport-sanctions'; }
    else if (selected === 'documents') { csv = 'Titre,Type,Employé,Statut,Expiration\n' + documents.filter(d => !d.archived).map(d => `${d.titre},${d.type},${d.employeeName},${d.statut},${d.dateExpiration}`).join('\n'); filename = 'rapport-documents'; }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`Rapport ${currentReport.label} exporté`);
  };

  const renderReport = () => {
    if (selected === 'effectifs') {
      const byDept = departements.map(d => ({ name: d, count: employees.filter(e => e.departement === d).length }));
      const maxD = Math.max(...byDept.map(c => c.count), 1);
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3"><div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-emerald-600">{employees.filter(e => e.statut === 'Présent').length}</p><p className="text-[10px] text-emerald-600 font-medium">Présents</p></div><div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-red-600">{employees.filter(e => e.statut === 'Absent').length}</p><p className="text-[10px] text-red-600 font-medium">Absents</p></div><div className="bg-sky-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-sky-600">{employees.filter(e => e.statut === 'Congé').length}</p><p className="text-[10px] text-sky-600 font-medium">Congé</p></div></div>
          <div><h4 className="text-sm font-bold text-gray-700 mb-3">🏢 Par département</h4><div className="space-y-2">{byDept.filter(c => c.count > 0).map(c => (<div key={c.name} className="bg-gray-50 rounded-xl p-3"><div className="flex items-center justify-between mb-1.5"><span className="text-xs font-medium text-gray-700">{c.name}</span><span className="text-xs font-bold text-gray-900">{c.count}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-400 rounded-full" style={{ width: `${(c.count / maxD) * 100}%` }} /></div></div>))}</div></div>
        </div>
      );
    }
    if (selected === 'conges') {
      const byType = ['Congé annuel', 'Permission', 'Maladie', 'Maternité/Paternité', 'Fête religieuse'].map(t => ({ type: t, count: conges.filter(c => c.type === t).length }));
      const maxC = Math.max(...byType.map(t => t.count), 1);
      return (<div className="space-y-5"><div className="grid grid-cols-3 gap-3"><div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-amber-600">{conges.filter(c => c.statut === 'En attente').length}</p><p className="text-[10px] text-amber-600 font-medium">En attente</p></div><div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-emerald-600">{conges.filter(c => c.statut === 'Approuvé').length}</p><p className="text-[10px] text-emerald-600 font-medium">Approuvés</p></div><div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-red-600">{conges.filter(c => c.statut === 'Refusé').length}</p><p className="text-[10px] text-red-600 font-medium">Refusés</p></div></div><div><h4 className="text-sm font-bold text-gray-700 mb-3">Par type</h4><div className="space-y-2">{byType.filter(t => t.count > 0).map(t => (<div key={t.type} className="bg-gray-50 rounded-xl p-3"><div className="flex items-center justify-between mb-1.5"><span className="text-xs font-medium text-gray-700">{t.type}</span><span className="text-xs font-bold text-gray-900">{t.count}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(t.count / maxC) * 100}%` }} /></div></div>))}</div></div></div>);
    }
    if (selected === 'paie') {
      const totalNet = bulletins.reduce((s, b) => s + getNetPaie(b), 0);
      const totalSalaires = bulletins.reduce((s, b) => s + b.salaireBase, 0);
      const byDept = departements.map(d => ({ name: d, total: bulletins.filter(b => b.departement === d).reduce((s, b) => s + b.salaireBase, 0), count: bulletins.filter(b => b.departement === d).length })).filter(c => c.count > 0);
      const maxP = Math.max(...byDept.map(c => c.total), 1);
      return (<div className="space-y-5"><div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 text-center border border-amber-200"><p className="text-xs text-amber-600 font-medium mb-1">Masse salariale mensuelle</p><p className="text-3xl font-extrabold text-amber-600">{formatCurrency(totalNet)}</p></div><div className="grid grid-cols-2 gap-3"><div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Salaires bruts</p><p className="text-lg font-bold text-blue-600">{formatCurrency(totalSalaires)}</p></div></div><div><h4 className="text-sm font-bold text-gray-700 mb-3">🏢 Par département</h4><div className="space-y-2">{byDept.map(c => (<div key={c.name} className="bg-gray-50 rounded-xl p-3"><div className="flex items-center justify-between mb-1.5"><div><span className="text-xs font-medium text-gray-700">{c.name}</span><p className="text-[10px] text-gray-400">{c.count} employés</p></div><span className="text-xs font-bold text-gray-900">{formatCurrency(c.total)}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${(c.total / maxP) * 100}%` }} /></div></div>))}</div></div></div>);
    }
    if (selected === 'formations') {
      const totalBudget = formations.reduce((s, f) => s + f.cout, 0);
      const tauxCompletion = formations.length > 0 ? Math.round((formations.filter(f => f.statut === 'Terminé').length / formations.length) * 100) : 0;
      return (<div className="space-y-5"><div className="grid grid-cols-2 gap-3"><div className="bg-violet-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold text-violet-600">{formations.length}</p><p className="text-xs text-violet-500 font-medium">Formations</p></div><div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold text-amber-600">{formatCurrency(totalBudget)}</p><p className="text-xs text-amber-500 font-medium">Budget total</p></div></div><div className="bg-gray-50 rounded-xl p-4"><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-600">Taux de complétion</span><span className="text-xs font-bold text-emerald-600">{tauxCompletion}%</span></div><div className="h-2.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full" style={{ width: `${tauxCompletion}%` }} /></div></div></div>);
    }
    if (selected === 'materiel') {
      const byType = ['Informatique', 'Mobilier', 'Téléphonie'].map(t => ({ type: t, count: materiels.filter(m => m.type === t).length, ok: materiels.filter(m => m.type === t && m.etat === 'Bon').length }));
      const tauxSante = materiels.length > 0 ? Math.round((materiels.filter(m => m.etat === 'Bon').length / materiels.length) * 100) : 0;
      const icons: Record<string, string> = { 'Informatique': '💻', 'Mobilier': '🪑', 'Téléphonie': '📱' };
      return (<div className="space-y-5"><div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 text-center border border-emerald-200"><p className="text-xs text-emerald-600 font-medium mb-1">Taux de santé du parc</p><p className="text-3xl font-extrabold text-emerald-600">{tauxSante}%</p><div className="h-2 bg-emerald-200 rounded-full overflow-hidden mt-3"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tauxSante}%` }} /></div></div><div className="space-y-3">{byType.filter(t => t.count > 0).map(t => (<div key={t.type} className="bg-gray-50 rounded-xl p-4"><div className="flex items-center justify-between mb-2"><span className="font-bold text-sm text-gray-900">{icons[t.type]} {t.type}</span><span className="text-xs text-gray-500">{t.ok}/{t.count} en bon état</span></div><div className="h-2.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${t.ok / t.count > 0.7 ? 'bg-emerald-400' : t.ok / t.count > 0.4 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: t.count > 0 ? `${(t.ok / t.count) * 100}%` : '0%' }} /></div></div>))}</div></div>);
    }
    if (selected === 'sanctions') {
      const byType = ['Avertissement oral', 'Avertissement écrit', 'Mise à pied temporaire', 'Licenciement', 'Blâme'].map(t => ({ type: t, count: sanctions.filter(s => s.type === t).length }));
      return (<div className="space-y-5"><div className="grid grid-cols-3 gap-3"><div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-amber-600">{sanctions.filter(s => s.statut === 'En cours').length}</p><p className="text-[10px] text-amber-600 font-medium">En cours</p></div><div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-emerald-600">{sanctions.filter(s => s.statut === 'Appliquée').length}</p><p className="text-[10px] text-emerald-600 font-medium">Appliquées</p></div><div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-red-600">{sanctions.filter(s => s.statut === 'Contestée').length}</p><p className="text-[10px] text-red-600 font-medium">Contestées</p></div></div><div className="space-y-2">{byType.filter(t => t.count > 0).map(t => (<div key={t.type} className="flex items-center justify-between bg-gray-50 rounded-xl p-3"><span className="text-sm font-medium text-gray-700">{t.type}</span><Badge variant="danger">{t.count}</Badge></div>))}</div></div>);
    }
    if (selected === 'documents') {
      const total = documents.filter(d => !d.archived).length;
      const valides = documents.filter(d => !d.archived && d.statut === 'Valide').length;
      const taux = total > 0 ? Math.round((valides / total) * 100) : 0;
      return (<div className="space-y-5"><div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-5 text-center border border-sky-200"><p className="text-xs text-sky-600 font-medium mb-1">Taux de conformité documentaire</p><p className="text-3xl font-extrabold text-sky-600">{taux}%</p><div className="h-2 bg-sky-200 rounded-full overflow-hidden mt-3"><div className="h-full bg-sky-500 rounded-full" style={{ width: `${taux}%` }} /></div></div><div className="grid grid-cols-3 gap-3"><div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-emerald-600">{valides}</p><p className="text-[10px] text-emerald-600 font-medium">Valides</p></div><div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-amber-600">{documents.filter(d => !d.archived && d.statut === 'Expire bientôt').length}</p><p className="text-[10px] text-amber-600 font-medium">Expirent</p></div><div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-xl font-extrabold text-red-600">{documents.filter(d => !d.archived && d.statut === 'Expiré').length}</p><p className="text-[10px] text-red-600 font-medium">Expirés</p></div></div></div>);
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reporting</h1><p className="text-gray-500 text-xs sm:text-sm mt-0.5">Rapports détaillés et exports</p></div><div className="flex items-center gap-2"><Button size="sm" variant="secondary" onClick={() => toast.success('Impression lancée')}><Printer size={14} /><span className="hidden sm:inline ml-1">Imprimer</span></Button><Button size="sm" onClick={exportCSV}><Download size={14} /><span className="hidden sm:inline ml-1">Export CSV</span></Button></div></div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">{reports.map((r) => (<button key={r.key} onClick={() => setSelected(r.key)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${selected === r.key ? `${r.bg} border-2 shadow-sm scale-105` : 'bg-white border border-gray-100 hover:bg-gray-50'}`} style={selected === r.key ? { borderColor: r.color.replace('text-', '') } : {}}><r.icon size={20} className={selected === r.key ? r.color : 'text-gray-400'} /><span className={`text-[10px] sm:text-xs font-semibold ${selected === r.key ? r.color : 'text-gray-500'}`}>{r.label}</span></button>))}</div>
      <Card><CardContent className="p-4 sm:p-5"><div className="flex items-center gap-2 mb-4"><div className={`w-8 h-8 rounded-xl ${currentReport.bg} flex items-center justify-center`}><currentReport.icon size={16} className={currentReport.color} /></div><h3 className="font-bold text-gray-900">Rapport {currentReport.label}</h3></div>{renderReport()}</CardContent></Card>
    </div>
  );
}