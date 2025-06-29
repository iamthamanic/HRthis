import React from 'react';
import { Skill } from '../../types/avatar';
import { SkillCardHorizontal } from './SkillCardHorizontal';
import { SkillCardGrid } from './SkillCardGrid';
import { SkillCardVertical } from './SkillCardVertical';

interface SkillCardProps {
  skill: Skill;
  showXP: boolean;
  showProgress: boolean;
  layout: 'horizontal' | 'vertical' | 'grid';
}

export const SkillCard: React.FC<SkillCardProps> = ({ 
  skill, 
  showXP, 
  showProgress, 
  layout 
}) => {
  const commonProps = { skill, showXP, showProgress };

  switch (layout) {
    case 'horizontal':
      return <SkillCardHorizontal {...commonProps} />;
    case 'grid':
      return <SkillCardGrid {...commonProps} />;
    case 'vertical':
    default:
      return <SkillCardVertical {...commonProps} />;
  }
};