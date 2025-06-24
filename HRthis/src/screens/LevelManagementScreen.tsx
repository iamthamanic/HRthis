import React, { useState } from 'react';
import { useAvatarStore } from '../state/avatar';
import { cn } from '../utils/cn';
import { calculateXPForLevel, calculateLevelFromXP } from '../types/avatar';

interface LevelTierProps {
  level: number;
  requiredXP: number;
  userCount: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (_newXP: number) => void;
  onCancel: () => void;
}

const LevelTier: React.FC<LevelTierProps> = ({
  level,
  requiredXP,
  userCount,
  isEditing,
  onEdit,
  onSave,
  onCancel
}) => {
  const [editValue, setEditValue] = useState(requiredXP.toString());

  const handleSave = () => {
    const newXP = parseInt(editValue);
    if (newXP > 0) {
      onSave(newXP);
    }
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 50) return 'from-purple-400 to-pink-500';
    if (level >= 30) return 'from-yellow-400 to-orange-500';
    if (level >= 20) return 'from-blue-400 to-indigo-500';
    if (level >= 10) return 'from-green-400 to-emerald-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r",
            getLevelBadgeColor(level)
          )}>
            {level}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Level {level}</h3>
            <p className="text-sm text-gray-600">{userCount} Benutzer</p>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Bearbeiten
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Benötigte XP:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                ✓
              </button>
              <button
                onClick={onCancel}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="font-semibold text-gray-900">
              {requiredXP.toLocaleString()} XP
            </span>
          )}
        </div>
        
        {level > 1 && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Differenz zu Level {level - 1}:</span>
            <span>+{(requiredXP - calculateXPForLevel(level - 1)).toLocaleString()} XP</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface CreateLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (level: number, requiredXP: number) => void;
  maxLevel: number;
}

const CreateLevelModal: React.FC<CreateLevelModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  maxLevel
}) => {
  const [level, setLevel] = useState((maxLevel + 1).toString());
  const [requiredXP, setRequiredXP] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    const levelNum = parseInt(level);
    const xpNum = parseInt(requiredXP);
    
    if (levelNum > 0 && xpNum > 0) {
      onCreate(levelNum, xpNum);
      setLevel((maxLevel + 2).toString());
      setRequiredXP('');
      onClose();
    }
  };

  // Calculate suggested XP based on progression
  const suggestedXP = maxLevel > 0 ? Math.floor(calculateXPForLevel(maxLevel) * 1.15) : 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Neues Level erstellen</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={maxLevel + 1}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benötigte XP
            </label>
            <input
              type="number"
              value={requiredXP}
              onChange={(e) => setRequiredXP(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Vorschlag: ${suggestedXP.toLocaleString()}`}
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Vorschlag basierend auf 15% Steigerung: {suggestedXP.toLocaleString()} XP
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCreate}
            disabled={!level || !requiredXP}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Level erstellen
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
 * Level Management Screen
 * Create and edit level progression system
 */
export const LevelManagementScreen: React.FC = () => {
  const { _getAllUserAvatars } = useAvatarStore();
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allUserAvatars = getAllUserAvatars();

  // Generate level data based on current system
  const maxLevel = Math.max(...allUserAvatars.map(avatar => avatar.level), 50);
  const levels = Array.from({ length: maxLevel }, (_, i) => {
    const level = i + 1;
    const requiredXP = calculateXPForLevel(level);
    const userCount = allUserAvatars.filter(avatar => avatar.level === level).length;
    
    return {
      level,
      requiredXP,
      userCount
    };
  });

  const filteredLevels = levels.filter(level => 
    level.level.toString().includes(searchTerm) ||
    level.requiredXP.toString().includes(searchTerm)
  );

  const handleEditLevel = (level: number) => {
    setEditingLevel(level);
  };

  const handleSaveLevel = (level: number, _newXP: number) => {
    // This would update the level system configuration
    console.log(`Updating level ${level} to require ${newXP} XP`);
    setEditingLevel(null);
  };

  const handleCancelEdit = () => {
    setEditingLevel(null);
  };

  const handleCreateLevel = (level: number, requiredXP: number) => {
    console.log(`Creating level ${level} with ${requiredXP} XP requirement`);
    // This would update the level system
  };

  // Statistics
  const totalUsers = allUserAvatars.length;
  const averageLevel = totalUsers > 0 
    ? allUserAvatars.reduce((sum, avatar) => sum + avatar.level, 0) / totalUsers 
    : 0;
  const highestLevel = Math.max(...allUserAvatars.map(avatar => avatar.level), 1);
  const totalXP = allUserAvatars.reduce((sum, avatar) => sum + avatar.totalXP, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Level Management
          </h1>
          <p className="text-gray-600">
            Verwalte das Level-System und XP-Anforderungen
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-2">{totalUsers}</div>
            <div className="text-sm text-gray-600">Aktive Benutzer</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {averageLevel.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Durchschnittslevel</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-2">{highestLevel}</div>
            <div className="text-sm text-gray-600">Höchstes Level</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {totalXP.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Gesamt XP</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Level oder XP suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Neues Level erstellen
            </button>
          </div>
        </div>

        {/* Level Progression Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Level Progression</h2>
          <div className="h-64 flex items-end justify-center gap-1 overflow-x-auto">
            {levels.slice(0, 20).map((levelData) => {
              const height = Math.max(10, (levelData.userCount / Math.max(...levels.map(l => l.userCount), 1)) * 200);
              return (
                <div key={levelData.level} className="flex flex-col items-center min-w-[40px]">
                  <div className="text-xs text-gray-600 mb-1">
                    {levelData.userCount}
                  </div>
                  <div
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                    style={{ height: `${height}px` }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    L{levelData.level}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Anzahl Benutzer pro Level (nur die ersten 20 Level angezeigt)
          </div>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLevels.map((levelData) => (
            <LevelTier
              key={levelData.level}
              level={levelData.level}
              requiredXP={levelData.requiredXP}
              userCount={levelData.userCount}
              isEditing={editingLevel === levelData.level}
              onEdit={() => handleEditLevel(levelData.level)}
              onSave={(newXP) => handleSaveLevel(levelData.level, newXP)}
              onCancel={handleCancelEdit}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredLevels.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📊</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Keine Level gefunden
            </h3>
            <p className="text-gray-600">
              Probiere einen anderen Suchbegriff oder erstelle ein neues Level
            </p>
          </div>
        )}

        {/* Create Level Modal */}
        <CreateLevelModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateLevel}
          maxLevel={maxLevel}
        />
      </div>
    </div>
  );
};