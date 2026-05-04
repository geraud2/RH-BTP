import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { SplashScreen } from './components/SplashScreen';
import DashboardRH from './pages/rh/DashboardRH';
import DossiersPersonnel from './pages/rh/DossiersPersonnel';
import DocumentsContrats from './pages/rh/DocumentsContrats';
import Recrutement from './pages/rh/Recrutement';
import CongesAbsences from './pages/rh/CongesAbsences';
import SanctionsConformite from './pages/rh/SanctionsConformite';
import Paie from './pages/rh/Paie';
import FormationsCompetences from './pages/rh/FormationsCompetences';
import MaterielTravail from './pages/rh/MaterielTravail';
import Reporting from './pages/rh/Reporting';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splash-done'));

  const onSplashComplete = useCallback(() => {
    sessionStorage.setItem('splash-done', '1');
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={onSplashComplete} />}
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardRH />} />
            <Route path="/dossiers" element={<DossiersPersonnel />} />
            <Route path="/documents" element={<DocumentsContrats />} />
            <Route path="/recrutement" element={<Recrutement />} />
            <Route path="/conges" element={<CongesAbsences />} />
            <Route path="/sanctions" element={<SanctionsConformite />} />
            <Route path="/paie" element={<Paie />} />
            <Route path="/formations" element={<FormationsCompetences />} />
            <Route path="/materiel" element={<MaterielTravail />} />
            <Route path="/reporting" element={<Reporting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
