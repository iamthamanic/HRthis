import React, { useState } from 'react';
import { useAchievementsStore } from '../state/achievements';
import { Achievement, AchievementCondition } from '../types/gamification';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (achievementId: string) => void;
  onToggleActive: (achievementId: string) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const { getAchievementStats } = useAchievementsStore();
  const stats = getAchievementStats(achievement.id);

  const rarityColors = {
    common: 'from-gray-300 to-gray-500',
    rare: 'from-blue-300 to-blue-500',
    epic: 'from-purple-300 to-purple-500',
    legendary: 'from-yellow-300 to-orange-500'
  };

  const rarityLabels = {
    common: 'Häufig',
    rare: 'Selten',
    epic: 'Episch',
    legendary: 'Legendär'
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border p-6 transition-all",
      achievement.isActive ? "border-gray-200 shadow-sm" : "border-gray-100 opacity-75"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md",
            `bg-gradient-to-br ${rarityColors[achievement.rarity]}`,
            !achievement.isActive && "grayscale"
          )}>
            {achievement.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleActive(achievement.id)}
            className={cn(
              "w-8 h-4 rounded-full relative transition-colors",
              achievement.isActive ? "bg-green-500" : "bg-gray-300"
            )}
          >
            <div className={cn(
              "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform",
              achievement.isActive ? "translate-x-4" : "translate-x-0.5"
            )} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Kategorie:</span>
          <span className="text-sm font-medium">{achievement.category}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Seltenheit:</span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
            achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
            achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          )}>
            {rarityLabels[achievement.rarity]}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">XP Belohnung:</span>
          <span className="text-sm font-medium">{achievement.xpReward} XP</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Freigeschaltet:</span>
          <span className="text-sm font-medium">{stats.unlockedCount} Benutzer</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(achievement)}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
          >
            Bearbeiten
          </button>
          <button
            onClick={() => onDelete(achievement.id)}
            className="px-3 py-2 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

interface AchievementModalProps {
  achievement?: Achievement;
  isOpen: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    id: achievement?.id || '',
    name: achievement?.name || '',
    description: achievement?.description || '',
    icon: achievement?.icon || '🏆',
    category: achievement?.category || 'milestone',
    rarity: achievement?.rarity || 'common',
    xpReward: achievement?.xpReward || 50,
    conditions: achievement?.conditions || [
      {
        type: 'xp_earned',
        target: 1000,
        operator: 'gte'
      }
    ] as AchievementCondition[],
    isActive: achievement?.isActive ?? true,
    isHidden: achievement?.isHidden ?? false
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const achievementData: Achievement = {
      ...formData,
      id: formData.id || `achievement-${Date.now()}`,
      createdAt: achievement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(achievementData);
    onClose();
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          type: 'xp_earned',
          target: 100,
          operator: 'gte'
        }
      ]
    }));
  };

  const updateCondition = (index: number, updates: Partial<AchievementCondition>) => {
    setFormData(prev => ({
      ...prev, conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, ...updates } : condition
      )
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev, conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {achievement ? 'Achievement bearbeiten': 'Neues Achievement erstellen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Erste Schritte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Beschreibung des Achievements..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🏆"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  XP Belohnung
                </label>
                <input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="learning">Lernen</option>
                  <option value="attendance">Anwesenheit</option>
                  <option value="engagement">Engagement</option>
                  <option value="milestone">Meilensteine</option>
                  <option value="special">Spezial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seltenheit
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="common">Häufig</option>
                  <option value="rare">Selten</option>
                  <option value="epic">Episch</option>
                  <option value="legendary">Legendär</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Aktiv</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isHidden}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHidden: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Versteckt (nicht in der Galerie anzeigen)</span>
              </label>
            </div>
          </div>

          {/* Right Column - Conditions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bedingungen</h3>
              <button
                onClick={addCondition}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                + Bedingung
              </button>
            </div>

            <div className="space-y-4">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Bedingung {index + 1}
                    </span>
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Typ</label>
                      <select
                        value={condition.type}
                        onChange={(e) => updateCondition(index, { type: e.target.value as any })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="xp_earned">XP erreicht</option>
                        <option value="training_completed">Schulungen abgeschlossen</option>
                        <option value="punctual_checkins">Pünktliche Check-ins</option>
                        <option value="coins_earned">Coins verdient</option>
                        <option value="level_reached">Level erreicht</option>
                        <option value="feedback_given">Feedback gegeben</option>
                        <option value="consecutive_days">Aufeinanderfolgende Tage</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Operator</label>
                        <select
                          value={condition.operator}
                          onChange={(e) => updateCondition(index, { operator: e.target.value as any })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="gte">≥ (mindestens)</option>
                          <option value="gt">&gt; (mehr als)</option>
                          <option value="eq">= (genau)</option>
                          <option value="lt">&lt; (weniger als)</option>
                          <option value="lte">≤ (höchstens)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Zielwert</label>
                        <input
                          type="number"
                          value={condition.target}
                          onChange={(e) => updateCondition(index, { target: parseInt(e.target.value) })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>

                    {condition.skillId !== undefined && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Skill (optional)</label>
                        <select
                          value={condition.skillId || ''}
                          onChange={(e) => updateCondition(index, { skillId: e.target.value || undefined })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Alle Skills</option>
                          <option value="knowledge">🧠 Wissen</option>
                          <option value="loyalty">❤️ Loyalität</option>
                          <option value="hustle">💪 Hustle</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.description}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {achievement ? 'Speichern' : 'Erstellen'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Achievement Admin Screen
 */
export const AchievementAdminScreen: React.FC = () => {
  const { getAchievements, createAchievement, updateAchievement, deleteAchievement, toggleAchievementActive } = useAchievementsStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | undefined>();

  const achievements = getAchievements();
  
  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'Alle', icon: '🏆' },
    { id: 'learning', name: 'Lernen', icon: '🎓' },
    { id: 'attendance', name: 'Anwesenheit', icon: '⏰' },
    { id: 'engagement', name: 'Engagement', icon: '💪' },
    { id: 'milestone', name: 'Meilensteine', icon: '🎯' },
    { id: 'special', name: 'Spezial', icon: '⭐' }
  ];

  const handleCreateAchievement = () => {
    setEditingAchievement(undefined);
    setShowModal(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowModal(true);
  };

  const handleSaveAchievement = (achievement: Achievement) => {
    if (editingAchievement) {
      updateAchievement(achievement.id, achievement);
    } else {
      createAchievement(achievement);
    }
  };

  const handleDeleteAchievement = (_achievementId: string) => {
    if (confirm('Möchtest du dieses Achievement wirklich löschen?')) {
      deleteAchievement(_achievementId);
    }
  };

  const handleToggleActive = (_achievementId: string) => {
    toggleAchievementActive(_achievementId);
  };

  // Statistics
  const totalAchievements = achievements.length;
  const activeAchievements = achievements.filter(a => a.isActive).length;
  const categoryStats = categories.slice(1).map(category => ({
    ...category,
    count: achievements.filter(a => a.category === category.id).length
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Achievement Management
          </h1>
          <p className="text-gray-600">
            Erstelle und verwalte Achievements für das Gamification-System
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-2">{totalAchievements}</div>
            <div className="text-sm text-gray-600">Gesamt Achievements</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-2">{activeAchievements}</div>
            <div className="text-sm text-gray-600">Aktive Achievements</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {achievements.filter(a => a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-gray-600">Legendäre Achievements</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {achievements.reduce((sum, a) => sum + a.xpReward, 0)}
            </div>
            <div className="text-sm text-gray-600">Gesamt XP Belohnungen</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Achievements suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleCreateAchievement}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Neues Achievement
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={handleEditAchievement}
              onDelete={handleDeleteAchievement}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏆</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Keine Achievements gefunden
            </h3>
            <p className="text-gray-600">
              Erstelle dein erstes Achievement oder ändere deine Suchkriterien
            </p>
          </div>
        )}

        {/* Achievement Modal */}
        <AchievementModal
          achievement={editingAchievement}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAchievement}
        />
      </div>
    </div>
  );
};