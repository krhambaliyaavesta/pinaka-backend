import { LogoutRequestDto } from './LogoutRequestDto';
import { LogoutResponseDto } from './LogoutResponseDto';
import { TokenBlacklistService } from '../../../../../shared/services/TokenBlacklistService';

// In a stateless JWT authentication system, logout is primarily a client-side concern
// Here we would implement server-side logic if we tracked tokens in a blacklist
export class LogoutUseCase {
  private tokenBlacklistService: TokenBlacklistService;
  
  constructor() {
    this.tokenBlacklistService = TokenBlacklistService.getInstance();
  }

  async execute(dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    // Add the token to the blacklist to invalidate it
    if (dto.token) {
      this.tokenBlacklistService.addToBlacklist(dto.token);
    }

    // Return a success message
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
} 