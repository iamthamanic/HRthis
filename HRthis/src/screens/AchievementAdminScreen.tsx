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
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full text-white",
                `bg-gradient-to-r ${rarityColors[achievement.rarity]}`
              )}>
                {rarityLabels[achievement.rarity]}
              </span>
              <span className="text-xs text-gray-500">
                {achievement.xpReward} XP
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {stats.unlockedCount} / {stats.totalUsers} erreicht
          </span>
          <button
            onClick={() => onToggleActive(achievement.id)}
            className={cn(
              "text-xs px-3 py-1 rounded-full border transition-colors",
              achievement.isActive 
                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            )}
          >
            {achievement.isActive ? 'Aktiv' : 'Inaktiv'}
          </button>
          <button
            onClick={() => onEdit(achievement)}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(achievement.id)}
            className="text-red-600 hover:text-red-800 p-1"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Bedingungen:</h4>
        <div className="space-y-1">
          {achievement.conditions.map((condition, index) => (
            <div key={index} className="text-sm text-gray-600">
              {condition.type === 'xp_earned' && `${condition.target} XP erreichen`}
              {condition.type === 'training_completed' && `${condition.target} Schulungen abschließen`}
              {condition.type === 'punctual_checkins' && `${condition.target} pünktliche Check-ins`}
              {condition.type === 'coins_earned' && `${condition.target} Coins verdienen`}
              {condition.type === 'level_reached' && `Level ${condition.target} erreichen`}
              {condition.type === 'feedback_given' && `${condition.target} Feedback geben`}
              {condition.type === 'consecutive_days' && `${condition.target} aufeinanderfolgende Tage`}
            </div>
          ))}
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
      ...prev, 
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, ...updates } : condition
      )
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev, 
      conditions: prev.conditions.filter((_, i) => i !== index)
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
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Erster Arbeitstag"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="milestone">Meilenstein</option>
                  <option value="skill">Fähigkeit</option>
                  <option value="social">Sozial</option>
                  <option value="special">Besonders</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                Aktiv
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isHidden}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHidden: e.target.checked }))}
                  className="mr-2"
                />
                Versteckt
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bedingungen</h3>
              <button
                onClick={addCondition}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                + Bedingung
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
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

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowModal(true);
  };

  const handleDelete = (achievementId: string) => {
    if (window.confirm('Achievement wirklich löschen?')) {
      deleteAchievement(achievementId);
    }
  };

  const handleSave = (achievement: Achievement) => {
    if (editingAchievement) {
      updateAchievement(achievement.id, achievement);
    } else {
      createAchievement(achievement);
    }
    setShowModal(false);
    setEditingAchievement(undefined);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAchievement(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievement Verwaltung</h1>
          <p className="text-gray-600">Verwalte Achievements und Belohnungen</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Neues Achievement
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Achievements durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Alle Kategorien</option>
          <option value="milestone">Meilenstein</option>
          <option value="skill">Fähigkeit</option>
          <option value="social">Sozial</option>
          <option value="special">Besonders</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={toggleAchievementActive}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Keine Achievements gefunden.</p>
        </div>
      )}

      <AchievementModal
        achievement={editingAchievement}
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};