/**
 * Test fixtures for kudosCards module tests
 */

// KudosCard fixtures
export const validKudosCardProps = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  recipientName: "John Doe",
  teamId: 1,
  categoryId: 1,
  message: "Great job on the project!",
  createdBy: "123e4567-e89b-12d3-a456-426614174000", // User ID
  sentBy: undefined, // Will default to createdBy
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
  deletedAt: null,
};

export const validKudosCardPropsWithSentBy = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  recipientName: "John Doe",
  teamId: 1,
  categoryId: 1,
  message: "Great job on the project!",
  createdBy: "123e4567-e89b-12d3-a456-426614174000", // Admin User ID
  sentBy: "123e4567-e89b-12d3-a456-426614174003", // Regular User ID (sent on behalf of)
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
  deletedAt: null,
};

export const invalidKudosCardProps = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  recipientName: "", // Empty recipient name - invalid
  teamId: 1,
  categoryId: 1,
  message: "Great job on the project!",
  createdBy: "123e4567-e89b-12d3-a456-426614174000",
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
};

export const kudosCardUpdateProps = {
  recipientName: "Jane Smith",
  message: "Updated message - excellent collaboration!",
  teamId: 2,
  categoryId: 3,
};

// Category fixtures
export const validCategoryProps = {
  id: 1,
  name: "Teamwork",
  description: "Recognition for great collaboration",
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
};

export const invalidCategoryProps = {
  id: 2,
  name: "", // Empty name - invalid
  description: "Invalid category",
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
};

// Team fixtures
export const validTeamProps = {
  id: 1,
  name: "Engineering",
  description: "Engineering department",
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
};

export const invalidTeamProps = {
  id: 2,
  name: "", // Empty name - invalid
  description: "Invalid team",
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
  updatedAt: new Date("2023-01-01T12:00:00.000Z"),
};

// DTO fixtures
export const createKudosCardDto = {
  recipientName: "John Doe",
  teamId: 1,
  categoryId: 1,
  message: "Great job on the project!",
};

export const createKudosCardDtoWithSentBy = {
  recipientName: "John Doe",
  teamId: 1,
  categoryId: 1,
  message: "Great job on the project!",
  sentBy: "123e4567-e89b-12d3-a456-426614174003", // Regular User ID (sent on behalf of)
};

export const updateKudosCardDto = {
  recipientName: "Jane Smith",
  teamId: 2,
  categoryId: 3,
  message: "Updated message - excellent collaboration!",
};

// Repository response fixtures
export const kudosCardDbResponse = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  recipient_name: "John Doe",
  team_id: 1,
  category_id: 1,
  message: "Great job on the project!",
  created_by: "123e4567-e89b-12d3-a456-426614174000",
  sent_by: null, // Will default to created_by
  created_at: new Date("2023-01-01T12:00:00.000Z"),
  updated_at: new Date("2023-01-01T12:00:00.000Z"),
  deleted_at: null,
};

export const kudosCardDbResponseWithSentBy = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  recipient_name: "John Doe",
  team_id: 1,
  category_id: 1,
  message: "Great job on the project!",
  created_by: "123e4567-e89b-12d3-a456-426614174000",
  sent_by: "123e4567-e89b-12d3-a456-426614174003", // Regular User ID (sent on behalf of)
  created_at: new Date("2023-01-01T12:00:00.000Z"),
  updated_at: new Date("2023-01-01T12:00:00.000Z"),
  deleted_at: null,
};

export const categoryDbResponse = {
  id: 1,
  name: "Teamwork",
  description: "Recognition for great collaboration",
  created_at: new Date("2023-01-01T12:00:00.000Z"),
  updated_at: new Date("2023-01-01T12:00:00.000Z"),
};

export const teamDbResponse = {
  id: 1,
  name: "Engineering",
  description: "Engineering department",
  created_at: new Date("2023-01-01T12:00:00.000Z"),
  updated_at: new Date("2023-01-01T12:00:00.000Z"),
};
