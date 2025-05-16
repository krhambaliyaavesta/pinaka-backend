
export class TokenBlacklistService {
  private static instance: TokenBlacklistService;
  private blacklist: Set<string> = new Set();
  
  private constructor() {}
  
  public static getInstance(): TokenBlacklistService {
    if (!TokenBlacklistService.instance) {
      TokenBlacklistService.instance = new TokenBlacklistService();
    }
    return TokenBlacklistService.instance;
  }
  
  /**
   * Add a token to the blacklist
   */
  public addToBlacklist(token: string): void {
    this.blacklist.add(token);
  }
  
  /**
   * Check if a token is blacklisted
   */
  public isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }
  
  /**
   * Clear the blacklist (for testing purposes)
   */
  public clearBlacklist(): void {
    this.blacklist.clear();
  }
} 