/**
 * Response DTO for the top teams analytics
 */
export interface GetTopTeamsResponseDto {
  /**
   * ID of the team
   */
  teamId: number;
  
  /**
   * Name of the team
   */
  teamName: string;
  
  /**
   * Number of kudos received
   */
  count: number;
} 