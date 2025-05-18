import { v4 as uuidv4 } from 'uuid';

/**
 * Create a test kudos card DTO with customizable properties
 * @param overrides Properties to override default values
 * @returns Kudos card DTO for testing
 */
export const createKudosCardDTO = (overrides = {}) => ({
  recipientName: 'Test Recipient',
  teamId: 1,
  categoryId: 1,
  message: 'Great job on the test project!',
  createdBy: 'test-user-id',
  ...overrides
});

/**
 * Create a test kudos card entity with customizable properties
 * @param overrides Properties to override default values
 * @returns Kudos card entity for testing
 */
export const createKudosCard = (overrides = {}) => ({
  id: uuidv4(),
  recipientName: 'Test Recipient',
  teamId: 1,
  categoryId: 1,
  message: 'Great job on the test project!',
  createdBy: 'test-user-id',
  createdAt: new Date(),
  ...overrides
});

/**
 * Create a test user DTO with customizable properties
 * @param overrides Properties to override default values
 * @returns User DTO for testing
 */
export const createUserDTO = (overrides = {}) => ({
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  jobTitle: 'Software Engineer',
  password: 'Password123!',
  ...overrides
});

/**
 * Create a test user entity with customizable properties
 * @param overrides Properties to override default values
 * @returns User entity for testing
 */
export const createUser = (overrides = {}) => ({
  id: uuidv4(),
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'TEAM_MEMBER',
  jobTitle: 'Software Engineer',
  approvalStatus: 'PENDING',
  password: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Hashed password
  ...overrides
});

/**
 * Create a test team with customizable properties
 * @param overrides Properties to override default values
 * @returns Team entity for testing
 */
export const createTeam = (overrides = {}) => ({
  id: uuidv4(),
  name: 'Test Team',
  ...overrides
});

/**
 * Create a test category with customizable properties
 * @param overrides Properties to override default values
 * @returns Category entity for testing
 */
export const createCategory = (overrides = {}) => ({
  id: uuidv4(),
  name: 'Test Category',
  ...overrides
});

/**
 * Create a set of test data for integration tests
 * @returns Object containing test entities and their IDs
 */
export const createTestData = () => {
  // Create teams
  const teams = [
    createTeam({ name: 'Engineering' }),
    createTeam({ name: 'Product' }),
    createTeam({ name: 'Design' })
  ];
  
  // Create categories
  const categories = [
    createCategory({ name: 'Teamwork' }),
    createCategory({ name: 'Innovation' }),
    createCategory({ name: 'Problem Solving' })
  ];
  
  // Create users with different roles
  const users = [
    createUser({ 
      firstName: 'Tech',
      lastName: 'Lead', 
      email: 'techlead@example.com', 
      role: 'TECH_LEAD' 
    }),
    createUser({ 
      firstName: 'Team',
      lastName: 'Member', 
      email: 'teammember@example.com', 
      role: 'TEAM_MEMBER' 
    }),
    createUser({ 
      firstName: 'Admin',
      lastName: 'User', 
      email: 'admin@example.com', 
      role: 'ADMIN' 
    })
  ];
  
  // Create kudos cards
  const kudosCards = [
    createKudosCard({
      recipientName: 'John Doe',
      teamId: teams[0].id,
      categoryId: categories[0].id,
      message: 'Great teamwork on the project!',
      createdBy: users[0].id
    }),
    createKudosCard({
      recipientName: 'Jane Smith',
      teamId: teams[1].id,
      categoryId: categories[1].id,
      message: 'Innovative solution to a complex problem!',
      createdBy: users[0].id
    })
  ];
  
  return {
    teams,
    categories,
    users,
    kudosCards,
    teamIds: teams.map(team => team.id),
    categoryIds: categories.map(category => category.id),
    userIds: users.map(user => user.id)
  };
}; 