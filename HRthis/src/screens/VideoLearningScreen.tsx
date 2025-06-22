import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearningStore } from '../state/learning';
import { useAuthStore } from '../state/auth';
import { VideoPlayer } from '../components/VideoPlayer';
import { Quiz } from '../components/Quiz';
import { LootboxAnimation, CelebrationOverlay } from '../components/LootboxAnimation';
import { TestResult } from '../types/learning';
import { cn } from '../utils/cn';

export const VideoLearningScreen = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    videos, 
    currentVideo, 
    selectVideo, 
    userProgress,
    getVideoQuestions,
    userLevel,
    userCoins,
    addXP,
    awardBadge
  } = useLearningStore();

  const [stage, setStage] = useState<'video' | 'quiz' | 'completed'>('video');
  const [showRewards, setShowRewards] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState<any[]>([]);
  const [showCelebration, setCelebration] = useState(false);

  useEffect(() => {
    if (videoId) {
      selectVideo(videoId);
    }
  }, [videoId, selectVideo]);

  useEffect(() => {
    // Check if video is completed and determine next stage
    if (currentVideo && user) {
      const progress = userProgress[currentVideo.id];
      const questions = getVideoQuestions(currentVideo.id);
      
      if (progress?.completed && questions.length > 0 && stage === 'video') {
        setStage('quiz');
      }
    }
  }, [currentVideo, user, userProgress, stage, getVideoQuestions]);

  const video = currentVideo || videos.find(v => v.id === videoId);
  
  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Video nicht gefunden</h1>
          <p className="text-gray-600 mb-4">Das angeforderte Video existiert nicht.</p>
          <button
            onClick={() => navigate('/learning')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  const questions = getVideoQuestions(video.id);
  const progress = user ? userProgress[video.id] : null;
  const isVideoCompleted = progress?.completed || false;
  const hasQuestions = questions.length > 0;

  const handleVideoComplete = () => {
    const rewards = [
      { type: 'xp', value: 50, description: 'Video abgeschlossen', icon: '⭐' },
      { type: 'coins', value: 10, description: 'BrowoCoins', icon: '🪙' }
    ];

    // Check for early bird badge (before 8 AM)
    const currentHour = new Date().getHours();
    if (currentHour < 8) {
      awardBadge('early-bird');
      rewards.push({
        type: 'badge',
        value: 100,
        description: 'Frühaufsteher Badge',
        icon: '🌅'
      });
    }

    setEarnedRewards(rewards);
    
    if (hasQuestions) {
      setStage('quiz');
    } else {
      setStage('completed');
      setShowRewards(true);
    }
  };

  const handleQuizComplete = (result: TestResult) => {
    const baseRewards = [
      { type: 'xp', value: result.earnedXP, description: `${result.earnedXP} XP`, icon: '⭐' },
      { type: 'coins', value: result.earnedCoins, description: `${result.earnedCoins} BrowoCoins`, icon: '🪙' }
    ];

    // Perfect score bonus
    if (result.score === 100) {
      baseRewards.push({
        type: 'badge',
        value: 150,
        description: 'Perfektionist Badge',
        icon: '🎯'
      });
      baseRewards.push({
        type: 'coins',
        value: 50,
        description: 'Perfektion Bonus',
        icon: '🪙'
      });
    }

    setEarnedRewards([...earnedRewards, ...baseRewards]);
    setStage('completed');
    setShowRewards(true);
  };

  const handleRewardsComplete = () => {
    setShowRewards(false);
    setCelebration(true);
  };

  const handleCelebrationComplete = () => {
    setCelebration(false);
    // Navigate back to learning dashboard
    navigate('/learning');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/learning')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{video.title}</h1>
              <p className="text-gray-300 text-sm">{video.description}</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🪙</span>
              <span className="font-bold">{userCoins}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">⭐</span>
              <span className="font-bold">{userLevel?.xp || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Indicator */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-8">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              stage === 'video' 
                ? "bg-blue-600 text-white" 
                : isVideoCompleted
                ? "bg-green-600 text-white"
                : "bg-gray-600 text-gray-300"
            )}>
              <span>{isVideoCompleted ? '✓' : '▶️'}</span>
              <span>Video ansehen</span>
            </div>

            {hasQuestions && (
              <>
                <div className="w-8 h-0.5 bg-gray-600" />
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  stage === 'quiz'
                    ? "bg-blue-600 text-white"
                    : stage === 'completed'
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300"
                )}>
                  <span>{stage === 'completed' ? '✓' : '📝'}</span>
                  <span>Quiz</span>
                </div>
              </>
            )}

            <div className="w-8 h-0.5 bg-gray-600" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              stage === 'completed'
                ? "bg-green-600 text-white"
                : "bg-gray-600 text-gray-300"
            )}>
              <span>{stage === 'completed' ? '🏆' : '🎁'}</span>
              <span>Belohnung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {stage === 'video' && (
          <div className="space-y-6">
            <VideoPlayer video={video} onComplete={handleVideoComplete} />
            
            {/* Video Info */}
            <div className="bg-gray-800 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
                  <p className="text-gray-300 mb-4">{video.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{Math.floor(video.duration / 60)} Minuten</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>+50 XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🪙</span>
                      <span>+10 Münzen</span>
                    </div>
                    {hasQuestions && (
                      <div className="flex items-center gap-2">
                        <span>📝</span>
                        <span>{questions.length} Fragen</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {progress && (
                  <div className="ml-6">
                    <div className="text-right mb-2">
                      <span className="text-sm text-gray-400">Fortschritt</span>
                      <div className="text-xl font-bold">
                        {Math.round((progress.watchedSeconds / video.duration) * 100)}%
                      </div>
                    </div>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.watchedSeconds / video.duration) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript (if available) */}
            {video.transcription && (
              <div className="bg-gray-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">📄 Vollständige Transkription</h3>
                <div className="max-h-48 overflow-y-auto text-gray-300 leading-relaxed">
                  {video.transcription.text}
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'quiz' && hasQuestions && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">📝 Wissenstest</h2>
              <p className="text-gray-300">
                Teste dein Wissen über das Video und sammle zusätzliche Belohnungen!
              </p>
            </div>
            <Quiz
              videoId={video.id}
              questions={questions}
              onComplete={handleQuizComplete}
            />
          </div>
        )}

        {stage === 'completed' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">Herzlichen Glückwunsch!</h2>
              <p className="text-xl mb-6">
                Du hast die Schulung "{video.title}" erfolgreich abgeschlossen!
              </p>

              {/* Summary */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Deine Leistung</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-90">Video angesehen</div>
                  </div>
                  {hasQuestions && (
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(earnedRewards.find(r => r.type === 'quiz-score')?.value || 0)}%
                      </div>
                      <div className="text-sm opacity-90">Quiz-Ergebnis</div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate('/learning')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Weiter lernen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reward Animations */}
      {showRewards && earnedRewards.length > 0 && (
        <LootboxAnimation
          reward={earnedRewards[0]}
          onComplete={handleRewardsComplete}
          autoStart
        />
      )}

      {showCelebration && (
        <CelebrationOverlay
          message="Schulung abgeschlossen!"
          icon="🎓"
          color="from-purple-400 to-blue-500"
          onComplete={handleCelebrationComplete}
        />
      )}
    </div>
  );
};