import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useNotificationsStore } from '../state/notifications';
import { useLeavesStore } from '../state/leaves';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RequestLeaveScreen } from '../screens/RequestLeaveScreen';
import { TimeRecordsScreen } from '../screens/TimeRecordsScreen';
import { MyRequestsScreen } from '../screens/MyRequestsScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { BenefitsScreen } from '../screens/BenefitsScreen';
import { CoinHistoryScreen } from '../screens/CoinHistoryScreen';
import { AdminCoinsScreen } from '../screens/AdminCoinsScreen';
import { TrainingOverviewScreen } from '../screens/TrainingOverviewScreen';
import { CreateTrainingScreen } from '../screens/CreateTrainingScreen';
import { TrainingDetailsScreen } from '../screens/TrainingDetailsScreen';
import { TakeLessonScreen } from '../screens/TakeLessonScreen';
import { TrainingManagementScreen } from '../screens/TrainingManagementScreen';
import { LearningDashboard } from '../screens/LearningDashboard';
import { VideoLearningScreen } from '../screens/VideoLearningScreen';
import { LearningAdmin } from '../screens/LearningAdmin';
import { LearningShop } from '../screens/LearningShop';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TeamManagementScreen } from '../screens/TeamManagementScreen';
import { TeamMemberDetailsScreen } from '../screens/TeamMemberDetailsScreen';
import { TeamsOverviewScreen } from '../screens/TeamsOverviewScreen';
import { TeamCalendarScreen } from '../screens/TeamCalendarScreen';
import { cn } from '../utils/cn';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { getUnreadCount } = useNotificationsStore();
  const { getAllLeaveRequests } = useLeavesStore();
  
  const getNotificationCount = (tabPath: string): number => {
    if (!user) return 0;
    
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';
    
    switch (tabPath) {
      case '/requests':
        if (isAdmin) {
          // For admin: show pending leave requests (these are the actionable items)
          const pendingRequests = getAllLeaveRequests().filter(req => req.status === 'PENDING').length;
          return pendingRequests;
        } else {
          // For users: show unread notifications about their requests
          return getUnreadCount(user.id);
        }
      case '/training':
        // Could add training-related notifications here
        return 0;
      default:
        return 0;
    }
  };
  
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  
  const tabs = [
    { path: '/dashboard', label: 'Übersicht', icon: '🏠' },
    { path: '/requests', label: 'Anträge', icon: '📝' },
    { path: '/time', label: 'Zeiten', icon: '⏰' },
    { path: '/calendar', label: 'Urlaub', icon: '📅' },
    { path: '/learning', label: 'Lernen', icon: '🎓' },
    { path: '/benefits', label: 'Benefits', icon: '🎁' },
    { path: '/documents', label: 'Dokumente', icon: '📄' },
    ...(isAdmin ? [{ path: '/team-management', label: 'Teams', icon: '👥' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center h-16 px-4">
          {/* HRdiese Logo */}
          <div className="flex items-center mr-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">HRdiese</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-around items-center flex-1">
            {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            const notificationCount = getNotificationCount(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative",
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Link>
            );
            })}
          </div>
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
      <Route path="/learning" element={<MainLayout><LearningDashboard /></MainLayout>} />
      <Route path="/benefits" element={<MainLayout><BenefitsScreen /></MainLayout>} />
      <Route path="/documents" element={<MainLayout><DocumentsScreen /></MainLayout>} />
      <Route path="/team-management" element={<MainLayout><TeamManagementScreen /></MainLayout>} />
      <Route path="/team-calendar" element={<MainLayout><TeamCalendarScreen /></MainLayout>} />
      
      {/* Modal-like routes */}
      <Route path="/request-leave" element={<RequestLeaveScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/coin-history" element={<CoinHistoryScreen />} />
      <Route path="/admin-coins" element={<AdminCoinsScreen />} />
      <Route path="/learning/video/:videoId" element={<VideoLearningScreen />} />
      <Route path="/learning/admin" element={<LearningAdmin />} />
      <Route path="/create-training" element={<CreateTrainingScreen />} />
      <Route path="/training/:id" element={<TrainingDetailsScreen />} />
      <Route path="/training/:trainingId/lesson/:lessonId" element={<TakeLessonScreen />} />
      <Route path="/training-management" element={<TrainingManagementScreen />} />
      <Route path="/team-management/user/:userId" element={<TeamMemberDetailsScreen />} />
      <Route path="/team-management/teams" element={<TeamsOverviewScreen />} />
      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};