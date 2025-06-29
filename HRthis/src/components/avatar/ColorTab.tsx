import React from 'react';
import { Avatar } from '../../types/learning';
import { cn } from '../../utils/cn';

interface ColorTabProps {
  previewAvatar: Avatar;
  onColorChange: (type: 'skin' | 'hair' | 'background', color: string) => void;
}

const skinColors = [
  '#FDBCB4', '#F5DEB3', '#FFE4C4', '#D2B48C', 
  '#BC9A6A', '#A0522D', '#8B4513', '#654321'
];

const hairColors = [
  '#000000', '#3B3B3B', '#8B4513', '#D2691E',
  '#FFD700', '#FF6347', '#9370DB', '#4169E1'
];

const backgroundColors = [
  '#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF3E0',
  '#FFEBEE', '#F3F4F6', '#FFFDE7', '#E0F2F1'
];

const ColorPalette: React.FC<{
  title: string;
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  isRounded?: boolean;
}> = ({ title, colors, selectedColor, onColorSelect, isRounded = true }) => (
  <div>
    <h4 className="font-medium text-gray-700 mb-3">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={cn(
            "w-12 h-12 border-4 transition-all",
            isRounded ? "rounded-full" : "rounded-lg",
            selectedColor === color
              ? "border-blue-500 scale-110"
              : "border-gray-300 hover:border-gray-400"
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  </div>
);

export const ColorTab: React.FC<ColorTabProps> = ({
  previewAvatar,
  onColorChange
}) => (
  <div className="space-y-6">
    <ColorPalette
      title="Hautfarbe"
      colors={skinColors}
      selectedColor={previewAvatar.skinColor}
      onColorSelect={(color) => onColorChange('skin', color)}
    />
    
    <ColorPalette
      title="Haarfarbe"
      colors={hairColors}
      selectedColor={previewAvatar.hairColor}
      onColorSelect={(color) => onColorChange('hair', color)}
    />
    
    <ColorPalette
      title="Hintergrund"
      colors={backgroundColors}
      selectedColor={previewAvatar.backgroundColor}
      onColorSelect={(color) => onColorChange('background', color)}
      isRounded={false}
    />
  </div>
);