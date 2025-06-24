/**
 * Dashboard Example
 * Zeigt wie das neue UI-System in der Praxis verwendet wird
 */

import React from 'react';
import { PageContainer, ContentArea } from '../components/layout/Container';
import { DashboardGrid, GridItem, StatsGrid } from '../components/layout/Grid';
import { Card, StatsCard, InfoCard, AvatarCard, CardHeader, CardContent } from '../components/layout/Card';

export const DashboardExample: React.FC = () => {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="Willkommen zurück, Anna!"
    >
      {/* Header Card mit Benutzerinfo */}
      <Card className="mb-6">
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
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>HR Manager</span>
                <span>Abteilung: Human Resources</span>
                <span>Organisation: HRthis GmbH</span>
              </div>
            </div>
          </div>
          
          {/* Right side: Settings + Logout */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              ⚙️
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              <span className="text-gray-700">Abmelden</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <DashboardGrid>
        {/* Stats Section - 9 columns */}
        <GridItem span="full" mdSpan={9}>
          <div className="space-y-6">
            {/* Stats Cards */}
            <StatsGrid>
              <StatsCard
                title="Heute"
                value="0h"
                subtitle="Nicht gestempelt"
                icon="⏰"
              />
              <StatsCard
                title="Monat"
                value="122.3h"
                subtitle="Soll: 173h"
                icon="📊"
                trend={{ value: "-50.7h", isPositive: false }}
              />
              <StatsCard
                title="Urlaub"
                value="22"
                subtitle="von 30 Tagen"
                icon="🏖️"
              />
            </StatsGrid>

            {/* Employment Details */}
            <InfoCard
              title="Beschäftigungsdetails"
              className="h-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-caption text-gray-500 mb-1">Wochenarbeitszeit</p>
                  <p className="text-body font-medium">40h / Woche</p>
                </div>
                <div>
                  <p className="text-caption text-gray-500 mb-1">Beschäftigungsart</p>
                  <p className="text-body font-medium">Vollzeit</p>
                </div>
                <div>
                  <p className="text-caption text-gray-500 mb-1">Eintrittsdatum</p>
                  <p className="text-body font-medium">1.3.2021</p>
                </div>
                <div>
                  <p className="text-caption text-gray-500 mb-1">Status</p>
                  <p className="text-body font-medium">✅ Aktiv</p>
                </div>
              </div>
            </InfoCard>
          </div>
        </GridItem>

        {/* Avatar Card - 3 columns */}
        <GridItem span="full" mdSpan={3}>
          <AvatarCard className="h-full">
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
        </GridItem>
      </DashboardGrid>
    </PageContainer>
  );
};

/**
 * Beispiel für responsive Mobile Ansicht
 */
export const MobileDashboardExample: React.FC = () => {
  return (
    <PageContainer title="Dashboard">
      {/* Auf Mobile: Alle Karten stapeln sich vertikal */}
      <div className="space-y-6">
        {/* Header wird kompakter */}
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 mx-auto mb-3"></div>
            <h1 className="text-heading-3">Hallo, Anna!</h1>
            <p className="text-caption text-gray-600">HR Manager</p>
          </div>
        </Card>

        {/* Stats stapeln sich vertikal */}
        <div className="space-y-4">
          <StatsCard title="Heute" value="0h" icon="⏰" />
          <StatsCard title="Monat" value="122.3h" icon="📊" />
          <StatsCard title="Urlaub" value="22" icon="🏖️" />
        </div>

        {/* Avatar Card kommt ans Ende */}
        <AvatarCard>
          {/* Kompakter Inhalt für Mobile */}
        </AvatarCard>
      </div>
    </PageContainer>
  );
};