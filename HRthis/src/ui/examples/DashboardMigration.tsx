/**
 * Dashboard Migration Beispiel
 * Zeigt wie dein bestehendes Dashboard mit dem neuen UI-System aussehen würde
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Neue UI System Imports
import { PageContainer, HeaderCard, Section } from '../components/layout/Container';
import { DashboardGrid, GridItem, StatsGrid } from '../components/layout/Grid';
import { StatsCard, InfoCard, AvatarCard, CardHeader, CardContent } from '../components/layout/Card';

// Deine bestehenden Hooks (bleiben unverändert)
import { useAuthStore } from '../../state/auth';
// ... andere Hooks

/**
 * VORHER vs NACHHER Vergleich
 */

// ❌ VORHER - Deine bisherige Struktur
export const DashboardOld: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            {/* ... Header Content ... */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Stats Section */}
          <div className="col-span-1 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Heute */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Heute</h3>
                  <span className="text-2xl">⏰</span>
                </div>
                <p className="text-2xl font-bold text-gray-400">-</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Nicht gestempelt
                </span>
              </div>
              
              {/* Mehr Stats... */}
            </div>
          </div>
          
          {/* Avatar Card */}
          <div className="col-span-1 md:col-span-3">
            {/* Avatar Content */}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ NACHHER - Mit neuem UI-System
export const DashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  return (<PageContainer 
      title="Dashboard" 
      subtitle="Willkommen zurück, Anna!"
    >
      {/* Header Card - Wiederverwendbar */}
      <HeaderCard>
        <div className="flex justify-between items-center">
          {/* Left side: Avatar + Name + Info */}
          <div className="flex items-center gap-4">
            {/* Avatar Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-500 flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-xl">👤</span>
              </div>
            </div>
            
            {/* Name and Info */}
            <div>
              <h1 className="text-heading-2 mb-1">Hallo, Anna!</h1>
              <div className="flex items-center gap-6 text-caption text-gray-600">
                <span>HR Manager</span>
                <span>Abteilung: Human Resources</span>
                <span>Organisation: Tech Company</span>
              </div>
            </div>
          </div>
        </div>
      </HeaderCard>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <StatsGrid>
            <StatsCard
              title="Abwesenheiten"
              value="4"
              subtitle="diesen Monat"
              icon="📅"
              trend={{ value: "12", direction: "down" }}
            />
            <StatsCard
              title="Urlaub"
              value="22"
              subtitle="von 30 Tagen"
              icon="🏖️"
            />
          </StatsGrid>

          {/* Employment Details - Wiederverwendbare InfoCard */}
          <InfoCard 
            title="Beschäftigungsdetails"
            className="mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Eintrittsdatum:</span>
                <span className="ml-2 text-gray-900">01.03.2022</span>
              </div>
              <div>
                <span className="text-gray-600">Arbeitszeit:</span>
                <span className="ml-2 text-gray-900">40h/Woche</span>
              </div>
              <div>
                <span className="text-gray-600">Vertragsart:</span>
                <span className="ml-2 text-gray-900">Unbefristet</span>
              </div>
              <div>
                <span className="text-gray-600">Standort:</span>
                <span className="ml-2 text-gray-900">Berlin</span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <AvatarCard onClick={() => navigate('/settings')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <h3 className="text-caption font-semibold text-gray-700">Avatar</h3>
              <span className="text-xs text-gray-400 hover:text-gray-600">
                Einstellungen →
              </span>
            </CardHeader>

            <CardContent centerContent>
              <div className="text-center space-y-6">
                {/* Level */}
                <div>
                  <h4 className="text-caption font-medium text-gray-900">Level 01: Rookie</h4>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills</h4>
                  <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-4 py-2 rounded-full font-medium">
                    Level 1
                  </div>
                </div>

                {/* Engagement */}
                <div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Engagement</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-gray-900">1600</span>
                        <span className="text-lg">🪙</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-caption text-gray-600 mt-2">Browo Coins</p>
                </div>

                {/* Achievement */}
                <div>
                  <span className="text-3xl mb-2 block">🏆</span>
                  <p className="text-caption text-gray-500">Verdiene dein erstes Achievement!</p>
                </div>
              </div>
            </CardContent>
          </AvatarCard>
        </div>
      </div>
    </PageContainer>
  );
};

/**
 * Migration Benefits - Was du gewinnst:
 */

// 🎯 Vorteile der Migration:

// 1. KONSISTENZ
// - Einheitliche Abstände überall (6px, 12px, 24px System)
// - Konsistente Farben, Shadows, Border Radius
// - Wiederverwendbare Komponenten

// 2. WARTBARKEIT  
// - Zentrale Änderungen in Design Tokens
// - Komponenten sind dokumentiert und typisiert
// - Einfache Anpassungen ohne Copy/Paste

// 3. RESPONSIVITÄT
// - Automatische responsive Behavior
// - Mobile-first Approach
// - Konsistente Breakpoints

// 4. ENTWICKLER-ERFAHRUNG
// - TypeScript Support mit IntelliSense
// - Klare Component APIs
// - Weniger Copy/Paste Code

// 5. PERFORMANCE
// - Optimierte Tailwind-Klassen  
// - Kleinere Bundle Size durch Wiederverwendung
// - CSS-in-JS Vermeidung

/**
 * Schritt-für-Schritt Migration:
 */

// SCHRITT 1: Installiere das UI-System
// - Kopiere die UI-Ordner-Struktur
// - Ersetze tailwind.config.js

// SCHRITT 2: Migriere Seite für Seite
// - Beginne mit einer Seite (z.B. Dashboard)
// - Ersetze die Container-Struktur
// - Ersetze Cards/Boxes mit Card-Komponenten
// - Ersetze Grid-Layouts

// SCHRITT 3: Teste responsive Verhalten
// - Mobile, Tablet, Desktop
// - Verschiedene Content-Längen
// - Hover/Focus States

// SCHRITT 4: Optimiere und dokumentiere
// - Erstelle Style Guide
// - Dokumentiere Custom Components
// - Setup Storybook (optional)

/**
 * Live Migration Beispiel:
 */
export const DashboardMigrationDemo: React.FC = () => {
  const [useNewSystem, setUseNewSystem] = React.useState(false);
  
  return (
    <div>
      {/* Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setUseNewSystem(!useNewSystem)}
          className="btn-primary"
        >
          {useNewSystem ? 'Zeige Alt' : 'Zeige Neu'} System
        </button>
      </div>
      
      {/* Render Current System */}
      {useNewSystem ? <DashboardNew /> : <DashboardOld />}
    </div>
  );
};