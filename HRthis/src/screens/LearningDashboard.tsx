import React, { useEffect, useState } from 'react';
import { useLearningStore } from '../state/learning';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';
import { TrainingCategory } from '../types/learning';

export const LearningDashboard = () => {
  const { user } = useAuthStore();
  const { 
    videos, 
    userLevel, 
    userCoins, 
    userBadges, 
    userProgress,
    loadVideos,
    selectVideo,
    getUserStatistics
  } = useLearningStore();

  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | 'all'>('all');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const stats = user ? getUserStatistics(user.id) : null;

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Alle', icon: '📚' },
    { id: TrainingCategory.MANDATORY, label: 'Pflicht', icon: '⚠️' },
    { id: TrainingCategory.COMPLIANCE, label: 'Compliance', icon: '⚖️' },
    { id: TrainingCategory.SKILLS, label: 'Skills', icon: '💡' },
    { id: TrainingCategory.ONBOARDING, label: 'Onboarding', icon: '👋' },
    { id: TrainingCategory.BONUS, label: 'Bonus', icon: '🎁' }
  ];

  const getProgressPercentage = (videoId: string) => {
    const progress = userProgress[videoId];
    const video = videos.find(v => v.id === videoId);
    
    if (!progress || !video) return 0;
    return Math.min(100, (progress.watchedSeconds / video.duration) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lernzentrum</h1>
            <p className="text-gray-600 mt-1">Erweitere dein Wissen und sammle Belohnungen!</p>
          </div>
          
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="relative group"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg transform transition-transform group-hover:scale-110">
              {user?.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {userLevel?.level}
            </div>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Level</p>
                <p className="text-2xl font-bold text-purple-900">{userLevel?.level}</p>
                <p className="text-xs text-purple-700">{userLevel?.title}</p>
              </div>
              <span className="text-3xl">🏆</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Münzen</p>
                <p className="text-2xl font-bold text-yellow-900">{userCoins}</p>
                <p className="text-xs text-yellow-700">BrowoCoins</p>
              </div>
              <span className="text-3xl">🪙</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">XP</p>
                <p className="text-2xl font-bold text-green-900">{userLevel?.xp || 0}</p>
                <p className="text-xs text-green-700">/ {userLevel?.nextLevelXp}</p>
              </div>
              <span className="text-3xl">⭐</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Abzeichen</p>
                <p className="text-2xl font-bold text-blue-900">{userBadges.length}</p>
                <p className="text-xs text-blue-700">Errungen</p>
              </div>
              <span className="text-3xl">🏅</span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Level {userLevel?.level}</span>
            <span>{userLevel?.xp} / {userLevel?.nextLevelXp} XP</span>
            <span>Level {(userLevel?.level || 0) + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
              style={{
                width: `${((userLevel?.xp || 0) / (userLevel?.nextLevelXp || 1)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap",
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => {
          const progress = getProgressPercentage(video.id);
          const isCompleted = userProgress[video.id]?.completed;

          return (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-[1.02] transition-transform"
              onClick={() => {
                selectVideo(video.id);
                // Navigate to video player
                window.location.href = `/learning/video/${video.id}`;
              }}
            >
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl text-white opacity-50">▶️</span>
                </div>
                {isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span>✓</span>
                    <span>Abgeschlossen</span>
                  </div>
                )}
                {video.category === TrainingCategory.MANDATORY && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Pflicht
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{Math.floor(video.duration / 60)} Min</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🎯</span>
                    <span>+50 XP</span>
                  </span>
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Fortschritt</span>
                      <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          isCompleted ? "bg-green-500" : "bg-blue-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mein Profil</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Avatar Section */}
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                {user?.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-purple-600 font-medium">{userLevel?.title}</p>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Abgeschlossene Schulungen</span>
                <span className="font-bold">{stats?.completedTrainings || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Durchschnittliche Punktzahl</span>
                <span className="font-bold">{Math.round(stats?.averageScore || 0)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Perfekte Ergebnisse</span>
                <span className="font-bold">{stats?.perfectScores || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Gesamte Lernzeit</span>
                <span className="font-bold">{Math.floor((stats?.totalWatchTime || 0) / 3600)}h</span>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h4 className="font-bold text-lg mb-3">Meine Abzeichen</h4>
              <div className="grid grid-cols-3 gap-3">
                {userBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};