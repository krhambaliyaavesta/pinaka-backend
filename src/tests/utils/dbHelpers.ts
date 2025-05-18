import { v4 as uuidv4 } from 'uuid';


// Define interfaces for our mock data
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
}

interface Team {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface KudosCard {
  id: string;
  recipientName: string;
  teamId: string;
  categoryId: string;
  message: string;
  createdBy: string;
  createdAt: Date;
}

interface MockData {
  users: User[];
  kudosCards: KudosCard[];
  teams: Team[];
  categories: Category[];
}

/**
 * Mock data storage for tests
 */
const mockData: MockData = {
  users: [],
  kudosCards: [],
  teams: [],
  categories: []
};

/**
 * Initialize mock repositories for testing
 * This provides an in-memory mock database for testing
 */
export const initMockRepositories = () => {
  // Clear any existing mock data
  clearAllMockData();
  
  // Create mock repositories
  const mockUserRepository = createMockUserRepository();
  const mockTeamRepository = createMockTeamRepository();
  const mockCategoryRepository = createMockCategoryRepository();
  const mockKudosCardRepository = createMockKudosCardRepository();
  
  return {
    userRepository: mockUserRepository,
    teamRepository: mockTeamRepository,
    categoryRepository: mockCategoryRepository,
    kudosCardRepository: mockKudosCardRepository,
    mockData,
    clearAllMockData
  };
};

/**
 * Clear all mock data
 */
export const clearAllMockData = () => {
  mockData.users = [];
  mockData.kudosCards = [];
  mockData.teams = [];
  mockData.categories = [];
};

/**
 * Seed mock data for testing
 * @param options Seeding options
 * @returns Object containing IDs of created entities
 */
export const seedMockData = (options = { 
  createUsers: true,
  createTeams: true, 
  createCategories: true, 
  createKudosCards: true 
}) => {
  // Clear existing data
  clearAllMockData();
  
  const teamIds: string[] = [];
  const categoryIds: string[] = [];
  const userIds: string[] = [];
  
  // Seed teams
  if (options.createTeams) {
    const teamNames = ['Engineering', 'Product', 'Design', 'Marketing'];
    for (const name of teamNames) {
      const id = uuidv4();
      mockData.teams.push({ id, name });
      teamIds.push(id);
    }
  }
  
  // Seed categories
  if (options.createCategories) {
    const categoryNames = ['Teamwork', 'Innovation', 'Helping Hand', 'Problem Solving'];
    for (const name of categoryNames) {
      const id = uuidv4();
      mockData.categories.push({ id, name });
      categoryIds.push(id);
    }
  }
  
  // Seed users
  if (options.createUsers) {
    const users = [
      { email: 'techlead@example.com', name: 'Tech Lead', role: 'TECH_LEAD', password: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { email: 'teammember@example.com', name: 'Team Member', role: 'TEAM_MEMBER', password: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { email: 'admin@example.com', name: 'Admin', role: 'ADMIN', password: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }
    ];
    
    for (const user of users) {
      const id = uuidv4();
      mockData.users.push({ id, ...user });
      userIds.push(id);
    }
  }
  
  // Seed kudos cards
  if (options.createKudosCards && teamIds.length > 0 && categoryIds.length > 0 && userIds.length > 0) {
    const kudosCards = [
      { 
        recipientName: 'John Doe', 
        teamId: teamIds[0], 
        categoryId: categoryIds[0], 
        message: 'Great teamwork on the project!', 
        createdBy: userIds[0],
        createdAt: new Date()
      },
      { 
        recipientName: 'Jane Smith', 
        teamId: teamIds[1], 
        categoryId: categoryIds[1], 
        message: 'Innovative solution to a complex problem!', 
        createdBy: userIds[0],
        createdAt: new Date()
      },
      { 
        recipientName: 'Bob Johnson', 
        teamId: teamIds[2], 
        categoryId: categoryIds[2], 
        message: 'Always there to help when needed!', 
        createdBy: userIds[0],
        createdAt: new Date() 
      }
    ];
    
    for (const kudos of kudosCards) {
      const id = uuidv4();
      mockData.kudosCards.push({ id, ...kudos });
    }
  }
  
  return { teamIds, categoryIds, userIds, mockData };
};

/**
 * Create a mock user repository
 */
const createMockUserRepository = () => {
  return {
    findByEmail: async (email: string) => {
      return mockData.users.find(u => u.email === email) || null;
    },
    findById: async (id: string) => {
      return mockData.users.find(u => u.id === id) || null;
    },
    create: async (userData: Omit<User, 'id'>) => {
      const id = uuidv4();
      const user = { id, ...userData } as User;
      mockData.users.push(user);
      return user;
    },
    findAll: async () => {
      return [...mockData.users];
    }
  };
};

/**
 * Create a mock team repository
 */
const createMockTeamRepository = () => {
  return {
    findById: async (id: string) => {
      return mockData.teams.find(t => t.id === id) || null;
    },
    findAll: async () => {
      return [...mockData.teams];
    },
    create: async (teamData: Omit<Team, 'id'>) => {
      const id = uuidv4();
      const team = { id, ...teamData } as Team;
      mockData.teams.push(team);
      return team;
    }
  };
};

/**
 * Create a mock category repository
 */
const createMockCategoryRepository = () => {
  return {
    findById: async (id: string) => {
      return mockData.categories.find(c => c.id === id) || null;
    },
    findAll: async () => {
      return [...mockData.categories];
    },
    create: async (categoryData: Omit<Category, 'id'>) => {
      const id = uuidv4();
      const category = { id, ...categoryData } as Category;
      mockData.categories.push(category);
      return category;
    }
  };
};

/**
 * Create a mock kudos card repository
 */
const createMockKudosCardRepository = () => {
  return {
    create: async (kudosData: Omit<KudosCard, 'id' | 'createdAt'>) => {
      const id = uuidv4();
      const kudosCard = { 
        id, 
        ...kudosData,
        createdAt: new Date()
      } as KudosCard;
      mockData.kudosCards.push(kudosCard);
      return kudosCard;
    },
    findAll: async () => {
      return [...mockData.kudosCards];
    },
    findById: async (id: string) => {
      return mockData.kudosCards.find(k => k.id === id) || null;
    },
    findByTeam: async (teamId: string) => {
      return mockData.kudosCards.filter(k => k.teamId === teamId);
    },
    findByFilters: async (filters: { teamId?: string; categoryId?: string; recipientName?: string }) => {
      return mockData.kudosCards.filter(card => {
        let match = true;
        
        if (filters.teamId) {
          match = match && card.teamId === filters.teamId;
        }
        
        if (filters.categoryId) {
          match = match && card.categoryId === filters.categoryId;
        }
        
        if (filters.recipientName) {
          match = match && card.recipientName.includes(filters.recipientName);
        }
        
        return match;
      });
    }
  };
};

/**
 * Create a test database configuration that points to a test database
 * IMPORTANT: Only use with a designated TEST database, NEVER production
 */
export const getTestDbConfig = () => {
  // This should point to a test/staging database, not production
  return {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    user: process.env.TEST_DB_USER || 'test_user',
    password: process.env.TEST_DB_PASSWORD || 'test_password',
    database: process.env.TEST_DB_NAME || 'pinaka_test'
  };
}; 