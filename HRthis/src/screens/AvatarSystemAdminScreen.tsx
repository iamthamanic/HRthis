import React, { useState } from 'react';
import { useAvatarStore } from '../state/avatar';
import { useAchievementsStore } from '../state/achievements';
import { useGamificationStore } from '../state/gamification';
import { cn } from '../utils/cn';

interface UserAvatarRowProps {
  userId: string;
  userAvatar: any;
  onManageUser: (userId: string) => void;
}

const UserAvatarRow: React.FC<UserAvatarRowProps> = ({ userId, userAvatar, onManageUser }) => {
  const { getUnlockedAchievements } = useAchievementsStore();
  const unlockedAchievements = getUnlockedAchievements(userId);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white">
            👤
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">User {userId}</div>
            <div className="text-sm text-gray-500">{userAvatar.title || 'Kein Titel'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-xs px-2 py-1 rounded-full font-bold">
            {userAvatar.level}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {userAvatar.totalXP.toLocaleString()} XP
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-1">
          {userAvatar.skills.map((skill: any) => (
            <div
              key={skill.id}
              className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              <span>{skill.icon}</span>
              <span>L{skill.level}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {unlockedAchievements.length}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onManageUser(userId)}
          className="text-blue-600 hover:text-blue-900"
        >
          Verwalten
        </button>
      </td>
    </tr>
  );
};

interface ManageUserModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ManageUserModal: React.FC<ManageUserModalProps> = ({ userId, isOpen, onClose }) => {
  const { getUserAvatar } = useAvatarStore();
  const { awardXP } = useGamificationStore();
  const [xpAmount, setXpAmount] = useState('50');
  const [xpReason, setXpReason] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const userAvatar = getUserAvatar(userId);

  if (!isOpen || !userAvatar) return null;

  const handleAwardXP = () => {
    if (!xpAmount || !xpReason) return;
    
    awardXP({
      type: 'manual',
      userId,
      skillIds: selectedSkill ? [selectedSkill] : undefined,
      xpAmount: parseInt(xpAmount),
      metadata: { reason: xpReason }
    });

    setXpAmount('50');
    setXpReason('');
    setSelectedSkill('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Benutzer verwalten: User {userId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{userAvatar.level}</div>
            <div className="text-sm text-blue-700">Avatar Level</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {userAvatar.totalXP.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Gesamt XP</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {userAvatar.skills.reduce((sum, skill) => sum + skill.level, 0)}
            </div>
            <div className="text-sm text-purple-700">Skill Level</div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="space-y-3">
            {userAvatar.skills.map((skill: any) => (
              <div key={skill.id} className="flex items-center gap-4">
                <span className="text-xl">{skill.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">Level {skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (skill.totalXP / Math.max(100, skill.totalXP)) * 60 + 40)}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {skill.totalXP} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Award XP Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">XP vergeben</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                XP Menge
              </label>
              <input
                type="number"
                value={xpAmount}
                onChange={(e) => setXpAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50"
                min="1"
                max="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill (optional)
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Allgemein (alle Skills)</option>
                {userAvatar.skills.map((skill: any) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.icon} {skill.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grund
              </label>
              <input
                type="text"
                value={xpReason}
                onChange={(e) => setXpReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Hervorragende Leistung"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAwardXP}
                disabled={!xpAmount || !xpReason}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                XP vergeben
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Avatar System Admin Screen
 * Main management interface for the avatar and gamification system
 */
export const AvatarSystemAdminScreen: React.FC = () => {
  const { getAllUserAvatars } = useAvatarStore();
  const { config, updateConfig, getLeaderboard } = useGamificationStore();
  const [selectedTab, setSelectedTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const allUserAvatars = getAllUserAvatars();
  const leaderboard = getLeaderboard(undefined, 20);

  const filteredUsers = allUserAvatars.filter(avatar => 
    avatar.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'users', name: 'Benutzer', icon: '👥' },
    { id: 'leaderboard', name: 'Rangliste', icon: '🏆' },
    { id: 'config', name: 'Konfiguration', icon: '⚙️' },
    { id: 'statistics', name: 'Statistiken', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👤 Avatarsystem Verwaltung
          </h1>
          <p className="text-gray-600">
            Verwalte Benutzer-Avatare, XP-System und Achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {selectedTab === 'users' && (
          <div>
            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Benutzer suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Bulk XP vergeben
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Benutzer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      XP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Achievements
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userAvatar) => (
                    <UserAvatarRow
                      key={userAvatar.userId}
                      userId={userAvatar.userId}
                      userAvatar={userAvatar}
                      onManageUser={setSelectedUser}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Rangliste</h2>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    index < 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                      index === 0 ? "bg-yellow-500" :
                      index === 1 ? "bg-gray-400" :
                      index === 2 ? "bg-orange-600" :
                      "bg-gray-300"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{entry.userName}</p>
                      <p className="text-sm text-gray-600">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{entry.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'config' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">⚙️ Konfiguration</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">XP Raten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schulung abgeschlossen
                    </label>
                    <input
                      type="number"
                      value={config.xpRates.trainingCompleted}
                      onChange={(e) => updateConfig({
                        xpRates: { ...config.xpRates, trainingCompleted: parseInt(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pünktlich gestempelt
                    </label>
                    <input
                      type="number"
                      value={config.xpRates.punctualCheckin}
                      onChange={(e) => updateConfig({
                        xpRates: { ...config.xpRates, punctualCheckin: parseInt(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback gegeben
                    </label>
                    <input
                      type="number"
                      value={config.xpRates.feedbackGiven}
                      onChange={(e) => updateConfig({
                        xpRates: { ...config.xpRates, feedbackGiven: parseInt(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Täglicher Login
                    </label>
                    <input
                      type="number"
                      value={config.xpRates.dailyLogin}
                      onChange={(e) => updateConfig({
                        xpRates: { ...config.xpRates, dailyLogin: parseInt(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Einstellungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basis XP pro Level
                    </label>
                    <input
                      type="number"
                      value={config.levelSystem.baseXP}
                      onChange={(e) => updateConfig({
                        levelSystem: { ...config.levelSystem, baseXP: parseInt(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Multiplikator pro Level (%)
                    </label>
                    <input
                      type="number"
                      value={config.levelSystem.multiplier * 100}
                      onChange={(e) => updateConfig({
                        levelSystem: { ...config.levelSystem, multiplier: parseInt(e.target.value) / 100 }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'statistics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {allUserAvatars.reduce((sum, avatar) => sum + avatar.totalXP, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Gesamt XP</div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(allUserAvatars.reduce((sum, avatar) => sum + avatar.level, 0) / Math.max(1, allUserAvatars.length))}
              </div>
              <div className="text-sm text-gray-600">Ø Level</div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {allUserAvatars.reduce((sum, avatar) => sum + avatar.skills.reduce((skillSum, skill) => skillSum + skill.level, 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Gesamt Skill Level</div>
            </div>
          </div>
        )}

        {/* Manage User Modal */}
        <ManageUserModal
          userId={selectedUser || ''}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  );
};