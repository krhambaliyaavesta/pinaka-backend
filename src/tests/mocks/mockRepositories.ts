import { mockUser, mockTeam, mockCategory, mockKudosCard } from './mockData';

/**
 * Create a mock user repository
 * @returns Mock user repository object with jest mock functions
 */
export const createMockUserRepository = () => {
  return {
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockUser({ id }));
    }),
    findByEmail: jest.fn().mockImplementation((email) => {
      return Promise.resolve(mockUser({ email }));
    }),
    create: jest.fn().mockImplementation((userData) => {
      return Promise.resolve(mockUser(userData));
    }),
    update: jest.fn().mockImplementation((id, userData) => {
      return Promise.resolve(mockUser({ id, ...userData }));
    }),
    delete: jest.fn().mockImplementation((id) => {
      return Promise.resolve(true);
    }),
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        mockUser({ id: 'user-1' }),
        mockUser({ id: 'user-2' }),
        mockUser({ id: 'user-3' })
      ]);
    })
  };
};

/**
 * Create a mock team repository
 * @returns Mock team repository object with jest mock functions
 */
export const createMockTeamRepository = () => {
  return {
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockTeam({ id }));
    }),
    create: jest.fn().mockImplementation((teamData) => {
      return Promise.resolve(mockTeam(teamData));
    }),
    update: jest.fn().mockImplementation((id, teamData) => {
      return Promise.resolve(mockTeam({ id, ...teamData }));
    }),
    delete: jest.fn().mockImplementation((id) => {
      return Promise.resolve(true);
    }),
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        mockTeam({ id: 'team-1', name: 'Engineering' }),
        mockTeam({ id: 'team-2', name: 'Product' }),
        mockTeam({ id: 'team-3', name: 'Design' })
      ]);
    })
  };
};

/**
 * Create a mock category repository
 * @returns Mock category repository object with jest mock functions
 */
export const createMockCategoryRepository = () => {
  return {
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockCategory({ id }));
    }),
    create: jest.fn().mockImplementation((categoryData) => {
      return Promise.resolve(mockCategory(categoryData));
    }),
    update: jest.fn().mockImplementation((id, categoryData) => {
      return Promise.resolve(mockCategory({ id, ...categoryData }));
    }),
    delete: jest.fn().mockImplementation((id) => {
      return Promise.resolve(true);
    }),
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        mockCategory({ id: 'category-1', name: 'Teamwork' }),
        mockCategory({ id: 'category-2', name: 'Innovation' }),
        mockCategory({ id: 'category-3', name: 'Helping Hand' })
      ]);
    })
  };
};

/**
 * Create a mock kudos card repository
 * @returns Mock kudos card repository object with jest mock functions
 */
export const createMockKudosCardRepository = () => {
  return {
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockKudosCard({ id }));
    }),
    create: jest.fn().mockImplementation((kudosData) => {
      return Promise.resolve(mockKudosCard(kudosData));
    }),
    update: jest.fn().mockImplementation((id, kudosData) => {
      return Promise.resolve(mockKudosCard({ id, ...kudosData }));
    }),
    delete: jest.fn().mockImplementation((id) => {
      return Promise.resolve(true);
    }),
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        mockKudosCard({ id: 'kudos-1' }),
        mockKudosCard({ id: 'kudos-2' }),
        mockKudosCard({ id: 'kudos-3' })
      ]);
    }),
    findByFilters: jest.fn().mockImplementation((filters) => {
      return Promise.resolve([
        mockKudosCard({ id: 'kudos-1', ...filters }),
        mockKudosCard({ id: 'kudos-2', ...filters })
      ]);
    }),
    findByTeam: jest.fn().mockImplementation((teamId) => {
      return Promise.resolve([
        mockKudosCard({ id: 'kudos-1', teamId }),
        mockKudosCard({ id: 'kudos-2', teamId })
      ]);
    }),
    findByCategory: jest.fn().mockImplementation((categoryId) => {
      return Promise.resolve([
        mockKudosCard({ id: 'kudos-1', categoryId }),
        mockKudosCard({ id: 'kudos-2', categoryId })
      ]);
    }),
    findByRecipient: jest.fn().mockImplementation((recipientName) => {
      return Promise.resolve([
        mockKudosCard({ id: 'kudos-1', recipientName }),
        mockKudosCard({ id: 'kudos-2', recipientName })
      ]);
    })
  };
}; 