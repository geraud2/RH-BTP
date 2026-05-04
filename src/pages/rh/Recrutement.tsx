import { useState } from 'react';
import { 
  UserPlus, ChevronRight, CheckCircle2, Circle, Clock, 
  XCircle, Send, MailCheck, Target, Users, Briefcase,
  Building2, Phone, Calendar, Filter, Plus, TrendingUp,
  FileText, Shield, HardHat, GraduationCap, BadgeCheck
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, chantiers, postes } from '../../data/mockDataRH';
import type { Candidature, OnboardingItem } from '../../data/mockDataRH';
import { toast } from 'sonner';

const pipelineStages = [
  { key: 'Reçue' as const, label: 'Reçues', icon: MailCheck, color: 'bg-blue-50 text-blue-600 border-blue-200', step: 1 },
  { key: 'En évaluation' as const, label: 'Évaluation', icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-200', step: 2 },
  { key: 'Entretien' as const, label: 'Entretiens', icon: Send, color: 'bg-violet-50 text-violet-600 border-violet-200', step: 3 },
  { key: 'Offre envoyée' as const, label: 'Offres', icon: Send, color: 'bg-sky-50 text-sky-600 border-sky-200', step: 4 },
  { key: 'Acceptée' as const, label: 'Acceptées', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', step: 5 },
];

const statutVariant: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
  'Reçue': 'info', 'En évaluation': 'warning', 'Entretien': 'warning', 
  'Offre envoyée': 'info', 'Acceptée': 'success', 'Refusée': 'danger',
};

const onboardingSteps = [
  { key: 'contratSigne' as const, label: 'Contrat signé', icon: FileText },
  { key: 'visiteMedicale' as const, label: 'Visite médicale', icon: Shield },
  { key: 'epiAttribue' as const, label: 'EPI attribué', icon: HardHat },
  { key: 'formationSecurite' as const, label: 'Formation sécurité', icon: GraduationCap },
  { key: 'badgeChantier' as const, label: 'Badge chantier', icon: BadgeCheck },
];

export default function Recrutement() {
  const [candidatures, setCandidatures] = useLocalStorage<Candidature[]>('rh-candidatures', mockData.candidatures);
  const [onboarding, setOnboarding] = useLocalStorage<OnboardingItem[]>('rh-onboarding', mockData.onboarding);
  const [tab, setTab] = useState<'pipeline' | 'onboarding'>('pipeline');
  const [showAdd, setShowAdd] = useState(false);
  const [newCand, setNewCand] = useState({ 
    candidatNom: '', candidatContact: '', poste: postes[0], chantier: chantiers[0] 
  });

  const handleAdd = () => {
    if (!newCand.candidatNom) {
      toast.error('Veuillez renseigner le nom du candidat');
      return;
    }
    const cand: Candidature = {
      id: `cand-${Date.now()}`,
      poste: newCand.poste,
      chantier: newCand.chantier,
      candidatNom: newCand.candidatNom,
      candidatContact: newCand.candidatContact,
      dateCandidature: new Date().toISOString().split('T')[0],
      statut: 'Reçue',
      candidat: undefined
    };
    setCandidatures([cand, ...candidatures]);
    setShowAdd(false);
    setNewCand({ candidatNom: '', candidatContact: '', poste: postes[0], chantier: chantiers[0] });
    toast.success('Candidature ajoutée');
  };

  const moveStage = (id: string) => {
    const order: Candidature['statut'][] = ['Reçue', 'En évaluation', 'Entretien', 'Offre envoyée', 'Acceptée'];
    setCandidatures(candidatures.map(c => {
      if (c.id !== id) return c;
      const idx = order.indexOf(c.statut);
      if (idx < order.length - 1) return { ...c, statut: order[idx + 1] };
      return c;
    }));
    toast.success('Étape suivante');
  };

  const reject = (id: string) => {
    setCandidatures(candidatures.map(c => c.id === id ? { ...c, statut: 'Refusée' as const } : c));
    toast.error('Candidature refusée');
  };

  const toggleOnboarding = (id: string, field: keyof OnboardingItem) => {
    setOnboarding(onboarding.map(o => o.id === id ? { ...o, [field]: !o[field] } : o));
  };

  const stats = {
    total: candidatures.length,
    recues: candidatures.filter(c => c.statut === 'Reçue').length,
    enCours: candidatures.filter(c => !['Acceptée', 'Refusée'].includes(c.statut)).length,
    acceptees: candidatures.filter(c => c.statut === 'Acceptée').length,
    refusees: candidatures.filter(c => c.statut === 'Refusée').length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Recrutement</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestion des candidatures et onboarding</p>
        </div>
        <div className="flex items-center gap-2">
          <Target size={18} className="text-amber-600" />
          <span className="text-sm font-semibold text-gray-700">{stats.total} candidatures</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-blue-200 rounded-2xl p-3 text-center">
          <MailCheck size={18} className="text-blue-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{stats.recues}</p>
          <p className="text-[10px] sm:text-xs text-blue-600 font-medium">Reçues</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-3 text-center">
          <Clock size={18} className="text-amber-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.enCours}</p>
          <p className="text-[10px] sm:text-xs text-amber-600 font-medium">En cours</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-2xl p-3 text-center">
          <CheckCircle2 size={18} className="text-emerald-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.acceptees}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Acceptées</p>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-3 text-center">
          <XCircle size={18} className="text-red-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-red-600">{stats.refusees}</p>
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">Refusées</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button 
          onClick={() => setTab('pipeline')} 
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            tab === 'pipeline' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          <Target size={16} /> Pipeline
        </button>
        <button 
          onClick={() => setTab('onboarding')} 
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            tab === 'onboarding' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          <Users size={16} /> Onboarding
        </button>
      </div>

      {tab === 'pipeline' && (
        <>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <UserPlus size={16} /> <span className="hidden sm:inline ml-1">Nouvelle candidature</span>
            </Button>
          </div>

          {/* Pipeline */}
          <div className="space-y-4">
            {pipelineStages.map((stage) => {
              const items = candidatures.filter(c => c.statut === stage.key);
              return (
                <div key={stage.key} className="space-y-2">
                  <div className={`flex items-center gap-2 p-2 rounded-xl ${stage.color.split(' ')[0]} bg-opacity-5`}>
                    <div className={`w-8 h-8 rounded-lg ${stage.color.split(' ')[0]} flex items-center justify-center`}>
                      <stage.icon size={16} className={stage.color.split(' ')[1]} />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{stage.label}</span>
                    <span className="ml-auto text-xs font-medium text-gray-400">{items.length}</span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-gray-400 italic pl-4">Aucune candidature</p>
                  ) : (
                    items.map((c) => (
                      <div
                        key={c.id}
                        className={`bg-white border rounded-2xl p-3 sm:p-4 transition-all hover:shadow-sm ml-2 ${
                          stage.color.split(' ')[2]
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-gray-900">{c.candidatNom}</p>
                              <Badge variant={statutVariant[c.statut]}>{c.statut}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Briefcase size={11} /> {c.poste}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1">
                                <Building2 size={11} /> {c.chantier}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5">
                              <span className="flex items-center gap-1">
                                <Phone size={11} /> {c.candidatContact}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={11} /> {c.dateCandidature}
                              </span>
                            </div>
                          </div>

                          {c.statut !== 'Acceptée' && c.statut !== 'Refusée' && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => moveStage(c.id)}
                                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                                title="Étape suivante"
                              >
                                <ChevronRight size={16} className="text-amber-600" />
                              </button>
                              <button
                                onClick={() => reject(c.id)}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                                title="Refuser"
                              >
                                <XCircle size={16} className="text-red-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}

            {/* Refusées */}
            {candidatures.filter(c => c.statut === 'Refusée').length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-red-50 bg-opacity-30">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle size={16} className="text-red-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">Refusées</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-2">
                  {candidatures.filter(c => c.statut === 'Refusée').map(c => (
                    <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 opacity-70">
                      <p className="text-sm font-medium text-gray-700">{c.candidatNom}</p>
                      <p className="text-xs text-gray-400">{c.poste} - {c.chantier}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'onboarding' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <Users size={16} className="text-amber-600" />
              </div>
              Checklist d'intégration
            </h3>
            <span className="text-xs text-gray-400">{onboarding.length} nouveaux</span>
          </div>

          {onboarding.map((o) => {
            const completed = onboardingSteps.filter(s => o[s.key]).length;
            const total = onboardingSteps.length;
            const progress = Math.round((completed / total) * 100);

            return (
              <div key={o.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm text-gray-900">{o.employeeName}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    progress === 100 ? 'bg-emerald-100 text-emerald-700' : 
                    progress >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {completed}/{total}
                  </span>
                </div>

                {/* Barre de progression */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="space-y-1.5">
                  {onboardingSteps.map((step) => {
                    const isDone = o[step.key];
                    return (
                      <button
                        key={step.key}
                        onClick={() => toggleOnboarding(o.id, step.key)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                          isDone ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDone ? 'bg-emerald-100' : 'bg-gray-200'
                        }`}>
                          {isDone ? (
                            <CheckCircle2 size={16} className="text-emerald-600" />
                          ) : (
                            <Circle size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <step.icon size={14} className={isDone ? 'text-emerald-600' : 'text-gray-400'} />
                          <span className={`text-sm font-medium ${isDone ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {step.label}
                          </span>
                        </div>
                        {isDone && <CheckCircle2 size={14} className="text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Ajout */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle candidature" size="md">
        <div className="space-y-4">
          <Input 
            label="Nom du candidat *" 
            value={newCand.candidatNom} 
            onChange={(e) => setNewCand({ ...newCand, candidatNom: e.target.value })}
            placeholder="Ex: Jean Traoré"
          />
          <Input 
            label="Contact" 
            value={newCand.candidatContact} 
            onChange={(e) => setNewCand({ ...newCand, candidatContact: e.target.value })}
            placeholder="Téléphone ou email"
          />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Poste</label>
            <select
              value={newCand.poste}
              onChange={(e) => setNewCand({ ...newCand, poste: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {postes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Chantier</label>
            <select
              value={newCand.chantier}
              onChange={(e) => setNewCand({ ...newCand, chantier: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {chantiers.map(c => <option key={c} value={c}>🏗️ {c}</option>)}
            </select>
          </div>
          <Button onClick={handleAdd} className="w-full" disabled={!newCand.candidatNom}>
            <UserPlus size={16} /> Ajouter la candidature
          </Button>
        </div>
      </Modal>
    </div>
  );
}