import { useState } from 'react';
import { 
  Award, Calendar, Plus, GraduationCap, Users, 
  Clock, TrendingUp, Target, BookOpen, Briefcase,
  BadgeCheck, Star, ChevronRight, Filter, X,
  DollarSign, Building2, Search,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, typesFormation } from '../../data/mockDataRH';
import type { Formation, FormationEmployee } from '../../data/mockDataRH';
import { toast } from 'sonner';

const statutVariant: Record<string, 'info' | 'warning' | 'success'> = { 
  'Programmé': 'info', 'En cours': 'warning', 'Terminé': 'success' 
};

const statutIcon: Record<string, typeof Clock> = {
  'Programmé': Calendar, 'En cours': Clock, 'Terminé': CheckCircle2,
};

const typeIcons: Record<string, string> = {
  'Sécurité chantier': '🦺', 'CACES': '🏗️', 'Échafaudage': '🚧',
  'Habilitation électrique': '⚡', 'Secourisme': '🩹', 'Lecture de plans': '📐',
  'Techniques métier': '🔧',
};

export default function FormationsCompetences() {
  const [formations, setFormations] = useLocalStorage<Formation[]>('rh-formations', mockData.formations);
  const [formationEmployees] = useLocalStorage<FormationEmployee[]>('rh-formation-employees', mockData.formationEmployees);
  const [tab, setTab] = useState<'catalogue' | 'suivi' | 'planification'>('catalogue');
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [newForm, setNewForm] = useState({ 
    titre: '', type: typesFormation[0], duree: '', prerequis: '', 
    cout: 0, organisme: '', dateDebut: '', dateFin: '' 
  });

  const handleAdd = () => {
    if (!newForm.titre) {
      toast.error('Veuillez renseigner le titre de la formation');
      return;
    }
    const form: Formation = {
      id: `form-${Date.now()}`,
      titre: newForm.titre,
      type: newForm.type,
      duree: newForm.duree,
      prerequis: newForm.prerequis,
      cout: newForm.cout,
      organisme: newForm.organisme,
      statut: 'Programmé',
      dateDebut: newForm.dateDebut,
      dateFin: newForm.dateFin,
      participants: [],
      employeeId: ''
    };
    setFormations([form, ...formations]);
    setShowAdd(false);
    setNewForm({ titre: '', type: typesFormation[0], duree: '', prerequis: '', cout: 0, organisme: '', dateDebut: '', dateFin: '' });
    toast.success('Formation ajoutée');
  };

  const filtered = formations.filter(f => {
    const matchSearch = !searchTerm || f.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = !filtreStatut || f.statut === filtreStatut;
    return matchSearch && matchStatut;
  });

  const stats = {
    total: formations.length,
    programmes: formations.filter(f => f.statut === 'Programmé').length,
    enCours: formations.filter(f => f.statut === 'En cours').length,
    termines: formations.filter(f => f.statut === 'Terminé').length,
    tauxCompletion: formations.length > 0 ? Math.round((formations.filter(f => f.statut === 'Terminé').length / formations.length) * 100) : 0,
  };

  const tabs = [
    { key: 'catalogue' as const, label: 'Catalogue', icon: BookOpen },
    { key: 'suivi' as const, label: 'Suivi', icon: Users },
    { key: 'planification' as const, label: 'Planning', icon: Calendar },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Formations & Compétences</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestion des formations du personnel chantier</p>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-amber-600" />
          <span className="text-sm font-semibold text-gray-700">{stats.total} formations</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mb-2">
            <BookOpen size={18} className="text-violet-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-gray-900">{stats.total}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-2xl p-3 sm:p-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
            <Calendar size={18} className="text-blue-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-blue-600">{stats.programmes}</p>
          <p className="text-[10px] sm:text-xs text-blue-600 font-medium">Programmées</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-3 sm:p-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-2">
            <Clock size={18} className="text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-amber-600">{stats.enCours}</p>
          <p className="text-[10px] sm:text-xs text-amber-600 font-medium">En cours</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-2xl p-3 sm:p-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-2">
            <BadgeCheck size={18} className="text-emerald-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-600">{stats.termines}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Terminées</p>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Taux de complétion</span>
          <span className="text-sm font-bold text-amber-600">{stats.tauxCompletion}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${stats.tauxCompletion}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Catalogue */}
      {tab === 'catalogue' && (
        <>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une formation..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white"
            >
              <option value="">Tous statuts</option>
              <option value="Programmé">Programmé</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
            <Button size="sm" onClick={() => setShowAdd(true)} className="flex-shrink-0">
              <Plus size={16} /> <span className="hidden sm:inline ml-1">Formation</span>
            </Button>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">Aucune formation trouvée</p>
              </div>
            ) : (
              filtered.map((f) => {
                const StatusIcon = statutIcon[f.statut];
                return (
                  <div key={f.id} className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-sm ${
                    f.statut === 'Terminé' ? 'border-emerald-200' :
                    f.statut === 'En cours' ? 'border-amber-200' : 'border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                          f.statut === 'Terminé' ? 'bg-emerald-50' :
                          f.statut === 'En cours' ? 'bg-amber-50' : 'bg-blue-50'
                        }`}>
                          {typeIcons[f.type] || '📚'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{f.titre}</p>
                          <p className="text-xs text-gray-500">{f.type} • {f.duree}</p>
                        </div>
                      </div>
                      <Badge variant={statutVariant[f.statut]}>
                        <StatusIcon size={10} className="mr-1 inline" />
                        {f.statut}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-gray-500">Organisme</p>
                        <p className="text-xs font-semibold text-gray-900">{f.organisme}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-gray-500">Coût</p>
                        <p className="text-xs font-semibold text-amber-600">{new Intl.NumberFormat('fr-FR').format(f.cout)} F</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-gray-500">Participants</p>
                        <p className="text-xs font-semibold text-violet-600">{f.participants.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-gray-500">Prérequis</p>
                        <p className="text-xs font-semibold text-gray-900">{f.prerequis || 'Aucun'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Calendar size={12} />
                      {f.dateDebut} → {f.dateFin}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Suivi employés */}
      {tab === 'suivi' && (
        <div className="space-y-3">
          {formationEmployees.map((fe) => {
            const completed = fe.formations.filter(f => f.statut === 'Terminé').length;
            const total = fe.formations.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div key={fe.employeeId} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm text-gray-900">{fe.employeeName}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    progress === 100 ? 'bg-emerald-100 text-emerald-700' : 
                    progress >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {completed}/{total} terminées
                  </span>
                </div>

                {/* Barre progression */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Liste formations */}
                <div className="space-y-1.5 mb-3">
                  {fe.formations.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        {f.certificat && <Award size={14} className="text-amber-500" />}
                        <span className="text-xs text-gray-700">{f.titre}</span>
                      </div>
                      <Badge variant={f.statut === 'Terminé' ? 'success' : 'warning'}>
                        {f.statut}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Compétences */}
                {fe.competences.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {fe.competences.map((c, i) => (
                      <span key={i} className="text-[10px] font-medium px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 flex items-center gap-1">
                        <Star size={10} /> {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Planification */}
      {tab === 'planification' && (
        <div className="space-y-3">
          {formations.filter(f => f.statut !== 'Terminé').map((f) => {
            const progress = f.statut === 'En cours' ? 50 : 0;
            return (
              <div key={f.id} className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-sm ${
                f.statut === 'En cours' ? 'border-amber-200' : 'border-blue-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{f.titre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.type} • {f.duree}</p>
                  </div>
                  <Badge variant={statutVariant[f.statut]}>{f.statut}</Badge>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">Progression</span>
                    <span className="text-xs font-bold text-amber-600">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <Calendar size={14} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-gray-600">{f.dateDebut}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <Users size={14} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-gray-600">{f.participants.length} inscrits</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <Building2 size={14} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-gray-600">{f.organisme}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {formations.filter(f => f.statut !== 'Terminé').length === 0 && (
            <div className="text-center py-12">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 font-medium">Aucune formation planifiée</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Ajout */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle formation" size="lg">
        <div className="space-y-4">
          <Input 
            label="Titre de la formation *" 
            value={newForm.titre} 
            onChange={(e) => setNewForm({ ...newForm, titre: e.target.value })}
            placeholder="Ex: Sécurité chantier niveau 2"
          />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type de formation</label>
            <select
              value={newForm.type}
              onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {typesFormation.map(t => (
                <option key={t} value={t}>{typeIcons[t]} {t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Durée" value={newForm.duree} onChange={(e) => setNewForm({ ...newForm, duree: e.target.value })} placeholder="ex: 2 jours" />
            <Input label="Coût (FCFA)" type="number" value={String(newForm.cout)} onChange={(e) => setNewForm({ ...newForm, cout: Number(e.target.value) })} />
          </div>
          <Input label="Prérequis" value={newForm.prerequis} onChange={(e) => setNewForm({ ...newForm, prerequis: e.target.value })} placeholder="Aucun" />
          <Input label="Organisme" value={newForm.organisme} onChange={(e) => setNewForm({ ...newForm, organisme: e.target.value })} placeholder="Nom de l'organisme" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date début" type="date" value={newForm.dateDebut} onChange={(e) => setNewForm({ ...newForm, dateDebut: e.target.value })} />
            <Input label="Date fin" type="date" value={newForm.dateFin} onChange={(e) => setNewForm({ ...newForm, dateFin: e.target.value })} />
          </div>
          <Button onClick={handleAdd} className="w-full" disabled={!newForm.titre}>
            <Plus size={16} /> Ajouter la formation
          </Button>
        </div>
      </Modal>
    </div>
  );
}