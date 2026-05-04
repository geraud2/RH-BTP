import { useState } from 'react';
import { 
  Search, FileText, FilePlus, Eye, Archive, Download, 
  Filter, X, CheckCircle, AlertTriangle, XCircle,
  Upload, Clock, Building2, User
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FileViewer } from '../../components/ui/FileViewer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockData, chantiers } from '../../data/mockDataRH';
import type { Document } from '../../data/mockDataRH';
import { toast } from 'sonner';

const docTypes = [
  'Contrat de travail', 'Avenant', 'Certificat médical', 
  'Habilitation', 'Attestation formation', 'Fiche de poste', 
  'Sanction', 'Bulletin de paie'
];

const docIcons: Record<string, string> = {
  'Contrat de travail': '📝', 'Avenant': '📋', 'Certificat médical': '🏥',
  'Habilitation': '⚡', 'Attestation formation': '🎓', 'Fiche de poste': '📑',
  'Sanction': '⚠️', 'Bulletin de paie': '💰',
};

const statutVariant: Record<string, 'success' | 'warning' | 'danger'> = { 
  'Valide': 'success', 'Expire bientôt': 'warning', 'Expiré': 'danger' 
};

const statutIcon: Record<string, typeof CheckCircle> = {
  'Valide': CheckCircle, 'Expire bientôt': Clock, 'Expiré': XCircle,
};

const statutColor: Record<string, string> = {
  'Valide': 'border-emerald-200 bg-emerald-50/30',
  'Expire bientôt': 'border-amber-200 bg-amber-50/30',
  'Expiré': 'border-red-200 bg-red-50/30',
};

export default function DocumentsContrats() {
  const [documents, setDocuments] = useLocalStorage<Document[]>('rh-documents', mockData.documents);
  const [search, setSearch] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [filtreChantier, setFiltreChantier] = useState('');
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newDoc, setNewDoc] = useState({ 
    employeeName: '', type: docTypes[0], titre: '', 
    dateEmission: '', dateExpiration: '', chantier: chantiers[0] 
  });

  const filtered = documents.filter(d => {
    if (d.archived) return false;
    if (search && !d.titre.toLowerCase().includes(search.toLowerCase()) && !d.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filtreType && d.type !== filtreType) return false;
    if (filtreStatut && d.statut !== filtreStatut) return false;
    if (filtreChantier && d.chantier !== filtreChantier) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newDoc.employeeName) {
      toast.error('Veuillez renseigner le nom de l\'employé');
      return;
    }
    const doc: Document = {
      id: `doc-${Date.now()}`,
      employeeId: '',
      employeeName: newDoc.employeeName,
      type: newDoc.type,
      titre: newDoc.titre || `${newDoc.type} - ${newDoc.employeeName}`,
      dateEmission: newDoc.dateEmission,
      dateExpiration: newDoc.dateExpiration,
      statut: 'Valide',
      chantier: newDoc.chantier,
      archived: false,
    };
    setDocuments([doc, ...documents]);
    setShowAdd(false);
    setNewDoc({ employeeName: '', type: docTypes[0], titre: '', dateEmission: '', dateExpiration: '', chantier: chantiers[0] });
    toast.success('Document ajouté avec succès');
  };

  const handleArchive = (id: string) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, archived: true } : d));
    toast.success('Document archivé');
  };

  const stats = {
    valides: filtered.filter(d => d.statut === 'Valide').length,
    expirant: filtered.filter(d => d.statut === 'Expire bientôt').length,
    expires: filtered.filter(d => d.statut === 'Expiré').length,
    total: filtered.length,
  };

  const hasActiveFilters = filtreType || filtreStatut || filtreChantier;

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto pb-20">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Documents & Contrats</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestion des documents administratifs</p>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-amber-600" />
          <span className="text-sm font-semibold text-gray-700">{stats.total} documents</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white border border-emerald-200 rounded-2xl p-3 text-center">
          <CheckCircle size={18} className="text-emerald-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.valides}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">Valides</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-3 text-center">
          <AlertTriangle size={18} className="text-amber-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.expirant}</p>
          <p className="text-[10px] sm:text-xs text-amber-600 font-medium">Expirent</p>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-3 text-center">
          <XCircle size={18} className="text-red-600 mx-auto mb-1" />
          <p className="text-xl sm:text-2xl font-extrabold text-red-600">{stats.expires}</p>
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">Expirés</p>
        </div>
      </div>

      {/* Recherche + Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un document ou employé..."
            className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg">
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
            hasActiveFilters || showFilters
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          title="Filtres"
        >
          <Filter size={18} />
        </button>
        <Button size="sm" onClick={() => setShowAdd(true)} className="flex-shrink-0">
          <FilePlus size={16} /> <span className="hidden sm:inline ml-1">Ajouter</span>
        </Button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-white border border-gray-100 rounded-2xl animate-fadeIn">
          <select
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[140px]"
          >
            <option value="">Tous types</option>
            {docTypes.map(t => <option key={t} value={t}>{docIcons[t]} {t}</option>)}
          </select>
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[120px]"
          >
            <option value="">Tous statuts</option>
            <option value="Valide">✅ Valide</option>
            <option value="Expire bientôt">⚠️ Expire bientôt</option>
            <option value="Expiré">❌ Expiré</option>
          </select>
          <select
            value={filtreChantier}
            onChange={(e) => setFiltreChantier(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white flex-1 min-w-[140px]"
          >
            <option value="">Tous chantiers</option>
            {chantiers.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {hasActiveFilters && (
            <button
              onClick={() => { setFiltreType(''); setFiltreStatut(''); setFiltreChantier(''); }}
              className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500 font-medium">Aucun document trouvé</p>
            <p className="text-xs text-gray-400 mt-1">Essayez de modifier les filtres</p>
          </div>
        ) : (
          filtered.map((doc) => {
            const StatusIcon = statutIcon[doc.statut];
            return (
              <div
                key={doc.id}
                className={`bg-white border rounded-2xl p-3 sm:p-4 transition-all hover:shadow-sm ${statutColor[doc.statut]}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icône type */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    doc.statut === 'Valide' ? 'bg-emerald-50' :
                    doc.statut === 'Expire bientôt' ? 'bg-amber-50' : 'bg-red-50'
                  }`}>
                    {docIcons[doc.type] || '📄'}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-900 truncate">{doc.titre}</p>
                      <Badge variant={statutVariant[doc.statut]}>
                        <StatusIcon size={10} className="mr-1 inline" />
                        {doc.statut}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User size={11} /> {doc.employeeName}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Building2 size={11} /> {doc.chantier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                      <span>Émis : {doc.dateEmission}</span>
                      {doc.dateExpiration && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className={doc.statut === 'Expiré' ? 'text-red-500 font-medium' : ''}>
                            Expire : {doc.dateExpiration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Consulter"
                    >
                      <Eye size={16} className="text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleArchive(doc.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Archiver"
                    >
                      <Archive size={16} className="text-gray-400 hover:text-amber-600" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Télécharger"
                    >
                      <Download size={16} className="text-gray-400 hover:text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FileViewer Modal */}
      {viewingDoc && <FileViewer filename={viewingDoc.titre} onClose={() => setViewingDoc(null)} />}

      {/* Modal Ajout */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Ajouter un document" size="lg">
        <div className="space-y-4">
          <Input
            label="Nom de l'employé *"
            value={newDoc.employeeName}
            onChange={(e) => setNewDoc({ ...newDoc, employeeName: e.target.value })}
            placeholder="Ex: Jean Traore"
          />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type de document</label>
            <select
              value={newDoc.type}
              onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {docTypes.map(t => (
                <option key={t} value={t}>{docIcons[t]} {t}</option>
              ))}
            </select>
          </div>
          <Input
            label="Titre"
            value={newDoc.titre}
            onChange={(e) => setNewDoc({ ...newDoc, titre: e.target.value })}
            placeholder={`${newDoc.type} - ${newDoc.employeeName}`}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date d'émission"
              type="date"
              value={newDoc.dateEmission}
              onChange={(e) => setNewDoc({ ...newDoc, dateEmission: e.target.value })}
            />
            <Input
              label="Date d'expiration"
              type="date"
              value={newDoc.dateExpiration}
              onChange={(e) => setNewDoc({ ...newDoc, dateExpiration: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Chantier</label>
            <select
              value={newDoc.chantier}
              onChange={(e) => setNewDoc({ ...newDoc, chantier: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              {chantiers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Zone upload simulée */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-amber-400 transition-colors cursor-pointer">
            <Upload size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Déposer un fichier ici</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Word, Image (max 10MB)</p>
          </div>

          <Button onClick={handleAdd} className="w-full" disabled={!newDoc.employeeName}>
            <FilePlus size={16} /> Ajouter le document
          </Button>
        </div>
      </Modal>
    </div>
  );
}