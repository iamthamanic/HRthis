import React from 'react';
import { useSession } from 'next-auth/react';
import { Card, Statistic, Row, Col, Badge, Avatar, Progress, List } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  GiftOutlined,
  BookOutlined,
  TrophyOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { HRthisLayout } from '../components/layout/HRthisLayout';

const DashboardPage: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;

  // Mock data - in real app would come from API
  const stats = {
    totalEmployees: 42,
    activeProjects: 8,
    pendingRequests: 3,
    completedTrainings: 15
  };

  const recentActivities = [
    { title: 'Neue Urlaubsanfrage von Max Mustermann', time: '2 Min. ago', type: 'vacation' },
    { title: 'Training "React Basics" abgeschlossen', time: '1 Std. ago', type: 'training' },
    { title: 'Dokument "Arbeitsvertrag" hochgeladen', time: '3 Std. ago', type: 'document' },
    { title: '5 Coins für Projekt-Completion erhalten', time: '1 Tag ago', type: 'coins' },
  ];

  const upcomingEvents = [
    { title: 'Team Meeting', date: '29.06.2024', time: '14:00' },
    { title: 'Quarterly Review', date: '30.06.2024', time: '10:00' },
    { title: 'Company Event', date: '02.07.2024', time: '18:00' },
  ];

  return (
    <HRthisLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Willkommen zurück, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Hier ist eine Übersicht über Ihre HR-Aktivitäten und anstehende Termine.
          </p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Mitarbeiter"
                value={stats.totalEmployees}
                prefix={<TeamOutlined className="text-blue-600" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Aktive Projekte"
                value={stats.activeProjects}
                prefix={<FileTextOutlined className="text-green-600" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Offene Anfragen"
                value={stats.pendingRequests}
                prefix={<ClockCircleOutlined className="text-orange-600" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Abgeschl. Trainings"
                value={stats.completedTrainings}
                prefix={<TrophyOutlined className="text-purple-600" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Quick Actions */}
          <Col xs={24} lg={12}>
            <Card title="Quick Actions" className="h-full">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <CalendarOutlined className="text-2xl text-blue-600 mb-2 block" />
                  <span className="text-sm font-medium">Urlaub beantragen</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <ClockCircleOutlined className="text-2xl text-green-600 mb-2 block" />
                  <span className="text-sm font-medium">Zeit erfassen</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <BookOutlined className="text-2xl text-purple-600 mb-2 block" />
                  <span className="text-sm font-medium">Training starten</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <GiftOutlined className="text-2xl text-orange-600 mb-2 block" />
                  <span className="text-sm font-medium">Benefits anzeigen</span>
                </button>
              </div>
            </Card>
          </Col>

          {/* Progress Overview */}
          <Col xs={24} lg={12}>
            <Card title="Fortschritt Übersicht" className="h-full">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Urlaubstage</span>
                    <span className="text-sm text-gray-500">15/30 Tage</span>
                  </div>
                  <Progress percent={50} strokeColor="#10b981" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Trainings</span>
                    <span className="text-sm text-gray-500">8/12 abgeschlossen</span>
                  </div>
                  <Progress percent={67} strokeColor="#3b82f6" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Benefits Coins</span>
                    <span className="text-sm text-gray-500">450/500 Coins</span>
                  </div>
                  <Progress percent={90} strokeColor="#f59e0b" />
                </div>
              </div>
            </Card>
          </Col>

          {/* Recent Activities */}
          <Col xs={24} lg={12}>
            <Card title="Letzte Aktivitäten" className="h-full">
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge 
                          status={
                            item.type === 'vacation' ? 'processing' :
                            item.type === 'training' ? 'success' :
                            item.type === 'document' ? 'warning' : 'default'
                          }
                        />
                      }
                      title={item.title}
                      description={item.time}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Upcoming Events */}
          <Col xs={24} lg={12}>
            <Card title="Anstehende Termine" className="h-full">
              <List
                dataSource={upcomingEvents}
                renderItem={(event) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CalendarOutlined className="text-blue-600" />}
                      title={event.title}
                      description={`${event.date} um ${event.time}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </HRthisLayout>
  );
};

export default DashboardPage;