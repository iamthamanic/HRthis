import React from 'react';
import { Avatar } from '../types/learning';
import { PreviewPanel } from './avatar/PreviewPanel';
import { CustomizationPanel } from './avatar/CustomizationPanel';
import { useAvatarCustomization } from './avatar/useAvatarCustomization';
import { availableAccessories } from './avatar/avatarData';

interface AvatarCustomizationProps {
  avatar: Avatar;
  onUpdate: (avatar: Avatar) => void;
  onClose: () => void;
}

const CustomizationHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Avatar anpassen</h2>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
);

const CustomizationContent: React.FC<{
  previewAvatar: Avatar;
  userCoins: number;
  activeTab: string;
  ownedItems: string[];
  setActiveTab: (tab: string) => void;
  handleAccessoryPreview: (accessory: any) => void;
  handleAccessoryPurchase: (accessory: any) => void;
  handleAccessoryRemove: (accessory: any) => void;
  handleColorChange: (property: string, color: string) => void;
}> = ({
  previewAvatar,
  userCoins,
  activeTab,
  ownedItems,
  setActiveTab,
  handleAccessoryPreview,
  handleAccessoryPurchase,
  handleAccessoryRemove,
  handleColorChange
}) => (
  <div className="flex h-[70vh]">
    <PreviewPanel 
      avatar={previewAvatar} 
      userCoins={userCoins} 
    />
    
    <CustomizationPanel
      activeTab={activeTab}
      previewAvatar={previewAvatar}
      availableAccessories={availableAccessories}
      ownedItems={ownedItems}
      userCoins={userCoins}
      onTabChange={setActiveTab}
      onAccessoryPreview={handleAccessoryPreview}
      onAccessoryPurchase={handleAccessoryPurchase}
      onAccessoryRemove={handleAccessoryRemove}
      onColorChange={handleColorChange}
    />
  </div>
);

const CustomizationFooter: React.FC<{ onClose: () => void; onSave: () => void }> = ({ onClose, onSave }) => (
  <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3">
    <button
      onClick={onClose}
      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Abbrechen
    </button>
    <button
      onClick={onSave}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Speichern
    </button>
  </div>
);

export const AvatarCustomization: React.FC<AvatarCustomizationProps> = ({
  avatar,
  onUpdate,
  onClose
}) => {
  const customizationState = useAvatarCustomization({ avatar, onUpdate, onClose });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CustomizationHeader onClose={onClose} />
        <CustomizationContent {...customizationState} />
        <CustomizationFooter onClose={onClose} onSave={customizationState.handleSave} />
      </div>
    </div>
  );
};