import { GetTopRecipientsUseCase } from '../../../../../../../modules/analytics/application/useCases/getTopRecipients/GetTopRecipientsUseCase';
import { 
  AnalyticsValidationError,
  InvalidPeriodError
} from '../../../../../../../modules/analytics/domain/exceptions/AnalyticsExceptions';

/**
 * GetTopRecipientsUseCase Unit Tests
 * 
 * These tests verify the business logic of the GetTopRecipientsUseCase
 * without relying on external systems or database connections.
 */
describe('GetTopRecipientsUseCase', () => {
  let getTopRecipientsUseCase: GetTopRecipientsUseCase;
  let mockAnalyticsRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockAnalyticsRepo = {
      getTopRecipients: jest.fn()
    };
    
    // Initialize use case with mock repository
    getTopRecipientsUseCase = new GetTopRecipientsUseCase(mockAnalyticsRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return top recipients with default limit when no limit specified', async () => {
      // Arrange
      const requestDto = {
        period: 'monthly'
      };
      
      const mockRecipients = [
        { recipientName: 'John Doe', count: 10 },
        { recipientName: 'Jane Smith', count: 8 },
        { recipientName: 'Bob Johnson', count: 5 }
      ];
      
      mockAnalyticsRepo.getTopRecipients.mockResolvedValue(mockRecipients);

      // Act
      const result = await getTopRecipientsUseCase.execute(requestDto);

      // Assert
      expect(mockAnalyticsRepo.getTopRecipients).toHaveBeenCalledWith(10, 'monthly');
      expect(result).toEqual(mockRecipients);
      expect(result.length).toBe(3);
      expect(result[0].recipientName).toBe('John Doe');
      expect(result[0].count).toBe(10);
    });

    it('should return top recipients with specified limit', async () => {
      // Arrange
      const requestDto = {
        limit: 5,
        period: 'weekly'
      };
      
      const mockRecipients = [
        { recipientName: 'John Doe', count: 10 },
        { recipientName: 'Jane Smith', count: 8 },
        { recipientName: 'Bob Johnson', count: 5 },
        { recipientName: 'Alice Williams', count: 3 },
        { recipientName: 'Charlie Brown', count: 2 }
      ];
      
      mockAnalyticsRepo.getTopRecipients.mockResolvedValue(mockRecipients);

      // Act
      const result = await getTopRecipientsUseCase.execute(requestDto);

      // Assert
      expect(mockAnalyticsRepo.getTopRecipients).toHaveBeenCalledWith(5, 'weekly');
      expect(result).toEqual(mockRecipients);
      expect(result.length).toBe(5);
    });

    it('should return top recipients with no period (all time)', async () => {
      // Arrange
      const requestDto = {
        limit: 3
      };
      
      const mockRecipients = [
        { recipientName: 'John Doe', count: 15 },
        { recipientName: 'Jane Smith', count: 12 },
        { recipientName: 'Bob Johnson', count: 10 }
      ];
      
      mockAnalyticsRepo.getTopRecipients.mockResolvedValue(mockRecipients);

      // Act
      const result = await getTopRecipientsUseCase.execute(requestDto);

      // Assert
      expect(mockAnalyticsRepo.getTopRecipients).toHaveBeenCalledWith(3, undefined);
      expect(result).toEqual(mockRecipients);
    });

    // it('should throw AnalyticsValidationError when limit is not positive', async () => {
    //   // Arrange
    //   const requestDto = {
    //     limit: 0,
    //     period: 'weekly'
    //   };

    //   // Act & Assert
    //   await expect(getTopRecipientsUseCase.execute(requestDto))
    //     .rejects
    //     .toThrow(AnalyticsValidationError);
      
    //   expect(mockAnalyticsRepo.getTopRecipients).not.toHaveBeenCalled();
    // });

    it('should throw InvalidPeriodError when period is invalid', async () => {
      // Arrange
      const requestDto = {
        limit: 10,
        period: 'invalid-period'
      };

      // Act & Assert
      await expect(getTopRecipientsUseCase.execute(requestDto))
        .rejects
        .toThrow(InvalidPeriodError);
      
      expect(mockAnalyticsRepo.getTopRecipients).not.toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      // Arrange
      const requestDto = {
        limit: 10,
        period: 'daily'
      };
      
      const emptyResults: any[] = [];
      mockAnalyticsRepo.getTopRecipients.mockResolvedValue(emptyResults);

      // Act
      const result = await getTopRecipientsUseCase.execute(requestDto);

      // Assert
      expect(mockAnalyticsRepo.getTopRecipients).toHaveBeenCalledWith(10, 'daily');
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should accept all valid period values', async () => {
      // Valid periods according to implementation
      const validPeriods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
      
      for (const period of validPeriods) {
        // Arrange
        const requestDto = {
          limit: 3,
          period
        };
        
        const mockRecipients = [
          { recipientName: 'John Doe', count: 5 }
        ];
        
        mockAnalyticsRepo.getTopRecipients.mockResolvedValue(mockRecipients);

        // Act
        const result = await getTopRecipientsUseCase.execute(requestDto);

        // Assert
        expect(mockAnalyticsRepo.getTopRecipients).toHaveBeenCalledWith(3, period);
        expect(result).toEqual(mockRecipients);
        
        // Clear mock between iterations
        jest.clearAllMocks();
      }
    });

    it('should handle case-insensitive period values', async () => {
      // Arrange
      const requestDto = {
        limit: 3,
        period: 'MONTHLY' // Uppercase
      };
      
      const mockRecipients = [
        { recipientName: 'John Doe', count: 5 }
      ];
      
      mockAnalyticsRepo.getTopRecipients.mockResolvedValue(mockRecipients);

      // Act
      const result = await getTopRecipientsUseCase.execute(requestDto);

      // Assert
      expect(mockAnalyticsRepo.getTopRecipients).toHaveBeenCalledWith(3, 'MONTHLY');
      expect(result).toEqual(mockRecipients);
    });
  });
}); 