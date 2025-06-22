import React, { useState } from 'react';
import { Avatar, AvatarAccessory, Badge } from '../types/learning';
import { useLearningStore } from '../state/learning';
import { cn } from '../utils/cn';

interface AvatarCustomizationProps {
  avatar: Avatar;
  onUpdate: (avatar: Avatar) => void;
  onClose: () => void;
}

export const AvatarCustomization: React.FC<AvatarCustomizationProps> = ({
  avatar,
  onUpdate,
  onClose
}) => {
  const { userCoins, ownedItems, purchaseItem } = useLearningStore();
  const [activeTab, setActiveTab] = useState<'accessories' | 'badges' | 'colors'>('accessories');
  const [previewAvatar, setPreviewAvatar] = useState<Avatar>(avatar);

  // Mock accessories data
  const availableAccessories: AvatarAccessory[] = [
    {
      id: 'hat_graduation',
      type: 'hat',
      name: 'Absolventenhut',
      imageUrl: '/avatars/hats/graduation.png',
      requiredLevel: 5
    },
    {
      id: 'glasses_nerd',
      type: 'glasses',
      name: 'Nerd-Brille',
      imageUrl: '/avatars/glasses/nerd.png',
      price: 100
    },
    {
      id: 'glasses_cool',
      type: 'glasses',
      name: 'Sonnenbrille',
      imageUrl: '/avatars/glasses/sunglasses.png',
      price: 150
    },
    {
      id: 'clothing_suit',
      type: 'clothing',
      name: 'Business Anzug',
      imageUrl: '/avatars/clothing/suit.png',
      price: 300
    },
    {
      id: 'clothing_casual',
      type: 'clothing',
      name: 'Casual Look',
      imageUrl: '/avatars/clothing/casual.png',
      price: 200
    },
    {
      id: 'effect_glow',
      type: 'effect',
      name: 'Goldener Schein',
      imageUrl: '/avatars/effects/golden-glow.png',
      price: 500
    },
    {
      id: 'effect_sparkles',
      type: 'effect',
      name: 'Sterne-Effekt',
      imageUrl: '/avatars/effects/sparkles.png',
      price: 400
    },
    {
      id: 'background_office',
      type: 'background',
      name: 'Büro-Hintergrund',
      imageUrl: '/avatars/backgrounds/office.png',
      price: 250
    },
    {
      id: 'background_nature',
      type: 'background',
      name: 'Natur-Hintergrund',
      imageUrl: '/avatars/backgrounds/nature.png',
      price: 250
    }
  ];

  const baseColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
  ];

  const canUseAccessory = (accessory: AvatarAccessory) => {
    if (accessory.requiredLevel && avatar.level < accessory.requiredLevel) {
      return false;
    }
    if (accessory.price && !ownedItems.includes(accessory.id)) {
      return userCoins >= accessory.price;
    }
    return true;
  };

  const isAccessoryOwned = (accessory: AvatarAccessory) => {
    return !accessory.price || ownedItems.includes(accessory.id);
  };

  const isAccessoryEquipped = (accessory: AvatarAccessory) => {
    return previewAvatar.accessories.some(a => a.id === accessory.id);
  };

  const toggleAccessory = (accessory: AvatarAccessory) => {
    if (!canUseAccessory(accessory)) return;

    if (!isAccessoryOwned(accessory) && accessory.price) {
      if (purchaseItem(accessory.id)) {
        equipAccessory(accessory);
      }
    } else {
      equipAccessory(accessory);
    }
  };

  const equipAccessory = (accessory: AvatarAccessory) => {
    const currentAccessories = previewAvatar.accessories.filter(a => a.type !== accessory.type);
    
    if (!isAccessoryEquipped(accessory)) {
      setPreviewAvatar({
        ...previewAvatar,
        accessories: [...currentAccessories, accessory]
      });
    } else {
      setPreviewAvatar({
        ...previewAvatar,
        accessories: currentAccessories
      });
    }
  };

  const handleSave = () => {
    onUpdate(previewAvatar);
    onClose();
  };

  const renderAvatarPreview = () => {
    const backgroundAccessory = previewAvatar.accessories.find(a => a.type === 'background');
    const effectAccessory = previewAvatar.accessories.find(a => a.type === 'effect');
    
    return (
      <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
        {/* Background */}
        {backgroundAccessory ? (
          <img 
            src={backgroundAccessory.imageUrl} 
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: previewAvatar.baseModel || '#3B82F6' }}
          />
        )}

        {/* Base Avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-white bg-opacity-90 flex items-center justify-center text-6xl font-bold text-gray-800">
            {avatar.userId.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Clothing */}
        {previewAvatar.accessories
          .filter(a => a.type === 'clothing')
          .map(accessory => (
            <img
              key={accessory.id}
              src={accessory.imageUrl}
              alt={accessory.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}

        {/* Glasses */}
        {previewAvatar.accessories
          .filter(a => a.type === 'glasses')
          .map(accessory => (
            <img
              key={accessory.id}
              src={accessory.imageUrl}
              alt={accessory.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}

        {/* Hat */}
        {previewAvatar.accessories
          .filter(a => a.type === 'hat')
          .map(accessory => (
            <img
              key={accessory.id}
              src={accessory.imageUrl}
              alt={accessory.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}

        {/* Effects */}
        {effectAccessory && (
          <div className="absolute inset-0 animate-pulse">
            <img
              src={effectAccessory.imageUrl}
              alt={effectAccessory.name}
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold border-2 border-white">
          {avatar.level}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'accessories', label: 'Zubehör', icon: '👓' },
    { id: 'badges', label: 'Abzeichen', icon: '🏅' },
    { id: 'colors', label: 'Farben', icon: '🎨' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Avatar anpassen</h2>
              <p className="opacity-90">Gestalte deinen Avatar individuell</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Münzen</p>
              <p className="text-2xl font-bold">🪙 {userCoins}</p>
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Preview */}
          <div className="w-1/3 bg-gray-50 p-6 flex flex-col items-center justify-center">
            {renderAvatarPreview()}
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">{avatar.userId}</h3>
              <p className="text-purple-600 font-medium">{avatar.title}</p>
              <p className="text-sm text-gray-600 mt-2">Level {avatar.level}</p>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'accessories' && (
                <div className="space-y-6">
                  {(['hat', 'glasses', 'clothing', 'background', 'effect'] as const).map(type => {
                    const typeAccessories = availableAccessories.filter(a => a.type === type);
                    const typeLabels = {
                      hat: 'Hüte',
                      glasses: 'Brillen',
                      clothing: 'Kleidung',
                      background: 'Hintergründe',
                      effect: 'Effekte'
                    };

                    return (
                      <div key={type}>
                        <h4 className="font-bold text-lg text-gray-900 mb-3">
                          {typeLabels[type]}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {typeAccessories.map(accessory => {
                            const canUse = canUseAccessory(accessory);
                            const isOwned = isAccessoryOwned(accessory);
                            const isEquipped = isAccessoryEquipped(accessory);

                            return (
                              <div
                                key={accessory.id}
                                className={cn(
                                  "border-2 rounded-lg p-3 cursor-pointer transition-all relative",
                                  isEquipped
                                    ? "border-blue-500 bg-blue-50"
                                    : canUse
                                    ? "border-gray-200 hover:border-gray-300"
                                    : "border-gray-100 opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => canUse && toggleAccessory(accessory)}
                              >
                                <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center text-2xl">
                                  👕
                                </div>
                                <p className="text-sm font-medium text-center">
                                  {accessory.name}
                                </p>
                                
                                {accessory.price && !isOwned && (
                                  <div className="text-center mt-1">
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                      🪙 {accessory.price}
                                    </span>
                                  </div>
                                )}

                                {accessory.requiredLevel && avatar.level < accessory.requiredLevel && (
                                  <div className="text-center mt-1">
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                      Level {accessory.requiredLevel}
                                    </span>
                                  </div>
                                )}

                                {isEquipped && (
                                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                    ✓
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'colors' && (
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3">
                    Avatar-Farben
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {baseColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setPreviewAvatar({
                          ...previewAvatar,
                          baseModel: color
                        })}
                        className={cn(
                          "w-16 h-16 rounded-full border-4 transition-all",
                          previewAvatar.baseModel === color
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:scale-105"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'badges' && (
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3">
                    Errungene Abzeichen
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {avatar.badges.map(badge => (
                      <div
                        key={badge.id}
                        className="border border-gray-200 rounded-lg p-4 text-center"
                      >
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        <span className={cn(
                          "inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium",
                          badge.rarity === 'legendary' && "bg-yellow-100 text-yellow-800",
                          badge.rarity === 'epic' && "bg-purple-100 text-purple-800",
                          badge.rarity === 'rare' && "bg-blue-100 text-blue-800",
                          badge.rarity === 'common' && "bg-gray-100 text-gray-800"
                        )}>
                          {badge.rarity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};