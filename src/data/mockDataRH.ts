// ============================================================
// CONSTANTES
// ============================================================

export const departements = [
  'IT', 'Marketing', 'RH', 'Finance', 'Commercial', 'Design', 'Support'
];

export const postes = [
  'Développeur', 'Designer', 'Commercial', 'Comptable', 'RH', 
  'Chef de projet', 'Assistant', 'Data Analyst'
];

export const typesContrat = ['CDI', 'CDD', 'Stage'];
export const typesConge = ['Congé annuel', 'Permission', 'Maladie', 'Maternité/Paternité', 'Fête religieuse'];
export const typesSanction = ['Avertissement oral', 'Avertissement écrit', 'Mise à pied temporaire', 'Licenciement', 'Blâme'];
export const typesFormation = ['Sécurité', 'Management', 'Développement', 'Langues', 'Bureautique', 'Design'];
export const typesMateriel = ['Informatique', 'Mobilier', 'Téléphonie'];

// ============================================================
// TYPES
// ============================================================

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  poste: string;
  departement: string;
  dateEmbauche: string;
  anciennete: number;
  statut: 'Présent' | 'Absent' | 'Congé';
  telephone: string;
  email: string;
  adresse: string;
  situationFamiliale: string;
  nombreEnfants: number;
  dateNaissance: string;
  lieuNaissance: string;
  numeroSecuriteSociale: string;
  typeContrat: string;
}

export interface Document {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  titre: string;
  dateEmission: string;
  dateExpiration: string;
  statut: 'Valide' | 'Expire bientôt' | 'Expiré';
  departement: string;
  archived: boolean;
}

export interface Candidature {
  id: string;
  poste: string;
  departement: string;
  candidatNom: string;
  candidatContact: string;
  dateCandidature: string;
  statut: 'Reçue' | 'En évaluation' | 'Entretien' | 'Offre envoyée' | 'Acceptée' | 'Refusée';
}

export interface OnboardingItem {
  id: string;
  employeeId: string;
  employeeName: string;
  contratSigne: boolean;
  visiteMedicale: boolean;
  laptopAttribue: boolean;
  formationAccueil: boolean;
  badgeCree: boolean;
}

export interface Conge {
  id: string;
  employeeId: string;
  employeeName: string;
  departement: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En attente' | 'Approuvé' | 'Refusé';
  motifRefus?: string;
}

export interface SoldeConge {
  employeeId: string;
  employeeName: string;
  acquis: number;
  pris: number;
  restants: number;
}

export interface Sanction {
  id: string;
  employeeId: string;
  employeeName: string;
  departement: string;
  dateIncident: string;
  type: string;
  description: string;
  temoins: string;
  decision: string;
  dateApplication: string;
  statut: 'En cours' | 'Appliquée' | 'Contestée';
}

export interface Conflit {
  id: string;
  type: 'personnel' | 'matériel' | 'hiérarchique';
  personnesImpliquees: string;
  description: string;
  resolution: string;
  date: string;
  statut: 'Ouvert' | 'En médiation' | 'Résolu';
}

export interface BulletinPaie {
  id: string;
  employeeId: string;
  employeeName: string;
  departement: string;
  mois: number;
  annee: number;
  salaireBase: number;
  heuresSup: number;
  montantHeuresSup: number;
  primeDeplacement: number;
  primeAnciennete: number;
  primeRendement: number;
  avances: number;
  absencesNonJustifiees: number;
  retenuesDiverses: number;
  cotisationsSociales: number;
}

export interface Formation {
  id: string;
  titre: string;
  type: string;
  duree: string;
  prerequis: string;
  cout: number;
  organisme: string;
  statut: 'Programmé' | 'En cours' | 'Terminé';
  dateDebut: string;
  dateFin: string;
  participants: string[];
  employeeId?: string;
}

export interface FormationEmployee {
  employeeId: string;
  employeeName: string;
  formations: { titre: string; date: string; statut: string; certificat: boolean }[];
  competences: string[];
}

export interface Materiel {
  id: string;
  type: string;
  designation: string;
  employeeId: string;
  employeeName: string;
  dateAttribution: string;
  departement: string;
  etat: 'Bon' | 'À remplacer' | 'Manquant/Perdu' | 'En réparation';
}

// ============================================================
// DONNÉES
// ============================================================

const firstNames = ['Sophie', 'Marc', 'Isabelle', 'Pierre', 'Nathalie', 'Jean', 'Marie', 'Laurent', 'Catherine', 'Thomas', 'Julie', 'Philippe', 'Anne', 'David', 'Emilie', 'Luc', 'Claire', 'Antoine', 'Hélène', 'Nicolas', 'Audrey', 'François', 'Sarah', 'Michel', 'Céline', 'Julien', 'Valérie', 'Éric', 'Béatrice', 'Vincent'];
const lastNames = ['Dubois', 'Martin', 'Bernard', 'Durand', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Garcia', 'Leroy', 'Roux', 'Fournier', 'Girard', 'Bonnet', 'Lambert', 'Dupont', 'Petit', 'Robert', 'Richard', 'Faure', 'Blanc', 'Perrin', 'Morin', 'Denis', 'Mercier', 'André', 'Legrand', 'Gauthier', 'Renaud', 'Brun'];

function generateEmployees(): Employee[] {
  return Array.from({ length: 30 }, (_, i) => {
    const fn = firstNames[i];
    const ln = lastNames[i];
    const poste = postes[i % postes.length];
    const dept = departements[i % departements.length];
    const year = 2018 + Math.floor(i / 5);
    const month = String((i % 12) + 1).padStart(2, '0');
    const day = String((i % 28) + 1).padStart(2, '0');
    const statuts: Employee['statut'][] = ['Présent', 'Présent', 'Présent', 'Absent', 'Congé'];
    return {
      id: `emp-${i + 1}`,
      firstName: fn,
      lastName: ln,
      photo: '',
      poste,
      departement: dept,
      dateEmbauche: `${year}-${month}-${day}`,
      anciennete: 2026 - year,
      statut: statuts[i % statuts.length],
      telephone: `+33 6 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@entreprise.fr`,
      adresse: `${i + 1} rue de la Paix, Paris`,
      situationFamiliale: ['Célibataire', 'Marié(e)', 'Marié(e)', 'Célibataire', 'Marié(e)'][i % 5],
      nombreEnfants: i % 4,
      dateNaissance: `${1985 + (i % 15)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lieuNaissance: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'][i % 5],
      numeroSecuriteSociale: `SS-${String(1000 + i).padStart(5, '0')}`,
      typeContrat: typesContrat[i % 3],
    };
  });
}

function generateDocuments(employees: Employee[]): Document[] {
  const docTypes = ['Contrat de travail', 'Avenant', 'Certificat médical', 'Attestation formation', 'Fiche de poste', 'Sanction', 'Bulletin de paie'];
  const docs: Document[] = [];
  let id = 1;
  employees.forEach((emp) => {
    const numDocs = 2 + (id % 3);
    for (let j = 0; j < numDocs; j++) {
      const type = docTypes[(id - 1) % docTypes.length];
      const yearEmit = 2024 + (j % 2);
      const monthEmit = String(((id * 3) % 12) + 1).padStart(2, '0');
      const dayEmit = String(((id * 7) % 28) + 1).padStart(2, '0');
      const expMonth = String(((id * 3 + 6) % 12) + 1).padStart(2, '0');
      const expYear = yearEmit + (expMonth < monthEmit ? 1 : 0);
      const dateExpiration = type === 'Contrat de travail' ? '2027-12-31' : `${expYear}-${expMonth}-${dayEmit}`;
      const diff = (new Date(dateExpiration).getTime() - Date.now()) / 86400000;
      let statut: Document['statut'] = 'Valide';
      if (diff < 0) statut = 'Expiré';
      else if (diff < 30) statut = 'Expire bientôt';
      docs.push({
        id: `doc-${id++}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        type,
        titre: `${type} - ${emp.firstName} ${emp.lastName}`,
        dateEmission: `${yearEmit}-${monthEmit}-${dayEmit}`,
        dateExpiration,
        statut,
        departement: emp.departement,
        archived: false,
      });
    }
  });
  return docs;
}

function generateCandidatures(): Candidature[] {
  const candidats = ['Paul Martin', 'Marie Blanc', 'Jean Perrin', 'Fatou Diallo', 'Ibrahim Touré', 'Awa Ndiaye', 'Moussa Sow', 'Rokia Keita'];
  const statuts: Candidature['statut'][] = ['Reçue', 'En évaluation', 'Entretien', 'Offre envoyée', 'Acceptée', 'Refusée'];
  return candidats.map((c, i) => ({
    id: `cand-${i + 1}`,
    poste: postes[(i * 3) % postes.length],
    departement: departements[i % departements.length],
    candidatNom: c,
    candidatContact: `+33 6 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    dateCandidature: `2026-0${(i % 3) + 1}-${String((i * 5 % 28) + 1).padStart(2, '0')}`,
    statut: statuts[i % statuts.length],
  }));
}

function generateOnboarding(): OnboardingItem[] {
  return [
    { id: 'onb-1', employeeId: 'emp-29', employeeName: 'Béatrice Renaud', contratSigne: true, visiteMedicale: true, laptopAttribue: false, formationAccueil: false, badgeCree: false },
    { id: 'onb-2', employeeId: 'emp-30', employeeName: 'Vincent Brun', contratSigne: true, visiteMedicale: false, laptopAttribue: false, formationAccueil: false, badgeCree: false },
  ];
}

function generateConges(employees: Employee[]): Conge[] {
  const onLeave = employees.filter(e => e.statut === 'Congé');
  const pending = employees.filter(e => e.statut === 'Présent').slice(0, 3);
  return [
    ...onLeave.map((emp, i) => ({
      id: `cong-${i + 1}`, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`,
      departement: emp.departement, type: typesConge[i % typesConge.length],
      dateDebut: '2026-04-28', dateFin: '2026-05-10', statut: 'Approuvé' as const,
    })),
    ...pending.map((emp, i) => ({
      id: `cong-${onLeave.length + i + 1}`, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`,
      departement: emp.departement, type: typesConge[(i + 2) % typesConge.length],
      dateDebut: '2026-05-15', dateFin: '2026-05-20', statut: 'En attente' as const,
    })),
  ];
}

function generateSoldes(employees: Employee[]): SoldeConge[] {
  return employees.map((emp, i) => {
    const acquis = 25 + Math.floor(i / 5);
    const pris = 5 + (i % 10);
    return { employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`, acquis, pris, restants: acquis - pris };
  });
}

function generateSanctions(employees: Employee[]): Sanction[] {
  return [
    { id: 'san-1', employeeId: 'emp-5', employeeName: `${employees[4].firstName} ${employees[4].lastName}`, departement: employees[4].departement, dateIncident: '2026-03-15', type: 'Avertissement oral', description: 'Retards répétés au bureau', temoins: 'Chef de projet', decision: 'Avertissement verbal', dateApplication: '2026-03-16', statut: 'Appliquée' },
    { id: 'san-2', employeeId: 'emp-12', employeeName: `${employees[11].firstName} ${employees[11].lastName}`, departement: employees[11].departement, dateIncident: '2026-04-01', type: 'Avertissement écrit', description: 'Non-respect des procédures', temoins: 'Manager', decision: 'Avertissement écrit', dateApplication: '2026-04-03', statut: 'En cours' },
    { id: 'san-3', employeeId: 'emp-20', employeeName: `${employees[19].firstName} ${employees[19].lastName}`, departement: employees[19].departement, dateIncident: '2026-04-10', type: 'Mise à pied temporaire', description: 'Altercation avec un collègue', temoins: '3 témoins', decision: 'Mise à pied 3 jours', dateApplication: '2026-04-12', statut: 'Contestée' },
  ];
}

function generateConflits(): Conflit[] {
  return [
    { id: 'conf-1', type: 'personnel', personnesImpliquees: 'Sophie Dubois / Marc Martin', description: "Désaccord sur l'organisation du projet", resolution: 'Médiation en cours', date: '2026-04-15', statut: 'En médiation' },
    { id: 'conf-2', type: 'matériel', personnesImpliquees: 'Pierre Durand / Isabelle Bernard', description: "Litige sur l'attribution d'un bureau", resolution: 'Bureau réattribué', date: '2026-03-20', statut: 'Résolu' },
  ];
}

function generateBulletins(employees: Employee[]): BulletinPaie[] {
  return employees.map((emp, i) => {
    const salaireBase = 2500 + (postes.indexOf(emp.poste) * 300) + (emp.anciennete * 50);
    return {
      id: `bul-${i + 1}`, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`,
      departement: emp.departement, mois: 4, annee: 2026, salaireBase,
      heuresSup: i % 5, montantHeuresSup: (i % 5) * 25,
      primeDeplacement: 100, primeAnciennete: emp.anciennete * 20,
      primeRendement: (i % 3 === 0) ? 200 : 100,
      avances: (i % 4 === 0) ? 300 : 0, absencesNonJustifiees: 0, retenuesDiverses: 0,
      cotisationsSociales: Math.round(salaireBase * 0.22),
    };
  });
}

function generateFormations(): Formation[] {
  return [
    { id: 'form-1', titre: 'Sécurité au travail', type: 'Sécurité', duree: '1 jour', prerequis: 'Aucun', cout: 500, organisme: 'APAVE', statut: 'Programmé', dateDebut: '2026-05-20', dateFin: '2026-05-20', participants: ['emp-1', 'emp-5', 'emp-10'] },
    { id: 'form-2', titre: "Management d'équipe", type: 'Management', duree: '3 jours', prerequis: 'Manager', cout: 1500, organisme: 'CEGOS', statut: 'En cours', dateDebut: '2026-05-01', dateFin: '2026-05-03', participants: ['emp-3', 'emp-7'] },
    { id: 'form-3', titre: 'Développement React', type: 'Développement', duree: '5 jours', prerequis: 'JavaScript', cout: 2500, organisme: 'Udemy', statut: 'Terminé', dateDebut: '2026-03-10', dateFin: '2026-03-14', participants: ['emp-2', 'emp-8'] },
    { id: 'form-4', titre: 'Excel avancé', type: 'Bureautique', duree: '2 jours', prerequis: 'Aucun', cout: 600, organisme: 'Bureau Formation', statut: 'Programmé', dateDebut: '2026-06-01', dateFin: '2026-06-02', participants: ['emp-4', 'emp-9'] },
    { id: 'form-5', titre: 'Anglais professionnel', type: 'Langues', duree: '10 jours', prerequis: 'Aucun', cout: 1200, organisme: 'Wall Street English', statut: 'Terminé', dateDebut: '2026-02-15', dateFin: '2026-02-25', participants: ['emp-1', 'emp-6'] },
  ];
}

function generateFormationEmployees(employees: Employee[]): FormationEmployee[] {
  return employees.slice(0, 15).map((emp, i) => ({
    employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`,
    formations: [
      { titre: 'Sécurité au travail', date: '2026-01-15', statut: 'Terminé', certificat: true },
      ...(i % 3 === 0 ? [{ titre: 'Développement React', date: '2026-03-01', statut: 'Terminé', certificat: true }] : []),
    ],
    competences: [emp.poste, ...(i % 2 === 0 ? ['Sécurité'] : []), ...(i % 3 === 0 ? ['React'] : [])],
  }));
}

function generateMateriels(employees: Employee[]): Materiel[] {
  const items: Materiel[] = [];
  let id = 1;
  ['MacBook Pro', 'Dell XPS', 'ThinkPad', 'HP EliteBook'].forEach((item, i) => {
    const emp = employees[i * 3];
    items.push({ id: `mat-${id++}`, type: 'Informatique', designation: item, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`, dateAttribution: '2026-01-15', departement: emp.departement, etat: i === 2 ? 'À remplacer' : 'Bon' });
  });
  ['iPhone 14', 'Samsung S23', 'Google Pixel'].forEach((item, i) => {
    const emp = employees[(i * 4) + 1];
    items.push({ id: `mat-${id++}`, type: 'Téléphonie', designation: item, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`, dateAttribution: '2026-02-01', departement: emp.departement, etat: 'Bon' });
  });
  ['Écran 27"', 'Écran 24"'].forEach((item, i) => {
    const emp = employees[(i * 6) + 2];
    items.push({ id: `mat-${id++}`, type: 'Informatique', designation: item, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`, dateAttribution: '2025-11-01', departement: emp.departement, etat: 'Bon' });
  });
  return items;
}

// ============================================================
// EXPORTS
// ============================================================

const employees = generateEmployees();

export const mockData = {
  employees,
  documents: generateDocuments(employees),
  candidatures: generateCandidatures(),
  onboarding: generateOnboarding(),
  conges: generateConges(employees),
  soldes: generateSoldes(employees),
  sanctions: generateSanctions(employees),
  conflits: generateConflits(),
  bulletins: generateBulletins(employees),
  formations: generateFormations(),
  formationEmployees: generateFormationEmployees(employees),
  materiels: generateMateriels(employees),
};

export function getNetPaie(b: BulletinPaie): number {
  const gains = b.salaireBase + b.montantHeuresSup + b.primeDeplacement + b.primeAnciennete + b.primeRendement;
  const retenues = b.avances + b.absencesNonJustifiees + b.retenuesDiverses + b.cotisationsSociales;
  return gains - retenues;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
}