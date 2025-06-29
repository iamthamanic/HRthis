import React from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface ParticleEffectProps {
  particles: Particle[];
  show: boolean;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ particles, show }) => {
  if (!show) return null;

  return (
    <>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </>
  );
};