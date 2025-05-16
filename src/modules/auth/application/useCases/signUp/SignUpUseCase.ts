import { User } from '../../../domain/entities/User';
import { UserRepo } from '../../../domain/repositories/UserRepo';
import { Email } from '../../../domain/valueObjects/Email';
import { EmailAlreadyExistsError, InvalidUserDataError } from '../../../domain/exceptions/AuthExceptions';
import { SignUpRequestDto } from './SignUpRequestDto';
import { SignUpResponseDto } from './SignUpResponseDto';
import { SignUpMapper } from './SignUpMapper';

export class SignUpUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    try {
      // Check if email exists
      const existingUser = await this.userRepo.findByEmail(dto.email);
      if (existingUser) {
        throw new EmailAlreadyExistsError(dto.email);
      }

      // Map dto to domain entity props
      const userProps = SignUpMapper.toDomainEntity(dto);
      
      // Create user entity
      const user = await User.create(userProps);

      // Save user
      const createdUser = await this.userRepo.create(user);

      // Return response using mapper
      return SignUpMapper.toResponseDto(createdUser);
    } catch (error) {
      // Rethrow domain errors directly, wrap others in application errors
      if (error instanceof EmailAlreadyExistsError) {
        throw error;
      }
      
      if (error instanceof Error && error.message.includes('Invalid email')) {
        throw new InvalidUserDataError('Invalid email format');
      }
      
      if (error instanceof Error && error.message.includes('Password must be')) {
        throw new InvalidUserDataError('Password should be at least 6 characters');
      }
      
      throw error;
    }
  }
} 