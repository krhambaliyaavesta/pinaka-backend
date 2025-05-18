import { SignUpUseCase } from '../../../../../../../modules/auth/application/useCases/signUp/SignUpUseCase';
import { EmailAlreadyExistsError, InvalidUserDataError } from '../../../../../../../modules/auth/domain/exceptions/AuthExceptions';
import { createUser, createUserDTO } from '../../../../../../mocks/testFactories';
import { User } from '../../../../../../../modules/auth/domain/entities/User';

/**
 * SignUpUseCase Unit Tests
 * 
 * These tests verify the business logic of the SignUpUseCase
 * without relying on external systems or database connections.
 */
describe('SignUpUseCase', () => {
  let signUpUseCase: SignUpUseCase;
  let mockUserRepo: any;
  
  // Mock the User.create static method
  const originalUserCreate = User.create;
  
  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockUserRepo = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };
    
    // Initialize use case with mock repository
    signUpUseCase = new SignUpUseCase(mockUserRepo);
    
    // Mock User.create
    User.create = jest.fn();
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
    // Restore original User.create method
    User.create = originalUserCreate;
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const signUpDto = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        jobTitle: 'Software Engineer',
        password: 'Password123!'
      };
      
      const createdUserEntity = createUser({
        id: 'user-new-123',
        email: signUpDto.email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        jobTitle: signUpDto.jobTitle
      });
      
      // No existing user with this email
      mockUserRepo.findByEmail.mockResolvedValue(null);
      
      // Mock User.create to return a user entity
      (User.create as jest.Mock).mockResolvedValue(createdUserEntity);
      
      // Mock userRepo.create to return the created user
      mockUserRepo.create.mockResolvedValue(createdUserEntity);
      
      // Act
      const result = await signUpUseCase.execute(signUpDto);

      // Assert
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(User.create).toHaveBeenCalled();
      expect(mockUserRepo.create).toHaveBeenCalledWith(createdUserEntity);
      
      expect(result).toEqual({
        id: createdUserEntity.id,
        email: createdUserEntity.email.toString(),
        firstName: createdUserEntity.firstName,
        lastName: createdUserEntity.lastName,
        role: createdUserEntity.role,
        jobTitle: createdUserEntity.jobTitle,
        approvalStatus: createdUserEntity.approvalStatus
      });
    });

    it('should throw EmailAlreadyExistsError when email is already registered', async () => {
      // Arrange
      const signUpDto = {
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        jobTitle: 'Developer',
        password: 'Password123!'
      };
      
      const existingUser = createUser({
        email: signUpDto.email
      });
      
      // Mock finding an existing user
      mockUserRepo.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(signUpUseCase.execute(signUpDto))
        .rejects
        .toThrow(EmailAlreadyExistsError);
      
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(User.create).not.toHaveBeenCalled();
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidUserDataError when email format is invalid', async () => {
      // Arrange
      const signUpDto = {
        email: 'invalid-email',
        firstName: 'Invalid',
        lastName: 'Email User',
        jobTitle: 'Developer',
        password: 'Password123!'
      };
      
      // No existing user with this email
      mockUserRepo.findByEmail.mockResolvedValue(null);
      
      // Mock User.create to throw an email validation error
      (User.create as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid email format');
      });

      // Act & Assert
      await expect(signUpUseCase.execute(signUpDto))
        .rejects
        .toThrow(InvalidUserDataError);
      
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(User.create).toHaveBeenCalled();
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidUserDataError when password is too short', async () => {
      // Arrange
      const signUpDto = {
        email: 'valid@example.com',
        firstName: 'Short',
        lastName: 'Password User',
        jobTitle: 'Developer',
        password: 'short'
      };
      
      // No existing user with this email
      mockUserRepo.findByEmail.mockResolvedValue(null);
      
      // Mock User.create to throw a password validation error
      (User.create as jest.Mock).mockImplementation(() => {
        throw new Error('Password must be at least 6 characters');
      });

      // Act & Assert
      await expect(signUpUseCase.execute(signUpDto))
        .rejects
        .toThrow(InvalidUserDataError);
      
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(User.create).toHaveBeenCalled();
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    it('should propagate unexpected errors', async () => {
      // Arrange
      const signUpDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        jobTitle: 'Developer',
        password: 'Password123!'
      };
      
      // No existing user with this email
      mockUserRepo.findByEmail.mockResolvedValue(null);
      
      // Mock User.create to succeed
      const userEntity = createUser({
        email: signUpDto.email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        jobTitle: signUpDto.jobTitle
      });
      (User.create as jest.Mock).mockResolvedValue(userEntity);
      
      // But mock userRepo.create to fail with an unexpected error
      const unexpectedError = new Error('Database connection failed');
      mockUserRepo.create.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(signUpUseCase.execute(signUpDto))
        .rejects
        .toThrow('Database connection failed');
      
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(User.create).toHaveBeenCalled();
      expect(mockUserRepo.create).toHaveBeenCalled();
    });
  });
}); 