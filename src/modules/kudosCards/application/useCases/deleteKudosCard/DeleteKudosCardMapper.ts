import { DeleteKudosCardResponseDto } from "./DeleteKudosCardResponseDto";

export class DeleteKudosCardMapper {
  /**
   * Creates a response DTO for a successful delete operation
   */
  public static toSuccessResponseDto(): DeleteKudosCardResponseDto {
    return {
      success: true,
      message: "Kudos card deleted successfully"
    };
  }

  /**
   * Creates a response DTO for a failed delete operation
   */
  public static toFailureResponseDto(error: Error): DeleteKudosCardResponseDto {
    return {
      success: false,
      message: error.message || "Failed to delete kudos card"
    };
  }
} 