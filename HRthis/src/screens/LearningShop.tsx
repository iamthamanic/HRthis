import React, { useState } from 'react';
import { useLearningStore } from '../state/learning';
import { useAuthStore } from '../state/auth';
import { ShopItem, LearningEvent } from '../types/learning';
import { LootboxAnimation, CelebrationOverlay } from '../components/LootboxAnimation';
import { cn } from '../utils/cn';

export const LearningShop = () => {
  const { user } = useAuthStore();
  const { 
    userCoins, 
    shopItems, 
    ownedItems, 
    activeEvents,
    purchaseItem 
  } = useLearningStore();

  const [activeTab, setActiveTab] = useState<'shop' | 'events' | 'inventory'>('shop');
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false);
  const [lastPurchase, setLastPurchase] = useState<ShopItem | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handlePurchase = (item: ShopItem) => {
    if (userCoins >= item.price) {
      const success = purchaseItem(item.id);
      if (success) {
        setLastPurchase(item);
        setShowPurchaseAnimation(true);
      }
    }
  };

  const tabs = [
    { id: 'shop', label: 'Shop', icon: '🛒' },
    { id: 'events', label: 'Events', icon: '🎉' },
    { id: 'inventory', label: 'Inventar', icon: '🎒' }
  ];

  const featuredItems = shopItems.filter(item => item.limitedTime);
  const regularItems = shopItems.filter(item => !item.limitedTime);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">BrowoShop</h1>
            <p className="text-purple-100">Tausche deine Münzen gegen tolle Belohnungen!</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <p className="text-sm opacity-90">Deine Münzen</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🪙</span>
                <span className="text-3xl font-bold">{userCoins.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors rounded-xl",
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'shop' && (
        <div className="space-y-8">
          {/* Featured Items */}
          {featuredItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <h2 className="text-2xl font-bold text-gray-900">Limitierte Angebote</h2>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  Nur für kurze Zeit!
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map(item => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    userCoins={userCoins}
                    isOwned={ownedItems.includes(item.id)}
                    onPurchase={() => handlePurchase(item)}
                    featured
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Items */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alle Items</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularItems.map(item => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  userCoins={userCoins}
                  isOwned={ownedItems.includes(item.id)}
                  onPurchase={() => handlePurchase(item)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && <EventsTab events={activeEvents} />}
      {activeTab === 'inventory' && <InventoryTab ownedItems={ownedItems} />}

      {/* Purchase Animation */}
      {showPurchaseAnimation && lastPurchase && (
        <LootboxAnimation
          reward={{
            type: 'coins',
            value: lastPurchase.name,
            description: lastPurchase.description,
            icon: '🎁'
          }}
          onComplete={() => {
            setShowPurchaseAnimation(false);
            setShowCelebration(true);
          }}
          autoStart
        />
      )}

      {/* Celebration */}
      {showCelebration && (
        <CelebrationOverlay
          message="Item erhalten!"
          icon="🎉"
          color="from-green-400 to-blue-500"
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};

// Shop Item Card Component
interface ShopItemCardProps {
  item: ShopItem;
  userCoins: number;
  isOwned: boolean;
  onPurchase: () => void;
  featured?: boolean;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  userCoins,
  isOwned,
  onPurchase,
  featured = false
}) => {
  const canAfford = userCoins >= item.price;
  const isExpiringSoon = item.expiresAt && 
    new Date(item.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000; // 24 hours

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-lg",
      featured && "ring-2 ring-yellow-400 relative",
      !item.available && "opacity-50"
    )}>
      {featured && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
          ⭐ Featured
        </div>
      )}

      {/* Item Image */}
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 p-6 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
        ) : (
          <div className="text-6xl">
            {item.type === 'boost' && '⚡'}
            {item.type === 'avatar-item' && '👕'}
            {item.type === 'special' && '🎁'}
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        {/* Expiration Warning */}
        {isExpiringSoon && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
            <p className="text-red-800 text-xs font-medium">
              ⏰ Läuft bald ab!
            </p>
          </div>
        )}

        {/* Price & Purchase */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xl">🪙</span>
            <span className="font-bold text-lg text-gray-900">
              {item.price.toLocaleString()}
            </span>
          </div>

          {isOwned ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ Besessen
            </div>
          ) : (
            <button
              onClick={onPurchase}
              disabled={!canAfford || !item.available}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                canAfford && item.available
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {!canAfford ? "Zu teuer" : "Kaufen"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Events Tab Component
interface EventsTabProps {
  events: LearningEvent[];
}

const EventsTab: React.FC<EventsTabProps> = ({ events }) => {
  const { userCoins } = useLearningStore();

  // Mock current event
  const currentEvent: LearningEvent = {
    id: 'event1',
    name: 'Sommer Learning Sprint',
    description: 'Sammle 2500 Münzen in diesem Monat und erhalte exklusive Belohnungen!',
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 5, 30),
    targetCoins: 2500,
    rewards: [
      { type: 'badge', value: 'summer-champion', description: 'Sommer Champion Badge', icon: '🏆' },
      { type: 'avatar-item', value: 'summer-hat', description: 'Sommer Hut', icon: '🏖️' },
      { type: 'coins', value: 500, description: 'Bonus Münzen', icon: '🪙' }
    ],
    participants: [
      { userId: 'user1', progress: 1850, claimed: false }
    ]
  };

  const userProgress = currentEvent.participants.find(p => p.userId === 'user1')?.progress || 0;
  const progressPercentage = Math.min(100, (userProgress / currentEvent.targetCoins) * 100);

  return (
    <div className="space-y-6">
      {/* Current Event */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentEvent.name}</h2>
            <p className="text-orange-100">{currentEvent.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Endet in</p>
            <p className="text-xl font-bold">12 Tagen</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Fortschritt</span>
            <span className="font-bold">
              {userProgress.toLocaleString()} / {currentEvent.targetCoins.toLocaleString()} 🪙
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div>
          <h4 className="font-bold mb-3">Belohnungen</h4>
          <div className="grid grid-cols-3 gap-3">
            {currentEvent.rewards.map((reward, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-20 rounded-lg p-3 text-center"
              >
                <div className="text-2xl mb-1">{reward.icon}</div>
                <p className="text-xs font-medium">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past Events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Vergangene Events</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Frühlings-Challenge</h4>
              <p className="text-sm text-gray-600">Abgeschlossen am 31. Mai 2024</p>
            </div>
            <div className="text-green-600 font-medium">✓ Teilgenommen</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Wissens-Marathon</h4>
              <p className="text-sm text-gray-600">Abgeschlossen am 30. April 2024</p>
            </div>
            <div className="text-green-600 font-medium">🏆 Gewinner</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inventory Tab Component
interface InventoryTabProps {
  ownedItems: string[];
}

const InventoryTab: React.FC<InventoryTabProps> = ({ ownedItems }) => {
  // Mock inventory items
  const inventoryItems = [
    {
      id: 'xp-boost-24h',
      name: 'XP Boost (24h)',
      description: 'Verdoppelt XP für 24 Stunden',
      type: 'boost',
      icon: '⚡',
      quantity: 2,
      active: false
    },
    {
      id: 'legendary-box',
      name: 'Legendäre Lootbox',
      description: 'Enthält seltene Items',
      type: 'special',
      icon: '📦',
      quantity: 1,
      active: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">Mein Inventar</h3>
          <p className="text-gray-600">Verwende deine Items oder verwalte dein Inventar</p>
        </div>

        <div className="p-6">
          {inventoryItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryItems.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{item.icon}</div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {item.quantity}x
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <button
                    className={cn(
                      "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                      item.active
                        ? "bg-green-100 text-green-800 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                    disabled={item.active}
                  >
                    {item.active ? 'Aktiv' : 'Verwenden'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎒</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Inventar ist leer</h4>
              <p className="text-gray-600 mb-6">
                Kaufe Items im Shop, um sie hier zu sehen
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                Zum Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};