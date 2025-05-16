import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UserRepo } from '../../../domain/repositories/UserRepo';
import { InvalidCredentialsError } from '../../../domain/exceptions/AuthExceptions';
import { SignInRequestDto } from './SignInRequestDto';
import { SignInResponseDto } from './SignInResponseDto'
import { config } from '../../../../../config';

export class SignInUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(dto: SignInRequestDto): Promise<SignInResponseDto> {
    // Find user by email
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(dto.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email.toString(), role: user.role },
      config.jwt.secret as Secret,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    // Return user info and token
    return {
      token,
      user: {
        id: user.id,
        email: user.email.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }
} 