import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

// Import existing and new admin components
import { TeamManagementScreen } from './TeamManagementScreen';
import { AddEmployeeScreen } from './AddEmployeeScreen';
import { TeamMemberDetailsScreen } from './TeamMemberDetailsScreen';
import { TeamsOverviewScreen } from './TeamsOverviewScreen';
import { DashboardInfoAdminScreen } from './DashboardInfoAdminScreen';

// Placeholder components for new admin sections
const OrganigramScreen = () => (
  <div className="flex-1 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Organigram</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🏢</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Organisationsstruktur</h2>
        <p className="text-gray-600">
          Hier wird eine visualisierte Darstellung der Teamstruktur und Hierarchie angezeigt.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Feature wird in Kürze verfügbar sein.
        </div>
      </div>
    </div>
  </div>
);

const AvatarManagementScreen = () => (
  <div className="flex-1 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Avatarverwaltung</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Gamification Management</h2>
        <p className="text-gray-600">
          Verwalten Sie Level, Ränge, Achievements und Avatare für das Mitarbeiter-Gamification-System.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Feature wird in Kürze verfügbar sein.
        </div>
      </div>
    </div>
  </div>
);

const BenefitsManagementScreen = () => (
  <div className="flex-1 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Benefitsverwaltung</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">💎</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Benefits & Coin-System</h2>
        <p className="text-gray-600">
          Verwalten Sie alle Benefit-Angebote und konfigurieren Sie das Coin-System.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Feature wird in Kürze verfügbar sein.
        </div>
      </div>
    </div>
  </div>
);

/**
 * Admin Layout mit Submenu
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const adminTabs = [
    { 
      path: '/admin/team-management', 
      label: 'Teamverwaltung', 
      icon: '👥',
      description: 'Mitarbeiter-Teams und Lead-Zuordnung'
    },
    { 
      path: '/admin/organigram', 
      label: 'Organigram', 
      icon: '🏢',
      description: 'Visualisierte Teamstruktur'
    },
    { 
      path: '/admin/avatar-management', 
      label: 'Avatarverwaltung', 
      icon: '🎮',
      description: 'Level, Achievements & Gamification'
    },
    { 
      path: '/admin/benefits-management', 
      label: 'Benefitsverwaltung', 
      icon: '💎',
      description: 'Benefits & Coin-System'
    },
    { 
      path: '/admin/dashboard-info', 
      label: 'Dashboard Mitteilungen', 
      icon: '📢',
      description: 'Nachrichten und Ankündigungen'
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
          <p className="text-gray-600">Verwaltung von Teams, Mitarbeitern und System-Einstellungen</p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Admin Navigation">
              {adminTabs.map((tab) => {
                const isActive = location.pathname.startsWith(tab.path);
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={cn(
                      "flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <span className="text-lg mr-2">{tab.icon}</span>
                    <div className="flex flex-col">
                      <span>{tab.label}</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {tab.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Admin Screen mit Routing
 */
export const AdminScreen = () => {
  const { user } = useAuthStore();
  
  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/team-management" replace />} />
      
      {/* Team Management Routes */}
      <Route path="/team-management" element={
        <AdminLayout>
          <TeamManagementScreen />
        </AdminLayout>
      } />
      <Route path="/team-management/add-employee" element={<AddEmployeeScreen />} />
      <Route path="/team-management/user/:userId" element={<TeamMemberDetailsScreen />} />
      <Route path="/team-management/teams" element={<TeamsOverviewScreen />} />
      
      {/* New Admin Routes */}
      <Route path="/organigram" element={
        <AdminLayout>
          <OrganigramScreen />
        </AdminLayout>
      } />
      <Route path="/avatar-management" element={
        <AdminLayout>
          <AvatarManagementScreen />
        </AdminLayout>
      } />
      <Route path="/benefits-management" element={
        <AdminLayout>
          <BenefitsManagementScreen />
        </AdminLayout>
      } />
      <Route path="/dashboard-info" element={
        <AdminLayout>
          <DashboardInfoAdminScreen />
        </AdminLayout>
      } />
    </Routes>
  );
};