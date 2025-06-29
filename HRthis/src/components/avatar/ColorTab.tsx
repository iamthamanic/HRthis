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

export const ColorTab: React.FC<ColorTabProps> = ({
  previewAvatar,
  onColorChange
}) => {
  return (
    <div className="space-y-6">
      {/* Skin Color */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Hautfarbe</h4>
        <div className="flex flex-wrap gap-2">
          {skinColors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange('skin', color)}
              className={cn(
                "w-12 h-12 rounded-full border-4 transition-all",
                previewAvatar.skinColor === color
                  ? "border-blue-500 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Haarfarbe</h4>
        <div className="flex flex-wrap gap-2">
          {hairColors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange('hair', color)}
              className={cn(
                "w-12 h-12 rounded-full border-4 transition-all",
                previewAvatar.hairColor === color
                  ? "border-blue-500 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Hintergrund</h4>
        <div className="flex flex-wrap gap-2">
          {backgroundColors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange('background', color)}
              className={cn(
                "w-12 h-12 rounded-lg border-4 transition-all",
                previewAvatar.backgroundColor === color
                  ? "border-blue-500 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};