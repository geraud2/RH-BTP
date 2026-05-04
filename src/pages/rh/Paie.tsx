import { useState } from 'react';
import { 
  ChevronDown, ChevronUp, DollarSign, TrendingUp, 
  Users, Building2, Calendar, FileText, Download,
  Eye, CreditCard, Banknote, PieChart
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, departements, formatCurrency } from '../../data/mockDataRH';
import type { BulletinPaie } from '../../data/mockDataRH';
import { toast } from 'sonner';

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function Paie() {
  const [bulletins] = useLocalStorage<BulletinPaie[]>('rh-bulletins', mockData.bulletins);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedYear] = useState(2026);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [expandedBulletin, setExpandedBulletin] = useState<string | null>(null);

  const filtered = bulletins.filter(b => {
    if (b.mois !== selectedMonth) return false;
    if (selectedDept && b.departement !== selectedDept) return false;
    if (selectedEmployee && b.employeeName !== selectedEmployee) return false;
    return true;
  });

  const deptSummary = departements.map(d => {
    const deptBulletins = filtered.filter(b => b.departement === d);
    const net = deptBulletins.reduce((s, b) => s + (b.salaireBase + b.montantHeuresSup + b.primeDeplacement + b.primeAnciennete + b.primeRendement - b.avances - b.absencesNonJustifiees - b.retenuesDiverses - b.cotisationsSociales), 0);
    return { dept: d, effectif: deptBulletins.length, totalSalaires: deptBulletins.reduce((s, b) => s + b.salaireBase, 0), totalPrimes: deptBulletins.reduce((s, b) => s + b.primeDeplacement + b.primeAnciennete + b.primeRendement, 0), totalHeuresSup: deptBulletins.reduce((s, b) => s + b.heuresSup, 0), totalNet: net };
  }).filter(c => c.effectif > 0);

  const employeeNames = [...new Set(bulletins.filter(b => b.mois === selectedMonth).map(b => b.employeeName))];

  const getNet = (b: BulletinPaie) => b.salaireBase + b.montantHeuresSup + b.primeDeplacement + b.primeAnciennete + b.primeRendement - b.avances - b.absencesNonJustifiees - b.retenuesDiverses - b.cotisationsSociales;

  const totals = {
    effectif: filtered.length,
    salaires: filtered.reduce((s, b) => s + b.salaireBase, 0),
    primes: filtered.reduce((s, b) => s + b.primeDeplacement + b.primeAnciennete + b.primeRendement, 0),
    heuresSup: filtered.reduce((s, b) => s + b.heuresSup, 0),
    net: filtered.reduce((s, b) => s + getNet(b), 0),
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paie</h1><p className="text-gray-500 text-xs sm:text-sm mt-0.5">Administration de la paie</p></div>
        <div className="flex items-center gap-2"><CreditCard size={18} className="text-amber-600" /><span className="text-sm font-semibold text-gray-700">{months[selectedMonth - 1]} {selectedYear}</span></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-2"><Users size={18} className="text-blue-600" /></div><p className="text-lg sm:text-xl font-extrabold text-gray-900">{totals.effectif}</p><p className="text-[10px] sm:text-xs text-gray-500 font-medium">Effectif</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-2"><Banknote size={18} className="text-amber-600" /></div><p className="text-lg sm:text-xl font-extrabold text-amber-600">{formatCurrency(totals.net)}</p><p className="text-[10px] sm:text-xs text-gray-500 font-medium">Net total</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-2"><TrendingUp size={18} className="text-emerald-600" /></div><p className="text-lg sm:text-xl font-extrabold text-emerald-600">{formatCurrency(totals.primes)}</p><p className="text-[10px] sm:text-xs text-gray-500 font-medium">Primes</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4"><div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mb-2"><PieChart size={18} className="text-violet-600" /></div><p className="text-lg sm:text-xl font-extrabold text-violet-600">{totals.heuresSup}h</p><p className="text-[10px] sm:text-xs text-gray-500 font-medium">Heures sup.</p></div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white flex-1">{months.map((m, i) => <option key={i} value={i + 1}>{m} {selectedYear}</option>)}</select>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white flex-1"><option value="">Tous départements</option>{departements.map(d => <option key={d} value={d}>🏢 {d}</option>)}</select>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white flex-1"><option value="">Tous les employés</option>{employeeNames.map(n => <option key={n} value={n}>{n}</option>)}</select>
          <button onClick={() => toast.success('Export CSV simulé')} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex-shrink-0"><Download size={16} /> Export</button>
        </div>
      </div>

      {deptSummary.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><Building2 size={16} className="text-amber-600" /></div>Résumé par département</h3>
          <div className="space-y-3">
            {deptSummary.map((ds) => (
              <div key={ds.dept} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3"><p className="font-bold text-sm text-gray-900">{ds.dept}</p><Badge variant="neutral">{ds.effectif} employés</Badge></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl p-2.5 text-center"><p className="text-xs text-gray-500">Salaires</p><p className="font-bold text-sm text-amber-600">{formatCurrency(ds.totalSalaires)}</p></div>
                  <div className="bg-white rounded-xl p-2.5 text-center"><p className="text-xs text-gray-500">Primes</p><p className="font-bold text-sm text-blue-600">{formatCurrency(ds.totalPrimes)}</p></div>
                  <div className="bg-white rounded-xl p-2.5 text-center"><p className="text-xs text-gray-500">H. Sup</p><p className="font-bold text-sm text-violet-600">{ds.totalHeuresSup}h</p></div>
                  <div className="bg-white rounded-xl p-2.5 text-center"><p className="text-xs text-gray-500">Net total</p><p className="font-bold text-sm text-emerald-600">{formatCurrency(ds.totalNet)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><FileText size={16} className="text-amber-600" /></div>Bulletins individuels<span className="text-xs text-gray-400 font-normal">({filtered.length})</span></h3></div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl"><DollarSign size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-sm text-gray-500 font-medium">Aucun bulletin trouvé</p></div>
        ) : (
          <div className="space-y-2">
            {filtered.slice(0, 20).map((b) => {
              const isExpanded = expandedBulletin === b.id;
              const net = getNet(b);
              return (
                <div key={b.id} className={`bg-white border rounded-2xl transition-all hover:shadow-sm ${isExpanded ? 'border-amber-200 shadow-md' : 'border-gray-100'}`}>
                  <button onClick={() => setExpandedBulletin(isExpanded ? null : b.id)} className="w-full p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><DollarSign size={18} className="text-amber-600" /></div><div className="text-left"><p className="font-bold text-sm text-gray-900">{b.employeeName}</p><p className="text-xs text-gray-500">{b.departement}</p></div></div>
                    <div className="flex items-center gap-3"><span className="font-extrabold text-base text-amber-600">{formatCurrency(net)}</span>{isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</div>
                  </button>
                  {isExpanded && (
                    <div className="px-3 sm:px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                      <div><p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Gains</p>
                        <div className="bg-emerald-50/50 rounded-xl p-3 space-y-1.5">
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Salaire de base</span><span className="font-semibold text-gray-900">{formatCurrency(b.salaireBase)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Heures supp. ({b.heuresSup}h)</span><span className="font-semibold text-gray-900">{formatCurrency(b.montantHeuresSup)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Prime déplacement</span><span className="font-semibold text-gray-900">{formatCurrency(b.primeDeplacement)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Prime ancienneté</span><span className="font-semibold text-gray-900">{formatCurrency(b.primeAnciennete)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Prime rendement</span><span className="font-semibold text-gray-900">{formatCurrency(b.primeRendement)}</span></div>
                        </div>
                      </div>
                      <div><p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Retenues</p>
                        <div className="bg-red-50/50 rounded-xl p-3 space-y-1.5">
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Avances</span><span className="font-semibold text-red-600">{formatCurrency(b.avances)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-600">Cotisations sociales</span><span className="font-semibold text-red-600">{formatCurrency(b.cotisationsSociales)}</span></div>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"><span className="font-bold text-gray-900">Net à payer</span><span className="font-extrabold text-lg text-amber-600">{formatCurrency(net)}</span></div>
                      <div className="flex gap-2"><button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"><Eye size={14} /> Voir fiche</button><button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200"><Download size={14} /> Télécharger</button></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}