import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { Badge, Dropdown, Menu, Avatar } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined 
} from '@ant-design/icons';

interface HRthisLayoutProps {
  children: React.ReactNode;
}

export const HRthisLayout: React.FC<HRthisLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const isAdmin = user?.role === 'admin';
  
  const tabs = [
    { path: '/dashboard', label: 'Übersicht', icon: '🏠' },
    { path: '/time-vacation', label: 'Zeit & Urlaub', icon: '⏰' },
    { path: '/learning', label: 'Lernen', icon: '🎓' },
    { path: '/benefits', label: 'Benefits', icon: '🎁' },
    { path: '/hr/employees', label: 'Mitarbeiter', icon: '👥' },
    { path: '/documents', label: 'Dokumente', icon: '📄' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: '🔧' }] : []),
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">Profil</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">Einstellungen</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Abmelden',
      onClick: () => signOut({ callbackUrl: '/auth/login' }),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HRthis</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const isActive = router.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Badge count={0} size="small">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <BellOutlined className="text-lg" />
              </button>
            </Badge>

            {/* User Dropdown */}
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </button>
            </Dropdown>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="grid grid-cols-4 gap-1 p-2">
            {tabs.slice(0, 4).map((tab) => {
              const isActive = router.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`
                    flex flex-col items-center py-2 px-1 text-xs rounded-lg transition-colors
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600'
                    }
                  `}
                >
                  <span className="text-lg mb-1">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2024 HRthis - Human Resources Management System
        </div>
      </footer>
    </div>
  );
};