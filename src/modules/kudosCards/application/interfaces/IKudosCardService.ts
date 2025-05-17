/**
 * Interface for external services required by the KudosCard module
 */
export interface IKudosCardService {
  /**
   * Gets the name of a user
   * @param userId The ID of the user
   * @returns The name of the user
   */
  getUserName(userId: string): Promise<string>;
  
  /**
   * Verifies if a user has permission to update a kudos card
   * @param userId The ID of the user
   * @param kudosCardId The ID of the kudos card
   * @returns Whether the user has permission
   */
  canUpdateKudosCard(userId: string, kudosCardId: number): Promise<boolean>;
} 