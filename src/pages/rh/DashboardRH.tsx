import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, Calendar, FileText, DollarSign, 
  Target, AlertTriangle, Plus, FilePlus, CheckCircle, 
  Eye, TrendingUp, Building2, ChevronRight, Bell, 
  Briefcase, Monitor, Clock
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { mockData } from '../../data/mockDataRH';

export default function DashboardRH() {
  const navigate = useNavigate();
  const { employees, documents, conges, candidatures, materiels, sanctions } = mockData;
  
  const presents = employees.filter(e => e.statut === 'Présent').length;
  const enConge = employees.filter(e => e.statut === 'Congé').length;
  const congesEnAttente = conges.filter(c => c.statut === 'En attente').length;
  const docsExpirant = documents.filter(d => d.statut === 'Expire bientôt').length;
  const docsExpires = documents.filter(d => d.statut === 'Expiré').length;
  const candEnCours = candidatures.filter(c => !['Acceptée', 'Refusée'].includes(c.statut)).length;
  const materielARemplacer = materiels.filter(m => m.etat === 'À remplacer' || m.etat === 'Manquant/Perdu').length;
  const sanctionsEnAttente = sanctions.filter(s => s.statut === 'En cours').length;

  const statsPrincipales = [
    { icon: Users, label: 'Total employés', value: employees.length, bg: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
    { icon: UserCheck, label: 'Présents', value: presents, bg: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
    { icon: Calendar, label: 'En congé', value: enConge, bg: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-200' },
    { icon: FileText, label: 'Docs expirant', value: docsExpirant, bg: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200' },
  ];

  const alertes = [
    ...(docsExpirant > 0 ? [{ text: `${docsExpirant} document(s) à renouveler`, variant: 'warning', icon: FileText }] : []),
    ...(docsExpires > 0 ? [{ text: `${docsExpires} document(s) expiré(s)`, variant: 'danger', icon: AlertTriangle }] : []),
    ...(congesEnAttente > 0 ? [{ text: `${congesEnAttente} congé(s) non validé(s)`, variant: 'warning', icon: Calendar }] : []),
    ...(materielARemplacer > 0 ? [{ text: `${materielARemplacer} matériel(s) à remplacer`, variant: 'danger', icon: Monitor }] : []),
    ...(sanctionsEnAttente > 0 ? [{ text: `${sanctionsEnAttente} sanction(s) en attente`, variant: 'danger', icon: AlertTriangle }] : []),
  ];

  const raccourcis = [
    { icon: Plus, label: 'Nouvel employé', desc: 'Ajouter un dossier', action: () => navigate('/dossiers'), bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { icon: FilePlus, label: 'Ajouter contrat', desc: 'Nouveau document', action: () => navigate('/documents'), bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: CheckCircle, label: 'Valider congés', desc: `${congesEnAttente} en attente`, action: () => navigate('/conges'), bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: Eye, label: 'Voir paie', desc: 'Bulletins du mois', action: () => navigate('/paie'), bg: 'bg-violet-50', iconColor: 'text-violet-600' },
  ];

  const kpis = [
    { icon: DollarSign, label: 'Paie du mois', value: 'Prête', bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { icon: Target, label: 'Candidatures', value: candEnCours, bg: 'bg-blue-50', textColor: 'text-blue-600' },
    { icon: Briefcase, label: 'Formations', value: '3 à venir', bg: 'bg-amber-50', textColor: 'text-amber-600' },
    { icon: TrendingUp, label: 'Taux présence', value: `${Math.round((presents / employees.length) * 100)}%`, bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-5 sm:p-6 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full -ml-8 -mb-8" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /><p className="text-xs text-emerald-400 font-medium">En ligne</p></div>
              <h1 className="text-xl sm:text-2xl font-bold">Bonjour, DRH</h1>
              <p className="text-sm text-gray-400 mt-0.5">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="relative p-2.5 rounded-xl bg-white/10">
              <Bell size={20} className="text-white" />
              {alertes.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{alertes.length}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2"><Building2 size={16} className="text-amber-400" /><span className="text-sm font-medium">7 départements</span></div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2"><Users size={16} className="text-amber-400" /><span className="text-sm font-medium">{employees.length} employés</span></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsPrincipales.map((s) => (
          <div key={s.label} className={`rounded-2xl border ${s.borderColor} bg-white p-4 hover:shadow-md transition-shadow cursor-pointer`} onClick={() => navigate('/dossiers')}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={20} className={s.textColor} /></div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-2`}><kpi.icon size={18} className={kpi.textColor} /></div>
            <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><AlertTriangle size={16} className="text-amber-600" /></div>Alertes<span className="ml-auto text-xs font-medium text-gray-400">{alertes.length}</span></h3>
          <div className="space-y-2">
            {alertes.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${a.variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}><a.icon size={16} className={a.variant === 'danger' ? 'text-red-600' : 'text-amber-600'} /></div>
                <p className="text-sm font-medium text-gray-900 flex-1">{a.text}</p>
                <Badge variant={a.variant as 'success' | 'warning' | 'danger'}>{a.variant === 'danger' ? 'Urgent' : 'Attention'}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accès rapides */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><Clock size={16} className="text-amber-600" /></div>Accès rapides</h3>
        <div className="grid grid-cols-2 gap-3">
          {raccourcis.map((r) => (
            <button key={r.label} onClick={r.action} className="rounded-2xl bg-gray-50 hover:bg-gray-100 p-4 transition-all text-left hover:shadow-md">
              <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center mb-2`}><r.icon size={20} className={r.iconColor} /></div>
              <p className="text-sm font-semibold text-gray-900">{r.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Candidatures récentes */}
      {candidatures.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center"><Target size={16} className="text-blue-600" /></div>Candidatures récentes</h3>
            <button onClick={() => navigate('/recrutement')} className="text-xs text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700">Voir tout <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-2">
            {candidatures.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div><p className="text-sm font-semibold text-gray-900">{c.candidatNom}</p><p className="text-xs text-gray-500">{c.poste} • {c.departement || ''}</p></div>
                <Badge variant={c.statut === 'Acceptée' ? 'success' : c.statut === 'Refusée' ? 'danger' : 'warning'}>{c.statut}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}