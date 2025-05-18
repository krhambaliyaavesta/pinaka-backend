import { initMockRepositories, clearAllMockData } from './dbHelpers';
import { createTestData } from '../mocks/testFactories';

/**
 * Initialize a fresh test environment for each test
 * This helps with test isolation by providing a clean state
 * @returns Object containing mock repositories and test data
 */
export const setupTestEnvironment = () => {
  // Clear any existing mock data
  clearAllMockData();
  
  // Initialize mock repositories
  const mockRepositories = initMockRepositories();
  
  // Create test data
  const testData = createTestData();
  
  // Return everything needed for tests
  return {
    mockRepositories,
    testData,
    tearDown: () => {
      clearAllMockData();
    }
  };
};

/**
 * Seed minimal test data required for a specific test case
 * @param repositories Mock repositories
 * @param options Options specifying what data to seed
 * @returns Object containing created test entities
 */
export const seedMinimalTestData = async (repositories: any, options: {
  seedUsers?: boolean;
  seedTeams?: boolean;
  seedCategories?: boolean;
  seedKudosCards?: boolean;
  specificUser?: any;
  specificTeam?: any;
  specificCategory?: any;
  specificKudosCard?: any;
}) => {
  const result: any = {
    users: [],
    teams: [],
    categories: [],
    kudosCards: []
  };
  
  // Create a test data set
  const testData = createTestData();
  
  // Seed only what's needed for this specific test
  if (options.seedUsers || options.specificUser) {
    if (options.specificUser) {
      const user = await repositories.userRepository.create(options.specificUser);
      result.users.push(user);
    } else {
      // Only seed the first user by default for minimal data
      const user = await repositories.userRepository.create(testData.users[0]);
      result.users.push(user);
    }
  }
  
  if (options.seedTeams || options.specificTeam) {
    if (options.specificTeam) {
      const team = await repositories.teamRepository.create(options.specificTeam);
      result.teams.push(team);
    } else {
      // Only seed the first team by default for minimal data
      const team = await repositories.teamRepository.create(testData.teams[0]);
      result.teams.push(team);
    }
  }
  
  if (options.seedCategories || options.specificCategory) {
    if (options.specificCategory) {
      const category = await repositories.categoryRepository.create(options.specificCategory);
      result.categories.push(category);
    } else {
      // Only seed the first category by default for minimal data
      const category = await repositories.categoryRepository.create(testData.categories[0]);
      result.categories.push(category);
    }
  }
  
  if (options.seedKudosCards || options.specificKudosCard) {
    if (options.specificKudosCard) {
      const kudosCard = await repositories.kudosCardRepository.create(options.specificKudosCard);
      result.kudosCards.push(kudosCard);
    } else if (result.users.length > 0 && result.teams.length > 0 && result.categories.length > 0) {
      // Create a kudos card using the seeded data
      const kudosCard = await repositories.kudosCardRepository.create({
        recipientName: 'Test Recipient',
        teamId: result.teams[0].id,
        categoryId: result.categories[0].id,
        message: 'Test message for kudos card',
        createdBy: result.users[0].id,
        createdAt: new Date()
      });
      result.kudosCards.push(kudosCard);
    }
  }
  
  return {
    ...result,
    userIds: result.users.map((user: any) => user.id),
    teamIds: result.teams.map((team: any) => team.id),
    categoryIds: result.categories.map((category: any) => category.id),
    kudosCardIds: result.kudosCards.map((kudosCard: any) => kudosCard.id)
  };
}; 