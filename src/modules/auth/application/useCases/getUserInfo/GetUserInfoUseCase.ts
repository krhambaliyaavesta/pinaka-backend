import { UserRepo } from '../../../domain/repositories/UserRepo';
import { UserNotFoundError } from '../../../domain/exceptions/AuthExceptions';
import { GetUserInfoRequestDto } from './GetUserInfoRequestDto';
import { GetUserInfoResponseDto } from './GetUserInfoResponseDto';

export class GetUserInfoUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(dto: GetUserInfoRequestDto): Promise<GetUserInfoResponseDto> {
    // Find user by ID
    const user = await this.userRepo.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError(dto.userId);
    }

    // Return user info
    return {
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString()
    };
  }
} 