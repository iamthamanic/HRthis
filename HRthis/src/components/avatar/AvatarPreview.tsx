import React from 'react';
import { Avatar } from '../../types/learning';
import { cn } from '../../utils/cn';

interface AvatarPreviewProps {
  avatar: Avatar;
  className?: string;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  avatar,
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      {/* Background */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{ backgroundColor: avatar.backgroundColor }}
      />
      
      {/* Base Avatar */}
      <div className="relative p-8">
        <div 
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl font-bold"
          style={{ 
            backgroundColor: avatar.skinColor,
            color: avatar.hairColor 
          }}
        >
          {avatar.baseImage ? (
            <img 
              src={avatar.baseImage} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{avatar.name?.charAt(0).toUpperCase() || 'A'}</span>
          )}
        </div>
        
        {/* Accessories */}
        {avatar.accessories.map(accessory => (
          <img
            key={accessory.id}
            src={accessory.imageUrl}
            alt={accessory.name}
            className={cn(
              "absolute w-16 h-16",
              accessory.type === 'hat' && "top-4 left-1/2 -translate-x-1/2",
              accessory.type === 'glasses' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              accessory.type === 'clothing' && "bottom-4 left-1/2 -translate-x-1/2"
            )}
          />
        ))}
      </div>
    </div>
  );
};