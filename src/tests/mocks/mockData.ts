import { UserRole } from '../utils/authHelpers';

/**
 * Create a mock user object
 * @param overrides Custom properties to override defaults
 * @returns Mock user object
 */
export const mockUser = (overrides: Partial<any> = {}) => {
  const id = overrides.id || `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    email: overrides.email || `${id}@example.com`,
    name: overrides.name || 'Test User',
    role: overrides.role || UserRole.TEAM_MEMBER,
    password: overrides.password || 'hashed_password',
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
    ...overrides
  };
};

/**
 * Create a mock team object
 * @param overrides Custom properties to override defaults
 * @returns Mock team object
 */
export const mockTeam = (overrides: Partial<any> = {}) => {
  const id = overrides.id || `team-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    name: overrides.name || 'Test Team',
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
    ...overrides
  };
};

/**
 * Create a mock category object
 * @param overrides Custom properties to override defaults
 * @returns Mock category object
 */
export const mockCategory = (overrides: Partial<any> = {}) => {
  const id = overrides.id || `category-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    name: overrides.name || 'Test Category',
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
    ...overrides
  };
};

/**
 * Create a mock kudos card object
 * @param overrides Custom properties to override defaults
 * @returns Mock kudos card object
 */
export const mockKudosCard = (overrides: Partial<any> = {}) => {
  const id = overrides.id || `kudos-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    recipientName: overrides.recipientName || 'Test Recipient',
    teamId: overrides.teamId || 'team-123',
    categoryId: overrides.categoryId || 'category-123',
    message: overrides.message || 'Test kudos message',
    createdBy: overrides.createdBy || 'user-123',
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
    ...overrides
  };
}; 