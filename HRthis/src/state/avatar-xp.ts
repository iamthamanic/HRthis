import { createXPEvent, updateAvatarWithXP, checkLevelUps } from './avatar-helpers';

export const processAddXP = (
  get: any,
  set: any,
  params: {
    userId: string;
    skillId: string | null | undefined;
    xpAmount: number;
    description: string;
    metadata?: Record<string, any>;
  }
) => {
  const { userId, skillId, xpAmount, description, metadata = {} } = params;
  const now = new Date().toISOString();
  let userAvatar = get().getUserAvatar(userId);
  
  // Create avatar if it doesn't exist
  if (!userAvatar) {
    userAvatar = get().createUserAvatar(userId);
  }

  // Create XP event using helper
  const xpEvent = createXPEvent({
    userId,
    skillId,
    xpAmount,
    description,
    metadata,
    now
  });

  set((state: any) => {
    // Update avatar using helper function
    const updatedAvatar = updateAvatarWithXP({
      avatar: state.userAvatars[userId],
      skillId,
      xpAmount,
      levels: state.levels,
      now
    });

    return {
      userAvatars: {
        ...state.userAvatars,
        [userId]: updatedAvatar
      },
      xpEvents: [xpEvent, ...state.xpEvents]
    };
  });

  // Check for level ups
  const levelUpEvents = checkLevelUps({
    userAvatar: get().getUserAvatar(userId)!,
    userId,
    now
  });
  
  if (levelUpEvents.length > 0) {
    set((state: any) => ({
      ...state,
      levelUpEvents: [...levelUpEvents, ...state.levelUpEvents]
    }));
  }
};