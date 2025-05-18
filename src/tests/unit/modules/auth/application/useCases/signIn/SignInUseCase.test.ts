import { SignInUseCase } from '../../../../../../../modules/auth/application/useCases/signIn/SignInUseCase';
import { InvalidCredentialsError } from '../../../../../../../modules/auth/domain/exceptions/AuthExceptions';
import { createUser } from '../../../../../../mocks/testFactories';
import jwt from 'jsonwebtoken';
import { config } from '../../../../../../../config';

// Mock dependencies
jest.mock('jsonwebtoken');

/**
 * SignInUseCase Unit Tests
 * 
 * These tests verify the business logic of the SignInUseCase
 * without relying on external systems or database connections.
 */
describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;
  let mockUserRepo: any;
  let mockUser: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockUserRepo = {
      findByEmail: jest.fn()
    };

    // Mock user with password verification method
    mockUser = createUser({
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 2, // Tech Lead
      jobTitle: 'Senior Developer',
      approvalStatus: 'APPROVED'
    });

    mockUser.verifyPassword = jest.fn();
    
    // Mock JWT sign method
    (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');
    
    // Initialize use case with mock repository
    signInUseCase = new SignInUseCase(mockUserRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should authenticate user with valid credentials and return token', async () => {
      // Arrange
      const signInDto = {
        email: 'test@example.com',
        password: 'validPassword123'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockUser.verifyPassword.mockResolvedValue(true);

      // Act
      const result = await signInUseCase.execute(signInDto);

      // Assert
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(mockUser.verifyPassword).toHaveBeenCalledWith(signInDto.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: mockUser.id,
          email: mockUser.email.toString(),
          role: mockUser.role
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email.toString(),
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          jobTitle: mockUser.jobTitle,
          approvalStatus: mockUser.approvalStatus
        }
      });
    });

    it('should throw InvalidCredentialsError when user does not exist', async () => {
      // Arrange
      const signInDto = {
        email: 'nonexistent@example.com',
        password: 'anyPassword123'
      };

      mockUserRepo.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(signInUseCase.execute(signInDto))
        .rejects
        .toThrow(InvalidCredentialsError);
      
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsError when password is incorrect', async () => {
      // Arrange
      const signInDto = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockUser.verifyPassword.mockResolvedValue(false);

      // Act & Assert
      await expect(signInUseCase.execute(signInDto))
        .rejects
        .toThrow(InvalidCredentialsError);
      
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(mockUser.verifyPassword).toHaveBeenCalledWith(signInDto.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should handle email capitalization differences', async () => {
      // Arrange
      const signInDto = {
        email: 'TEST@example.com', // Uppercase variation
        password: 'validPassword123'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockUser.verifyPassword.mockResolvedValue(true);

      // Act
      const result = await signInUseCase.execute(signInDto);

      // Assert
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should propagate unexpected errors', async () => {
      // Arrange
      const signInDto = {
        email: 'test@example.com',
        password: 'validPassword123'
      };

      const unexpectedError = new Error('Database connection failed');
      mockUserRepo.findByEmail.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(signInUseCase.execute(signInDto))
        .rejects
        .toThrow('Database connection failed');
    });
  });
}); 