import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../state/auth';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RequestLeaveScreen } from '../screens/RequestLeaveScreen';
import { TimeRecordsScreen } from '../screens/TimeRecordsScreen';
import { MyRequestsScreen } from '../screens/MyRequestsScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { SickLeaveScreen } from '../screens/SickLeaveScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { BenefitsScreen } from '../screens/BenefitsScreen';
import { CoinHistoryScreen } from '../screens/CoinHistoryScreen';
import { AdminCoinsScreen } from '../screens/AdminCoinsScreen';
import { TrainingOverviewScreen } from '../screens/TrainingOverviewScreen';
import { CreateTrainingScreen } from '../screens/CreateTrainingScreen';
import { TrainingDetailsScreen } from '../screens/TrainingDetailsScreen';
import { TakeLessonScreen } from '../screens/TakeLessonScreen';
import { TrainingManagementScreen } from '../screens/TrainingManagementScreen';
import { cn } from '../utils/cn';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const tabs = [
    { path: '/dashboard', label: 'Übersicht', icon: '🏠' },
    { path: '/requests', label: 'Anträge', icon: '📝' },
    { path: '/time', label: 'Zeiten', icon: '⏰' },
    { path: '/calendar', label: 'Kalender', icon: '📅' },
    { path: '/training', label: 'Schulungen', icon: '📘' },
    { path: '/benefits', label: 'Benefits', icon: '🎁' },
    { path: '/documents', label: 'Dokumente', icon: '📄' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-around items-center h-16 px-4">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout><Navigate to="/dashboard" /></MainLayout>} />
      <Route path="/dashboard" element={<MainLayout><DashboardScreen /></MainLayout>} />
      <Route path="/requests" element={<MainLayout><MyRequestsScreen /></MainLayout>} />
      <Route path="/time" element={<MainLayout><TimeRecordsScreen /></MainLayout>} />
      <Route path="/calendar" element={<MainLayout><CalendarScreen /></MainLayout>} />
      <Route path="/training" element={<MainLayout><TrainingOverviewScreen /></MainLayout>} />
      <Route path="/benefits" element={<MainLayout><BenefitsScreen /></MainLayout>} />
      <Route path="/documents" element={<MainLayout><DocumentsScreen /></MainLayout>} />
      
      {/* Modal-like routes */}
      <Route path="/request-leave" element={<RequestLeaveScreen />} />
      <Route path="/sick-leave" element={<SickLeaveScreen />} />
      <Route path="/coin-history" element={<CoinHistoryScreen />} />
      <Route path="/admin-coins" element={<AdminCoinsScreen />} />
      <Route path="/create-training" element={<CreateTrainingScreen />} />
      <Route path="/training/:id" element={<TrainingDetailsScreen />} />
      <Route path="/training/:trainingId/lesson/:lessonId" element={<TakeLessonScreen />} />
      <Route path="/training-management" element={<TrainingManagementScreen />} />
      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};