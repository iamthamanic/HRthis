import React from 'react';

interface UserInfoProps {
  userName?: string;
  title?: string;
  level: number;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userName = "Anna Admin",
  title,
  level
}) => (
  <div className="text-center mb-6">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">
      {userName}
    </h2>
    
    <div className="flex items-center justify-center gap-3 mb-2">
      {title && (
        <span className="text-gray-600 text-lg">
          {title}❤️
        </span>
      )}
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-6 py-2 rounded-full font-bold text-lg">
        Level {level}
      </div>
    </div>
  </div>
);