import { useState } from 'react';
import { Avatar, AvatarAccessory } from '../../types/learning';
import { useLearningStore } from '../../state/learning';

type TabType = 'accessories' | 'colors';

interface UseAvatarCustomizationProps {
  avatar: Avatar;
  onUpdate: (avatar: Avatar) => void;
  onClose: () => void;
}

export const useAvatarCustomization = ({ 
  avatar, 
  onUpdate, 
  onClose 
}: UseAvatarCustomizationProps) => {
  const { userCoins, ownedItems, purchaseItem } = useLearningStore();
  const [activeTab, setActiveTab] = useState<TabType>('accessories');
  const [previewAvatar, setPreviewAvatar] = useState<Avatar>(avatar);

  const handleAccessoryPreview = (accessory: AvatarAccessory) => {
    const currentAccessories = previewAvatar.accessories.filter(a => a.type !== accessory.type);
    const isEquipped = previewAvatar.accessories.some(a => a.id === accessory.id);
    
    setPreviewAvatar({
      ...previewAvatar,
      accessories: isEquipped ? currentAccessories : [...currentAccessories, accessory]
    });
  };

  const handleAccessoryPurchase = (accessory: AvatarAccessory) => {
    if (accessory.price && purchaseItem(accessory.id)) {
      handleAccessoryPreview(accessory);
    }
  };

  const handleAccessoryRemove = (type: string) => {
    setPreviewAvatar({
      ...previewAvatar,
      accessories: previewAvatar.accessories.filter(a => a.type !== type)
    });
  };

  const handleColorChange = (type: 'skin' | 'hair' | 'background', color: string) => {
    setPreviewAvatar({
      ...previewAvatar,
      [type === 'skin' ? 'skinColor' : type === 'hair' ? 'hairColor' : 'backgroundColor']: color
    });
  };

  const handleSave = () => {
    onUpdate(previewAvatar);
    onClose();
  };

  return {
    activeTab,
    previewAvatar,
    userCoins,
    ownedItems,
    setActiveTab,
    handleAccessoryPreview,
    handleAccessoryPurchase,
    handleAccessoryRemove,
    handleColorChange,
    handleSave
  };
};