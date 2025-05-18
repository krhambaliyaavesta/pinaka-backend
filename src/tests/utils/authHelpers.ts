import jwt from 'jsonwebtoken';
import { config } from '../../config';

// Use the same fixed JWT secret as in AuthService
const JWT_SECRET = 'your-jwt-secret-here';

/**
 * Generate JWT token for testing
 * @param payload User data to include in token
 * @returns JWT token string
 */
export const generateAuthToken = (payload: { id: string; role: string; [key: string]: any }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verify JWT token
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const verifyAuthToken = (token: string): any | null => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * User roles
 */
export enum UserRole {
  TECH_LEAD = 'TECH_LEAD',
  TEAM_MEMBER = 'TEAM_MEMBER',
  ADMIN = 'ADMIN'
}

/**
 * Create test user data
 * @param role User role
 * @returns Test user object
 */
export const createTestUser = (role: UserRole = UserRole.TEAM_MEMBER) => {
  const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    id: userId,
    email: `${userId}@example.com`,
    name: `Test ${role}`,
    role,
    password: 'hashed_password_here' // In a real test, you'd use bcrypt to hash this
  };
}; 