export const chantiers = [
  'Immeuble R+3 Cotonou',
  'Route Parakou',
  'École Porto-Novo',
  'Marché Abomey',
  'Pont Natitingou',
];

export const departements = [
  'Maçonnerie', 'Coffrage', 'Ferraillage',
  'Transport', 'Topographie', 'Sécurité', 'Laboratoire',
];

export const postes = [
  'Chef de chantier', 'Conducteur de travaux', 'Chef équipe',
  'Maçon', 'Coffreur', 'Ferailleur', 'Chauffeur',
  'Topographe', 'Agent sécurité', 'Laborantin',
];

export const typesContrat = ['CDI', 'CDD', 'Journalier'];
export const typesConge = ['Congé annuel', 'Permission', 'Maladie', 'Accident de travail', 'Maternité/Paternité', 'Fête religieuse'];
export const typesSanction = ['Avertissement oral', 'Avertissement écrit', 'Mise à pied temporaire', 'Licenciement', 'Blâme'];
export const typesFormation = ['Sécurité chantier', 'CACES (engins)', 'Habilitation électrique', 'Échafaudage', 'Secourisme', 'Lecture de plans', 'Techniques métier'];
export const typesMateriel = ['EPI', 'Outillage', 'Véhicule', 'Équipement'];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  poste: string;
  departement: string;
  chantier: string;
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
  chantier: string;
  archived: boolean;
}

export interface Candidature {
  candidat: ReactNode;
  id: string;
  poste: string;
  chantier: string;
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
  epiAttribue: boolean;
  formationSecurite: boolean;
  badgeChantier: boolean;
}

export interface Conge {
  id: string;
  employeeId: string;
  employeeName: string;
  chantier: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En attente' | 'Approuvé' | 'Refusé';
  motifRefus?: string;
  commentaire?: string;
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
  chantier: string;
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
  chantier: string;
  mois: number;
  annee: number;
  salaireBase: number;
  heuresSup: number;
  montantHeuresSup: number;
  primeDeplacement: number;
  primeRisque: number;
  primeAnciennete: number;
  primeRendement: number;
  avances: number;
  absencesNonJustifiees: number;
  retenuesDiverses: number;
  cotisationsSociales: number;
}

export interface Formation {
  employeeId: string;
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
  chantier: string;
  etat: 'Bon' | 'À remplacer' | 'Manquant/Perdu' | 'En réparation';
}

const firstNames = ['Koffi', 'Adama', 'Issa', 'Rachid', 'Seydou', 'Moussa', 'Abdou', 'Ousmane', 'Ibrahim', 'Yacoubou', 'Aminata', 'Fatou', 'Mariam', 'Awa', 'Kadiatou', 'Rokia', 'Bintou', 'Aissatou', 'Djenaba', 'Hawa', 'Cisse', 'Ballo', 'Diallo', 'Keita', 'Traore', 'Coulibaly', 'Sissoko', 'Sangare', 'Toure', 'Konate'];
const lastNames = ['Adambi', 'Agossou', 'Ahouangan', 'Akakpo', 'Assogba', 'Attakpa', 'Azon', 'Dagba', 'Dossou', 'Gandonou', 'Houenou', 'Kinde', 'Kpakpo', 'Lokonon', 'Miguel', 'N\'Dah', 'Ogou', 'Ouro', 'Saka', 'Sossou', 'Vignikin', 'Yehouessi', 'Zannou', 'Ahotin', 'Boko', 'Djossou', 'Gbenou', 'Houin', 'Kpetehoua', 'Lokossou'];

function generateEmployees(): Employee[] {
  return Array.from({ length: 30 }, (_, i) => {
    const fn = firstNames[i];
    const ln = lastNames[i];
    const poste = postes[i % postes.length];
    const dept = departements[i % departements.length];
    const chantier = chantiers[i % chantiers.length];
    const year = 2015 + Math.floor(i / 4);
    const month = String((i % 12) + 1).padStart(2, '0');
    const day = String((i % 28) + 1).padStart(2, '0');
    const dateEmbauche = `${year}-${month}-${day}`;
    const anciennete = 2026 - year;
    const statuts: Employee['statut'][] = ['Présent', 'Présent', 'Présent', 'Absent', 'Congé'];
    return {
      id: `emp-${i + 1}`,
      firstName: fn,
      lastName: ln,
      photo: `https://images.pexels.com/photos/${1000000 + i * 7}/pexels-photo-${1000000 + i * 7}.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1`,
      poste,
      departement: dept,
      chantier,
      dateEmbauche,
      anciennete,
      statut: statuts[i % statuts.length],
      telephone: `+229 9${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase().replace("'", "")}@btp-benin.com`,
      adresse: `Quartier ${['Akpakpa', 'Ganhi', 'Cadjèhoun', 'Fidjrossè', 'Godomey'][i % 5]}, Cotonou`,
      situationFamiliale: ['Célibataire', 'Marié(e)', 'Marié(e)', 'Célibataire', 'Marié(e)'][i % 5],
      nombreEnfants: i % 4,
      dateNaissance: `${1980 + (i % 20)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lieuNaissance: ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey', 'Natitingou'][i % 5],
      numeroSecuriteSociale: `BN-${String(1000 + i).padStart(5, '0')}`,
      typeContrat: typesContrat[i % 3],
    };
  });
}

function generateDocuments(employees: Employee[]): Document[] {
  const docTypes = ['Contrat de travail', 'Avenant', 'Certificat médical', 'Habilitation', 'Attestation formation', 'Fiche de poste', 'Sanction', 'Bulletin de paie'];
  const docs: Document[] = [];
  let id = 1;
  employees.forEach((emp) => {
    const numDocs = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < numDocs; j++) {
      const type = docTypes[(id - 1) % docTypes.length];
      const yearEmit = 2024 + (j % 2);
      const monthEmit = String(((id * 3) % 12) + 1).padStart(2, '0');
      const dayEmit = String(((id * 7) % 28) + 1).padStart(2, '0');
      const expMonth = String(((id * 3 + 6) % 12) + 1).padStart(2, '0');
      const expYear = yearEmit + (expMonth < monthEmit ? 1 : 0);
      const dateEmission = `${yearEmit}-${monthEmit}-${dayEmit}`;
      const dateExpiration = type === 'Contrat de travail' ? '2027-12-31' : `${expYear}-${expMonth}-${dayEmit}`;
      const now = new Date();
      const exp = new Date(dateExpiration);
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      let statut: Document['statut'] = 'Valide';
      if (diff < 0) statut = 'Expiré';
      else if (diff < 30) statut = 'Expire bientôt';
      docs.push({
        id: `doc-${id}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        type,
        titre: `${type} - ${emp.firstName} ${emp.lastName}`,
        dateEmission,
        dateExpiration,
        statut,
        chantier: emp.chantier,
        archived: false,
      });
      id++;
    }
  });
  return docs;
}

function generateCandidatures(): Candidature[] {
  const candidats = ['Paul Akakpo', 'Marie Dossou', 'Jean Kinde', 'Fatou Saka', 'Ibrahim Toure', 'Awa N\'Dah', 'Moussa Diallo', 'Rokia Gbenou'];
  const statuts: Candidature['statut'][] = ['Reçue', 'En évaluation', 'Entretien', 'Offre envoyée', 'Acceptée', 'Refusée'];
  return candidats.map((c, i) => ({
    id: `cand-${i + 1}`,
    poste: postes[(i * 3) % postes.length],
    chantier: chantiers[i % chantiers.length],
    candidatNom: c,
    candidatContact: `+229 9${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    dateCandidature: `2026-0${String((i % 3) + 1)}-${String((i * 5 % 28) + 1).padStart(2, '0')}`,
    statut: statuts[i % statuts.length],
  }));
}

function generateOnboarding(): OnboardingItem[] {
  return [
    { id: 'onb-1', employeeId: 'emp-29', employeeName: 'Ballo N\'Dah', contratSigne: true, visiteMedicale: true, epiAttribue: false, formationSecurite: false, badgeChantier: false },
    { id: 'onb-2', employeeId: 'emp-30', employeeName: 'Diallo Lokossou', contratSigne: true, visiteMedicale: false, epiAttribue: false, formationSecurite: false, badgeChantier: false },
  ];
}

function generateConges(employees: Employee[]): Conge[] {
  const conges: Conge[] = [];
  const onLeave = employees.filter(e => e.statut === 'Congé');
  onLeave.forEach((emp, i) => {
    conges.push({
      id: `cong-${i + 1}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      chantier: emp.chantier,
      type: typesConge[i % typesConge.length],
      dateDebut: '2026-04-28',
      dateFin: '2026-05-10',
      statut: 'Approuvé',
    });
  });
  const pending = employees.filter(e => e.statut === 'Présent').slice(0, 3);
  pending.forEach((emp, i) => {
    conges.push({
      id: `cong-${onLeave.length + i + 1}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      chantier: emp.chantier,
      type: typesConge[(i + 2) % typesConge.length],
      dateDebut: '2026-05-15',
      dateFin: '2026-05-20',
      statut: 'En attente',
    });
  });
  return conges;
}

function generateSoldes(employees: Employee[]): SoldeConge[] {
  return employees.map((emp, i) => ({
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    acquis: 24 + Math.floor(i / 5),
    pris: 5 + (i % 10),
    restants: 19 + Math.floor(i / 5) - (5 + (i % 10)),
  }));
}

function generateSanctions(employees: Employee[]): Sanction[] {
  return [
    { id: 'san-1', employeeId: 'emp-5', employeeName: `${employees[4].firstName} ${employees[4].lastName}`, chantier: employees[4].chantier, dateIncident: '2026-03-15', type: 'Avertissement oral', description: 'Retard répété sur le chantier', temoins: 'Chef équipe Koffi', decision: 'Avertissement verbal notifié', dateApplication: '2026-03-16', statut: 'Appliquée' },
    { id: 'san-2', employeeId: 'emp-12', employeeName: `${employees[11].firstName} ${employees[11].lastName}`, chantier: employees[11].chantier, dateIncident: '2026-04-01', type: 'Avertissement écrit', description: 'Non-respect des consignes de sécurité', temoins: 'Agent sécurité, Chef chantier', decision: 'Avertissement écrit avec mise en demeure', dateApplication: '2026-04-03', statut: 'En cours' },
    { id: 'san-3', employeeId: 'emp-20', employeeName: `${employees[19].firstName} ${employees[19].lastName}`, chantier: employees[19].chantier, dateIncident: '2026-04-10', type: 'Mise à pied temporaire', description: 'Altercation avec un collègue sur le chantier', temoins: '3 membres équipe', decision: 'Mise à pied 3 jours', dateApplication: '2026-04-12', statut: 'Contestée' },
  ];
}

function generateConflits(): Conflit[] {
  return [
    { id: 'conf-1', type: 'personnel', personnesImpliquees: 'Koffi Adambi / Adama Agossou', description: 'Dispute sur l\'organisation du travail', resolution: 'Médiation en cours', date: '2026-04-15', statut: 'En médiation' },
    { id: 'conf-2', type: 'matériel', personnesImpliquees: 'Issa Ahouangan / Moussa Dossou', description: 'Litige sur l\'attribution d\'un véhicule', resolution: 'Réaffectation du véhicule', date: '2026-03-20', statut: 'Résolu' },
  ];
}

function generateBulletins(employees: Employee[]): BulletinPaie[] {
  return employees.map((emp, i) => {
    const salaireBase = 80000 + (postes.indexOf(emp.poste) * 15000) + (emp.anciennete * 5000);
    const heuresSup = i % 5;
    const montantHeuresSup = heuresSup * 2500;
    const primeDeplacement = emp.chantier !== 'Immeuble R+3 Cotonou' ? 15000 : 5000;
    const primeRisque = ['Maçonnerie', 'Coffrage', 'Ferraillage'].includes(emp.departement) ? 10000 : 5000;
    const primeAnciennete = emp.anciennete * 2000;
    const primeRendement = (i % 3 === 0) ? 10000 : 5000;
    const avances = (i % 4 === 0) ? 20000 : 0;
    const absencesNonJustifiees = 0;
    const retenuesDiverses = 0;
    const cotisationsSociales = Math.round(salaireBase * 0.04);
    return {
      id: `bul-${i + 1}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      chantier: emp.chantier,
      mois: 4,
      annee: 2026,
      salaireBase,
      heuresSup,
      montantHeuresSup,
      primeDeplacement,
      primeRisque,
      primeAnciennete,
      primeRendement,
      avances,
      absencesNonJustifiees,
      retenuesDiverses,
      cotisationsSociales,
    };
  });
}

function generateFormations(): Formation[] {
  return [
    { id: 'form-1', titre: 'Sécurité chantier Niveau 1', type: 'Sécurité chantier', duree: '2 jours', prerequis: 'Aucun', cout: 50000, organisme: 'INPB', statut: 'Programmé', dateDebut: '2026-05-20', dateFin: '2026-05-21', participants: ['emp-1', 'emp-5', 'emp-10'] },
    { id: 'form-2', titre: 'CACES R372 - Engins de chantier', type: 'CACES (engins)', duree: '5 jours', prerequis: 'Expérience conduite', cout: 150000, organisme: 'CACES Bénin', statut: 'En cours', dateDebut: '2026-05-01', dateFin: '2026-05-05', participants: ['emp-3', 'emp-7'] },
    { id: 'form-3', titre: 'Habilitation électrique B1V', type: 'Habilitation électrique', duree: '3 jours', prerequis: 'Connaissances de base électricité', cout: 80000, organisme: 'APAVE', statut: 'Terminé', dateDebut: '2026-03-10', dateFin: '2026-03-12', participants: ['emp-2', 'emp-8', 'emp-15'] },
    { id: 'form-4', titre: 'Montage échafaudage', type: 'Échafaudage', duree: '2 jours', prerequis: 'Aucun', cout: 60000, organisme: 'BTP Formation', statut: 'Programmé', dateDebut: '2026-06-01', dateFin: '2026-06-02', participants: ['emp-4', 'emp-9', 'emp-11'] },
    { id: 'form-5', titre: 'Secourisme du travail', type: 'Secourisme', duree: '2 jours', prerequis: 'Aucun', cout: 45000, organisme: 'Croix-Rouge Bénin', statut: 'Terminé', dateDebut: '2026-02-15', dateFin: '2026-02-16', participants: ['emp-1', 'emp-6', 'emp-12', 'emp-20'] },
    { id: 'form-6', titre: 'Lecture de plans BTP', type: 'Lecture de plans', duree: '3 jours', prerequis: 'Savoir lire et écrire', cout: 70000, organisme: 'INPB', statut: 'Programmé', dateDebut: '2026-06-15', dateFin: '2026-06-17', participants: ['emp-2', 'emp-5'] },
    { id: 'form-7', titre: 'Techniques de coffrage avancées', type: 'Techniques métier', duree: '4 jours', prerequis: 'Expérience coffrage', cout: 90000, organisme: 'BTP Formation', statut: 'En cours', dateDebut: '2026-04-28', dateFin: '2026-05-01', participants: ['emp-4', 'emp-11', 'emp-16'] },
  ];
}

function generateFormationEmployees(employees: Employee[]): FormationEmployee[] {
  return employees.slice(0, 15).map((emp, i) => ({
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    formations: [
      { titre: 'Sécurité chantier', date: '2026-01-15', statut: 'Terminé', certificat: true },
      ...(i % 3 === 0 ? [{ titre: 'CACES R372', date: '2026-03-01', statut: 'Terminé', certificat: true }] : []),
      ...(i % 5 === 0 ? [{ titre: 'Habilitation électrique', date: '2026-03-10', statut: 'Terminé', certificat: true }] : []),
    ],
    competences: [emp.poste, ...(i % 2 === 0 ? ['Sécurité chantier'] : []), ...(i % 3 === 0 ? ['Conduite engins'] : [])],
  }));
}

function generateMateriels(employees: Employee[]): Materiel[] {
  const items: Materiel[] = [];
  const epiItems = ['Casque sécurité', 'Gants de protection', 'Chaussures de sécurité', 'Gilet haute visibilité', 'Lunettes protection'];
  const outillageItems = ['Perceuse', 'Marteau-piqueur', 'Scie circulaire', 'Meuleuse', 'Bétonnière'];
  const vehiculeItems = ['Camion benne', 'Pick-up Toyota', 'Grue mobile', 'Niveleuse', 'Compacteur'];
  const equipItems = ['Téléphone chantier', 'Talkie-walkie', 'GPS topographie', 'Appareil photo chantier', 'Tablette terrain'];

  let id = 1;
  epiItems.forEach((item, i) => {
    const emp = employees[i * 3];
    items.push({
      id: `mat-${id}`,
      type: 'EPI',
      designation: item,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      dateAttribution: '2026-01-15',
      chantier: emp.chantier,
      etat: i === 2 ? 'À remplacer' : i === 4 ? 'En réparation' : 'Bon',
    });
    id++;
  });
  outillageItems.forEach((item, i) => {
    const emp = employees[(i * 4) + 1];
    items.push({
      id: `mat-${id}`,
      type: 'Outillage',
      designation: item,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      dateAttribution: '2026-02-01',
      chantier: emp.chantier,
      etat: i === 3 ? 'Manquant/Perdu' : 'Bon',
    });
    id++;
  });
  vehiculeItems.forEach((item, i) => {
    const emp = employees[(i * 6) + 2];
    items.push({
      id: `mat-${id}`,
      type: 'Véhicule',
      designation: item,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      dateAttribution: '2025-11-01',
      chantier: emp.chantier,
      etat: 'Bon',
    });
    id++;
  });
  equipItems.forEach((item, i) => {
    const emp = employees[(i * 5) + 3];
    items.push({
      id: `mat-${id}`,
      type: 'Équipement',
      designation: item,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      dateAttribution: '2026-01-20',
      chantier: emp.chantier,
      etat: i === 1 ? 'À remplacer' : 'Bon',
    });
    id++;
  });
  return items;
}

const employees = generateEmployees();
const documents = generateDocuments(employees);
const candidatures = generateCandidatures();
const onboarding = generateOnboarding();
const conges = generateConges(employees);
const soldes = generateSoldes(employees);
const sanctions = generateSanctions(employees);
const conflits = generateConflits();
const bulletins = generateBulletins(employees);
const formations = generateFormations();
const formationEmployees = generateFormationEmployees(employees);
const materiels = generateMateriels(employees);

export const mockData = {
  employees,
  documents,
  candidatures,
  onboarding,
  conges,
  soldes,
  sanctions,
  conflits,
  bulletins,
  formations,
  formationEmployees,
  materiels,
};

export function getNetPaie(b: BulletinPaie): number {
  const totalGains = b.salaireBase + b.montantHeuresSup + b.primeDeplacement + b.primeRisque + b.primeAnciennete + b.primeRendement;
  const totalRetenues = b.avances + b.absencesNonJustifiees + b.retenuesDiverses + b.cotisationsSociales;
  return totalGains - totalRetenues;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
}
