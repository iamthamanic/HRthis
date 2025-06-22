import React, { useState, useEffect } from 'react';
import { VideoContent, TestQuestion, LevelConfig, TrainingCategory } from '../types/learning';
import { useLearningStore } from '../state/learning';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

export const LearningAdmin = () => {
  const { user } = useAuthStore();
  const { videos, loadVideos } = useLearningStore();
  const [activeTab, setActiveTab] = useState<'videos' | 'tests' | 'levels' | 'analytics'>('videos');
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [showTestEditor, setShowTestEditor] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // Check if user is admin
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zugriff verweigert</h1>
          <p className="text-gray-600">Sie haben keine Berechtigung für den Admin-Bereich.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'videos', label: 'Schulungen', icon: '📹', count: videos.length },
    { id: 'tests', label: 'Tests', icon: '📝', count: 0 },
    { id: 'levels', label: 'Level', icon: '🏆', count: 10 },
    { id: 'analytics', label: 'Statistiken', icon: '📊', count: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Management</h1>
              <p className="text-gray-600 mt-1">Verwalten Sie Schulungen, Tests und das Levelsystem</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateVideo(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <span>➕</span>
                <span>Neue Schulung</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'videos' && <VideoManagement />}
        {activeTab === 'tests' && <TestManagement />}
        {activeTab === 'levels' && <LevelManagement />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>

      {/* Modals */}
      {showCreateVideo && (
        <CreateVideoModal onClose={() => setShowCreateVideo(false)} />
      )}
      {showTestEditor && selectedVideo && (
        <TestEditorModal 
          video={selectedVideo} 
          onClose={() => {
            setShowTestEditor(false);
            setSelectedVideo(null);
          }} 
        />
      )}
    </div>
  );
};

// Video Management Component
const VideoManagement = () => {
  const { videos } = useLearningStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: 'all', label: 'Alle Kategorien' },
    { value: TrainingCategory.MANDATORY, label: 'Pflicht' },
    { value: TrainingCategory.COMPLIANCE, label: 'Compliance' },
    { value: TrainingCategory.SKILLS, label: 'Skills' },
    { value: TrainingCategory.ONBOARDING, label: 'Onboarding' },
    { value: TrainingCategory.BONUS, label: 'Bonus' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Schulungen durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Video List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schulung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dauer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVideos.map(video => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                        ▶️
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{video.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{video.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      video.category === TrainingCategory.MANDATORY && "bg-red-100 text-red-800",
                      video.category === TrainingCategory.COMPLIANCE && "bg-yellow-100 text-yellow-800",
                      video.category === TrainingCategory.SKILLS && "bg-blue-100 text-blue-800",
                      video.category === TrainingCategory.ONBOARDING && "bg-green-100 text-green-800",
                      video.category === TrainingCategory.BONUS && "bg-purple-100 text-purple-800"
                    )}>
                      {video.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(video.duration / 60)} Min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      <button className="text-green-600 hover:text-green-900">Test</button>
                      <button className="text-red-600 hover:text-red-900">Löschen</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Test Management Component
const TestManagement = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Test-Editor</h3>
        <p className="text-gray-600 mb-6">
          Erstellen Sie interaktive Tests mit verschiedenen Fragetypen
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
          Neuen Test erstellen
        </button>
      </div>
    </div>
  );
};

// Level Management Component
const LevelManagement = () => {
  const levels = [
    { level: 1, title: "Newcomer", xp: 0, users: 45 },
    { level: 2, title: "Beginner", xp: 50, users: 32 },
    { level: 3, title: "Schulungs-Kid", xp: 150, users: 28 },
    { level: 4, title: "Knowledge Seeker", xp: 300, users: 22 },
    { level: 5, title: "Certified Champ", xp: 500, users: 18 },
    { level: 6, title: "Expert Learner", xp: 750, users: 12 },
    { level: 7, title: "Master Student", xp: 1000, users: 8 },
    { level: 8, title: "Team Brain", xp: 1500, users: 5 },
    { level: 9, title: "Wisdom Keeper", xp: 2000, users: 3 },
    { level: 10, title: "Legend", xp: 3000, users: 1 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Level-Konfiguration</h3>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Benötigte XP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Benutzer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {levels.map(level => (
                <tr key={level.level} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {level.level}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{level.title}</td>
                  <td className="px-4 py-4 text-gray-600">{level.xp.toLocaleString()} XP</td>
                  <td className="px-4 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {level.users} Benutzer
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">Bearbeiten</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const stats = [
    { label: 'Aktive Lernende', value: '174', change: '+12%', positive: true },
    { label: 'Abgeschlossene Schulungen', value: '2,847', change: '+23%', positive: true },
    { label: 'Durchschnittliche Punktzahl', value: '87%', change: '+5%', positive: true },
    { label: 'Gesamte Lernzeit', value: '1,245h', change: '+18%', positive: true }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={cn(
                "text-sm font-medium",
                stat.positive ? "text-green-600" : "text-red-600"
              )}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Lernaktivität</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart Placeholder</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Kategorien-Performance</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Video Modal
interface CreateVideoModalProps {
  onClose: () => void;
}

const CreateVideoModal: React.FC<CreateVideoModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    duration: 0,
    category: TrainingCategory.SKILLS
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement video creation
    console.log('Creating video:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Neue Schulung erstellen</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Datenschutz Grundlagen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kurze Beschreibung der Schulung..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video-URL *
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TrainingCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={TrainingCategory.SKILLS}>Skills</option>
                <option value={TrainingCategory.MANDATORY}>Pflicht</option>
                <option value={TrainingCategory.COMPLIANCE}>Compliance</option>
                <option value={TrainingCategory.ONBOARDING}>Onboarding</option>
                <option value={TrainingCategory.BONUS}>Bonus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dauer (Minuten) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) * 60 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. 15"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Schulung erstellen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Test Editor Modal (placeholder)
interface TestEditorModalProps {
  video: VideoContent;
  onClose: () => void;
}

const TestEditorModal: React.FC<TestEditorModalProps> = ({ video, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Test-Editor: {video.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Test-Editor wird hier implementiert...</p>
          </div>
        </div>
      </div>
    </div>
  );
};