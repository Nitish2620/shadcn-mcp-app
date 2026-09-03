import React from 'react';
import { UserProfileCard } from './user-profile-card';
import type { UserProfileCardProps } from './user-profile-card';

/**
 * UserProfileCardDisplay
 * Enterprise MNC-grade pure user profile card component.
 */
export const UserProfileCardDisplay: React.FC<UserProfileCardProps> = (props) => {
  return <UserProfileCard {...props} />;
};

export { UserProfileCard };
export type { UserProfileCardProps };
